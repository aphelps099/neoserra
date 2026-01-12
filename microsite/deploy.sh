#!/bin/bash

echo "🚀 Deploying Neoserra Training Search to GitHub Pages..."
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this from the microsite folder."
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✓ Git initialized"
else
    echo "✓ Git already initialized"
fi

# Add files
echo ""
echo "📝 Adding files to git..."
git add .
git status --short

# Commit
echo ""
echo "💾 Creating commit..."
git commit -m "Deploy Neoserra training search microsite" 2>/dev/null || echo "✓ No changes to commit"

echo ""
echo "🌐 Next steps to deploy to GitHub Pages:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   → Go to: https://github.com/new"
echo "   → Repository name: neoserra-training-search (or any name you like)"
echo "   → Make it Public"
echo "   → DO NOT initialize with README"
echo "   → Click 'Create repository'"
echo ""
echo "2. Copy the repository URL from GitHub (looks like):"
echo "   https://github.com/YOUR-USERNAME/neoserra-training-search.git"
echo ""
echo "3. Run these commands (replace YOUR-USERNAME):"
echo ""
echo "   git remote add origin https://github.com/YOUR-USERNAME/neoserra-training-search.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Enable GitHub Pages:"
echo "   → Go to your repo Settings → Pages"
echo "   → Source: Deploy from branch → main → root"
echo "   → Click Save"
echo ""
echo "5. Your site will be live at:"
echo "   https://YOUR-USERNAME.github.io/neoserra-training-search/"
echo ""
echo "✨ Questions? I can help! Just ask."
