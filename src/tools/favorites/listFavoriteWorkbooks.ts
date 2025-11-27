import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Ok } from 'ts-results-es';
import { z } from 'zod';

import { BoundedContext, getConfig } from '../../config.js';
import { useRestApi } from '../../restApiInstance.js';
import { Server } from '../../server.js';
import { getTableauAuthInfo } from '../../server/oauth/getTableauAuthInfo.js';
import { ConstrainedResult, Tool } from '../tool.js';

const paramsSchema = {};

type FavoriteWorkbook = {
  id: string;
  name: string;
  contentUrl?: string;
  webpageUrl?: string;
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

export const getListFavoriteWorkbooksTool = (
  server: Server,
): Tool<typeof paramsSchema> => {
  const listFavoriteWorkbooksTool = new Tool({
    server,
    name: 'list-favorite-workbooks',
    description: `
      Retrieves a list of workbooks marked as favorites by the authenticated user.
      Use this tool when a user wants to see their favorite workbooks.

      This tool returns the workbooks that the current user has explicitly added to their favorites list.

      **Example Usage:**
      - List my favorite workbooks
      - Show me my favorite dashboards
      - What workbooks have I favorited?
    `,
    paramsSchema,
    annotations: {
      title: 'List Favorite Workbooks',
      readOnlyHint: true,
      openWorldHint: false,
    },
    callback: async (params, { requestId, authInfo }): Promise<CallToolResult> => {
      const config = getConfig();

      return await listFavoriteWorkbooksTool.logAndExecute({
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

          const workbooks = favorites.workbook ?? [];
          return new Ok(workbooks);
        },
        constrainSuccessResult: (workbooks) =>
          constrainFavoriteWorkbooks({ workbooks, boundedContext: config.boundedContext }),
      });
    },
  });

  return listFavoriteWorkbooksTool;
};

export function constrainFavoriteWorkbooks({
  workbooks,
  boundedContext,
}: {
  workbooks: Array<FavoriteWorkbook>;
  boundedContext: BoundedContext;
}): ConstrainedResult<Array<FavoriteWorkbook>> {
  if (workbooks.length === 0) {
    return {
      type: 'empty',
      message: 'No favorite workbooks found for the current user.',
    };
  }

  const { projectIds, workbookIds } = boundedContext;
  if (projectIds) {
    workbooks = workbooks.filter(
      (workbook) => workbook.project && projectIds.has(workbook.project.id),
    );
  }

  if (workbookIds) {
    workbooks = workbooks.filter((workbook) => workbookIds.has(workbook.id));
  }

  if (workbooks.length === 0) {
    return {
      type: 'empty',
      message: [
        'The set of allowed workbooks that can be accessed is limited by the cloud configuration.',
        'While favorite workbooks were found, they were all filtered out by the cloud configuration.',
      ].join(' '),
    };
  }

  return {
    type: 'success',
    result: workbooks,
  };
}
