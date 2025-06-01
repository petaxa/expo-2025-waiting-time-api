import type z from "zod";
import type { TableSchemaRegestory } from "./useTable";

type AnyTable = z.infer<
  (typeof TableSchemaRegestory)[keyof typeof TableSchemaRegestory]
>;

type RowWithKey<K extends PropertyKey> = AnyTable[number] & Record<K, unknown>;
type TableWithPropertyKey<K extends PropertyKey> = readonly RowWithKey<K>[];

export function tableJoin<
  K extends PropertyKey,
  A extends TableWithPropertyKey<K>,
  B extends TableWithPropertyKey<K>,
>(tableOne: A, tableTwo: B, key: K): (A[number] & B[number])[] {
  const index = new Map<unknown, B[number]>(
    tableTwo.map((rowB) => [rowB[key], rowB]),
  );

  return tableOne.flatMap((rowA) => {
    const matched = index.get(rowA[key]);
    return matched ? { ...rowA, ...matched } : [];
  });
}
