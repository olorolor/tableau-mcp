---
sidebar_position: 1
---

# List Favorites

Retrieves lists of content items marked as favorites by the authenticated user. This includes projects, workbooks, views, datasources, and collections that the user has explicitly added to their favorites.

## Available Tools

### `list-favorite-projects`

Returns a list of projects marked as favorites by the authenticated user.

**Example Usage:**
- "List my favorite projects"
- "Show me my favorite projects"
- "What projects have I favorited?"

### `list-favorite-workbooks`

Returns a list of workbooks marked as favorites by the authenticated user.

**Example Usage:**
- "List my favorite workbooks"
- "Show me my favorite dashboards"
- "What workbooks have I favorited?"

### `list-favorite-views`

Returns a list of views marked as favorites by the authenticated user.

**Example Usage:**
- "List my favorite views"
- "Show me my favorite views"
- "What views have I favorited?"

### `list-favorite-datasources`

Returns a list of datasources marked as favorites by the authenticated user.

**Example Usage:**
- "List my favorite datasources"
- "Show me my favorite data sources"
- "What datasources have I favorited?"

## APIs called

- [Get Favorites for User](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_favorites.htm#get_favorites_for_user)

## Arguments

None. These tools automatically retrieve favorites for the currently authenticated user.

## Example results

### list-favorite-projects

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Marketing Analytics"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "Sales Dashboard"
  },
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "name": "Executive Reports"
  }
]
```

### list-favorite-workbooks

```json
[
  {
    "id": "d4e5f6a7-b8c9-0123-def1-234567890123",
    "name": "Quarterly Revenue Report",
    "contentUrl": "QuarterlyRevenueReport",
    "webpageUrl": "https://tableau-server.example.com/#/site/mysite/workbooks/123456",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2025-11-20T14:45:30Z",
    "project": {
      "id": "e5f6a7b8-c9d0-1234-ef12-345678901234",
      "name": "Finance"
    },
    "owner": {
      "id": "f6a7b8c9-d0e1-2345-f123-456789012345"
    }
  },
  {
    "id": "a7b8c9d0-e1f2-3456-1234-567890123456",
    "name": "Customer Insights Dashboard",
    "contentUrl": "CustomerInsightsDashboard",
    "webpageUrl": "https://tableau-server.example.com/#/site/mysite/workbooks/234567",
    "createdAt": "2024-03-22T08:15:00Z",
    "updatedAt": "2025-11-18T16:20:45Z",
    "project": {
      "id": "b8c9d0e1-f2a3-4567-2345-678901234567",
      "name": "Marketing"
    },
    "owner": {
      "id": "c9d0e1f2-a3b4-5678-3456-789012345678"
    }
  }
]
```

### list-favorite-views

```json
[
  {
    "id": "d0e1f2a3-b4c5-6789-4567-890123456789",
    "name": "Sales Overview",
    "contentUrl": "SalesAnalysis/sheets/Overview",
    "createdAt": "2024-02-10T12:00:00Z",
    "updatedAt": "2025-10-15T09:30:15Z",
    "workbook": {
      "id": "e1f2a3b4-c5d6-7890-5678-901234567890"
    },
    "owner": {
      "id": "f2a3b4c5-d6e7-8901-6789-012345678901"
    }
  },
  {
    "id": "a3b4c5d6-e7f8-9012-7890-123456789012",
    "name": "Monthly Performance",
    "contentUrl": "PerformanceMetrics/sheets/Monthly",
    "createdAt": "2024-05-20T14:30:00Z",
    "updatedAt": "2025-11-05T11:45:20Z",
    "workbook": {
      "id": "b4c5d6e7-f8a9-0123-8901-234567890123"
    },
    "owner": {
      "id": "c5d6e7f8-a9b0-1234-9012-345678901234"
    }
  }
]
```

### list-favorite-datasources

```json
[
  {
    "id": "d6e7f8a9-b0c1-2345-0123-456789012345",
    "name": "Sales Database",
    "contentUrl": "SalesDatabase",
    "type": "postgres",
    "createdAt": "2024-01-05T08:00:00Z",
    "updatedAt": "2025-11-22T16:30:45Z",
    "project": {
      "id": "e7f8a9b0-c1d2-3456-1234-567890123456",
      "name": "Data Sources"
    },
    "owner": {
      "id": "f8a9b0c1-d2e3-4567-2345-678901234567"
    }
  }
]
```

## Notes

- All favorites tools are read-only and do not modify any content
- Results are automatically filtered based on server configuration (e.g., `PROJECT_IDS`, `WORKBOOK_IDS`)
- If no favorites are found, an appropriate message is returned
- The authenticated user's favorites are retrieved automatically based on their credentials
