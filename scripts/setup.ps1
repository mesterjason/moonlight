Write-Host "🌙 MoonLight Setup - Starting..." -ForegroundColor Cyan

Write-Host "📦 Installing pnpm dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
cd apps/web
pnpm dlx prisma generate
cd ../..

Write-Host "🐍 Installing Python dependencies..." -ForegroundColor Yellow
pip install -r apps/worker/python/requirements.txt

Write-Host "✅ MoonLight setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Run 'pnpm dev' to start the development server" -ForegroundColor Cyan
