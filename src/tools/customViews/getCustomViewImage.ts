import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Err, Ok } from 'ts-results-es';
import { z } from 'zod';

import { getConfig } from '../../config.js';
import { useRestApi } from '../../restApiInstance.js';
import { Server } from '../../server.js';
import { getTableauAuthInfo } from '../../server/oauth/getTableauAuthInfo.js';
import { convertPngDataToToolResult } from '../convertPngDataToToolResult.js';
import { Tool } from '../tool.js';

const paramsSchema = {
  customViewId: z.string(),
  maxAge: z.number().gt(0).optional(),
};

export type GetCustomViewImageError =
  | {
      type: 'custom-view-not-found';
      message: string;
    }
  | {
      type: 'image-fetch-failed';
      message: string;
    };

export const getGetCustomViewImageTool = (server: Server): Tool<typeof paramsSchema> => {
  const getCustomViewImageTool = new Tool({
    server,
    name: 'get-custom-view-image',
    description: `
  Retrieves an image (PNG format) of the specified custom view. The image is rendered at high resolution.

  **Example Usage:**
  - "Show me an image of my custom view"
  - "Get a screenshot of this custom view"
  - "Display this custom view as an image"`,
    paramsSchema,
    annotations: {
      title: 'Get Custom View Image',
      readOnlyHint: true,
      openWorldHint: false,
    },
    callback: async (
      { customViewId, maxAge },
      { requestId, authInfo },
    ): Promise<CallToolResult> => {
      const config = getConfig();

      return await getCustomViewImageTool.logAndExecute<string, GetCustomViewImageError>({
        requestId,
        authInfo,
        args: { customViewId },
        callback: async () => {
          return await useRestApi({
            config,
            requestId,
            server,
            jwtScopes: ['tableau:views:download'],
            authInfo: getTableauAuthInfo(authInfo),
            callback: async (restApi) => {
              try {
                // First verify ownership
                await restApi.customViewsMethods.getOwnCustomView({
                  customViewId,
                  siteId: restApi.siteId,
                });
              } catch (error) {
                return new Err({
                  type: 'custom-view-not-found',
                  message: 'Custom view not found.',
                });
              }

              try {
                // Now get the image
                const imageData = await restApi.customViewsMethods.getCustomViewImage({
                  customViewId,
                  siteId: restApi.siteId,
                  resolution: 'high',
                  maxAge,
                });
                return new Ok(imageData);
              } catch (error) {
                return new Err({
                  type: 'image-fetch-failed',
                  message: 'Failed to fetch custom view image.',
                });
              }
            },
          });
        },
        constrainSuccessResult: (imageData) => {
          return {
            type: 'success',
            result: imageData,
          };
        },
        getErrorText: (error) => {
          switch (error.type) {
            case 'custom-view-not-found':
              return error.message;
            case 'image-fetch-failed':
              return error.message;
          }
        },
        getSuccessResult: (imageData: string) => {
          return convertPngDataToToolResult(imageData);
        },
      });
    },
  });

  return getCustomViewImageTool;
};
