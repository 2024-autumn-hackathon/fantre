# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Next.jsの依存関係をインストール
COPY package.json package-lock.json ./
RUN npm install

# Next.jsアプリケーションをコピー
COPY . .

# 開発モードでNext.jsサーバーを起動（ポート3000）
CMD ["npm", "run", "dev"]
