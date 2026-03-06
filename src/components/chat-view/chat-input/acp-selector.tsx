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
  const Icon = selected?.Icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className={cn("gap-1.5 min-w-24 justify-between text-xs", className)}
            variant="ghost"
          />
        }
      >
        {Icon && <Icon className="size-3.5 shrink-0" />}
        {selected?.name ?? "Select ACP"}
        <CaretDownIcon className="size-3 shrink-0 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="border bg-(--bg-overlay)"
      >
        <DropdownMenuRadioGroup
          value={value && installedAcpIds.includes(value) ? value : defaultId}
          onValueChange={(v) => v && onValueChange(v)}
        >
          {installedAcps.map((item) => {
            const ItemIcon = item.Icon;
            return (
              <DropdownMenuRadioItem
                key={item.id}
                value={item.id}
                className="cursor-pointer"
              >
                <ItemIcon className="size-3.5 shrink-0" />
                {item.name}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
