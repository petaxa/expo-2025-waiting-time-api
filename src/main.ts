import { z } from "zod";
import { error400 } from "./responseUtils/httpErrors";
import { all } from "./routes/all";
import { ping } from "./routes/ping";
import type { GoogleAppsResponseType } from "./types";
import { createResponse } from "./utils/createResponse";

const Parameters = z.object({
  route: z.union([z.literal("ping"), z.literal("all")]),
});

function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsResponseType {
  const param = Parameters.safeParse(e.parameter);
  if (!param.success) {
    return createResponse(error400("Invalid Query Parameters."));
  }

  switch (param.data.route) {
    case "ping":
      return createResponse(ping());
    case "all":
      return createResponse(all());
  }
}
