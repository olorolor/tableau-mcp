---
sidebar_position: 1
---

# Manage Custom Views

Custom views are personalized versions of Tableau views that users have saved with specific filters, parameters, or other customizations. These tools allow you to list, retrieve details, export data, and get images of custom views owned by the authenticated user.

## Available Tools

### `list-custom-views`

Retrieves a list of custom views created by the authenticated user.

**Example Usage:**
- "List my custom views"
- "Show me my saved custom views"
- "What custom views do I have?"
- "Show me my personalized dashboards"

**Arguments:**
- `pageSize` (optional): Number of items per page (default: based on server settings)
- `limit` (optional): Maximum total number of items to retrieve

### `get-custom-view`

Retrieves the details of a specific custom view created by the authenticated user including its metadata such as name, creation date, associated view and workbook information.

**Example Usage:**
- "Get details for custom view with ID abc123"
- "Show me information about this custom view"

**Arguments:**
- `customViewId` (required): The ID of the custom view

### `get-custom-view-data`

Retrieves the data from a specified custom view in comma-separated value (CSV) format. The data returned is at summary level only.

**Example Usage:**
- "Get the data from my custom view"
- "Export custom view data as CSV"
- "Download the data from this custom view"

**Arguments:**
- `customViewId` (required): The ID of the custom view
- `maxAge` (optional): Maximum cache age in minutes (minimum: 1)

### `get-custom-view-image`

Retrieves an image (PNG format) of the specified custom view. The image is rendered at high resolution.

**Example Usage:**
- "Show me an image of my custom view"
- "Get a screenshot of this custom view"
- "Display this custom view as an image"

**Arguments:**
- `customViewId` (required): The ID of the custom view
- `maxAge` (optional): Maximum cache age in minutes (minimum: 1)

## Security & Ownership

All custom view tools enforce ownership verification:
- Users can **only access custom views they own**
- Attempting to access another user's custom view returns: `"Custom view not found"`
- This ensures privacy and data security

## APIs Called

- [List Custom Views](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#list_custom_views) - Automatically filtered by owner
- [Get Custom View](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#get_custom_view) - With ownership verification
- [Get Custom View Data](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#get_custom_view_data)
- [Get Custom View Image](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#get_custom_view_image)

## Example Results

### list-custom-views

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Sales by Region - Q4 Focus",
    "createdAt": "2024-10-15T09:30:00Z",
    "updatedAt": "2025-11-22T14:20:00Z",
    "lastAccessedAt": "2025-11-27T10:15:30Z",
    "shared": false,
    "view": {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "Sales Dashboard"
    },
    "workbook": {
      "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "name": "Regional Sales Analysis"
    },
    "owner": {
      "id": "d4e5f6a7-b8c9-0123-def1-234567890123"
    }
  },
  {
    "id": "e5f6a7b8-c9d0-1234-ef12-345678901234",
    "name": "Revenue Trends - Last 6 Months",
    "createdAt": "2024-11-01T11:45:00Z",
    "updatedAt": "2025-11-25T16:30:00Z",
    "shared": true,
    "view": {
      "id": "f6a7b8c9-d0e1-2345-f123-456789012345",
      "name": "Revenue Overview"
    },
    "workbook": {
      "id": "a7b8c9d0-e1f2-3456-1234-567890123456",
      "name": "Financial Dashboard"
    },
    "owner": {
      "id": "d4e5f6a7-b8c9-0123-def1-234567890123"
    }
  }
]
```

### get-custom-view

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Sales by Region - Q4 Focus",
  "createdAt": "2024-10-15T09:30:00Z",
  "updatedAt": "2025-11-22T14:20:00Z",
  "lastAccessedAt": "2025-11-27T10:15:30Z",
  "shared": false,
  "view": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "Sales Dashboard"
  },
  "workbook": {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "name": "Regional Sales Analysis"
  },
  "owner": {
    "id": "d4e5f6a7-b8c9-0123-def1-234567890123"
  }
}
```

### get-custom-view-data

Returns CSV format data (summary level only):

```csv
Region,Quarter,Total Sales,Average Order Value
North,Q4 2024,1250000,450.25
South,Q4 2024,980000,425.50
East,Q4 2024,1150000,475.00
West,Q4 2024,1420000,500.75
```

### get-custom-view-image

Returns a PNG image (Base64 encoded in the API response). The image shows the visual representation of the custom view with all applied filters and customizations.

## Notes

- **Summary Data Only**: Both `get-custom-view-data` and the underlying view data APIs return summary-level data, not raw detailed records
- **Cache Control**: Use the `maxAge` parameter to control whether fresh data is fetched or cached data is used
- **High Resolution**: Images are automatically rendered at high resolution for clarity
- **Ownership Enforcement**: All operations verify that the custom view belongs to the authenticated user
