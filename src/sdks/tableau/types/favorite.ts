import { z } from 'zod';

/**
 * Favorite item schema for Tableau REST API
 *
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_favorites.htm
 */
export const favoriteItemSchema = z.object({
  label: z.string(),
});

export const favoriteWorkbookSchema = z.object({
  workbook: z.object({
    id: z.string(),
    name: z.string(),
    contentUrl: z.string().optional(),
    webpageUrl: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    project: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
    owner: z
      .object({
        id: z.string(),
      })
      .optional(),
  }),
});

export const favoriteViewSchema = z.object({
  view: z.object({
    id: z.string(),
    name: z.string(),
    contentUrl: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    workbook: z
      .object({
        id: z.string(),
      })
      .optional(),
    owner: z
      .object({
        id: z.string(),
      })
      .optional(),
  }),
});

export const favoriteDatasourceSchema = z.object({
  datasource: z.object({
    id: z.string(),
    name: z.string(),
    contentUrl: z.string().optional(),
    type: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    project: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
    owner: z
      .object({
        id: z.string(),
      })
      .optional(),
  }),
});

export const favoriteProjectSchema = z.object({
  project: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const favoriteCollectionSchema = z.object({
  collection: z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    owner: z
      .object({
        id: z.string(),
      })
      .optional(),
  }),
});

/**
 * Individual favorite item that can be a workbook, view, datasource, project, or collection
 */
export const favoriteItemUnionSchema = z.union([
  favoriteWorkbookSchema,
  favoriteViewSchema,
  favoriteDatasourceSchema,
  favoriteProjectSchema,
  favoriteCollectionSchema,
]);

/**
 * Combined favorites response schema - matches actual API response structure
 * The API returns a single 'favorite' array containing mixed types
 */
export const favoritesSchema = z.object({
  favorite: z.optional(z.array(favoriteItemUnionSchema)),
});

/**
 * TypeScript types exported from Zod schemas
 */
export type FavoriteItem = z.infer<typeof favoriteItemSchema>;
export type FavoriteWorkbook = z.infer<typeof favoriteWorkbookSchema>;
export type FavoriteView = z.infer<typeof favoriteViewSchema>;
export type FavoriteDatasource = z.infer<typeof favoriteDatasourceSchema>;
export type FavoriteProject = z.infer<typeof favoriteProjectSchema>;
export type FavoriteCollection = z.infer<typeof favoriteCollectionSchema>;
export type FavoriteItemUnion = z.infer<typeof favoriteItemUnionSchema>;

/**
 * Raw API response type
 */
export type FavoritesApiResponse = z.infer<typeof favoritesSchema>;

/**
 * Parsed favorites by type - used internally after parsing the API response
 */
export type Favorites = {
  workbook?: Array<FavoriteWorkbook['workbook']>;
  view?: Array<FavoriteView['view']>;
  datasource?: Array<FavoriteDatasource['datasource']>;
  project?: Array<FavoriteProject['project']>;
  collection?: Array<FavoriteCollection['collection']>;
};
