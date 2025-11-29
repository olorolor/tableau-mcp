import { getSearchContentTool } from './contentExploration/searchContent.js';
import { getGetCustomViewTool } from './customViews/getCustomView.js';
import { getGetCustomViewDataTool } from './customViews/getCustomViewData.js';
import { getGetCustomViewImageTool } from './customViews/getCustomViewImage.js';
import { getListCustomViewsTool } from './customViews/listCustomViews.js';
import { getListFavoriteDatasourcesTool } from './favorites/listFavoriteDatasources.js';
import { getListFavoriteProjectsTool } from './favorites/listFavoriteProjects.js';
import { getListFavoriteViewsTool } from './favorites/listFavoriteViews.js';
import { getListFavoriteWorkbooksTool } from './favorites/listFavoriteWorkbooks.js';
import { getGetDatasourceMetadataTool } from './getDatasourceMetadata/getDatasourceMetadata.js';
import { getListDatasourcesTool } from './listDatasources/listDatasources.js';
import { getGeneratePulseMetricValueInsightBundleTool } from './pulse/generateMetricValueInsightBundle/generatePulseMetricValueInsightBundleTool.js';
import { getListAllPulseMetricDefinitionsTool } from './pulse/listAllMetricDefinitions/listAllPulseMetricDefinitions.js';
import { getListPulseMetricDefinitionsFromDefinitionIdsTool } from './pulse/listMetricDefinitionsFromDefinitionIds/listPulseMetricDefinitionsFromDefinitionIds.js';
import { getListPulseMetricsFromMetricDefinitionIdTool } from './pulse/listMetricsFromMetricDefinitionId/listPulseMetricsFromMetricDefinitionId.js';
import { getListPulseMetricsFromMetricIdsTool } from './pulse/listMetricsFromMetricIds/listPulseMetricsFromMetricIds.js';
import { getListPulseMetricSubscriptionsTool } from './pulse/listMetricSubscriptions/listPulseMetricSubscriptions.js';
import { getQueryDatasourceTool } from './queryDatasource/queryDatasource.js';
import { getGetViewDataTool } from './views/getViewData.js';
import { getGetViewImageTool } from './views/getViewImage.js';
import { getListViewsTool } from './views/listViews.js';
import { getGetWorkbookTool } from './workbooks/getWorkbook.js';
import { getListWorkbooksTool } from './workbooks/listWorkbooks.js';

export const toolFactories = [
  getGetDatasourceMetadataTool,
  getListDatasourcesTool,
  getQueryDatasourceTool,
  getListAllPulseMetricDefinitionsTool,
  getListPulseMetricDefinitionsFromDefinitionIdsTool,
  getListPulseMetricsFromMetricDefinitionIdTool,
  getListPulseMetricsFromMetricIdsTool,
  getListPulseMetricSubscriptionsTool,
  getGeneratePulseMetricValueInsightBundleTool,
  getGetWorkbookTool,
  getGetViewDataTool,
  getGetViewImageTool,
  getListWorkbooksTool,
  getListViewsTool,
  getSearchContentTool,
  getListFavoriteWorkbooksTool,
  getListFavoriteViewsTool,
  getListFavoriteProjectsTool,
  getListFavoriteDatasourcesTool,
  getListCustomViewsTool,
  getGetCustomViewTool,
  getGetCustomViewDataTool,
  getGetCustomViewImageTool,
];
