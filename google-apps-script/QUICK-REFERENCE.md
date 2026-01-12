# 💬 Neoserra Training Chat - Quick Reference Card

## 🚀 5-Minute Setup

```
1. Open Google Sheets
2. Extensions → Apps Script
3. Paste ChatInterface.js
4. Add HTML file "ChatSidebar" with ChatSidebar.html
5. Save, refresh sheet
6. Neoserra → Training Search Chat
```

## 💡 Example Questions

### By Time
```
"What trainings are this week?"
"Show me events this month"
"Trainings next month"
"What's happening today?"
```

### By Location
```
"Trainings in Oakland"
"San Francisco events"
"Online trainings"
```

### By Topic
```
"Business planning trainings"
"Marketing events"
"Startup workshops"
"Social media trainings"
```

### Combined
```
"Online business planning this month"
"Marketing events in Oakland next week"
"Startup trainings in San Francisco"
```

## 🎯 Quick Filters (One Click)

| Button | What It Shows |
|--------|---------------|
| This Week | Next 7 days |
| This Month | Current month |
| Online | Virtual events only |
| Business Plan | Planning topics |
| Marketing | Marketing topics |
| Start-up | Startup topics |

## 📊 Understanding Results

### Event Card Shows:
- 📅 **Date** - When it happens
- 📍 **Location** - Where (city/state or online)
- ✅ **Status** - Open, Closed, Full
- 🎯 **Format** - Workshop, Online, Course
- ⏱️ **Hours** - Duration
- 📝 **Description** - Brief summary
- 🔗 **Register** - Signup link

### Status Meanings:
- **Open** ✅ - Can register now
- **Closed** ❌ - Registration closed
- **Full** 🚫 - Max attendees reached
- **Canceled** ⛔ - Event canceled

## 🔧 Pro Tips

✅ **DO:**
- Use natural language
- Combine filters (time + location + topic)
- Try quick filters first
- Click "Export to Sheet" to save results

❌ **DON'T:**
- Use exact dates (use "this week")
- Make queries too complex
- Forget to authorize on first use

## 🎨 What You'll See

```
┌─────────────────────────────┐
│ 💬 Training Search          │  ← Header
├─────────────────────────────┤
│                             │
│ 👋 Welcome message          │
│ Example questions...        │  ← Chat Area
│                             │
│ You: Oakland trainings?     │
│                             │
│ Bot: Found 3 events         │
│ ┌─────────────────────┐     │
│ │ Business Plan 101   │     │  ← Event Cards
│ │ 📅 Jan 15            │     │
│ │ 📍 Oakland, CA       │     │
│ └─────────────────────┘     │
│                             │
├─────────────────────────────┤
│ [This Week] [This Month]    │  ← Quick Filters
│ [Online] [Business Plan]    │
├─────────────────────────────┤
│ [Ask about trainings... ]   │  ← Input
│                         Send│
└─────────────────────────────┘
```

## 🔑 Keywords That Work

### Time Words:
`today`, `tomorrow`, `this week`, `this month`, `next month`

### Cities:
`Oakland`, `San Francisco`, `Berkeley`, `Sacramento`, `San Jose`

### Topics:
`business plan`, `marketing`, `startup`, `accounting`, `financing`, `legal`, `tax`, `social media`, `ecommerce`

### Format:
`online`, `virtual`, `in person`, `webinar`

## 📱 Mobile Friendly

Works on mobile devices! Access from:
- Google Sheets mobile app
- Mobile browser

## ⚡ Speed Tips

1. **Quick Filters** → Fastest results
2. **"This week"** → Most relevant
3. **Export button** → Save for later
4. **Combine 2-3 filters** → Best precision

## 🐛 Common Issues

### No results?
- Try broader date range
- Remove location filter
- Use general topic keywords

### Chat not opening?
- Refresh the sheet
- Check menu shows "Neoserra"
- Authorize the script

### Results seem off?
- Be more specific
- Try exact city names
- Use quoted phrases

## 📞 Need More Help?

Read the full guides:
- **CHAT-INTERFACE-GUIDE.md** - Complete user guide
- **SETUP-INSTRUCTIONS.md** - Setup details
- **README.md** - Full documentation

## 🎉 You're Ready!

Just type your question and hit Enter!

Example to try right now:
```
"What business trainings are happening in Oakland this month?"
```

---

**Made with ❤️ for SBDC Neoserra**
