export type CommonResponse<T> = {
  message?: string;
  status?: number;
  data?: T;
};

export type ErrorResponse = CommonResponse<undefined>;
