import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Ok } from 'ts-results-es';
import { z } from 'zod';

import { BoundedContext, getConfig } from '../../config.js';
import { useRestApi } from '../../restApiInstance.js';
import { Server } from '../../server.js';
import { getTableauAuthInfo } from '../../server/oauth/getTableauAuthInfo.js';
import { ConstrainedResult, Tool } from '../tool.js';

const paramsSchema = {};

type FavoriteDatasource = {
  id: string;
  name: string;
  contentUrl?: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  project?: {
    id: string;
    name: string;
  };
  owner?: {
    id: string;
  };
};

export const getListFavoriteDatasourcesTool = (
  server: Server,
): Tool<typeof paramsSchema> => {
  const listFavoriteDatasourcesTool = new Tool({
    server,
    name: 'list-favorite-datasources',
    description: `
      Retrieves a list of datasources marked as favorites by the authenticated user.
      Use this tool when a user wants to see their favorite datasources.

      This tool returns the datasources that the current user has explicitly added to their favorites list.

      **Example Usage:**
      - List my favorite datasources
      - Show me my favorite data sources
      - What datasources have I favorited?
      - Tell me the most recently updated favorite datasource.
    `,
    paramsSchema,
    annotations: {
      title: 'List Favorite Datasources',
      readOnlyHint: true,
      openWorldHint: false,
    },
    callback: async (params, { requestId, authInfo }): Promise<CallToolResult> => {
      const config = getConfig();

      return await listFavoriteDatasourcesTool.logAndExecute({
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

          const datasources = favorites.datasource ?? [];
          return new Ok(datasources);
        },
        constrainSuccessResult: (datasources) =>
          constrainFavoriteDatasources({ datasources, boundedContext: config.boundedContext }),
      });
    },
  });

  return listFavoriteDatasourcesTool;
};

export function constrainFavoriteDatasources({
  datasources,
  boundedContext,
}: {
  datasources: Array<FavoriteDatasource>;
  boundedContext: BoundedContext;
}): ConstrainedResult<Array<FavoriteDatasource>> {
  if (datasources.length === 0) {
    return {
      type: 'empty',
      message: 'No favorite datasources found for the current user.',
    };
  }

  const { projectIds, datasourceIds } = boundedContext;
  if (projectIds) {
    datasources = datasources.filter(
      (datasource) => datasource.project && projectIds.has(datasource.project.id),
    );
  }

  if (datasourceIds) {
    datasources = datasources.filter((datasource) => datasourceIds.has(datasource.id));
  }

  if (datasources.length === 0) {
    return {
      type: 'empty',
      message: [
        'The set of allowed datasources that can be accessed is limited by the server configuration.',
        'While favorite datasources were found, they were all filtered out by the server configuration.',
      ].join(' '),
    };
  }

  return {
    type: 'success',
    result: datasources,
  };
}