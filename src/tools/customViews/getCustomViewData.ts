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
  maxAge: z.number().gt(0).optional(),
};

export type GetCustomViewDataError = {
  type: 'custom-view-not-found';
  message: string;
};

export const getGetCustomViewDataTool = (server: Server): Tool<typeof paramsSchema> => {
  const getCustomViewDataTool = new Tool({
    server,
    name: 'get-custom-view-data',
    description: `
  Retrieves the data from a specified custom view in comma-separated value (CSV) format. The data returned is at summary level only.

  **Example Usage:**
  - "Get the data from my custom view"
  - "Export custom view data as CSV"
  - "Download the data from this custom view"`,
    paramsSchema,
    annotations: {
      title: 'Get Custom View Data',
      readOnlyHint: true,
      openWorldHint: false,
    },
    callback: async (
      { customViewId, maxAge },
      { requestId, authInfo },
    ): Promise<CallToolResult> => {
      const config = getConfig();

      return await getCustomViewDataTool.logAndExecute<string, GetCustomViewDataError>({
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
                  // First verify ownership
                  await restApi.customViewsMethods.getOwnCustomView({
                    customViewId,
                    siteId: restApi.siteId,
                  });

                  // Now get the data
                  return await restApi.customViewsMethods.getCustomViewData({
                    customViewId,
                    siteId: restApi.siteId,
                    maxAge,
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
        constrainSuccessResult: (data) => {
          return {
            type: 'success',
            result: data,
          };
        },
        getErrorText: (error) => {
          return error.message;
        },
      });
    },
  });

  return getCustomViewDataTool;
};
