import type { GoogleAppsResponseType, ZodResponseBody } from "../types";

export const createResponse = (
  response: ZodResponseBody,
): GoogleAppsResponseType => {
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON,
  );
};
