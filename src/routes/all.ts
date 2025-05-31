import type { ZodResponseBody } from "../types";

export const all = (): ZodResponseBody => {
  const data: ZodResponseBody["data"] = [
    {
      pavilionName: "pav!",
      waitTime: "10min",
      elapsedTime: "60min",
      postedAt: "4:35",
    },
    {
      pavilionName: "pav!",
      waitTime: "10min",
      elapsedTime: "60min",
      postedAt: "4:35",
    },
  ];
  return {
    status: 200,
    data,
  };
};
