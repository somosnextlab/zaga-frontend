export type FetchParameters = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: BodyInit | Record<string, unknown> | string;
  accessToken?: string;
  headers?: Record<string, string>;
};

export type FetchResult = {
  data?: unknown;
  error?: {
    message: string;
    status: number;
  };
  response: Response;
};
