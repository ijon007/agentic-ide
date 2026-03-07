"use client";

import { SignOutIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/app-context";

export function AccountSection() {
  const {
    syncLayoutsAcrossWindows,
    setSyncLayoutsAcrossWindows,
    systemNotifications,
    setSystemNotifications,
    systemTrayIcon,
    setSystemTrayIcon,
    completionSound,
    setCompletionSound,
  } = useApp();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <div
          className="rounded-lg px-3 py-3 text-xs"
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-secondary)",
          }}
        >
          Not signed in. Account features coming soon.
        </div>
      </div>
      <Button
        className="w-fit"
        onClick={() => {}}
        size="sm"
        variant="outline"
      >
        <SignOutIcon className="mr-2 size-3.5" />
        Log out
      </Button>
      <div>
        <div className="flex items-center justify-between gap-4 rounded-lg py-2">
          <div>
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Sync layouts across windows
            </p>
            <p
              className="text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              Keep sidebar and panel layout in sync across all windows
            </p>
          </div>
          <Switch
            checked={syncLayoutsAcrossWindows}
            onCheckedChange={setSyncLayoutsAcrossWindows}
          />
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-1">
          <div
            className="flex items-center justify-between gap-4 rounded-lg border-b py-3"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                System Notifications
              </p>
              <p
                className="text-[11px]"
                style={{ color: "var(--text-muted)" }}
              >
                Show system notifications when Agent completes or
                needs attention
              </p>
            </div>
            <Switch
              checked={systemNotifications}
              onCheckedChange={setSystemNotifications}
            />
          </div>
          <div
            className="flex items-center justify-between gap-4 rounded-lg border-b py-3"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                System Tray Icon
              </p>
              <p
                className="text-[11px]"
                style={{ color: "var(--text-muted)" }}
              >
                Show Cursor in system tray
              </p>
            </div>
            <Switch
              checked={systemTrayIcon}
              onCheckedChange={setSystemTrayIcon}
            />
          </div>
          <div
            className="flex items-center justify-between gap-4 rounded-lg py-3"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Completion Sound
              </p>
              <p
                className="text-[11px]"
                style={{ color: "var(--text-muted)" }}
              >
                Play a sound when Agent finishes responding
              </p>
            </div>
            <Switch
              checked={completionSound}
              onCheckedChange={setCompletionSound}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
