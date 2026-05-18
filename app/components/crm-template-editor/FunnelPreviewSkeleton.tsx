"use client";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-200/80 ${className ?? ""}`}
      aria-hidden
    />
  );
}

export function FunnelPreviewSkeleton() {
  return (
    <div
      className="mx-auto w-full min-w-0 overflow-x-hidden bg-white p-4"
      aria-busy="true"
      aria-label="Loading funnel preview"
    >
      <div className="-mx-4 -mt-4 mb-6">
        <Bone className="aspect-[4/3] w-full rounded-none rounded-t-2xl sm:aspect-[3/2]" />
      </div>

      <div className="space-y-5 text-center">
        <Bone className="mx-auto h-6 w-24" />
        <Bone className="mx-auto h-4 w-[85%] max-w-xs" />
        <Bone className="mx-auto h-4 w-[70%] max-w-[16rem]" />

        <div className="space-y-3 pt-2">
          <Bone className="mx-auto h-3 w-full max-w-sm" />
          <Bone className="mx-auto h-3 w-full max-w-sm" />
          <Bone className="mx-auto h-3 w-[92%] max-w-sm" />
          <Bone className="mx-auto h-3 w-full max-w-sm" />
          <Bone className="mx-auto h-3 w-[80%] max-w-sm" />
        </div>

        <Bone className="mt-6 h-11 w-full rounded-lg bg-zinc-300/90" />
      </div>
    </div>
  );
}
