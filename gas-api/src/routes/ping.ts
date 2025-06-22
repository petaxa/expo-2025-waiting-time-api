import type { ZodResponseBody } from "../types";

export const ping = (): ZodResponseBody => {
  const content = "ping!";
  return {
    status: 200,
    data: content,
  };
};
