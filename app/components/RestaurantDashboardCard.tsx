"use client";

import type { AdminRestaurant } from "@/app/services/restaurant/get-my-restaurant";
import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  Building2,
  MapPin,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";

type Props = {
  restaurant: AdminRestaurant;
};

export default function RestaurantDashboardCard({ restaurant }: Props) {
  const {
    name,
    description,
    branchCount,
    city,
    state,
    country,
    logoUrl,
    cuisineType,
  } = restaurant;

  const location = [city, state, country].filter(Boolean).join(", ");
  const logoSrc = logoUrl?.trim() ?? "";

  const detailRows: { key: string; icon: LucideIcon; label: string }[] = [];
  if (cuisineType?.trim()) {
    detailRows.push({
      key: "cuisine",
      icon: UtensilsCrossed,
      label: cuisineType.trim(),
    });
  }
  if (location) {
    detailRows.push({ key: "location", icon: MapPin, label: location });
  }
  if (branchCount != null) {
    detailRows.push({
      key: "branches",
      icon: Building2,
      label: `${branchCount} ${branchCount === 1 ? "branch" : "branches"}`,
    });
  }

  return (
    <Link
      href="/restaurant/dashboard"
      className="block h-full w-full rounded-xl outline-none ring-offset-2 ring-offset-white transition duration-200 ease-out hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-black/20"
    >
      <article className="flex h-full w-full min-h-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition duration-200 ease-out hover:shadow-md">
      <div className="shrink-0 border-b border-zinc-100">
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={`${name} logo`}
            className="h-44 w-full object-cover"
          />
        ) : (
          <div
            className="flex h-44 w-full items-center justify-center bg-zinc-100 text-zinc-500"
            aria-hidden
          >
            <Store className="h-12 w-12" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-black">{name}</h2>
          {description?.trim() ? (
            <div className="flex items-start gap-2 text-sm leading-relaxed text-black">
              <AlignLeft
                className="mt-0.5 h-4 w-4 shrink-0 text-black"
                strokeWidth={2}
                aria-hidden
              />
              <p>{description.trim()}</p>
            </div>
          ) : null}
        </div>

        {detailRows.length > 0 ? (
          <ul className="mt-4 space-y-2.5">
            {detailRows.map(({ key, icon: Icon, label }) => (
              <li key={key} className="flex items-start gap-2 text-sm text-black">
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-black"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
    </Link>
  );
}
