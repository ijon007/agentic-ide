"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DEFAULT_ACP_ID,
  MOCK_ACP_LIST,
} from "@/constants/chat-selectors";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";

export function AcpSelector({
  value,
  onValueChange,
  className,
}: {
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
}) {
  const { installedAcpIds } = useApp();
  const installedAcps = MOCK_ACP_LIST.filter((a) => installedAcpIds.includes(a.id));
  const defaultId = installedAcpIds[0] ?? DEFAULT_ACP_ID;
  const selected = installedAcps.find((a) => a.id === value) ?? installedAcps.find((a) => a.id === defaultId) ?? installedAcps[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          className={cn("gap-1.5 min-w-24 justify-between text-xs", className)}
          variant="ghost"
        >
          {selected &&
            (selected.Icon ? (
              <selected.Icon className="size-4 shrink-0" />
            ) : selected.logo ? (
              <img src={selected.logo} alt="" className="size-4 object-contain" />
            ) : null)}
          {selected?.name ?? "Select ACP"}
          <CaretDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="border bg-(--bg-overlay) w-40"
      >
        <DropdownMenuRadioGroup
          value={value && installedAcpIds.includes(value) ? value : defaultId}
          onValueChange={(v) => v && onValueChange(v)}
        >
          {installedAcps.map((item) => (
            <DropdownMenuRadioItem
              key={item.id}
              value={item.id}
              className="cursor-pointer"
            >
              {item.Icon ? (
                <item.Icon
                  className={`${item.name.toLowerCase() === "codex" ? "size-5" : "size-4"} shrink-0`}
                />
              ) : (
                <img
                  src={item.logo}
                  alt=""
                  className={`${item.name.toLowerCase() === "codex" ? "size-5" : "size-4"} object-contain`}
                />
              )}
              {item.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
