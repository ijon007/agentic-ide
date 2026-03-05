"use client";

export function PlanningBlock() {
  return (
    <div
      className="inline-block text-sm"
      style={{
        color: "var(--text-muted)",
      }}
    >
      <span
        className="inline-block bg-clip-text text-transparent bg-size-[200%_100%]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--text-muted) 0%, var(--text-secondary) 50%, var(--text-muted) 100%)",
          animation: "text-shimmer 2s ease-in-out infinite",
        }}
      >
        Planning…
      </span>
    </div>
  );
}
