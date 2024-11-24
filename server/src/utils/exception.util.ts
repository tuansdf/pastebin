import { ErrorResponse } from "@/types/common.type.js";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

const DEFAULT_MESSAGE = "Something Went Wrong";

class ExceptionUtils {
  public getResponse = (err: Error): [number, ErrorResponse] => {
    let errorMessage = DEFAULT_MESSAGE;
    let status = 500;
    if (err instanceof HTTPException) {
      status = err.status || 500;
      errorMessage = err.message || DEFAULT_MESSAGE;
    }
    if (err instanceof ZodError) {
      status = 400;
      errorMessage = err.errors[0]?.message || DEFAULT_MESSAGE;
    }
    return [status, { message: errorMessage, status }];
  };

  public getMessage = (err: Error): string => {
    return this.getResponse(err)[1].message!;
  };
}

export const exceptionUtils = new ExceptionUtils();
