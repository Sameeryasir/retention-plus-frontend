import type { AdminRestaurant } from "@/app/services/restaurant/get-my-restaurant";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  Store,
} from "lucide-react";

type Props = {
  restaurant: AdminRestaurant;
};

export default function RestaurantCard({ restaurant }: Props) {
  const {
    name,
    description,
    email,
    phoneNumber,
    websiteUrl,
    branchCount,
    city,
    state,
    country,
    logoUrl,
  } = restaurant;

  const location = [city, state, country].filter(Boolean).join(", ");
  const logoSrc = logoUrl?.trim() ?? "";

  return (
    <article className="group/card relative flex w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-md shadow-zinc-900/[0.06] ring-1 ring-zinc-900/[0.03] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-900/[0.1] hover:ring-zinc-900/[0.05]">
      <div className="h-1 shrink-0 bg-zinc-900" />

      <div className="relative aspect-[5/3] w-full min-h-[140px] shrink-0 overflow-hidden bg-zinc-100">
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- API URL / data URL; not using next/image remotePatterns
          <img
            src={logoSrc}
            alt={`${name} logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-zinc-800 to-zinc-950 text-white"
            aria-hidden
          >
            <Store className="h-12 w-12 opacity-90" strokeWidth={1.5} />
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              No logo
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <header className="min-w-0 border-b border-zinc-100 pb-5">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            {name}
          </h2>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              {description}
            </p>
          ) : null}
        </header>

        <div className="mt-5 flex flex-1 flex-col space-y-2.5 text-sm">
          {email?.trim() ? (
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 text-zinc-800">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-200/80">
                <Mail className="h-4 w-4" />
              </span>
              <a
                href={`mailto:${email.trim()}`}
                className="min-w-0 break-all font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:text-black hover:decoration-zinc-600"
              >
                {email.trim()}
              </a>
            </div>
          ) : null}

          {phoneNumber?.trim() ? (
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 text-zinc-800">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-200/80">
                <Phone className="h-4 w-4" />
              </span>
              <a
                href={`tel:${phoneNumber.trim().replace(/\s/g, "")}`}
                className="min-w-0 break-all font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:text-black hover:decoration-zinc-600"
              >
                {phoneNumber.trim()}
              </a>
            </div>
          ) : null}

          {websiteUrl?.trim() ? (
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 text-zinc-800">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-200/80">
                <Globe className="h-4 w-4" />
              </span>
              <a
                href={
                  /^https?:\/\//i.test(websiteUrl.trim())
                    ? websiteUrl.trim()
                    : `https://${websiteUrl.trim()}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 break-all font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:text-black hover:decoration-zinc-600"
              >
                {websiteUrl.trim()}
              </a>
            </div>
          ) : null}

          {branchCount != null ? (
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 text-zinc-800">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-200/80">
                <Building2 className="h-4 w-4" />
              </span>
              <span className="font-medium text-zinc-800">
                {branchCount} {branchCount === 1 ? "branch" : "branches"}
              </span>
            </div>
          ) : null}

          {location ? (
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 text-zinc-800">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-200/80">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="font-medium text-zinc-800">{location}</span>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
