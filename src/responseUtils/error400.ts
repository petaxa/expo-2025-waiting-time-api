import type { ZodResponseBody } from "../types";

export const error400 = (message: string): ZodResponseBody => {
  return {
    status: 400,
    data: message,
  };
};
