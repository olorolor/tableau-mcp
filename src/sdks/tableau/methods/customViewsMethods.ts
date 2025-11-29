import { Zodios } from '@zodios/core';

import { customViewsApis } from '../apis/customViewsApi.js';
import { Credentials } from '../types/credentials.js';
import { CustomView } from '../types/customView.js';
import { Pagination } from '../types/pagination.js';
import AuthenticatedMethods from './authenticatedMethods.js';

/**
 * Custom Views methods of the Tableau Server REST API
 *
 * @export
 * @class CustomViewsMethods
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm
 */
export default class CustomViewsMethods extends AuthenticatedMethods<typeof customViewsApis> {
  constructor(baseUrl: string, creds: Credentials) {
    super(new Zodios(baseUrl, customViewsApis), creds);
  }

  /**
   * Returns a list of custom views for the authenticated user.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param {string} siteId - The Tableau site ID
   * @param {string} sort - (Optional) Sort expression
   * @param {number} pageSize - (Optional) The number of items to return in one response
   * @param {number} pageNumber - (Optional) The offset for paging
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#list_custom_views
   */
  listCustomViews = async ({
    siteId,
    sort,
    pageSize,
    pageNumber,
  }: {
    siteId: string;
    sort?: string;
    pageSize?: number;
    pageNumber?: number;
  }): Promise<{ pagination: Pagination; customViews: CustomView[] }> => {
    // Always filter by the authenticated user's ID
    const ownerIdFilter = `ownerId:eq:${this.userId}`;

    const response = await this._apiClient.listCustomViews({
      params: { siteId },
      queries: { filter: ownerIdFilter, sort, pageSize, pageNumber },
      ...this.authHeader,
    });
    return {
      pagination: response.pagination,
      customViews: response.customViews.customView ?? [],
    };
  };

  /**
   * Gets the details of a specific custom view.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param {string} customViewId - The ID of the custom view to get
   * @param {string} siteId - The Tableau site ID
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#get_custom_view
   */
  getCustomView = async ({
    customViewId,
    siteId,
  }: {
    customViewId: string;
    siteId: string;
  }): Promise<CustomView> => {
    return (
      await this._apiClient.getCustomView({ params: { siteId, customViewId }, ...this.authHeader })
    ).customView;
  };

  /**
   * Gets the details of a specific custom view owned by the current user.
   * Throws an error if the custom view is not owned by the authenticated user.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param {string} customViewId - The ID of the custom view to get
   * @param {string} siteId - The Tableau site ID
   * @throws {Error} If the custom view is not owned by the authenticated user
   */
  getOwnCustomView = async ({
    customViewId,
    siteId,
  }: {
    customViewId: string;
    siteId: string;
  }): Promise<CustomView> => {
    const customView = await this.getCustomView({ customViewId, siteId });

    if (customView.owner?.id !== this.userId) {
      throw new Error('Custom view not found.');
    }

    return customView;
  };

  /**
   * Returns a specified custom view rendered as data in comma separated value (CSV) format.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param {string} customViewId - The ID of the custom view
   * @param {string} siteId - The Tableau site ID
   * @param {number} maxAge - (Optional) Maximum cache age in minutes
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#get_custom_view_data
   */
  getCustomViewData = async ({
    customViewId,
    siteId,
    maxAge,
  }: {
    customViewId: string;
    siteId: string;
    maxAge?: number;
  }): Promise<string> => {
    return await this._apiClient.getCustomViewData({
      params: { siteId, customViewId },
      queries: { maxAge },
      ...this.authHeader,
    });
  };

  /**
   * Returns an image of the specified custom view.
   *
   * Required scopes: `tableau:views:download`
   *
   * @param {string} customViewId - The ID of the custom view
   * @param {string} siteId - The Tableau site ID
   * @param {string} resolution - (Optional) The resolution of the image (use 'high' for maximum pixel density)
   * @param {number} maxAge - (Optional) Maximum cache age in minutes
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#get_custom_view_image
   */
  getCustomViewImage = async ({
    customViewId,
    siteId,
    resolution,
    maxAge,
  }: {
    customViewId: string;
    siteId: string;
    resolution?: 'high';
    maxAge?: number;
  }): Promise<string> => {
    return await this._apiClient.getCustomViewImage({
      params: { siteId, customViewId },
      queries: { resolution, maxAge },
      ...this.authHeader,
      responseType: 'arraybuffer',
    });
  };
}
