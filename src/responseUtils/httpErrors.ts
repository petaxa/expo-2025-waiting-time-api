import type { ZodResponseBody } from "../types";

export const error400 = (message: string): ZodResponseBody => {
  return {
    status: 400,
    data: message,
  };
};

export const error500 = (message: string): ZodResponseBody => {
  return {
    status: 500,
    data: message,
  };
};

export const error502 = (message: string): ZodResponseBody => {
  return {
    status: 502,
    data: message,
  };
};
