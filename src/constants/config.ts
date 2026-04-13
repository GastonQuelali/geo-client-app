export const API_CONFIG = {
  APP_ID: 'geo-client-app',
};

export const ENDPOINTS = {
  MAP_INIT: '/api/v1/map/init',
  MAP_HTML: (slug: string) => `/api/v1/map/${slug}/html`,
};