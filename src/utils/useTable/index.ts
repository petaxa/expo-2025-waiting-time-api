import z from "zod";

export const TableSchemaRegestory = {
  WaitingTableSchema: z.array(
    z.object({
      pavilionName: z.string(),
      waitTime: z.string(),
      elapsedTime: z.string(),
      postedAt: z.string(),
    }),
  ),
  PavilionTableSchema: z.array(
    z.object({
      pavilionName: z.string(),
      englishName: z.string(),
      osmId: z.string(),
    }),
  ),
};
