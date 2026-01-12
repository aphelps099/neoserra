# 💬 Neoserra Training Search Chat - User Guide

## Overview

The Training Search Chat provides a conversational interface for finding Neoserra training events. Just type your question in natural language and get instant results!

## Features

✅ **Natural Language Search** - Ask questions like you would to a person
✅ **Smart Filtering** - Automatically detects dates, locations, topics, and formats
✅ **Quick Filter Buttons** - One-click access to common searches
✅ **Beautiful Results** - Event cards with all the details you need
✅ **Export to Sheet** - Save results to a spreadsheet with one click
✅ **Conversational UI** - Chat-style interface that's easy to use

## How to Setup

### 1. Add Scripts to Google Sheets

1. Create a new Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Delete any default code
4. Copy the contents of `ChatInterface.js` and paste it
5. Click **+** next to Files → **HTML**
6. Name it **"ChatSidebar"** (exact name)
7. Paste the contents of `ChatSidebar.html`
8. Click **Save** (💾)
9. Close Apps Script editor

### 2. Open the Chat

1. Refresh your Google Sheet
2. You'll see a new menu: **Neoserra**
3. Click **Neoserra** → **💬 Training Search Chat**
4. Authorize when prompted (first time only)
5. Chat sidebar opens on the right!

## How to Use

### Example Questions You Can Ask

**By Time:**
- "What trainings are happening this week?"
- "Show me events this month"
- "Trainings next month"
- "What's happening today?"
- "Events tomorrow"

**By Location:**
- "Trainings in Oakland"
- "Events in San Francisco"
- "Sacramento trainings"
- "Online trainings in California"

**By Topic:**
- "Business planning trainings"
- "Marketing events"
- "Start-up workshops"
- "Accounting trainings"
- "Social media events"
- "Legal trainings"

**By Format:**
- "Online trainings this week"
- "In-person events"
- "Virtual workshops"

**Combined Filters:**
- "Online business planning trainings this month"
- "Marketing events in Oakland next week"
- "Startup trainings in San Francisco"

### Quick Filter Buttons

Click any quick filter button for instant results:
- **This Week** - Trainings in the next 7 days
- **This Month** - All trainings this month
- **Online** - Virtual events only
- **Business Plan** - Business planning topics
- **Marketing** - Marketing-related events
- **Start-up** - Startup/entrepreneurship trainings

## Understanding the Results

Each event card shows:

📅 **Date** - When the training occurs
📍 **Location** - City/State or "Online"
✅ **Status** - Open, Closed, Full, etc.
🎯 **Format** - Workshop, Course, Online, etc.
⏱️ **Hours** - Total training hours
📝 **Description** - Event details (truncated)
🔗 **Register Link** - Direct signup URL (if available)

### Event Status Meanings

- **Open** - Registration is open
- **Closed** - Registration closed
- **Full** - Maximum attendees reached
- **Canceled** - Event canceled
- **Postponed** - Event delayed

### Event Formats

- **Workshop/Seminar** - In-person session
- **Multi-session Course** - Series of sessions
- **Online (Live)** - Live virtual event
- **Online (Prerecorded)** - Pre-recorded course

## Natural Language Understanding

The chat automatically detects:

### Time References
- "this week" → Next 7 days
- "this month" → Current month
- "next month" → Following month
- "today" → Today only
- "tomorrow" → Tomorrow only
- (default) → Next 30 days

### Cities (Examples)
Detects: Oakland, San Francisco, Berkeley, Sacramento, San Jose, Fresno, San Diego, Los Angeles, and more

### Topics with Keywords
- "business plan" or "planning" → Business Plan topic
- "marketing" → Marketing topic
- "accounting" or "budget" → Accounting/Budget topic
- "startup" or "start up" → Business Start-up topic
- "financing" → Business Financing topic
- "social media" or "digital marketing" → Digital/Social Media topic
- "export" or "international" → International Trade topic
- "legal" → Legal Issues topic
- "tax" → Tax Planning topic

### Formats
- "online" or "virtual" or "webinar" → Online events
- "in person" or "in-person" → In-person events

## Exporting Results

1. After getting search results, click **📊 Export to Sheet**
2. A new sheet "Training Results" is created
3. All event details are exported in a formatted table
4. Sheet becomes active automatically
5. Columns are auto-resized for readability

## Tips for Best Results

### ✅ Do's

- **Be conversational** - "What business trainings are in Oakland?"
- **Combine criteria** - "Online marketing events this month"
- **Use natural dates** - "this week", "next month"
- **Try quick filters** - Fast access to common searches

### ❌ Don'ts

- **Don't use exact dates** - Use "this week" instead of "January 13-19"
- **Don't use complex queries** - Keep it simple and clear
- **Don't worry about typos** - Search is forgiving

## Keyboard Shortcuts

- **Enter** - Send message (when typing in input box)

## Troubleshooting

### "No events found"

Try:
- Expanding your date range (use "this month" instead of "this week")
- Removing location filters
- Using broader topic keywords
- Checking if events exist in Neoserra for that criteria

### Chat not responding

- Check your internet connection
- Verify API token is correct in the script
- Look for errors in Apps Script logs

### Results seem incomplete

- The chat shows maximum 20 results
- Use more specific filters to narrow down
- Export to sheet to see all details

### Export not working

- Ensure you have edit permissions on the sheet
- Try refreshing the sheet
- Check Apps Script execution logs

## Advanced Usage

### Modifying Search Criteria

Edit `ChatInterface.js` to:
- Add more cities to detection
- Add custom topic keywords
- Adjust default date range (currently 30 days)
- Change maximum results (currently 20)

### Customizing the UI

Edit `ChatSidebar.html` to:
- Change colors (see gradient in `.header`)
- Modify quick filter buttons
- Add your branding
- Adjust card layouts

## Privacy & Security

- Your API token is embedded in the script
- Only share this sheet with authorized users
- For better security, use Script Properties to store the token
- All searches are private to your session

## Example Conversation

```
You: What trainings are happening this week?
Bot: Found 5 training events
     [Event cards displayed]

You: Show me only online ones
Bot: Found 3 training events
     [Filtered event cards]

You: Export to sheet
Bot: Exported 3 events to "Training Results" sheet
```

## Need Help?

- Check the example questions in the welcome screen
- Try quick filter buttons first
- Start with broad searches, then narrow down
- Look at Apps Script logs for technical errors

## Future Enhancements

Potential additions:
- Save favorite searches
- Email notifications for new events
- Calendar integration
- Multi-event registration
- Training attendance tracking

---

**Enjoy your new training search chat! 🎉**

For technical support, check the main README.md or SETUP-INSTRUCTIONS.md files.
