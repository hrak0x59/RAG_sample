from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os


load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

embeddings_model = OpenAIEmbeddings()
loader = PyPDFLoader("right.pdf")
text = "\n".join([page.page_content for page in loader.load()])

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=20,
    length_function=len,
    add_start_index=True
)

documents = text_splitter.create_documents([text])
db = Chroma.from_documents(documents, embeddings_model)
retriever = db.as_retriever()

template = """Answer the question based only on the following context:

{context}

Question: {question}

回答は日本語で生成してください
"""
prompt = ChatPromptTemplate.from_template(template)

llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, verbose=True)

def format_docs(docs):
    return "\n\n".join([d.page_content for d in docs])

chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser(verbose=True)
    )



app = Flask(__name__)
CORS(app)

@app.route('/api/<query>')
def search(query):
    input = query
    return chain.invoke(input)

if __name__ == '__main__':
    app.run(debug=True)
