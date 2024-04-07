export interface IHttpClientRequestConfig {
  url?: string;
  data?: any;
  headers?: any;
  params?: any;
  observe?: string;
  timeout?: number;
  responseType?: string;
  method?: string;
  reportProgress?: boolean;
  withCredentials?: boolean;
}
