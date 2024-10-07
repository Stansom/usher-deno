type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

type METHODS =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "PATCH";

type MethodFunctions = {
  [K in METHODS as string]: (args: IRequest) => IResponse | Promise<IResponse>;
};

interface IRoute {
  path: string;
  response?: (args: IRequest) => IResponse;
  methods?: AtLeastOne<MethodFunctions>;
  notFound?: () => IResponse;
}

interface IPath {
  method?: string;
  url: string;
}

interface IResponse {
  status: number;
  body: string;
  headers?: unknown;
  cookies?: unknown;
  contentType?: string;
  json?: unknown;
  pathParams?: Map<string, string>;
}

type IPathParams = Map<string, string | null>;

interface IRequest extends IPath {
  headers?: unknown;
  cookies?: unknown;
  queryParams?: unknown;
  body?: unknown;
  host?: unknown;
  ip?: unknown;
  protocol?: unknown;
  secure?: unknown;
  contentType?: unknown;
  pathParams?: IPathParams;
  credentials?: unknown;
  keepalive?: unknown;
  mode?: unknown;
  redirect?: unknown;
  referrer?: unknown;
  referrerPolicy?: unknown;
}

export type { IPath, IRequest, IResponse, IRoute, MethodFunctions };
