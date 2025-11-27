import { Zodios } from '@zodios/core';

import { favoritesApis } from '../apis/favoritesApi.js';
import { Credentials } from '../types/credentials.js';
import { Favorites } from '../types/favorite.js';
import AuthenticatedMethods from './authenticatedMethods.js';

/**
 * Favorites methods of the Tableau Server REST API
 *
 * @export
 * @class FavoritesMethods
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_favorites.htm
 */
export default class FavoritesMethods extends AuthenticatedMethods<typeof favoritesApis> {
  constructor(baseUrl: string, creds: Credentials) {
    super(new Zodios(baseUrl, favoritesApis), creds);
  }

  /**
   * Returns a list of favorite projects, workbooks, views, and data sources for the authenticated user.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param {string} siteId - The Tableau site ID
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_favorites.htm#get_favorites_for_user
   */
  getFavoritesForUser = async ({ siteId }: { siteId: string }): Promise<Favorites> => {
    // Always use the authenticated user's ID
    const response = await this._apiClient.getFavoritesForUser({
      params: { siteId, userId: this.userId },
      ...this.authHeader,
    });

    // Parse the favorite array and separate by type
    const favorites = response.favorites.favorite ?? [];
    const result: Favorites = {
      workbook: [],
      view: [],
      datasource: [],
      project: [],
      collection: [],
    };

    for (const item of favorites) {
      if ('workbook' in item) {
        result.workbook!.push(item.workbook);
      } else if ('view' in item) {
        result.view!.push(item.view);
      } else if ('datasource' in item) {
        result.datasource!.push(item.datasource);
      } else if ('project' in item) {
        result.project!.push(item.project);
      } else if ('collection' in item) {
        result.collection!.push(item.collection);
      }
    }

    return result;
  };
}
