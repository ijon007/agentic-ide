"use client";

import type { TerminalLayoutMode } from "@/context/app-context";
import { cn } from "@/lib/utils";

const iconClass = "size-3.5";
const r = 2;

function IconFull({ className }: { className?: string }) {
  return (
    <svg
      className={cn(iconClass, className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      viewBox="0 0 16 16"
    >
      <rect
        fill="none"
        height="14"
        rx={r}
        strokeOpacity="0.4"
        width="14"
        x="1"
        y="1"
      />
      <rect
        fill="currentColor"
        fillOpacity="0.6"
        height="6"
        rx={r - 0.5}
        width="14"
        x="1"
        y="8"
      />
    </svg>
  );
}

function IconCenter({ className }: { className?: string }) {
  return (
    <svg
      className={cn(iconClass, className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      viewBox="0 0 16 16"
    >
      <rect
        fill="none"
        height="14"
        rx={r}
        strokeOpacity="0.4"
        width="14"
        x="1"
        y="1"
      />
      <rect
        fill="currentColor"
        fillOpacity="0.2"
        height="14"
        rx={1}
        width="3"
        x="2"
        y="1"
      />
      <rect
        fill="currentColor"
        fillOpacity="0.2"
        height="14"
        rx={1}
        width="3"
        x="11"
        y="1"
      />
      <rect
        fill="currentColor"
        fillOpacity="0.2"
        height="6"
        rx={1}
        width="6"
        x="5"
        y="1"
      />
      <rect
        fill="currentColor"
        fillOpacity="0.65"
        height="6"
        rx={r - 0.5}
        width="6"
        x="5"
        y="8"
      />
    </svg>
  );
}

function IconCenterRight({ className }: { className?: string }) {
  return (
    <svg
      className={cn(iconClass, className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      viewBox="0 0 16 16"
    >
      <rect
        fill="none"
        height="14"
        rx={r}
        strokeOpacity="0.4"
        width="14"
        x="1"
        y="1"
      />
      <rect
        fill="currentColor"
        fillOpacity="0.25"
        height="14"
        rx={1}
        width="4"
        x="1"
        y="1"
      />
      <rect
        fill="currentColor"
        fillOpacity="0.6"
        height="6"
        rx={r - 0.5}
        width="10"
        x="5"
        y="8"
      />
    </svg>
  );
}

function IconCenterLeft({ className }: { className?: string }) {
  return (
    <svg
      className={cn(iconClass, className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      viewBox="0 0 16 16"
    >
      <rect
        fill="none"
        height="14"
        rx={r}
        strokeOpacity="0.4"
        width="14"
        x="1"
        y="1"
      />
      <rect
        fill="currentColor"
        fillOpacity="0.25"
        height="14"
        rx={1}
        width="4"
        x="11"
        y="1"
      />
      <rect
        fill="currentColor"
        fillOpacity="0.6"
        height="6"
        rx={r - 0.5}
        width="10"
        x="1"
        y="8"
      />
    </svg>
  );
}

const icons: Record<
  TerminalLayoutMode,
  React.ComponentType<{ className?: string }>
> = {
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
