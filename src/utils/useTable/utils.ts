import type z from "zod";

export type TableResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      data: null;
    };

export function useTableData<T, U>(
  useSheet: () => GoogleAppsScript.Spreadsheet.Sheet | null,
  range: string,
  sheetSchema: z.ZodType<T>,
  transform: (data: T) => U,
): TableResult<U> {
  const sheet = useSheet();
  if (!sheet) {
    return {
      success: false,
      data: null,
    };
  }

  const { success, data: rowData } = sheetSchema.safeParse(
    sheet.getRange(range).getValues(),
  );
  if (!success) {
    return {
      success: false,
      data: null,
    };
  }

  const data = transform(rowData);
  return { success: true, data };
}
