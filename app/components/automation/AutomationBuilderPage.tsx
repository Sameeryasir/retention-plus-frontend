"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { AutomationExecutionsPanel } from "@/app/components/automation/AutomationExecutionsPanel";
import { BlockSidebar } from "@/app/components/automation/builder/BlockSidebar";
import { BuilderCanvas } from "@/app/components/automation/builder/BuilderCanvas";
import { NodeSettingsPanel } from "@/app/components/automation/builder/NodeSettingsPanel";
import { automationEase } from "@/app/lib/motion";
import { AUTOMATION_BLOCKS } from "@/app/components/automation/mock-data";
import type {
  AutomationListItem,
  AutomationStatus,
  WorkflowNode,
  WorkflowNodeKind,
} from "@/app/components/automation/types";
import {
  getAutomationById,
  mapAutomationToListItem,
} from "@/app/services/automation/automation-api";
import { BuilderShell } from "@/app/components/builder/BuilderShell";
import { toastApiError } from "@/app/lib/toast-api-error";
import { reorderList } from "@/app/components/automation/builder/automation-dnd";
import {
  createAutomationConnection,
  deleteAutomationConnection,
} from "@/app/services/automation/connection-api";
import type { AutomationConnection } from "@/app/services/automation/types";
import {
  blockKindToNodeType,
  createAutomationNode,
  deleteAutomationNode,
  mapApiNodeToWorkflowNode,
  mapAutomationGraphToWorkflowNodes,
  defaultConfigForBlockKind,
  isTriggerBlockKind,
  updateAutomationNode,
} from "@/app/services/automation/node-api";
import { isPositiveInt } from "@/app/lib/numbers";

type BuilderTab = "builder" | "runs";

