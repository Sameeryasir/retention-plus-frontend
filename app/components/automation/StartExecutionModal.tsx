"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { automationEase } from "@/app/components/automation/automation-ui";
import { AutomationApiError } from "@/app/services/automation/automation-fetch";
import { startExecution } from "@/app/services/automation/execution-api";

const HARDCODED_CUSTOMER_ID = 34;

export function StartExecutionModal({
  open,
  onClose,
  automationId,
  automationActive,
  onStarted,
}: {
  open: boolean;
  onClose: () => void;
  automationId: number;
  automationActive?: boolean;
  onStarted: (executionId: number) => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubmitting(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-zinc-950/40 backdrop-blur-sm"
            aria-label="Close dialog"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="start-execution-title"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: automationEase }}
          >
            <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
              <div>
                <h2
                  id="start-execution-title"
                  className="text-lg font-bold text-zinc-900"
                >
                  Run for customer
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Start this automation for one customer.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <form
              className="space-y-4 px-6 py-5"
              onSubmit={async (e) => {
                e.preventDefault();
                if (automationActive === false) {
                  toast.error("Automation must be active before starting a run.");
                  return;
                }
                setSubmitting(true);
                try {
                  const run = await startExecution({
                    automationId,
                    customerId: HARDCODED_CUSTOMER_ID,
                  });
                  toast.success("Workflow started for customer.");
                  onStarted(run.id);
                  onClose();
                } catch (err) {
                  if (err instanceof AutomationApiError) {
                    if (err.status === 403) {
                      toast.error("Admin permission required.");
                    } else if (err.status === 409) {
                      toast.error("Customer already in this workflow.");
                    } else {
                      toast.error(err.message);
                    }
                  } else {
                    toast.error(
                      err instanceof Error ? err.message : "Could not start run.",
                    );
                  }
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <p className="rounded-xl border border-zinc-200/90 bg-zinc-50 px-3 py-3 text-sm text-zinc-700">
                Customer ID:{" "}
                <span className="font-bold text-zinc-900">
                  {HARDCODED_CUSTOMER_ID}
                </span>
              </p>
              {automationActive === false ? (
                <p className="text-xs text-amber-800">
                  This automation is not active. Activate it before starting runs.
                </p>
              ) : null}
              <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || automationActive === false}
                  className="cursor-pointer rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  {submitting ? "Starting…" : "Start run"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
