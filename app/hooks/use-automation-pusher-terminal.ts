"use client";

import { useEffect, useRef } from "react";
import {
  isPusherConfigured,
  type ExecutionTerminalPusherPayload,
} from "@/app/lib/pusher-execution";
import { subscribeAutomationTerminal } from "@/app/lib/pusher-client";

export function useAutomationPusherTerminal(
  automationId: number,
  onTerminal: (payload: ExecutionTerminalPusherPayload) => void,
): void {
  const onTerminalRef = useRef(onTerminal);
  onTerminalRef.current = onTerminal;

  useEffect(() => {
    if (!isPusherConfigured() || automationId < 1) {
      return;
    }

    return subscribeAutomationTerminal(automationId, (payload) => {
      if (payload.automationId !== automationId) return;
      onTerminalRef.current(payload);
    });
  }, [automationId]);
}
