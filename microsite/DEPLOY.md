# 🚀 Deploy Your Neoserra Training Search Site

Choose the easiest option for you:

---

## ⚡ Option 1: Netlify Drop (EASIEST - 2 Minutes!)

**No command line needed!**

### Steps:
1. **Zip this folder**
   - Right-click the `microsite` folder
   - Select "Compress" or "Create Archive"
   - You'll get `microsite.zip`

2. **Go to Netlify Drop**
   - Open: https://app.netlify.com/drop
   - (No account needed for testing!)

3. **Drag & Drop**
   - Drag `microsite.zip` (or the entire folder) onto the page
   - Wait 10 seconds...
   - **DONE!** You get a URL like: `https://random-name-123.netlify.app`

4. **Share Your URL**
   - Click the URL to test
   - Share with anyone!
   - Works immediately!

### Optional: Custom Domain
- Create free Netlify account
- Click "Domain settings"
- Add custom domain (like: `trainings.yoursite.com`)

**⭐ This is the FASTEST way!** No git, no CLI, just drag & drop!

---

## 🐙 Option 2: GitHub Pages (FREE Forever!)

**Best for permanent hosting**

### Prerequisites:
- GitHub account (free at github.com)
- Git installed on your computer

### Steps:

#### 1️⃣ Create GitHub Repository
```bash
# Go to: https://github.com/new
# - Name: neoserra-training-search
# - Public repository
# - DO NOT check "Add README"
# - Click "Create repository"
```

#### 2️⃣ Deploy from Command Line
```bash
# Navigate to microsite folder
cd /home/user/neoserra/microsite/

# Initialize git (if not already done)
git init

# Add all files
git add .
git commit -m "Initial deployment"

# Add your GitHub repo (REPLACE with your username!)
git remote add origin https://github.com/YOUR-USERNAME/neoserra-training-search.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 3️⃣ Enable GitHub Pages
```bash
# Go to your repo on GitHub
# Settings → Pages (left sidebar)
# Source: "Deploy from a branch"
# Branch: main → / (root) → Save
```

#### 4️⃣ Your Site is Live!
```
https://YOUR-USERNAME.github.io/neoserra-training-search/
```

Wait 2-3 minutes for first deployment.

### Custom Domain (Optional):
1. Settings → Pages → Custom domain
2. Enter: `trainings.yoursite.com`
3. Add CNAME record in your DNS

---

## ⚡ Option 3: Vercel (ONE Command!)

**Fast CLI deployment**

### Steps:

#### 1️⃣ Install Vercel CLI
```bash
npm install -g vercel
# Or use without installing:
# npx vercel
```

#### 2️⃣ Deploy
```bash
# Navigate to microsite folder
cd /home/user/neoserra/microsite/

# Deploy!
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your username
# - Link to existing project? No
# - What's your project's name? neoserra-training-search
# - In which directory is your code? ./
# - Want to modify settings? No
```

#### 3️⃣ Done!
You'll get a URL like:
```
https://neoserra-training-search.vercel.app
```

### Production Deployment:
```bash
vercel --prod
```

---

## 🖥️ Option 4: Local Server (For Testing)

**Not online, but great for testing!**

### Python (Easiest):
```bash
cd /home/user/neoserra/microsite/
python3 -m http.server 8000
```
Open: http://localhost:8000

### Node.js:
```bash
npx serve .
```
Open: http://localhost:3000

### PHP:
```bash
php -S localhost:8000
```
Open: http://localhost:8000

Press `Ctrl+C` to stop the server.

---

## 📊 Comparison

| Method | Time | Free | Custom Domain | Difficulty |
|--------|------|------|---------------|------------|
| **Netlify Drop** | 2 min | ✅ Yes | ✅ Yes | ⭐ Easiest |
| **GitHub Pages** | 5 min | ✅ Yes | ✅ Yes | ⭐⭐ Easy |
| **Vercel** | 3 min | ✅ Yes | ✅ Yes | ⭐⭐ Easy |
| **Local** | 1 min | ✅ Yes | ❌ No | ⭐ Easiest |

---

## 🎯 Recommended Path

### For Quick Test:
**→ Netlify Drop** (2 minutes, no CLI)

### For Production:
**→ GitHub Pages** (free forever, reliable)

### For Developer:
**→ Vercel** (fastest deployments, great CLI)

---

## 🔧 Troubleshooting

### Netlify Drop: "Site not loading"
- Clear browser cache
- Check if all files uploaded
- Try re-uploading

### GitHub Pages: "404 Not Found"
- Wait 2-3 minutes after enabling
- Check Settings → Pages shows "Your site is live"
- Verify branch is `main` not `master`

### CORS Errors
- Neoserra API must allow your domain
- Contact Neoserra support if needed
- Or use backend proxy (I can help!)

### Site works locally but not online
- Check browser console for errors
- Verify API token is correct
- Test with different browser

---

## 🎨 After Deployment

### Test Your Site:
1. Open the URL
2. Try search: "What trainings are this week?"
3. Test on mobile device
4. Share with colleagues

### Monitor Usage:
- **Netlify**: View analytics in dashboard
- **GitHub Pages**: Check repo traffic
- **Vercel**: View analytics in dashboard

### Update Your Site:
```bash
# Make changes to files, then:
git add .
git commit -m "Update site"
git push

# Site auto-deploys in 1-2 minutes!
```

---

## 🚀 Quick Start Command

**For the absolute fastest deployment:**

```bash
cd /home/user/neoserra/microsite/
npx vercel
```

**Or just use Netlify Drop!**
1. Zip the folder
2. Go to app.netlify.com/drop
3. Drag & drop
4. Done!

---

## 💡 Need Help?

**I'm here to help!** Just ask:
- "How do I add a custom domain?"
- "How do I update the site?"
- "CORS errors - what do I do?"
- "Can you help with SSL/HTTPS?"

---

**Ready to deploy?** Pick your method and go! 🎉
