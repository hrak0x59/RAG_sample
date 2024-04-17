# 環境構築

`back`(バックエンド)と`front`(フロントエンド)でそれぞれやんないとです😭

## バックエンド
#### `.env`ファイルの作成
プロジェクトのルートディレクトリに作ってね♡
```sh
OPENAI_API_KEY={APIキー}
```


#### ディレクトリの移動
```sh
cd back
```

#### 仮想環境の構築
windowsだとコマンド違うかも
```sh
python -m venv venv
source venv/bin/activate
```

#### 使うもののインストール
```sh
pip install -r requirements.txt
```

#### 起動
```sh
python api.py
```
なんかエラー出るけど気にしないで！！



## フロントエンド
nodeを入れてなかったら入れてください！
(nodeのインストール)[https://nodejs.org/en]

#### ディレクトリの移動
```sh
cd front/sample
```
#### 依存関係をインストール
```sh
npm install
```

#### サーバー立ち上げ
```sh
npm run dev
```

[http://localhost:3000/](http://localhost:3000/)
これでアクセスできるようになるはず
