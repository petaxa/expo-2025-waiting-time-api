import { error500 } from "../responseUtils/httpErrors";
import type { ZodResponseBody } from "../types";
import { tableJoin } from "../utils/tableUtils";
import { usePavilionTable } from "../utils/useTable/usePavilionTable";
import { useWaitingTable } from "../utils/useTable/useWaitingTable";
import { parseWaitTime } from "../utils/useTable/useWaitingTable";

export const all = (): ZodResponseBody => {
  const waitingTable = useWaitingTable();
  const pavilionTable = usePavilionTable();
  if (!waitingTable.success || !pavilionTable.success) {
    return error500("DB Issue.");
  }

  const joinedTable = tableJoin(
    waitingTable.data,
    pavilionTable.data,
    "pavilionName",
  );

  const now = Date.now();
  const data = dedupByOsmId(joinedTable, (current: Row, picked: Row) =>
    isBetter(current, picked, now),
  ).map((row) => ({
    osmId: row.osmId,
    waitTime: row.waitTime,
    elapsedTime: row.elapsedTime,
    postedAt: row.postedAt,
  }));

  return {
    status: 200,
    data,
  };
};

type Row = {
  osmId: string;
  waitTime: string;
  postedAt: string;
};

function isBetter(a: Row, b: Row, now: number): boolean {
  // 投稿時間が最近のものを優先
  const diffA = Math.abs(Date.parse(a.postedAt) - now);
  const diffB = Math.abs(Date.parse(b.postedAt) - now);
  if (diffA !== diffB) return diffA < diffB;

  // 待ち時間が大きいほうを優先
  const waitA = parseWaitTime(a.waitTime) ?? 0;
  const waitB = parseWaitTime(b.waitTime) ?? 0;
  if (waitA !== waitB) return waitA > waitB;

  // ここまで同値なら、第一引数を尊重
  return false;
}

function dedupByOsmId<T extends Row>(
  list: T[],
  comp: (current: Row, picked: Row) => boolean,
): T[] {
  const best = new Map<string, T>();

  for (const row of list) {
    const current = best.get(row.osmId);
    if (!current || comp(current, row)) {
      best.set(row.osmId, row);
    }
  }

  return [...best.values()];
}
