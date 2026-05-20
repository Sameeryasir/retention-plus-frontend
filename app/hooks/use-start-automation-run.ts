"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { pollExecutionStatus } from "@/app/lib/poll-execution-status";
import { AutomationApiError } from "@/app/services/automation/automation-fetch";
import { startExecution } from "@/app/services/automation/execution-api";
import type { AutomationExecutionStatusDto } from "@/app/services/automation/types";

export function useStartAutomationRun(
  automationId: number,
  automationActive?: boolean,
) {
  const [starting, setStarting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [activeRun, setActiveRun] =
    useState<AutomationExecutionStatusDto | null>(null);
  const pollGenerationRef = useRef(0);

  const run = useCallback(
    async (onFinished?: (result: AutomationExecutionStatusDto) => void) => {
      if (automationActive === false) {
        toast.error("Automation must be active before starting a run.");
        return;
      }

      const generation = ++pollGenerationRef.current;
      setStarting(true);
      setActiveRun(null);

      try {
        const { status: initial } = await startExecution(automationId);
        if (generation !== pollGenerationRef.current) return;

        setActiveRun(initial);
        setStarting(false);
        setPolling(true);

        const final = await pollExecutionStatus(
          initial.executionId,
          (update) => {
            if (generation === pollGenerationRef.current) {
              setActiveRun(update);
            }
          },
        );

        if (generation !== pollGenerationRef.current) return;

        if (final.status === "completed") {
          toast.success(
            `Run completed — ${final.emailsSent} of ${final.totalRecipients} email${final.totalRecipients === 1 ? "" : "s"} sent.`,
          );
        } else if (final.status === "failed") {
          toast.error(final.lastError ?? "Run failed.");
        }

        onFinished?.(final);
      } catch (err) {
        if (generation !== pollGenerationRef.current) return;

        if (err instanceof AutomationApiError) {
          if (err.status === 403) {
            toast.error("Admin permission required.");
          } else if (err.status === 409) {
            toast.error("A run is already in progress for this automation.");
          } else {
            toast.error(err.message);
          }
        } else {
          toast.error(
            err instanceof Error ? err.message : "Could not start run.",
          );
        }
      } finally {
        if (generation === pollGenerationRef.current) {
          setStarting(false);
          setPolling(false);
          setActiveRun(null);
        }
      }
    },
    [automationId, automationActive],
  );

  const busy = starting || polling;

  return { starting, polling, busy, activeRun, run };
}
