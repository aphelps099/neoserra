# 🚀 Neoserra Training Search - Getting Started

Choose your preferred interface:

## Option 1: 🌐 Microsite (RECOMMENDED!)

**Best for:** Public-facing website, shareable links, no Google account needed

### What You Get
- Beautiful modern website
- Works on any device
- Share with anyone via URL
- Deploy to free hosting
- No setup required to use

### Quick Start (Use Locally)
1. Open `microsite/index.html` in your browser
2. Start searching!

### Deploy to Web (GitHub Pages - FREE)
```bash
# 1. Go to microsite folder
cd microsite/

# 2. Create GitHub repo and push
git init
git add .
git commit -m "Neoserra training search site"
git remote add origin https://github.com/YOUR-USERNAME/neoserra-search.git
git push -u origin main

# 3. On GitHub.com:
# - Go to Settings → Pages
# - Source: main branch
# - Save
# - Your site is live at: https://YOUR-USERNAME.github.io/neoserra-search/
```

**Live in 5 minutes!** 🎉

### Other Deployment Options

**Netlify (Easiest):**
1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag the `microsite/` folder
3. Done! Instant URL

**Vercel:**
```bash
cd microsite/
npx vercel
# Follow prompts
```

---

## Option 2: 📊 Google Sheets Integration

**Best for:** Internal use, spreadsheet workflows, batch operations

### What You Get
- Chat interface in Google Sheets
- Create client records
- Export to spreadsheet
- Integration with your existing sheets

### Quick Start
1. Create new Google Sheet
2. Extensions → Apps Script
3. Copy `google-apps-script/ChatInterface.js`
4. Add HTML file "ChatSidebar" with `google-apps-script/ChatSidebar.html`
5. Save, refresh sheet
6. Neoserra → Training Search Chat

**See:** `google-apps-script/QUICK-REFERENCE.md` for details

---

## 🎯 Which Should I Choose?

| Feature | Microsite | Google Sheets |
|---------|-----------|---------------|
| **Public Access** | ✅ Yes | ❌ No (Google login) |
| **Share via URL** | ✅ Yes | ⚠️ Sheet link only |
| **Mobile Friendly** | ✅ Perfect | ⚠️ Limited |
| **Setup Time** | 0 min | 5-10 min |
| **Beautiful UI** | ✅ Yes | ✅ Yes |
| **Export Data** | ✅ CSV | ✅ Google Sheet |
| **Create Clients** | ❌ No | ✅ Yes |
| **Best For** | Public site | Internal tool |

**Recommendation:**
- 🌐 **Microsite** for external users, marketing, public access
- 📊 **Google Sheets** for staff, internal workflows, client creation

---

## 📁 Project Structure

```
neoserra/
├── microsite/                      ⭐ Standalone website
│   ├── index.html                  - Main page
│   ├── styles.css                  - All styling
│   ├── app.js                      - Search logic
│   └── README.md                   - Deployment guide
│
├── google-apps-script/             📊 Google Sheets version
│   ├── ChatInterface.js            - Chat search script
│   ├── ChatSidebar.html            - Chat UI
│   ├── NeoserraIntegration.js      - Basic version
│   ├── EnhancedVersion.js          - Enhanced panel
│   ├── Sidebar.html                - Panel UI
│   ├── QUICK-REFERENCE.md          - Cheat sheet
│   ├── CHAT-INTERFACE-GUIDE.md     - Full guide
│   └── README.md                   - Documentation
│
└── NEO-API-docuementation/         📖 Neoserra API docs
    ├── OBJECT-RECORDS/
    └── LINKAGES/
```

---

## 🎨 What It Looks Like

### Microsite Preview

```
┌─────────────────────────────────────────────┐
│  🎓 SBDC Training Search                    │
├─────────────────────────────────────────────┤
│                                             │
│   Find Your Perfect Training                │
│   Ask questions in plain English            │
│                                             │
│   [Start Searching]  [How It Works]         │
│                                             │
│   Try asking:                               │
│   • "What trainings are this week?"         │
│   • "Show me business planning events"      │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   💬 Chat Interface                         │
│   ┌─────────────────────────────────────┐   │
│   │ You: Oakland trainings?             │   │
│   │                                     │   │
│   │ Bot: Found 3 events                 │   │
│   │ ┌─────────────────────────────┐     │   │
│   │ │ Business Planning Workshop  │     │   │
│   │ │ 📅 Jan 15  📍 Oakland, CA   │     │   │
│   │ └─────────────────────────────┘     │   │
│   └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 💡 Example Questions

Both versions understand these questions:

### By Time
```
"What trainings are this week?"
"Events happening this month"
"Show me next month's workshops"
"What's available today?"
```

### By Location
```
"Trainings in Oakland"
"San Francisco events"
"Online workshops"
"Berkeley trainings"
```

### By Topic
```
"Business planning trainings"
"Marketing workshops"
"Startup events"
"Accounting courses"
```

### Combined
```
"Online business planning this month"
"Marketing events in Oakland next week"
"Startup trainings in San Francisco"
```

---

## 🎯 Quick Actions

### Test the Microsite Right Now
```bash
cd microsite/
open index.html  # Mac
start index.html # Windows
xdg-open index.html # Linux
```

### Test Google Sheets Version
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new sheet
3. Follow setup in `google-apps-script/QUICK-REFERENCE.md`

---

## 🔧 Configuration

Both versions use the same API token. To change:

**Microsite:** Edit `microsite/app.js` line 3
**Google Sheets:** Edit script line 3

```javascript
apiToken: 'YOUR-NEW-TOKEN-HERE'
```

---

## 📞 Need Help?

### For Microsite:
- Read: `microsite/README.md`
- Check: Browser console for errors
- Test: Open `index.html` locally first

### For Google Sheets:
- Read: `google-apps-script/QUICK-REFERENCE.md`
- Guide: `google-apps-script/CHAT-INTERFACE-GUIDE.md`
- Full Docs: `google-apps-script/README.md`

### For API Issues:
- Check: `NEO-API-docuementation/`
- Verify: API token is valid
- Test: API connection in both versions

---

## 🎉 You're Ready!

**Fastest Path to Success:**

### For Public Website (5 min):
```bash
1. Open microsite/index.html in browser
2. Test search
3. Deploy to Netlify (drag & drop)
4. Share URL with everyone
```

### For Internal Tool (10 min):
```bash
1. Open Google Sheets
2. Extensions → Apps Script
3. Copy ChatInterface.js + ChatSidebar.html
4. Save, refresh, use!
```

---

**Choose your version and start searching!** 🚀

Both options provide the same powerful conversational search experience.
The only difference is delivery: web vs spreadsheet.
