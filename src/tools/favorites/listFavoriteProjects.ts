import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Ok } from 'ts-results-es';
import { z } from 'zod';

import { BoundedContext, getConfig } from '../../config.js';
import { useRestApi } from '../../restApiInstance.js';
import { Server } from '../../server.js';
import { getTableauAuthInfo } from '../../server/oauth/getTableauAuthInfo.js';
import { ConstrainedResult, Tool } from '../tool.js';

const paramsSchema = {};

type FavoriteProject = {
  id: string;
  name: string;
};

export const getListFavoriteProjectsTool = (server: Server): Tool<typeof paramsSchema> => {
  const listFavoriteProjectsTool = new Tool({
    server,
    name: 'list-favorite-projects',
    description: `
      Retrieves a list of projects marked as favorites by the authenticated user.
      Use this tool when a user wants to see their favorite projects.

      This tool returns the projects that the current user has explicitly added to their favorites list.

      **Example Usage:**
      - List my favorite projects
      - Show me my favorite projects
      - What projects have I favorited?
    `,
    paramsSchema,
    annotations: {
      title: 'List Favorite Projects',
      readOnlyHint: true,
      openWorldHint: false,
    },
    callback: async (params, { requestId, authInfo }): Promise<CallToolResult> => {
      const config = getConfig();

      return await listFavoriteProjectsTool.logAndExecute({
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

          const projects = favorites.project ?? [];
          return new Ok(projects);
        },
        constrainSuccessResult: (projects) =>
          constrainFavoriteProjects({ projects, boundedContext: config.boundedContext }),
      });
    },
  });

  return listFavoriteProjectsTool;
};

export function constrainFavoriteProjects({
  projects,
  boundedContext,
}: {
  projects: Array<FavoriteProject>;
  boundedContext: BoundedContext;
}): ConstrainedResult<Array<FavoriteProject>> {
  if (projects.length === 0) {
    return {
      type: 'empty',
      message: 'No favorite projects found for the current user.',
    };
  }

  const { projectIds } = boundedContext;
  if (projectIds) {
    projects = projects.filter((project) => projectIds.has(project.id));
  }

  if (projects.length === 0) {
    return {
      type: 'empty',
      message: [
        'The set of allowed projects that can be accessed is limited by the server configuration.',
        'While favorite projects were found, they were all filtered out by the server configuration.',
      ].join(' '),
    };
  }

  return {
    type: 'success',
    result: projects,
  };
}
