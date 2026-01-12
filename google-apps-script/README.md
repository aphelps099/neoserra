# Neoserra Google Sheets Integration

Complete integration between Google Sheets and the Neoserra API for creating client records and fetching training events.

## 🎯 What This Does

1. **Create Client Records**: Add new clients to Neoserra directly from a Google Sheet
2. **Fetch Training Events**: Pull training event data for any date range into Google Sheets
3. **💬 Chat Interface**: Ask questions in natural language to find trainings (NEW!)
4. **Easy-to-Use Interface**: Custom menu and optional sidebar control panel

## 📦 Files Included

### Core Files
- **`NeoserraIntegration.js`** - Basic version with menu-based interface
- **`EnhancedVersion.js`** - Enhanced version with custom sidebar UI
- **`Sidebar.html`** - HTML sidebar interface for the enhanced version
- **`ChatInterface.js`** - 💬 Chat-style training search (RECOMMENDED!)
- **`ChatSidebar.html`** - Chat interface UI

### Documentation
- **`SETUP-INSTRUCTIONS.md`** - Complete setup guide
- **`CHAT-INTERFACE-GUIDE.md`** - Chat interface user guide
- **`CLIENTS_TEMPLATE.csv`** - Sample client data template

## 🚀 Quick Start

### Option 1: 💬 Chat Interface (RECOMMENDED - Most User-Friendly!)

**Best for: Finding trainings with natural language questions**

1. Create a new Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Copy the contents of `ChatInterface.js` into the script editor
4. Click **+** next to Files → **HTML** → Name it "ChatSidebar"
5. Copy the contents of `ChatSidebar.html` into this file
6. Save and refresh your sheet
7. Click **Neoserra** → **💬 Training Search Chat**
8. Ask questions like "What trainings are in Oakland this week?"

📖 See **CHAT-INTERFACE-GUIDE.md** for detailed instructions

### Option 2: Basic Version (Simple Menu Interface)

**Best for: Batch client creation and basic event fetching**

1. Create a new Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Copy the contents of `NeoserraIntegration.js` into the script editor
4. Save and refresh your sheet
5. Use the **Neoserra** menu to interact with the API

### Option 3: Enhanced Version (With Sidebar UI)

**Best for: Visual control panel with date pickers**

1. Create a new Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Copy the contents of `EnhancedVersion.js` into the script editor
4. Click **+** next to Files → **HTML** → Name it "Sidebar"
5. Copy the contents of `Sidebar.html` into this file
6. Save and refresh your sheet
7. Use **Neoserra** → **Open Control Panel** for a visual interface

## 📋 Sheet Structure

### "Clients" Sheet (for creating clients)

| Column | Field | Required | Example |
|--------|-------|----------|---------|
| A | Client ID | Yes | CL001 |
| B | Company Name | Yes | Acme Corporation |
| C | Client Type | Yes | AC |
| D | Physical Address | Yes | 123 Main Street |
| E | City | Yes | Oakland |
| F | State | Yes | CA |
| G | ZIP Code | Yes | 94612 |
| H | Phone | No | 510-555-1234 |
| I | Email | No | info@acme.com |
| J | Website | No | https://acme.com |
| K | Status | Auto | (populated by script) |

**Client Type Values:**
- `AC` - Active Client
- `IC` - Inactive Client
- `PC` - Pre-client
- `PI` - Pre-client (Inactive)
- `10` - Stakeholder

### "Training Events" Sheet (auto-generated)

This sheet is automatically created and populated when you fetch training events.

## 🔧 Configuration

The API token is embedded in the script:

```javascript
const NEOSERRA_CONFIG = {
  apiUrl: 'https://norcal.neoserra.com/api/v1/',
  apiToken: 'b4afa19f-c2f5-45c5-89b0-82ce7bc79145'
};
```

**Security Note:** Only share this sheet with trusted users who should have Neoserra API access.

## 📖 Usage Examples

### Creating Clients

1. Fill in client data in the "Clients" sheet
2. Click **Neoserra** → **Create All New Clients**
3. Script processes all rows without a status
4. Each row is marked with success/error in column K

### Fetching Events

**Current Month:**
- Click **Neoserra** → **Fetch Training Events (This Month)**

**Custom Date Range (Enhanced Version):**
- Click **Neoserra** → **Open Control Panel**
- Enter start and end dates
- Click **Fetch Custom Range**

## 🔌 API Endpoints Used

### Create Client
```
POST https://norcal.neoserra.com/api/v1/clients/new
```

**Headers:**
```
Authorization: Bearer {API_TOKEN}
Content-Type: application/json
```

**Payload Example:**
```json
{
  "client": "CL001",
  "company": "Acme Corp",
  "type2": "AC",
  "physaddr": "123 Main St",
  "physcity": "Oakland",
  "physst": "CA",
  "physzip": "94612",
  "emailingLists": true
}
```

### Fetch Events
```
GET https://norcal.neoserra.com/api/v1/events?startDate=2026-01-01&endDate=2026-01-31
```

**Headers:**
```
Authorization: Bearer {API_TOKEN}
```

## ⚙️ Features

### Basic Version (NeoserraIntegration.js)
- ✅ Create clients from sheet
- ✅ Fetch training events
- ✅ Test API connection
- ✅ Menu-based interface
- ✅ Automatic rate limiting (500ms between requests)
- ✅ Error handling and status tracking

### Enhanced Version (EnhancedVersion.js + Sidebar.html)
- ✅ All basic version features
- ✅ Custom sidebar control panel
- ✅ Visual status indicators
- ✅ Pending client counter
- ✅ Custom date range picker
- ✅ Real-time feedback
- ✅ Modern UI design

## 🛠️ Troubleshooting

### "API Connection Failed"
- Verify API token is correct
- Check Neoserra API status
- Ensure you have internet connectivity

### "Error processing row X"
- Check all required fields are filled
- Verify state code is valid (CA, NY, etc.)
- Ensure Client Type is valid (AC, IC, PC, PI, 10)
- Check Client ID is unique

### Script menu doesn't appear
- Refresh the Google Sheet
- Close and reopen
- Check script was saved properly

### Permission errors
- Go to **Neoserra** menu → **Test API Connection**
- Click **Review Permissions**
- Authorize the script

## 🔒 Security Best Practices

1. **Restrict Sheet Access**: Only share with authorized users
2. **Use Script Properties**: Store API token in Script Properties instead of code
3. **Rotate Tokens**: Periodically generate new API tokens
4. **Monitor Usage**: Check Apps Script logs regularly

### Storing Token Securely

Instead of hardcoding the token:

1. In Apps Script, go to **Project Settings** ⚙️
2. Add Script Property: `NEOSERRA_API_TOKEN` = `b4afa19f-c2f5-45c5-89b0-82ce7bc79145`
3. Update code:
```javascript
apiToken: PropertiesService.getScriptProperties().getProperty('NEOSERRA_API_TOKEN')
```

## 📊 Rate Limiting

- 500ms delay between client creation requests
- Prevents overwhelming the API
- For 100+ clients, expect several minutes processing time

## 🐛 Debugging

View logs in Apps Script:
1. Open Apps Script editor
2. Click **Executions** (⏱️ icon)
3. View execution logs and errors

## 📞 Support

- **Script Issues**: Check Apps Script logs
- **API Issues**: Contact Neoserra support
- **Google Sheets**: See Google Workspace documentation

## 📝 License

This integration script is provided as-is for use with your Neoserra account.

## 🎉 Credits

Built for SBDC Neoserra integration - connecting WordPress/Gravity Forms data to Neoserra database via Google Sheets middleware.
