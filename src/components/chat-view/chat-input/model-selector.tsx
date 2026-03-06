"use client";

import { BrainIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxSearchInput,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useApp } from "@/context/app-context";
import { MOCK_MODELS } from "@/constants/models";
import type { Model } from "@/types/model";

function ModelInfoPopup({ model }: { model: Model }) {
  return (
    <div className="flex flex-col gap-1 text-left w-full">
      <p className="font-semibold text-xs text-foreground">{model.name}</p>
      <p className="text-xs/relaxed text-popover-foreground">{model.description}</p>
      <p className="text-xs text-muted-foreground">
        {model.contextWindow.toLowerCase()} context window
      </p>
      <p className="text-xs italic text-muted-foreground">
        Version: {model.thinking ? "high reasoning effort" : "standard"}
      </p>
    </div>
  );
}

export function ModelSelector({
  value,
  onValueChange,
  className,
}: {
  value: { id: string; name: string };
  onValueChange: (id: string) => void;
  className?: string;
}) {
  const { enabledModelIds } = useApp();
  const enabledModels = useMemo(
    () => MOCK_MODELS.filter((m) => enabledModelIds.includes(m.id)),
    [enabledModelIds]
  );
  const selectedModel = useMemo(
    () => enabledModels.find((m) => m.id === value.id) ?? enabledModels[0] ?? null,
    [value.id, enabledModels]
  );

  return (
    <Combobox<Model>
      value={selectedModel}
      onValueChange={(m) => m && onValueChange(m.id)}
      items={enabledModels}
      itemToStringLabel={(m) => m.name}
      itemToStringValue={(m) => m.id}
      isItemEqualToValue={(a, b) => a.id === b.id}
    >
      <ComboboxTrigger
        render={
          <Button className={className ?? "gap-1.5 justify-between"} variant="ghost" />
        }
      >
        {value.name}
      </ComboboxTrigger>
      <ComboboxContent
        align="start"
        className="min-w-[200px] w-(--anchor-width) rounded"
      >
        <ComboboxSearchInput placeholder="Search models…" className="border-none rounded-t" />
        <ComboboxEmpty>No models found.</ComboboxEmpty>
        <ComboboxList className="rounded-b">
          {(m: Model) => (
            <ComboboxItem key={m.id} value={m} className="cursor-pointer">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <span className="flex flex-1 items-center gap-1.5">
                      {m.name}
                      {m.thinking && (
                        <BrainIcon className="size-3.5 shrink-0 text-muted-foreground" />
                      )}
                    </span>
                  }
                />
                <TooltipContent
                  side="right"
                  sideOffset={8}
                  className="max-w-[100px] bg-popover text-popover-foreground border border-border/80 shadow-md p-2"
                >
                  <ModelInfoPopup model={m} />
                </TooltipContent>
              </Tooltip>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
