import { z } from 'zod';

/**
 * Custom View schema for Tableau REST API
 *
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#get_custom_view
 */
export const customViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  lastAccessedAt: z.string().optional(),
  shared: z.boolean().optional(),
  view: z
    .object({
      id: z.string(),
      name: z.string().optional(),
    })
    .optional(),
  workbook: z
    .object({
      id: z.string(),
      name: z.string().optional(),
    })
    .optional(),
  owner: z
    .object({
      id: z.string(),
    })
    .optional(),
});

export type CustomView = z.infer<typeof customViewSchema>;
