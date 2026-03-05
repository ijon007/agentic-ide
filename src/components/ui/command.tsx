"use client";

import {
  Command as CommandPrimitive,
  CommandDialog as CommandDialogPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandList as CommandListPrimitive,
  CommandSeparator as CommandSeparatorPrimitive,
} from "cmdk";
import type * as React from "react";
import { cn } from "@/lib/utils";

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded",
        className
      )}
      {...props}
    />
  );
}

function CommandDialog({
  overlayClassName,
  contentClassName,
  ...props
}: React.ComponentProps<typeof CommandDialogPrimitive>) {
  return (
    <CommandDialogPrimitive
      overlayClassName={cn(
        "data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 z-50 bg-black/80 data-closed:animate-out data-open:animate-in",
        overlayClassName
      )}
      contentClassName={cn(
        "data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-[15%] left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl border bg-background p-0 shadow-lg data-closed:animate-out data-open:animate-in",
        "border-[var(--border-subtle)] bg-[var(--bg-surface)]",
        contentClassName
      )}
      {...props}
    />
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandInputPrimitive>) {
  return (
    <CommandInputPrimitive
      className={cn(
        "flex h-10 w-full rounded-t-xl border-0 border-b bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        "border-b-(--border-subtle) text-(--text-primary)",
        className
      )}
      {...props}
    />
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandListPrimitive>) {
  return (
    <CommandListPrimitive
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden p-1",
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandEmptyPrimitive>) {
  return (
    <CommandEmptyPrimitive
      className={cn(
        "py-6 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandGroupPrimitive>) {
  return (
    <CommandGroupPrimitive
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-(--text-muted)",
        className
      )}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandItemPrimitive>) {
  return (
    <CommandItemPrimitive
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        "data-[selected=true]:bg-(--selection-bg) data-[selected=true]:text-(--text-primary)",
        className
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandSeparatorPrimitive>) {
  return (
    <CommandSeparatorPrimitive
      className={cn("-mx-1 h-px bg-border", "bg-(--border-subtle)", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
};
