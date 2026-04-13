export interface MapItem {
  slug: string;
  name: string;
  icon?: string;
}

export interface InitResponse {
  app_session_token: string;
  maps: MapItem[];
}

export interface HtmlResponse {
  html_legacy: string;
}