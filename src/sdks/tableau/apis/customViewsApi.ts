import { makeApi, makeEndpoint, ZodiosEndpointDefinitions } from '@zodios/core';
import { z } from 'zod';

import { paginationSchema } from '../types/pagination.js';
import { customViewSchema } from '../types/customView.js';
import { paginationParameters } from './paginationParameters.js';

/**
 * List Custom Views endpoint
 *
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#list_custom_views
 */
const listCustomViewsEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/customviews',
  alias: 'listCustomViews',
  description: 'Returns a list of custom views for the site.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    ...paginationParameters,
    {
      name: 'filter',
      type: 'Query',
      schema: z.string().optional(),
      description:
        "Filter expression to specify a subset of custom views to return. \
        You can filter by ownerId(viewId, workbookId, name, createdAt, updatedAt, or shared are prohibited according to my mind).",
    },
    {
      name: 'sort',
      type: 'Query',
      schema: z.string().optional(),
      description: 'Sort expression (e.g., createdAt:desc, updatedAt:asc).',
    },
  ],
  response: z.object({
    pagination: paginationSchema,
    customViews: z.object({ customView: z.array(customViewSchema).optional() }),
  }),
});

/**
 * Get Custom View endpoint
 *
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#get_custom_view
 */
const getCustomViewEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/customviews/:customViewId',
  alias: 'getCustomView',
  description: 'Gets the details of a specific custom view.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'customViewId',
      type: 'Path',
      schema: z.string(),
    },
  ],
  response: z.object({ customView: customViewSchema }),
});

/**
 * Get Custom View Data endpoint
 *
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#get_custom_view_data
 */
const getCustomViewDataEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/customviews/:customViewId/data',
  alias: 'getCustomViewData',
  description:
    'Returns a specified custom view rendered as data in comma separated value (CSV) format.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'customViewId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'maxAge',
      type: 'Query',
      schema: z.number().optional(),
      description:
        'The maximum number of minutes that data cached on the server will be used before being refreshed. Minimum value is 1 minute.',
    },
  ],
  response: z.string(),
});

/**
 * Get Custom View Image endpoint
 *
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#get_custom_view_image
 */
const getCustomViewImageEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/customviews/:customViewId/image',
  alias: 'getCustomViewImage',
  description: 'Returns an image of the specified custom view.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'customViewId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'resolution',
      type: 'Query',
      schema: z.literal('high').optional(),
      description:
        'The resolution of the image. Set the value to high to ensure maximum pixel density.',
    },
    {
      name: 'maxAge',
      type: 'Query',
      schema: z.number().optional(),
      description:
        'The maximum number of minutes that data cached on the server will be used before being refreshed.',
    },
  ],
  response: z.string(),
});

const customViewsApi = makeApi([
  listCustomViewsEndpoint,
  getCustomViewEndpoint,
  getCustomViewDataEndpoint,
  getCustomViewImageEndpoint,
]);

export const customViewsApis = [...customViewsApi] as const satisfies ZodiosEndpointDefinitions;