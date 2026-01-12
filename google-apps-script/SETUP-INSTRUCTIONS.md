# Neoserra Google Sheets Integration - Setup Instructions

## Overview
This integration allows you to:
1. **Create new client records** in Neoserra directly from Google Sheets
2. **Fetch training events** for the current month into Google Sheets

## Setup Steps

### 1. Create Your Google Sheet

Create a new Google Sheet with two tabs:

#### **Tab 1: "Clients"**
This sheet will contain client data to be uploaded to Neoserra.

| Column | Header | Description | Required |
|--------|--------|-------------|----------|
| A | Client ID | Unique client identifier | Yes |
| B | Company Name | Business name | Yes |
| C | Client Type | AC, IC, PC, PI, or 10 | Yes |
| D | Physical Address | Street address | Yes |
| E | City | City name | Yes |
| F | State | 2-letter state code (e.g., CA) | Yes |
| G | ZIP Code | Postal code | Yes |
| H | Phone Number | Business phone (optional) | No |
| I | Email Address | Business email (optional) | No |
| J | Website | Company website URL (optional) | No |
| K | Status | Auto-populated by script | Auto |

**Client Type Codes:**
- `AC` = Active Client
- `IC` = Inactive Client
- `PC` = Pre-client
- `PI` = Pre-client (Inactive)
- `10` = Stakeholder

#### **Tab 2: "Training Events"**
This sheet will be auto-populated when you fetch training events. It will be created automatically if it doesn't exist.

### 2. Add the Script to Your Google Sheet

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. Delete any default code in the editor
4. Copy and paste the entire contents of `NeoserraIntegration.js`
5. Click **Save** (💾 icon)
6. Name your project (e.g., "Neoserra Integration")

### 3. Authorize the Script

1. Close the Apps Script editor
2. Refresh your Google Sheet
3. You'll see a new menu: **Neoserra**
4. Click **Neoserra** → **Test API Connection**
5. When prompted, click **Review Permissions**
6. Select your Google account
7. Click **Advanced** → **Go to [Your Project Name] (unsafe)**
8. Click **Allow**

### 4. Test the Integration

Click **Neoserra** → **Test API Connection**
- If successful, you'll see: "Successfully connected to Neoserra API!"
- If failed, check that your API token is correct

## Usage

### Creating New Clients

1. Fill in client data in the "Clients" sheet (columns A-J)
2. Click **Neoserra** → **Create All New Clients**
3. The script will:
   - Process all rows where column K (Status) is empty
   - Create each client in Neoserra
   - Mark each row with "Success: [timestamp]" or "Error: [message]"
   - Add a 500ms delay between requests (rate limiting)

### Fetching Training Events

1. Click **Neoserra** → **Fetch Training Events (This Month)**
2. The script will:
   - Fetch all events for the current month
   - Create/clear the "Training Events" sheet
   - Populate it with event data

## Example Client Data

| Client ID | Company Name | Client Type | Physical Address | City | State | ZIP | Phone | Email | Website | Status |
|-----------|--------------|-------------|------------------|------|-------|-----|-------|-------|---------|--------|
| CL001 | Acme Corp | AC | 123 Main St | Oakland | CA | 94612 | 510-555-1234 | info@acme.com | https://acme.com | |
| CL002 | Tech Startup Inc | PC | 456 Market St | San Francisco | CA | 94102 | | hello@techstartup.io | | |

## API Details

### Authentication
The script uses Bearer token authentication:
```
Authorization: Bearer b4afa19f-c2f5-45c5-89b0-82ce7bc79145
```

### Base URL
```
https://norcal.neoserra.com/api/v1/
```

### Endpoints Used

**Create Client:**
```
POST /clients/new
```

**Fetch Events:**
```
GET /events?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

## Troubleshooting

### "API Connection Failed"
- Verify your API token is correct in the script
- Check that you have internet connectivity
- Ensure the Neoserra API is accessible

### "Error processing row X"
- Check that all required fields are filled
- Verify state codes are valid 2-letter codes (CA, NY, etc.)
- Check that Client Type is one of: AC, IC, PC, PI, 10
- Ensure Client ID is unique

### Script doesn't appear in menu
- Refresh the Google Sheet
- Close and reopen the sheet
- Check that the script was saved properly

## Rate Limiting

The script includes a 500ms delay between client creation requests to avoid overwhelming the API. For large batches (100+ clients), this may take several minutes.

## Security Note

**IMPORTANT:** Your API token is embedded in the script. Only share this Google Sheet with trusted users who should have access to your Neoserra account.

To increase security:
1. Use Google Sheets permissions to restrict access
2. Consider using Google Apps Script Properties Service to store the token separately
3. Rotate your API token periodically

## Support

For issues with:
- **The script**: Check the Apps Script logs (View → Logs)
- **Neoserra API**: Contact Neoserra support
- **Google Sheets/Apps Script**: Check Google's documentation

## Advanced: Storing API Token Securely

For better security, you can store the API token in Script Properties:

1. In Apps Script, click **Project Settings** (⚙️)
2. Scroll to **Script Properties**
3. Click **Add script property**
4. Property: `NEOSERRA_API_TOKEN`
5. Value: `b4afa19f-c2f5-45c5-89b0-82ce7bc79145`
6. Click **Save**

Then update the script:
```javascript
const NEOSERRA_CONFIG = {
  apiUrl: 'https://norcal.neoserra.com/api/v1/',
  apiToken: PropertiesService.getScriptProperties().getProperty('NEOSERRA_API_TOKEN')
};
```
