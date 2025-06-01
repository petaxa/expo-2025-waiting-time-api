import z from "zod";
import type { TableSchemaRegestory } from ".";
import { usePavilionSheet } from "../useSpreadsheet";
import { type TableResult, useTableData } from "./utils";

export const usePavilionTable = (): TableResult<
  z.infer<typeof TableSchemaRegestory.PavilionTableSchema>
> => {
  const SheetSchema = z.array(z.tuple([z.string(), z.string(), z.string()]));

  type SheetType = z.infer<typeof SheetSchema>;
  return useTableData<
    SheetType,
    z.infer<typeof TableSchemaRegestory.PavilionTableSchema>
  >(usePavilionSheet, "A2:C103", SheetSchema, (rowData) =>
    rowData.map((d) => ({
      pavilionName: d[0].replace(/\r?\n/g, ""),
      englishName: d[1],
      osmId: d[2],
    })),
  );
};
