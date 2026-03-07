"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_ACP_LIST } from "@/constants/chat-selectors";
import { useApp } from "@/context/app-context";

export function AcpListSection() {
  const { installedAcpIds, setInstalledAcpIds } = useApp();

  const installAcp = (acpId: string) => {
    setInstalledAcpIds((prev) =>
      prev.includes(acpId) ? prev : [...prev, acpId]
    );
  };

  return (
    <section>
      <p
        className="mb-4 text-xs"
        style={{ color: "var(--text-secondary)" }}
      >
        Install ACPs to add them to the chat ACP selector.
      </p>
      <div className="flex flex-col gap-2">
        {MOCK_ACP_LIST.map((acp) => {
          const isInstalled = installedAcpIds.includes(acp.id);
          return (
            <div
              className="flex items-center justify-between gap-4 rounded-lg border py-2.5 pl-3 pr-2"
              key={acp.id}
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 p-2">
                {acp.Icon ? (
                  <acp.Icon
                    className={`${acp.name.toLowerCase() === "codex" ? "size-10" : "size-8"} shrink-0`}
                  />
                ) : (
                  <img
                    src={acp.logo}
                    alt=""
                    className={`${acp.name.toLowerCase() === "codex" ? "size-10" : "size-8"} shrink-0 object-contain`}
                  />
                )}
                <div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {acp.name}
                  </p>
                  {acp.description && (
                    <p
                      className="text-[11px]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {acp.description}
                    </p>
                  )}
                </div>
              </div>
              {isInstalled ? (
                <Badge
                  className="shrink-0"
                  variant="secondary"
                >
                  Added
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => installAcp(acp.id)}
                >
                  Install
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
