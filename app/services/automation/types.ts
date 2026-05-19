export interface Automation {
  id: number;
  name: string;
  description?: string | null;
  trigger: string;
  isActive: boolean;
  published: boolean;
  restaurantId?: number;
  campaignId?: number;
  funnelId?: number;
  nodes?: AutomationNode[];
  connections?: AutomationConnection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAutomationBody {
  name: string;
  description?: string;
  trigger: string;
  restaurantId: number;
  campaignId: number;
  funnelId: number;
}

export interface AutomationNode {
  id: number;
  automationId: number;
  type: string;
  order: number;
  config: Record<string, unknown>;
  positionX?: number;
  positionY?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAutomationNodeBody {
  automationId: number;
  type: string;
  order: number;
  config?: Record<string, unknown>;
  positionX?: number;
  positionY?: number;
}

export interface AutomationConnection {
  id: number;
  automationId: number;
  sourceNodeId: number;
  targetNodeId: number;
}

export interface CreateAutomationConnectionBody {
  automationId: number;
  sourceNodeId: number;
  targetNodeId: number;
}

export interface FunnelAutomationGraph {
  funnelId: number;
  automationIds: number[];
  nodes: AutomationNode[];
  connections: AutomationConnection[];
}

export type AutomationExecutionStatus =
  | "running"
  | "waiting"
  | "completed"
  | "failed";

export interface AutomationExecution {
  id: number;
  automationId: number;
  customerId: number;
  currentNodeId: number;
  status: AutomationExecutionStatus;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  automation?: {
    id: number;
    name: string;
    trigger: string;
    isActive: boolean;
    published: boolean;
  };
  currentNode?: {
    id: number;
    type: string;
    config: Record<string, unknown>;
    order: number;
  };
  customer?: {
    id: number;
    email?: string;
    name?: string;
  };
}

export interface AutomationLog {
  id: number;
  executionId: number;
  nodeId: number;
  customerId: number;
  message: string;
  error: string | null;
  createdAt: string;
  node?: {
    id: number;
    type: string;
    config: Record<string, unknown>;
  };
}

export interface StartAutomationExecutionBody {
  automationId: number;
  customerId: number;
  currentNodeId?: number;
}
