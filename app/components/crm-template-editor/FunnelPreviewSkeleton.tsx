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
      className="mx-auto w-full min-w-0 overflow-hidden bg-[#F8F7FF]"
      aria-busy="true"
      aria-label="Loading funnel preview"
    >
      <Bone className="aspect-[4/3] w-full rounded-none bg-violet-100/90 sm:aspect-[3/2]" />

      <div className="space-y-4 px-5 pb-8 pt-6 text-center">
        <Bone className="mx-auto h-5 w-28 rounded-full" />
        <Bone className="mx-auto h-8 w-[88%] max-w-[16rem]" />
        <Bone className="mx-auto h-4 w-[70%] max-w-xs" />
        <Bone className="mx-auto mt-2 h-px w-12" />

        <div className="space-y-2.5 pt-1">
          <Bone className="mx-auto h-3 w-full max-w-sm" />
          <Bone className="mx-auto h-3 w-full max-w-sm" />
          <Bone className="mx-auto h-3 w-[90%] max-w-sm" />
        </div>

        <Bone className="mx-auto mt-4 h-12 w-full max-w-sm rounded-2xl bg-violet-200/90" />
        <Bone className="mx-auto h-3 w-40" />
      </div>
    </div>
  );
}
