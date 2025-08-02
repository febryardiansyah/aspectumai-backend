echo "🔄 Pulling latest changes..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "🗄️ Running migrations..."
node forge migrate:run

echo "🚀 Restarting PM2..."
pm2 reload 0

echo "✅ Deployment complete!"
pm2 status