# Tableau MCP

[![Tableau Supported](https://img.shields.io/badge/Support%20Level-Tableau%20Supported-53bd92.svg)](https://www.tableau.com/support-levels-it-and-developer-tools)

[![Build and Test](https://github.com/tableau/tableau-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/tableau/tableau-mcp/actions/workflows/ci.yml)

[![npm](https://img.shields.io/npm/v/@tableau/mcp-server)](https://www.npmjs.com/package/@tableau/mcp-server)

## Overview

Tableau MCP is a suite of developer primitives, including tools, resources and prompts, that will
make it easier for developers to build AI applications that integrate with Tableau.

## Enhanced Features

This fork includes additional features built on top of the official Tableau MCP to improve user experience and productivity:

### Favorites Management

The favorites feature allows users to quickly access their most frequently used Tableau content. This enhancement provides:

- **Quick Access to Preferred Content**: Retrieve your favorite projects, workbooks, views, and datasources without searching through the entire Tableau site
- **Personalized Workflows**: Build AI workflows that prioritize your most important content based on your favorites
- **Context-Aware Recommendations**: Use your favorites as context for AI-powered analysis and reporting

**Use Cases:**

1. **Daily Dashboard Review**: "Show me my favorite dashboards and summarize any significant changes in the last 24 hours"
   - Quickly review your most important metrics without manually navigating through projects

2. **Quick Report Generation**: "Generate a summary report from my favorite workbooks in the Sales project"
   - Automatically compile insights from your curated list of key workbooks

3. **Personalized Content Discovery**: "Find workbooks similar to my favorites that I haven't seen yet"
   - Discover new relevant content based on your existing preferences

### Custom Views Management

Custom views are personalized versions of Tableau views with specific filters, parameters, and customizations saved by users. This feature provides secure access to user-owned custom views:

- **Personal View Management**: List and access only custom views you own with automatic ownership verification
- **Data Export**: Export custom view data in CSV format for further analysis
- **Visual Snapshots**: Retrieve high-resolution images of your customized views
- **Metadata Access**: Get detailed information about creation dates, associated views, and workbooks

**Use Cases:**

1. **Personalized Reporting**: "Show me data from my custom view for the Q4 sales analysis"
   - Access your saved filtered views without manually reapplying filters

2. **Custom Dashboards Sharing**: "Get an image of my revenue trends custom view for the presentation"
   - Export visual snapshots of your personalized dashboards

3. **Tracking Custom Analyses**: "List all my custom views and when they were last updated"
   - Manage and organize your personalized analytical views

**Security Note**: All custom view operations enforce strict ownership verification - you can only access custom views you created.

### Viewer-Focused Content Filtering

This MCP server is optimized for Tableau viewers by restricting content search results to viewer-relevant types. This enhancement provides:

- **Focused Search Results**: Automatically filters out creator-focused content types (datasources, tables, flows, etc.)
- **Configurable Content Types**: Easily customize which content types are searchable via environment variables
- **Improved User Experience**: Viewers see only the content they can interact with (workbooks, views, projects, collections)

**Default Allowed Types:**
- `datasource` - Published data sources
- `workbook` - Tableau workbooks
- `view` - Individual dashboard views
- `project` - Project folders
- `collection` - Curated content collections

**Filtered Out Types** (for viewer focus):
- `lens` - Ask Data lenses
- `virtualconnection` - Virtual connections
- `flow` - Tableau Prep flows
- `datarole` - Data roles
- `table` - Database tables
- `database` - Database connections

**Configuration:**

You can customize the allowed content types by setting the `ALLOWED_SEARCH_CONTENT_TYPES` environment variable:

```json
{
  "mcpServers": {
    "tableau": {
      "command": "npx",
      "args": ["-y", "@tableau/mcp-server@latest"],
      "env": {
        "SERVER": "https://my-tableau-server.com",
        "SITE_NAME": "my_site",
        "PAT_NAME": "my_pat",
        "PAT_VALUE": "pat_value",
        "ALLOWED_SEARCH_CONTENT_TYPES": "workbook,view,project"
      }
    }
  }
}
```

To modify the default types programmatically, edit the `searchContentTypes` array in [src/config.ts](src/config.ts):

```typescript
export const searchContentTypes = [
  // 'lens',
  'datasource',
  // 'virtualconnection',
  'collection',
  'project',
  // 'flow',
  // 'datarole',
  // 'table',
  // 'database',
  'view',
  'workbook',
] as const;
```

**Use Cases:**

1. **Viewer-Only Deployment**: "Search for sales dashboards" - Returns only workbooks and views, not underlying datasources or flows
2. **Custom Content Scope**: Restrict search to only `workbook` and `view` types for end-user focused deployments
3. **Gradual Rollout**: Start with viewer-focused types, then expand to creator types as needed

## Official Documentation

https://tableau.github.io/tableau-mcp/

## Quick Start

### Requirements

- Node.js 22.7.5 or newer
- An MCP client e.g. Claude Desktop, Cursor, VS Code, MCP Inspector, etc.

Standard config works in most MCP clients:

```json
{
  "mcpServers": {
    "tableau": {
      "command": "npx",
      "args": ["-y", "@tableau/mcp-server@latest"],
      "env": {
        "SERVER": "https://my-tableau-server.com",
        "SITE_NAME": "my_site",
        "PAT_NAME": "my_pat",
        "PAT_VALUE": "pat_value"
      }
    }
  }
}
```

## Deploy to Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://www.heroku.com/deploy?template=https://github.com/tableau/tableau-mcp)

## Example Prompts to Client

#### Prompt #1: Querying Data

```
For the Superstore Datasource, what are the top 5 states with the most sales in 2025?
```

#### Response

```
Based on the Superstore Datasource, here are the top 5 states with the most sales in 2025:
  1. California - $146,388.34
  2. New York - $93,922.99
  3. Washington - $65,539.90
  4. Texas - $43,421.76
  5. Pennsylvania - $42,688.31
California leads by a significant margin with over $146,000 in sales, followed by New York with nearly $94,000. These two states alone account for a substantial portion of the total sales across the top 5 states.
```

#### Prompt #2: Content Exploration

```
Find me the most viewed workbook within the last year.
```

#### Response

```
The most viewed workbook within the last year is:

Global Connections
- Owner: John Doe
- Project: Marketing
- Views in last year: 523
- Last Modified: September 2, 2025
- Workbook ID: 111fb672-9401-4913-a167-17b3d89a3e4f
```

#### Prompt #3: Getting a View

```
Show me an image of the "Economy" view in the "Finances" project.
```

#### Response

![Economy View Image](docs/static/img/economy-view.png)

#### Prompt #4: Listing Favorites

```
Show me my favorite projects and workbooks.
```

#### Response

```
Here are your favorite projects:
1. Marketing Analytics (ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890)
2. Sales Dashboard (ID: b2c3d4e5-f6a7-8901-bcde-f12345678901)
3. Executive Reports (ID: c3d4e5f6-a7b8-9012-cdef-123456789012)

And your favorite workbooks:
1. Quarterly Revenue Report
   - Project: Finance
   - URL: https://tableau-server.example.com/#/site/mysite/workbooks/123456
   - Last Updated: November 20, 2025

2. Customer Insights Dashboard
   - Project: Marketing
   - URL: https://tableau-server.example.com/#/site/mysite/workbooks/234567
   - Last Updated: November 18, 2025
```
