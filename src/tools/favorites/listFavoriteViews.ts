import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Ok } from 'ts-results-es';
import { z } from 'zod';

import { BoundedContext, getConfig } from '../../config.js';
import { useRestApi } from '../../restApiInstance.js';
import { Server } from '../../server.js';
import { getTableauAuthInfo } from '../../server/oauth/getTableauAuthInfo.js';
import { ConstrainedResult, Tool } from '../tool.js';

const paramsSchema = {};

type FavoriteView = {
  id: string;
  name: string;
  contentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  workbook?: {
    id: string;
  };
  owner?: {
    id: string;
  };
};

export const getListFavoriteViewsTool = (server: Server): Tool<typeof paramsSchema> => {
  const listFavoriteViewsTool = new Tool({
    server,
    name: 'list-favorite-views',
    description: `
      Retrieves a list of views marked as favorites by the authenticated user.
      Use this tool when a user wants to see their favorite views.

      This tool returns the views that the current user has explicitly added to their favorites list.

      **Example Usage:**
      - List my favorite views
      - Show me my favorite dashboards
      - What views have I favorited?
    `,
    paramsSchema,
    annotations: {
      title: 'List Favorite Views',
      readOnlyHint: true,
      openWorldHint: false,
    },
    callback: async (params, { requestId, authInfo }): Promise<CallToolResult> => {
      const config = getConfig();

      return await listFavoriteViewsTool.logAndExecute({
        requestId,
        authInfo,
        args: params,
        callback: async () => {
          const favorites = await useRestApi({
            config,
            requestId,
            server,
            jwtScopes: ['tableau:content:read'],
            authInfo: getTableauAuthInfo(authInfo),
            callback: async (restApi) => {
              return await restApi.favoritesMethods.getFavoritesForUser({
                siteId: restApi.siteId,
              });
            },
          });

          const views = favorites.view ?? [];
          return new Ok(views);
        },
        constrainSuccessResult: (views) =>
          constrainFavoriteViews({ views, boundedContext: config.boundedContext }),
      });
    },
  });

  return listFavoriteViewsTool;
};

export function constrainFavoriteViews({
  views,
  boundedContext,
}: {
  views: Array<FavoriteView>;
  boundedContext: BoundedContext;
}): ConstrainedResult<Array<FavoriteView>> {
  if (views.length === 0) {
    return {
      type: 'empty',
      message: 'No favorite views found for the current user.',
    };
  }

  const { workbookIds } = boundedContext;
  if (workbookIds) {
    views = views.filter((view) => view.workbook && workbookIds.has(view.workbook.id));
  }

  if (views.length === 0) {
    return {
      type: 'empty',
      message: [
        'The set of allowed views that can be accessed is limited by the server configuration.',
        'While favorite views were found, they were all filtered out by the server configuration.',
      ].join(' '),
    };
  }

  return {
    type: 'success',
    result: views,
  };
}
