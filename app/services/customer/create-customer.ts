const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export type CreateCustomerPayload = {
  name: string;
  email: string;
};

export async function createCustomer(
  payload: CreateCustomerPayload,
): Promise<unknown> {
  if (!payload.name?.trim()) {
    throw new Error("Name is required.");
  }
  if (!payload.email?.trim()) {
    throw new Error("Email is required.");
  }

  const res = await fetch(`${API_URL}/customer/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim(),
    }),
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const errBody = (await res.json()) as { message?: unknown };
      const m = errBody?.message;
      if (Array.isArray(m)) message = m.join(" ");
      else if (typeof m === "string") message = m;
    } catch {}
    throw new Error(message);
  }

  return res.json() as Promise<unknown>;
}
