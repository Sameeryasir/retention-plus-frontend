import { getExecutionStatus } from "@/app/services/automation/execution-api";
import type { AutomationExecutionStatusDto } from "@/app/services/automation/types";

export const EXECUTION_POLL_INTERVAL_MS = 2500;
export const EXECUTION_POLL_MAX_WAIT_MS = 15 * 60 * 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Polls GET /automation/execution/:id/status until isTerminal or timeout.
 */
export async function pollExecutionStatus(
  executionId: number,
  onUpdate: (status: AutomationExecutionStatusDto) => void,
  options?: {
    intervalMs?: number;
    maxWaitMs?: number;
  },
): Promise<AutomationExecutionStatusDto> {
  const intervalMs = options?.intervalMs ?? EXECUTION_POLL_INTERVAL_MS;
  const maxWaitMs = options?.maxWaitMs ?? EXECUTION_POLL_MAX_WAIT_MS;
  const started = Date.now();

  while (Date.now() - started < maxWaitMs) {
    const status = await getExecutionStatus(executionId);
    onUpdate(status);
    if (status.isTerminal) {
      return status;
    }
    await delay(intervalMs);
  }

  throw new Error(
    "Run is taking longer than expected. Check the Runs tab for the latest status.",
  );
}
