import z from "zod";
import type { TableSchemaRegestory } from ".";
import { useWaitingSheet } from "../useSpreadsheet";
import { type TableResult, useTableData } from "./utils";

export const useWaitingTable = (): TableResult<
  z.infer<typeof TableSchemaRegestory.WaitingTableSchema>
> => {
  const SheetSchema = z.array(
    z.tuple([
      z.string(),
      z.string(),
      z.string(),
      z.union([z.date(), z.literal("")]),
    ]),
  );

  type SheetType = z.infer<typeof SheetSchema>;
  return useTableData<
    SheetType,
    z.infer<typeof TableSchemaRegestory.WaitingTableSchema>
  >(useWaitingSheet, "B3:E104", SheetSchema, (rowData) =>
    rowData.map((d) => ({
      pavilionName: d[0].replace(/\r?\n/g, ""),
      waitTime: d[1],
      elapsedTime: d[2],
      postedAt: String(d[3]),
    })),
  );
};

/**
 * waitTime の文字列を分の数値に変換する
 * @param waitingTime
 */
export const parseWaitTime = (waitTime: string): number | null => {
  const m = waitTime.match(/^(\d+時間)?\s*(\d+分)?$/);
  if (!m) return null;

  const hours = m[1] ? Number(m[1].replace("時間", "")) : 0;
  const minutes = m[2] ? Number(m[2].replace("分", "")) : 0;
  return hours * 60 + minutes;
};
