import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Err, Ok } from 'ts-results-es';
import { z } from 'zod';

import { getConfig } from '../../config.js';
import { useRestApi } from '../../restApiInstance.js';
import { Server } from '../../server.js';
import { getTableauAuthInfo } from '../../server/oauth/getTableauAuthInfo.js';
import { Tool } from '../tool.js';

const paramsSchema = {
  customViewId: z.string(),
};

export type GetCustomViewError = {
  type: 'custom-view-not-found';
  message: string;
};

export const getGetCustomViewTool = (server: Server): Tool<typeof paramsSchema> => {
  const getCustomViewTool = new Tool({
    server,
    name: 'get-custom-view',
    description: `
  Retrieves the details of a specific custom view created by the authenticated user including its metadata such as name, creation date, associated view and workbook information.

  **Example Usage:**
  - "Get details for custom view with ID abc123"
  - "Show me information about this custom view"`,
    paramsSchema,
    annotations: {
      title: 'Get Custom View',
      readOnlyHint: true,
      openWorldHint: false,
    },
    callback: async (
      { customViewId },
      { requestId, authInfo },
    ): Promise<CallToolResult> => {
      const config = getConfig();

      return await getCustomViewTool.logAndExecute<unknown, GetCustomViewError>({
        requestId,
        authInfo,
        args: { customViewId },
        callback: async () => {
          try {
            return new Ok(
              await useRestApi({
                config,
                requestId,
                server,
                jwtScopes: ['tableau:content:read'],
                authInfo: getTableauAuthInfo(authInfo),
                callback: async (restApi) => {
                  return await restApi.customViewsMethods.getOwnCustomView({
                    customViewId,
                    siteId: restApi.siteId,
                  });
                },
              }),
            );
          } catch (error) {
            return new Err({
              type: 'custom-view-not-found',
              message: 'Custom view not found.',
            });
          }
        },
        constrainSuccessResult: (customView) => {
          return {
            type: 'success',
            result: customView,
          };
        },
        getErrorText: (error) => {
          return error.message;
        },
      });
    },
  });

  return getCustomViewTool;
};
