import { BUILDER_PAGE_URL, BUILDER_URL } from "constants/routes";
const { match } = require("path-to-regexp");

export const SAAS_BASE_PATH = `${BUILDER_URL}/saas`;
export const SAAS_EDITOR_PATH = `${SAAS_BASE_PATH}/:pluginPackageName`;
export const SAAS_EDITOR_DATASOURCE_ID_PATH = `${SAAS_EDITOR_PATH}/datasources/:datasourceId`;
export const SAAS_EDITOR_API_ID_PATH = `${SAAS_EDITOR_PATH}/api/:apiId`;

export const matchSaasPath = match(SAAS_EDITOR_API_ID_PATH);

export const SAAS_BASE_URL = (
  applicationSlug: string,
  pageSlug: string,
  pageId: string,
) => BUILDER_PAGE_URL({ applicationSlug, pageSlug, pageId, suffix: "saas" });

export const SAAS_EDITOR_URL = (
  applicationSlug: string,
  pageSlug: string,
  pageId: string,
  pluginPackageName: string,
): string => {
  return BUILDER_PAGE_URL({
    applicationSlug,
    pageSlug,
    pageId,
    suffix: `saas/${pluginPackageName}`,
  });
};

export const SAAS_EDITOR_DATASOURCE_ID_URL = (
  applicationSlug: string,
  pageSlug: string,
  pageId: string,
  pluginPackageName: string,
  datasourceId: string,
  params = {},
): string =>
  BUILDER_PAGE_URL({
    applicationSlug,
    pageSlug,
    pageId,
    suffix: `saas/${pluginPackageName}/datasources/${datasourceId}`,
    params,
  });

export const SAAS_EDITOR_API_ID_URL = (
  applicationSlug: string,
  pageSlug: string,
  pageId: string,
  pluginPackageName: string,
  apiId: string,
  params = {},
): string =>
  BUILDER_PAGE_URL({
    applicationSlug,
    pageSlug,
    pageId,
    suffix: `saas/${pluginPackageName}/api/${apiId}`,
    params,
  });

export const APPSMITH_TOKEN_STORAGE_KEY = "APPSMITH_AUTH_TOKEN";
