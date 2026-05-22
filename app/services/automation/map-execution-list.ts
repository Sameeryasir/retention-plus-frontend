import type {
  AutomationExecution,
  AutomationExecutionStatus,
  ExecutionListItem,
  PaginatedExecutionsApiResponse,
  PaginatedExecutionsResponse,
} from "@/app/services/automation/types";

function toIsoDate(value: string | Date): string {
  if (typeof value === "string") return value;
  return value instanceof Date ? value.toISOString() : String(value);
}

function isExecutionListItem(row: unknown): row is ExecutionListItem {
  if (!row || typeof row !== "object") return false;
  const r = row as Record<string, unknown>;
  return (
    typeof r.id === "number" &&
    typeof r.status === "string" &&
    (typeof r.startedAt === "string" || r.startedAt instanceof Date) &&
    typeof r.customerCount === "number"
  );
}

export function mapExecutionListItemToExecution(
  item: ExecutionListItem,
  automationId = 0,
): AutomationExecution {
  const id = item.id ?? item.runId;
  const count = Math.max(0, item.customerCount ?? 0);
  const startedAt = toIsoDate(item.startedAt);
  const status = item.status as AutomationExecutionStatus;
  const completed = status === "completed";

  const stepType = item.stepType?.trim() || undefined;

  return {
    id,
    automationId,
    customerId: 0,
    currentNodeId: 0,
    status,
    scheduledAt: null,
    totalRecipients: count,
    emailsSentCount: completed ? count : 0,
    queueJobId: null,
    lastError: null,
    createdAt: startedAt,
    updatedAt: startedAt,
    ...(stepType
      ? {
          currentNode: {
            id: 0,
            type: stepType,
            config: {},
            order: 0,
          },
        }
      : {}),
  };
}

function mapExecutionRow(
  row: ExecutionListItem | AutomationExecution,
  automationId?: number,
): AutomationExecution {
  if (isExecutionListItem(row)) {
    return mapExecutionListItemToExecution(row, automationId ?? 0);
  }
  const full = row as AutomationExecution;
  return {
    ...full,
    id: full.id,
    createdAt: full.createdAt ?? full.updatedAt,
    updatedAt: full.updatedAt ?? full.createdAt,
  };
}

export function normalizeExecutionsListResponse(
  raw: PaginatedExecutionsApiResponse,
  automationId?: number,
): PaginatedExecutionsResponse {
  return {
    data: (raw.data ?? []).map((row) => mapExecutionRow(row, automationId)),
    meta: raw.meta,
  };
}
