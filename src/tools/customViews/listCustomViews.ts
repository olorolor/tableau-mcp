import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Ok } from 'ts-results-es';
import { z } from 'zod';

import { BoundedContext, getConfig } from '../../config.js';
import { useRestApi } from '../../restApiInstance.js';
import { CustomView } from '../../sdks/tableau/types/customView.js';
import { Server } from '../../server.js';
import { getTableauAuthInfo } from '../../server/oauth/getTableauAuthInfo.js';
import { paginate } from '../../utils/paginate.js';
import { ConstrainedResult, Tool } from '../tool.js';

const paramsSchema = {
  pageSize: z.number().gt(0).optional(),
  limit: z.number().gt(0).optional(),
};

export const getListCustomViewsTool = (server: Server): Tool<typeof paramsSchema> => {
  const listCustomViewsTool = new Tool({
    server,
    name: 'list-custom-views',
    description: `
  Retrieves a list of custom views created by the authenticated user. Custom views are personalized versions of views that users have saved with specific filters, parameters, or other customizations.

  Use this tool when a user wants to see their saved custom views or personalized dashboards.

  **Example Usage:**
  - "List my custom views"
  - "Show me my saved custom views"
  - "What custom views do I have?"
  - "Show me my personalized dashboards"`,
    paramsSchema,
    annotations: {
      title: 'List Custom Views',
      readOnlyHint: true,
      openWorldHint: false,
    },
    callback: async (
      { pageSize, limit },
      { requestId, authInfo },
    ): Promise<CallToolResult> => {
      const config = getConfig();

      return await listCustomViewsTool.logAndExecute({
        requestId,
        authInfo,
        args: {},
        callback: async () => {
          return new Ok(
            await useRestApi({
              config,
              requestId,
              server,
              jwtScopes: ['tableau:content:read'],
              authInfo: getTableauAuthInfo(authInfo),
              callback: async (restApi) => {
                const customViews = await paginate({
                  pageConfig: {
                    pageSize,
                    limit: config.maxResultLimit
                      ? Math.min(config.maxResultLimit, limit ?? Number.MAX_SAFE_INTEGER)
                      : limit,
                  },
                  getDataFn: async (pageConfig) => {
                    const { pagination, customViews: data } =
                      await restApi.customViewsMethods.listCustomViews({
                        siteId: restApi.siteId,
                        pageSize: pageConfig.pageSize,
                        pageNumber: pageConfig.pageNumber,
                      });
                    return { pagination, data };
                  },
                });

                return customViews;
              },
            }),
          );
        },
        constrainSuccessResult: (customViews) =>
          constrainCustomViews({ customViews, boundedContext: config.boundedContext }),
      });
    },
  });

  return listCustomViewsTool;
};

export function constrainCustomViews({
  customViews,
  boundedContext,
}: {
  customViews: Array<CustomView>;
  boundedContext: BoundedContext;
}): ConstrainedResult<Array<CustomView>> {
  if (customViews.length === 0) {
    return {
      type: 'empty',
      message: 'No custom views found for the current user.',
    };
  }

  // Note: Custom views don't have direct project associations like workbooks
  // so we don't filter by projectIds here

  return {
    type: 'success',
    result: customViews,
  };
}
