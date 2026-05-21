#!/bin/bash
# Oracle Cloud VM Setup Script for LLMAtlas Backend
# Run this after SSHing into your Oracle Cloud VM

set -e

echo "=== LLMAtlas Backend Setup ==="
echo "Starting automated setup..."

# 1. Update system
echo "[1/7] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20.x
echo "[2/7] Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2
echo "[3/7] Installing PM2 process manager..."
sudo npm install -g pm2

# 4. Install Git
echo "[4/7] Installing Git..."
sudo apt install -y git

# 5. Configure firewall
echo "[5/7] Configuring firewall..."
sudo ufw allow 3001/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable

# 6. Clone and setup application
echo "[6/7] Cloning repository and installing dependencies..."
cd /home/ubuntu
git clone https://github.com/RohitSinghMcKvian/LLMAtlas.git
cd LLMAtlas/backend

# Create .env file (you'll need to edit this with your actual values)
cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_SUPABASE_HOST:5432/postgres
JWT_SECRET=YOUR_JWT_SECRET
FRONTEND_URL=https://YOUR_VERCEL_URL.vercel.app
OPENROUTER_API_KEY=YOUR_KEY
HUGGINGFACE_API_KEY=YOUR_KEY
NEWSAPI_KEY=YOUR_KEY
GOOGLE_AI_API_KEY=YOUR_KEY
GROQ_API_KEY=YOUR_KEY
CEREBRAS_API_KEY=YOUR_KEY
MISTRAL_API_KEY=YOUR_KEY
CLOUDFLARE_API_KEY=YOUR_KEY
CLOUDFLARE_ACCOUNT_ID=YOUR_ID
GITHUB_TOKEN=YOUR_TOKEN
NVIDIA_API_KEY=YOUR_KEY
SYNC_CRON_EXPRESSION=0 2 * * *
RSS_FEED_URLS=https://arxiv.org/rss/cs.AI,https://arxiv.org/rss/cs.CL,https://openai.com/blog/rss.xml,https://www.anthropic.com/rss/news.xml,https://blog.google/technology/ai/rss/,https://ai.meta.com/blog/rss/
ENVEOF

echo "IMPORTANT: Edit /home/ubuntu/LLMAtlas/backend/.env with your actual values!"
echo "Press Enter to continue after editing .env..."
read -r

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build TypeScript
npm run build

# 7. Setup PM2
echo "[7/7] Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo ""
echo "=== Setup Complete! ==="
echo "Your API is running at: http://$(curl -s ifconfig.me):3001"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check app status"
echo "  pm2 logs llmatlas-api   - View logs"
echo "  pm2 restart llmatlas-api - Restart app"
echo "  pm2 stop llmatlas-api   - Stop app"
echo ""
echo "Next steps:"
echo "  1. Deploy frontend to Vercel with VITE_API_URL=http://YOUR_IP:3001/api"
echo "  2. Update FRONTEND_URL in .env with your Vercel URL"
echo "  3. Run: pm2 restart llmatlas-api"
