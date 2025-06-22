const DOC_ID = "14R9px2COU6-9UIgib2xY7ICh5sI-FDzcfC14iQXFj3U";

export const useWaitingSheet =
  (): GoogleAppsScript.Spreadsheet.Sheet | null => {
    const SHEET_NAME = "最新待ち時間";

    const doc = SpreadsheetApp.openById(DOC_ID);
    const sheet = doc.getSheetByName(SHEET_NAME);

    return sheet;
  };

export const usePavilionSheet =
  (): GoogleAppsScript.Spreadsheet.Sheet | null => {
    const SHEET_NAME = "パビリオンインフォ";

    const doc = SpreadsheetApp.openById(DOC_ID);
    const sheet = doc.getSheetByName(SHEET_NAME);

    return sheet;
  };
