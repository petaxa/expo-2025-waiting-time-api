import z from "zod";

export type GoogleAppsResponseType = GoogleAppsScript.Content.TextOutput;

export type ZodResponseBody = z.infer<typeof ResponseBody>;
export const ResponseBody = z.object({
  status: z.number(),
  data: z.union([
    z.string(),
    z.array(
      z.object({
        pavilionName: z.string(),
        waitTime: z.string(),
        elapsedTime: z.string(),
        postedAt: z.string(),
      }),
    ),
  ]),
});
