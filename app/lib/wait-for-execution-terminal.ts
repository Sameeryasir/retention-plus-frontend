import { getExecutionStatus } from "@/app/services/automation/execution-api";
import type { AutomationExecutionStatusDto } from "@/app/services/automation/types";

export const EXECUTION_COMPLETION_MAX_WAIT_MS = 15 * 60 * 1000;
const STATUS_POLL_INTERVAL_MS = 2500;

function isTerminalStatus(status: AutomationExecutionStatusDto): boolean {
  return (
    status.isTerminal ||
    status.status === "completed" ||
    status.status === "failed"
  );
}

export async function waitForExecutionTerminal(
  executionId: number,
  initialStatus: AutomationExecutionStatusDto,
  onUpdate: (status: AutomationExecutionStatusDto) => void,
  options?: { maxWaitMs?: number },
): Promise<AutomationExecutionStatusDto> {
  if (isTerminalStatus(initialStatus)) {
    return initialStatus;
  }

  const maxWaitMs = options?.maxWaitMs ?? EXECUTION_COMPLETION_MAX_WAIT_MS;

  return new Promise((resolve, reject) => {
    let settled = false;

    const finish = (status: AutomationExecutionStatusDto) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      resolve(status);
    };

    const fail = (err: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      reject(err);
    };

    const poll = async () => {
      try {
        const current = await getExecutionStatus(executionId);
        onUpdate(current);
        if (isTerminalStatus(current)) {
          finish(current);
        }
      } catch (error) {
        fail(
          error instanceof Error
            ? error
            : new Error("Could not load run status."),
        );
      }
    };

    void poll();

    const intervalId = setInterval(() => {
      void poll();
    }, STATUS_POLL_INTERVAL_MS);

    const timeoutId = setTimeout(() => {
      fail(
        new Error(
          "Run is taking longer than expected. Check the Runs tab for the latest status.",
        ),
      );
    }, maxWaitMs);
  });
}
