"use client";

import type { TerminalLayoutMode } from "@/context/app-context";
import { cn } from "@/lib/utils";

const iconClass = "size-3.5";
const r = 2;

function IconFull({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={cn(iconClass, className)}
    >
      <rect x="1" y="1" width="14" height="14" rx={r} fill="none" strokeOpacity="0.4" />
      <rect x="1" y="8" width="14" height="6" rx={r - 0.5} fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

function IconCenter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={cn(iconClass, className)}
    >
      <rect x="1" y="1" width="14" height="14" rx={r} fill="none" strokeOpacity="0.4" />
      <rect x="2" y="1" width="3" height="14" rx={1} fill="currentColor" fillOpacity="0.2" />
      <rect x="11" y="1" width="3" height="14" rx={1} fill="currentColor" fillOpacity="0.2" />
      <rect x="5" y="1" width="6" height="6" rx={1} fill="currentColor" fillOpacity="0.2" />
      <rect x="5" y="8" width="6" height="6" rx={r - 0.5} fill="currentColor" fillOpacity="0.65" />
    </svg>
  );
}

function IconCenterRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={cn(iconClass, className)}
    >
      <rect x="1" y="1" width="14" height="14" rx={r} fill="none" strokeOpacity="0.4" />
      <rect x="1" y="1" width="4" height="14" rx={1} fill="currentColor" fillOpacity="0.25" />
      <rect x="5" y="8" width="10" height="6" rx={r - 0.5} fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

function IconCenterLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={cn(iconClass, className)}
    >
      <rect x="1" y="1" width="14" height="14" rx={r} fill="none" strokeOpacity="0.4" />
      <rect x="11" y="1" width="4" height="14" rx={1} fill="currentColor" fillOpacity="0.25" />
      <rect x="1" y="8" width="10" height="6" rx={r - 0.5} fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

const icons: Record<TerminalLayoutMode, React.ComponentType<{ className?: string }>> = {
  full: IconFull,
  center: IconCenter,
  "center-right": IconCenterRight,
  "center-left": IconCenterLeft,
};

export function TerminalLayoutIcon({
  mode,
  className,
}: {
  mode: TerminalLayoutMode;
  className?: string;
}) {
  const Icon = icons[mode];
  return <Icon className={className} />;
}
