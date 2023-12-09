# 本番環境用Dockerfile
# ビルドステージ
FROM node:20:10 as builder

WORKDIR /app

# pnpmをインストール
RUN npm install -g pnpm

# 依存関係をコピー
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install

# ソースコードをコピー
COPY . .

# ビルド
RUN pnpm run build

# 本番ステージ
FROM node:20:10

WORKDIR /app

# pnpmをインストール
RUN npm install -g pnpm

# ビルドしたファイルと必要な依存関係のみをコピー
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# 本番用の依存関係をインストール
RUN pnpm install --production

# 本番用サーバーを起動
CMD ["pnpm", "start"]