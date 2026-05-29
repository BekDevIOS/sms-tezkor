export type T = {
  [key: string]: any;
};

export type HttpErrorBody = {
  success: false;
  statusCode: number;
  errorCode: string;
  message: string;
  path: string;
  timestamp: string;
};

/** Standard collection response wrapper. */
export type List<E> = {
  list: E[];
  total: number;
};
