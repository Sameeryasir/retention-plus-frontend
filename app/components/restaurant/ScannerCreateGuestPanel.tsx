"use client";

import { CheckCircle2, UserPlus } from "lucide-react";
import { useState } from "react";
import { createCustomer } from "@/app/services/customer/create-customer";

export function ScannerCreateGuestPanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdGuestId, setCreatedGuestId] = useState<number | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setErrorMessage(null);
    setCreatedGuestId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setCreatedGuestId(null);

    try {
      const result = await createCustomer({ name, email, phone });
      setCreatedGuestId(result.id);
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Could not create guest.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-zinc-100">
          <UserPlus className="size-5 text-zinc-700" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Create new guest</h2>
          <p className="text-sm text-zinc-500">
            Add a guest profile so staff can look them up later.
          </p>
        </div>
      </div>

      {createdGuestId ? (
        <div className="mb-6 flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-center">
          <CheckCircle2 className="size-10 text-emerald-500" aria-hidden />
          <div>
            <p className="font-semibold text-zinc-900">Guest created</p>
            <p className="mt-1 text-sm text-zinc-600">
              Guest ID #{createdGuestId}. You can find them in Search Guest.
            </p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Create another
          </button>
        </div>
      ) : null}

      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <div>
          <label
            htmlFor="guest-name"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Name
          </label>
          <input
            id="guest-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
          />
        </div>

        <div>
          <label
            htmlFor="guest-email"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Email
          </label>
          <input
            id="guest-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            placeholder="jane@email.com"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
          />
        </div>

        <div>
          <label
            htmlFor="guest-phone"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Phone
          </label>
          <input
            id="guest-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            autoComplete="tel"
            placeholder="(555) 123-4567"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
          />
        </div>

        {errorMessage ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create guest"}
        </button>
      </form>
    </div>
  );
}