function estimateWorkflowMinutes(nodes: WorkflowNode[]): string {
  let mins = 0;
  for (const n of nodes) {
    if (n.kind === "wait" || n.kind === "delay") mins += 30;
    else if (n.kind === "send_email" || n.kind === "send_sms") mins += 2;
    else mins += 1;
  }
  if (mins < 60) return `~${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}

const TABS: { id: BuilderTab; label: string }[] = [
  { id: "builder", label: "Flow" },
  { id: "runs", label: "Runs" },
];

function BuilderTabToggle({
  tab,
  onChange,
}: {
  tab: BuilderTab;
  onChange: (next: BuilderTab) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Automation views"
      className="relative grid w-max min-w-[10.5rem] grid-cols-2 rounded-full border border-zinc-200/80 bg-zinc-100/80 p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-zinc-950/[0.05] sm:min-w-[12rem] sm:p-1 xl:min-w-[14rem]"
    >
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={`relative z-10 cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight transition-colors duration-200 sm:px-6 sm:py-2 sm:text-sm xl:px-7 xl:py-2.5 ${
              active ? "" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {active ? (
              <motion.span
                layoutId="automation-builder-tab-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-black/25"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            <motion.span
              className={`relative block ${
                active ? "text-white" : "text-zinc-500 hover:text-zinc-800"
              }`}
              animate={{ scale: active ? 1.02 : 1 }}
              transition={{ duration: 0.2, ease: automationEase }}
            >
              {t.label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}

export function AutomationBuilderPage({
  restaurantId,
  automationId,
  automationNumericId,
  funnelId,
  listHref,
}: {
  restaurantId: number;
  automationId: string;
  automationNumericId: number | null;
  funnelId?: number | null;
  listHref?: string;
}) {
  const [automation, setAutomation] = useState<AutomationListItem | null>(null);
  const [status, setStatus] = useState<AutomationStatus>("draft");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const initialTab: BuilderTab =
    tabFromUrl === "runs" || tabFromUrl === "activity" ? "runs" : "builder";
  const [tab, setTab] = useState<BuilderTab>(initialTab);
  const [, startTabTransition] = useTransition();
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<AutomationConnection[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nodesLoading, setNodesLoading] = useState(false);
  const [deletingNode, setDeletingNode] = useState(false);
  const [savingNode, setSavingNode] = useState(false);

  const loadAutomation = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!isPositiveInt(automationNumericId)) {
        setAutomation(null);
        setNodes([]);
        setConnections([]);
        setSelectedId(null);
        return;
      }
      if (!options?.silent) {
        setNodesLoading(true);
      }
      try {
        const remote = await getAutomationById(automationNumericId);
        const mapped = mapAutomationToListItem(remote);
        setAutomation(mapped);
        setStatus(mapped.status);
        const list = mapAutomationGraphToWorkflowNodes(
          remote.nodes ?? [],
          remote.connections ?? [],
        );
        setNodes(list);
        setConnections(remote.connections ?? []);
        setSelectedId((current) => {
          if (current && list.some((n) => n.id === current)) {
            return current;
          }
          return list[0]?.id ?? null;
        });
      } catch {
        if (!options?.silent) {
          setAutomation(null);
          setNodes([]);
          setConnections([]);
          setSelectedId(null);
        }
      } finally {
        if (!options?.silent) {
          setNodesLoading(false);
        }
      }
    },
    [automationNumericId],
  );

  useEffect(() => {
    void loadAutomation();
  }, [loadAutomation]);

  useEffect(() => {
    const next: BuilderTab | null =
      tabFromUrl === "runs" || tabFromUrl === "activity"
        ? "runs"
        : tabFromUrl === "builder"
          ? "builder"
          : null;
    if (next) {
      setTab(next);
    }
  }, [tabFromUrl]);

  const automationsListHref =
    listHref ?? `/restaurant/${restaurantId}/dashboard/automations`;

  const setBuilderTab = useCallback(
    (next: BuilderTab) => {
      setTab(next);
      startTabTransition(() => {
        const q = new URLSearchParams(searchParams.toString());
        q.set("tab", next);
        if (funnelId != null && funnelId >= 1) {
          q.set("funnelId", String(funnelId));
        }
        router.replace(`${pathname}?${q.toString()}`);
      });
    },
    [funnelId, pathname, router, searchParams],
  );

  const automationActive =
    status === "active" || automation?.status === "active";

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedId) ?? null,
    [nodes, selectedId],
  );

  useEffect(() => {
    if (
      !selectedNode ||
      !isTriggerBlockKind(selectedNode.kind) ||
      selectedNode.kind === "cron_trigger" ||
      selectedNode.numericId == null
    ) {
      return;
    }
    const defaultConfig = defaultConfigForBlockKind(selectedNode.kind);
    const expectedTrigger = defaultConfig.trigger;
    if (selectedNode.config?.trigger === expectedTrigger) {
      return;
    }

    let cancelled = false;
    const nodeId = selectedNode.numericId;

    (async () => {
      setSavingNode(true);
      try {
        const updated = await updateAutomationNode(nodeId, {
          config: defaultConfig,
        });
        if (cancelled) return;
        const mapped = {
          ...mapApiNodeToWorkflowNode(updated),
          config:
            updated.config && Object.keys(updated.config).length > 0
              ? updated.config
              : defaultConfig,
        };
        setNodes((prev) =>
          prev.map((n) => (n.numericId === updated.id ? mapped : n)),
        );
      } catch (err) {
        if (cancelled) return;
        toastApiError(err, "Could not save trigger settings.");
      } finally {
        if (!cancelled) setSavingNode(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    selectedNode?.id,
    selectedNode?.kind,
    selectedNode?.numericId,
    selectedNode?.config?.trigger,
  ]);

  const stats = useMemo(
    () => ({
      nodeCount: nodes.length,
      estimated: estimateWorkflowMinutes(nodes),
      customers: automation?.customersEntered ?? 0,
    }),
    [nodes, automation?.customersEntered],
  );

  const onAddBlock = useCallback(
    async (blockId: WorkflowNodeKind) => {
      const block = AUTOMATION_BLOCKS.find((b) => b.id === blockId);
      if (!block) return;

      if (!isPositiveInt(automationNumericId)) {
        toast.error("Open a saved automation before adding nodes.");
        return;
      }

      const order = nodes.length;
      const previousNode = nodes[nodes.length - 1] ?? null;
      const defaultConfig = defaultConfigForBlockKind(blockId);
      try {
        const created = await createAutomationNode({
          automationId: automationNumericId,
          type: blockKindToNodeType(blockId),
          order,
          config: defaultConfig,
          positionX: 100,
          positionY: 200 + order * 120,
        });
        const next: WorkflowNode = {
          ...mapApiNodeToWorkflowNode(created),
          kind: blockId,
          label: block.label,
          config: {
            ...defaultConfig,
            ...(created.config ?? {}),
          },
        };
        setNodes((prev) => [
          ...prev.filter((n) => n.numericId !== created.id),
          next,
        ]);
        setSelectedId(next.id);

        if (previousNode?.numericId != null) {
          try {
            await createAutomationConnection({
              automationId: automationNumericId,
              sourceNodeId: previousNode.numericId,
              targetNodeId: created.id,
            });
          } catch (connErr) {
            toastApiError(
              connErr,
              "Node saved, but could not link to the previous step.",
            );
          }
        }

        void loadAutomation({ silent: true });
      } catch (err) {
        toastApiError(err, "Could not create node.");
      }
    },
    [automationNumericId, nodes, loadAutomation],
  );

  const onUpdateNode = useCallback(
    async (config: Record<string, unknown>) => {
      if (!selectedNode?.numericId) {
        toast.error("This step is not saved yet.");
        return;
      }

      setSavingNode(true);
      try {
        const updated = await updateAutomationNode(selectedNode.numericId, {
          config,
        });
        const savedConfig =
          updated.config && Object.keys(updated.config).length > 0
            ? updated.config
            : config;
        const mapped = {
          ...mapApiNodeToWorkflowNode(updated),
          config: savedConfig,
        };
        setNodes((prev) =>
          prev.map((n) => (n.numericId === updated.id ? mapped : n)),
        );
        toast.success("Step updated.");
      } catch (err) {
        toastApiError(err, "Could not update step.");
      } finally {
        setSavingNode(false);
      }
    },
    [selectedNode],
  );

  const onDeleteNode = useCallback(async () => {
    if (!selectedNode) return;

    const nodeId = selectedNode.numericId;
    if (nodeId == null) {
      setNodes((prev) => prev.filter((n) => n.id !== selectedNode.id));
      setSelectedId(null);
      return;
    }

    setDeletingNode(true);
    try {
      await deleteAutomationNode(nodeId);
      setNodes((prev) => prev.filter((n) => n.numericId !== nodeId));
      setSelectedId(null);
      toast.success("Step removed.");
      void loadAutomation({ silent: true });
    } catch (err) {
      toastApiError(err, "Could not delete step.");
    } finally {
      setDeletingNode(false);
    }
  },     [selectedNode, loadAutomation]);

  const onReorderNodes = useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (!isPositiveInt(automationNumericId)) return;
      if (fromIndex === toIndex) return;

      const reordered = reorderList(nodes, fromIndex, toIndex);
      const unchanged = reordered.every((n, i) => n.id === nodes[i]?.id);
      if (unchanged) return;

      setNodes(reordered);

      try {
        await Promise.all(
          reordered.map((node, order) =>
            node.numericId != null
              ? updateAutomationNode(node.numericId, { order })
              : Promise.resolve(),
          ),
        );

        for (const connection of connections) {
          try {
            await deleteAutomationConnection(connection.id);
          } catch {}
        }

        const newConnections: AutomationConnection[] = [];
        for (let i = 0; i < reordered.length - 1; i++) {
          const source = reordered[i]?.numericId;
          const target = reordered[i + 1]?.numericId;
          if (source == null || target == null) continue;
          try {
            const created = await createAutomationConnection({
              automationId: automationNumericId,
              sourceNodeId: source,
              targetNodeId: target,
            });
            newConnections.push(created);
          } catch (connErr) {
            toastApiError(connErr, "Could not link steps after reorder.");
            break;
          }
        }
        setConnections(newConnections);
        toast.success("Flow order updated.");
        void loadAutomation({ silent: true });
      } catch (err) {
        toastApiError(err, "Could not reorder steps.");
        void loadAutomation({ silent: true });
      }
    },
    [automationNumericId, connections, nodes, loadAutomation],
  );

  const persistentHeader = (
    <header className="relative shrink-0 border-b border-zinc-200/70 bg-gradient-to-b from-white via-white to-zinc-50/80 px-3 py-2.5 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] sm:px-4 sm:py-3 lg:px-6 lg:py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 lg:gap-4">
        <BuilderTabToggle tab={tab} onChange={setBuilderTab} />

        {tab === "builder" ? (
          <div className="flex min-h-9 flex-wrap items-center gap-1 rounded-xl border border-zinc-200/70 bg-zinc-100/60 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-950/[0.04] sm:min-h-10 sm:gap-1.5 sm:rounded-2xl sm:p-1.5">
            <button
              type="button"
              onClick={() => setStatus("draft")}
              className="cursor-pointer rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm ring-1 ring-zinc-950/[0.04] transition hover:text-zinc-900 active:scale-[0.98] sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
            >
              Save draft
            </button>
            <button
              type="button"
              onClick={() => setStatus("published")}
              className="cursor-pointer rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm ring-1 ring-zinc-950/[0.04] transition hover:text-zinc-900 active:scale-[0.98] sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => setStatus("active")}
              className="cursor-pointer rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_3px_12px_rgba(0,0,0,0.2)] ring-1 ring-black/20 transition hover:from-zinc-700 hover:to-zinc-900 active:scale-[0.98] sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm"
            >
              Activate
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );

  return (
    <motion.div
      className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden bg-[#f0f0f2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: automationEase }}
    >
      {persistentHeader}
      <AnimatePresence mode="wait">
      {tab === "builder" ? (
        <motion.div
          key="builder"
          className="flex min-h-0 min-w-0 flex-1 flex-col"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: automationEase }}
        >
          <BuilderShell
            sidebar={<BlockSidebar onAddBlock={onAddBlock} />}
            canvas={
              <BuilderCanvas
                nodes={nodes}
                loading={nodesLoading}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDropBlock={onAddBlock}
                onReorderNodes={onReorderNodes}
              />
            }
            settingsPanel={
              <NodeSettingsPanel
                node={selectedNode}
                onSave={onUpdateNode}
                onDelete={onDeleteNode}
                saving={savingNode}
                deleting={deletingNode}
              />
            }
            overlay={
              <motion.aside
                className="pointer-events-none absolute bottom-4 left-1/2 z-30 max-w-[calc(100%-2rem)] -translate-x-1/2 sm:bottom-5 lg:max-w-none"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, ease: automationEase }}
              >
                <div className="pointer-events-auto rounded-xl border border-white/70 bg-white/90 px-3 py-2 shadow-[0_8px_28px_rgba(0,0,0,0.08)] ring-1 ring-zinc-950/[0.05] backdrop-blur-md sm:rounded-2xl sm:px-4 sm:py-3 xl:px-5 xl:py-3.5">
                  <dl className="flex divide-x divide-zinc-200/70">
                    <div className="min-w-[3.25rem] pr-3 sm:min-w-[4rem] sm:pr-4 xl:min-w-[5rem] xl:pr-5">
                      <dt className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-zinc-400 sm:text-[0.6rem] sm:tracking-[0.14em]">
                        Steps
                      </dt>
                      <dd className="mt-0.5 text-sm font-bold tabular-nums tracking-tight text-zinc-900 sm:mt-1 sm:text-base xl:text-lg">
                        {stats.nodeCount}
                      </dd>
                    </div>
                    <div className="min-w-[3.25rem] px-3 sm:min-w-[4rem] sm:px-4 xl:min-w-[5rem] xl:px-5">
                      <dt className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-zinc-400 sm:text-[0.6rem] sm:tracking-[0.14em]">
                        Est. time
                      </dt>
                      <dd className="mt-0.5 text-sm font-bold tracking-tight text-zinc-900 sm:mt-1 sm:text-base xl:text-lg">
                        {stats.estimated}
                      </dd>
                    </div>
                    <div className="min-w-[3.25rem] pl-3 sm:min-w-[4rem] sm:pl-4 xl:min-w-[5rem] xl:pl-5">
                      <dt className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-zinc-400 sm:text-[0.6rem] sm:tracking-[0.14em]">
                        In flow
                      </dt>
                      <dd className="mt-0.5 text-sm font-bold tabular-nums tracking-tight text-zinc-900 sm:mt-1 sm:text-base xl:text-lg">
                        {stats.customers}
                      </dd>
                    </div>
                  </dl>
                </div>
              </motion.aside>
            }
          />
        </motion.div>
      ) : automationNumericId == null ? (
        <motion.div
          key="not-found"
          className="flex flex-1 items-center justify-center px-4 py-12 text-center text-sm text-zinc-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: automationEase }}
        >
          <p>
            Automation not found.{" "}
            <Link
              href={automationsListHref}
              className="font-semibold text-zinc-900 underline"
            >
              Back to automations
            </Link>
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="runs"
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: automationEase }}
        >
          <AutomationExecutionsPanel
            automationId={automationNumericId}
            automationActive={automationActive}
            showRunButton
          />
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}
