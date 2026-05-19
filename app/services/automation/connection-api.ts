import { automationFetch } from "@/app/services/automation/automation-fetch";
import type {
  AutomationConnection,
  CreateAutomationConnectionBody,
} from "@/app/services/automation/types";

export async function createAutomationConnection(
  body: CreateAutomationConnectionBody,
): Promise<AutomationConnection> {
  return automationFetch<AutomationConnection>("/connection", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
