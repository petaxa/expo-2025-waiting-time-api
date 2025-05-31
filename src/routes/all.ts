import { z } from "zod";
import { error500, error502 } from "../responseUtils/httpErrors";
import type { ZodResponseBody } from "../types";
import { useWaitingSheet } from "../utils/useSpreadsheet";

export const all = (): ZodResponseBody => {
  const sheet = useWaitingSheet();
  if (!sheet) {
    return error500("Data Source is Not Found.");
  }

  const SheetData = z.array(
    z.tuple([
      z.string(),
      z.string(),
      z.string(),
      z.union([z.date(), z.literal("")]),
    ]),
  );

  const { success, data: rowData } = SheetData.safeParse(
    sheet.getRange("B3:E104").getValues(),
  );
  if (!success) {
    return error502("Invalid Data Source Format.");
  }

  const data: ZodResponseBody["data"] = rowData.map((d) => ({
    pavilionName: d[0],
    waitTime: d[1],
    elapsedTime: d[2],
    postedAt: String(d[3]),
  }));
  return {
    status: 200,
    data,
  };
};
