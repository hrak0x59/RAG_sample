from flask import Flask, jsonify, request
import json
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


load_dotenv()

embeddings_model = OpenAIEmbeddings()
loader = PyPDFLoader("right.pdf")
text = "\n".join([page.page_content for page in loader.load()])

loader2 = PyPDFLoader("hanrei.pdf")
text2 = text + "\n".join([page.page_content for page in loader2.load()])

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=20,
    length_function=len,
    add_start_index=True
)

documents = text_splitter.create_documents([text])
db = Chroma.from_documents(documents, embeddings_model)
retriever = db.as_retriever()

documents2 = text_splitter.create_documents([text2])
db2 = Chroma.from_documents(documents2, embeddings_model)
retriever2 = db2.as_retriever()

# model I/O

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

chain2 = (
    {"context": retriever2 | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser(verbose=True)
    )


app = Flask(__name__)
CORS(app)
data = {
    'RAG': '質問を入力してください',
    'ROW': 'データなし',
}

@app.route('/', methods=['GET'])
def search():
    query = request.args.get('query')
    han = request.args.get('han')
    if han == "YES":
        references = retriever2.get_relevant_documents(query)
        strings = [doc.page_content for doc in references]
        return jsonify({"RAG":chain2.invoke(query), "ROW":strings})
    elif han == "NO":
        references = retriever.get_relevant_documents(query)
        strings = [doc.page_content for doc in references]
        return jsonify({"RAG":chain.invoke(query), "ROW":strings})
    else:
        return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
