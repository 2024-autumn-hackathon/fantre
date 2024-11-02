# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# FastAPIとその他の依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# FastAPIアプリケーションをコピー
COPY . .

# FastAPIサーバーを起動（ポート8000）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
