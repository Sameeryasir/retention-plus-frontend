"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ActivateFlowPromptDialog } from "@/app/components/automation/ActivateFlowPromptDialog";
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
  updateAutomation,
} from "@/app/services/automation/automation-api";
import { BuilderShell } from "@/app/components/builder/BuilderShell";
import { toastApiError } from "@/app/lib/toast-api-error";
import { reorderList } from "@/app/components/automation/builder/automation-dnd";
import {
  createAutomationConnection,
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
import { useFlowNavigationGuard } from "@/app/hooks/use-flow-navigation-guard";
import { isPositiveInt } from "@/app/lib/numbers";

type BuilderTab = "builder" | "runs";

type PendingFlowNavigation =
  | { kind: "href"; href: string }
  | { kind: "tab"; tab: BuilderTab };

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
  const addingBlockRef = useRef(false);
  const [activating, setActivating] = useState(false);
  const [automationPublished, setAutomationPublished] = useState(false);
  const [isFlowDirty, setIsFlowDirty] = useState(false);
  const [navPromptOpen, setNavPromptOpen] = useState(false);
  const [pendingNav, setPendingNav] = useState<PendingFlowNavigation | null>(
    null,
  );

  const loadAutomation = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!isPositiveInt(automationNumericId)) {
        setAutomation(null);
        setNodes([]);
        setConnections([]);
        setSelectedId(null);
        setAutomationPublished(false);
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
        setAutomationPublished(remote.published === true);
        const list = mapAutomationGraphToWorkflowNodes(
          remote.nodes ?? [],
          remote.connections ?? [],
        );
        setNodes(list);
        setConnections(remote.connections ?? []);
        setIsFlowDirty(false);
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
          setAutomationPublished(false);
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

  const automationActive =
    status === "active" || automation?.status === "active";

  const shouldBlockFlowNavigation =
    tab === "builder" && isFlowDirty && !automationPublished;

  const applyBuilderTab = useCallback(
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

  const setBuilderTab = useCallback(
    (next: BuilderTab) => {
      if (tab === "builder" && next !== "builder" && shouldBlockFlowNavigation) {
        setPendingNav({ kind: "tab", tab: next });
        setNavPromptOpen(true);
        return;
      }
      applyBuilderTab(next);
    },
    [applyBuilderTab, shouldBlockFlowNavigation, tab],
  );

  const completePendingNavigation = useCallback(() => {
    if (pendingNav == null) return;

    if (pendingNav.kind === "href") {
      router.push(pendingNav.href);
    } else {
      applyBuilderTab(pendingNav.tab);
    }

    setPendingNav(null);
    setNavPromptOpen(false);
  }, [applyBuilderTab, pendingNav, router]);

  useFlowNavigationGuard(
    shouldBlockFlowNavigation,
    useCallback((href: string) => {
      setPendingNav({ kind: "href", href });
      setNavPromptOpen(true);
    }, []),
  );

  useEffect(() => {
    if (automationPublished && navPromptOpen) {
      setNavPromptOpen(false);
      setPendingNav(null);
    }
  }, [automationPublished, navPromptOpen]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedId) ?? null,
    [nodes, selectedId],
  );

  useEffect(() => {
    if (
      !selectedNode ||
      !isTriggerBlockKind(selectedNode.kind) ||
      selectedNode.kind === "cron_trigger"
    ) {
      return;
    }
    const defaultConfig = defaultConfigForBlockKind(selectedNode.kind);
    const expectedTrigger = defaultConfig.trigger;
    if (selectedNode.config?.trigger === expectedTrigger) {
      return;
    }

    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNode.id ? { ...n, config: defaultConfig } : n,
      ),
    );
  }, [
    selectedNode?.id,
    selectedNode?.kind,
    selectedNode?.config?.trigger,
  ]);

  const syncDirtyNodesToServer = useCallback(async () => {
    for (let order = 0; order < nodes.length; order++) {
      const node = nodes[order];
      if (node.numericId == null) continue;
      await updateAutomationNode(node.numericId, {
        order,
        config: node.config,
      });
    }
  }, [nodes]);

  const handleActivate = useCallback(async (): Promise<boolean> => {
    if (!isPositiveInt(automationNumericId)) {
      toast.error("Open a saved automation before activating.");
      return false;
    }

    setActivating(true);
    try {
      if (isFlowDirty) {
        await syncDirtyNodesToServer();
      }

      const updated = await updateAutomation(automationNumericId, {
        isActive: true,
        published: true,
      });
      setAutomation(mapAutomationToListItem(updated));
      setStatus("active");
      setAutomationPublished(updated.published === true);
      setIsFlowDirty(false);
      toast.success("Automation activated.");
      return true;
    } catch (err) {
      toastApiError(err, "Could not activate automation.");
      return false;
    } finally {
      setActivating(false);
    }
  }, [
    automationNumericId,
    isFlowDirty,
    syncDirtyNodesToServer,
  ]);

  const handleDialogActivate = useCallback(async () => {
    const ok = await handleActivate();
    if (ok) {
      completePendingNavigation();
    }
  }, [completePendingNavigation, handleActivate]);

  const closeNavPrompt = useCallback(() => {
    setPendingNav(null);
    setNavPromptOpen(false);
  }, []);

  const onAddBlock = useCallback(
    async (blockId: WorkflowNodeKind) => {
      const block = AUTOMATION_BLOCKS.find((b) => b.id === blockId);
      if (!block) return;

      if (!isPositiveInt(automationNumericId)) {
        toast.error("Open a saved automation before adding nodes.");
        return;
      }

      if (addingBlockRef.current) return;

      const defaultConfig = defaultConfigForBlockKind(blockId);
      const order = nodes.length;
      const previousNode = nodes[nodes.length - 1];
      const tempId = `local-${blockId}-${Date.now()}`;
      const optimisticNode: WorkflowNode = {
        id: tempId,
        automationId: automationNumericId,
        kind: blockId,
        label: block.label,
        config: defaultConfig,
      };

      addingBlockRef.current = true;
      setNodes((prev) => [...prev, optimisticNode]);
      setSelectedId(tempId);
      setIsFlowDirty(true);

      try {
        const created = await createAutomationNode({
          automationId: automationNumericId,
          type: blockKindToNodeType(blockId),
          order,
          config: defaultConfig,
          positionX: 100,
          positionY: 200 + order * 120,
        });

        const workflowNode: WorkflowNode = {
          ...mapApiNodeToWorkflowNode(created),
          kind: blockId,
          label: block.label,
          config: defaultConfig,
        };

        let newConnection: AutomationConnection | null = null;
        if (
          previousNode?.numericId != null &&
          workflowNode.numericId != null
        ) {
          newConnection = await createAutomationConnection({
            automationId: automationNumericId,
            sourceNodeId: previousNode.numericId,
            targetNodeId: workflowNode.numericId,
          });
        }

        setNodes((prev) =>
          prev.map((node) => (node.id === tempId ? workflowNode : node)),
        );
        if (newConnection) {
          setConnections((prev) => [...prev, newConnection]);
        }
        setSelectedId(workflowNode.id);
        toast.success("Step added.");
      } catch (err) {
        setNodes((prev) => prev.filter((node) => node.id !== tempId));
        setSelectedId((current) => (current === tempId ? null : current));
        toastApiError(err, "Could not add step.");
      } finally {
        addingBlockRef.current = false;
      }
    },
    [automationNumericId, nodes],
  );

  const onUpdateNode = useCallback(
    async (config: Record<string, unknown>) => {
      if (!selectedNode) return;

      const nodeId = selectedNode.id;
      const numericId = selectedNode.numericId;
      setSavingNode(true);

      try {
        if (numericId != null) {
          const order = nodes.findIndex((n) => n.id === nodeId);
          await updateAutomationNode(numericId, {
            order: order >= 0 ? order : 0,
            config,
          });
        }

        setNodes((prev) =>
          prev.map((n) => (n.id === nodeId ? { ...n, config } : n)),
        );
        if (numericId == null) {
          setIsFlowDirty(true);
        }
        toast.success(
          numericId != null ? "Step saved." : "Step updated locally.",
        );
      } catch (err) {
        toastApiError(err, "Could not save step.");
      } finally {
        setSavingNode(false);
      }
    },
    [nodes, selectedNode],
  );

  const onDeleteNode = useCallback(async () => {
    if (!selectedNode) return;

    const nodeId = selectedNode.id;
    const numericId = selectedNode.numericId;
    setDeletingNode(true);

    try {
      if (numericId != null) {
        await deleteAutomationNode(numericId);
      }

      setNodes((prev) => prev.filter((n) => n.id !== nodeId));
      if (numericId != null) {
        setConnections((prev) =>
          prev.filter(
            (c) =>
              c.sourceNodeId !== numericId && c.targetNodeId !== numericId,
          ),
        );
      }
      setSelectedId(null);
      setIsFlowDirty(true);
      toast.success("Step removed.");
    } catch (err) {
      toastApiError(err, "Could not delete step.");
    } finally {
      setDeletingNode(false);
    }
  }, [selectedNode]);

  const onReorderNodes = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setNodes((prev) => reorderList(prev, fromIndex, toIndex));
    setIsFlowDirty(true);
  }, []);

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
              onClick={() => void handleActivate()}
              disabled={activating}
              className="cursor-pointer rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_3px_12px_rgba(0,0,0,0.2)] ring-1 ring-black/20 transition hover:from-zinc-700 hover:to-zinc-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm"
            >
              {activating ? "Activating…" : "Activate"}
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
            sidebar={<BlockSidebar onAddBlock={(id) => void onAddBlock(id)} />}
            canvas={
              <BuilderCanvas
                nodes={nodes}
                loading={nodesLoading}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDropBlock={(id) => void onAddBlock(id)}
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

      <ActivateFlowPromptDialog
        open={navPromptOpen && !automationPublished}
        isLoading={activating}
        onStay={closeNavPrompt}
        onActivate={() => void handleDialogActivate()}
      />
    </motion.div>
  );
}
