import { makeApi, makeEndpoint, ZodiosEndpointDefinitions } from '@zodios/core';
import { z } from 'zod';

import { favoritesSchema, FavoritesApiResponse } from '../types/favorite.js';

/**
 * Get Favorites for User endpoint
 *
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_favorites.htm#get_favorites_for_user
 */
const getFavoritesForUserEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/favorites/:userId',
  alias: 'getFavoritesForUser',
  description: 'Returns a list of favorite projects, workbooks, views, and data sources for a user.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'userId',
      type: 'Path',
      schema: z.string(),
    },
  ],
  response: z.object({
    favorites: favoritesSchema,
  }),
});

const favoritesApi = makeApi([getFavoritesForUserEndpoint]);

export const favoritesApis = [...favoritesApi] as const satisfies ZodiosEndpointDefinitions;
