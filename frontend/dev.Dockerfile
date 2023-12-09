FROM node:20:10

# 作業ディレクトリを設定
WORKDIR /app

# pnpmをインストール
RUN npm install -g pnpm

# package.json と pnpm-lock.yaml をコピー
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install

# アプリケーションのソースコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["pnpm", "run", "dev"]
