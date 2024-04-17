from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
load_dotenv()

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")


from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# OpenAI埋め込みモデルのインスタンスを作成
embeddings_model = OpenAIEmbeddings()


# PDFファイルの読み込み
loader = PyPDFLoader("right.pdf")
text = "\n".join([page.page_content for page in loader.load()])

# Text Splitterの設定
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=20,
    length_function=len,
    add_start_index=True
)

# テキストの分割
documents = text_splitter.create_documents([text])

# ベクトル化したテキストをChromaDBに保存する
db = Chroma.from_documents(documents, embeddings_model)
# 必要なライブラリをインポートする
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# retriever(検索対象のVectorDB)の定義
retriever = db.as_retriever()

# テンプレートを定義
template = """Answer the question based only on the following context:

{context}

Question: {question}
"""
# promptを定義。これがLLMの入力になる
prompt = ChatPromptTemplate.from_template(template)

# LLMを定義。今回はChatGPTの3.5を利用する
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, verbose=True)


def format_docs(docs):
    return "\n\n".join([d.page_content for d in docs])

# Chainを定義。これはおまじないだと思って下さい。
chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser(verbose=True)
    )


app = Flask(__name__)
CORS(app)

@app.route('/api/hello')
def hello():
    return 'Hello, world!'


@app.route('/api/<query>')
def search(query):
    input = query
    return chain.invoke(input)

if __name__ == '__main__':
    app.run(debug=True)
