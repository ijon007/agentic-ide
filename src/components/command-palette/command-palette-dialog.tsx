"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getCommandPaletteItems,
  type CommandPaletteChatItem,
  type CommandPaletteFileItem,
  type CommandPaletteProjectItem,
} from "@/lib/command-palette-items";
import { useApp } from "@/context/app-context";
import { CommandPaletteItem } from "./command-palette-item";

interface CommandPaletteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPaletteDialog({
  open,
  onOpenChange,
}: CommandPaletteDialogProps) {
  const {
    setActiveProject,
    openChat,
    openFile,
    setFocusedCenterPanel,
  } = useApp();

  const { projects, chats, files } = getCommandPaletteItems();

  const handleSelectProject = (item: CommandPaletteProjectItem) => {
    setActiveProject(item.id);
    onOpenChange(false);
  };

  const handleSelectChat = (item: CommandPaletteChatItem) => {
    setActiveProject(item.projectId);
    openChat(item.id);
    setFocusedCenterPanel("chat");
    onOpenChange(false);
  };

  const handleSelectFile = (item: CommandPaletteFileItem) => {
    setActiveProject(item.projectId);
    openFile(item.path);
    setFocusedCenterPanel("editor");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-[15%] max-w-4xl -translate-x-1/2 translate-y-0 p-0 gap-0 border-(--border-subtle) bg-(--bg-surface)"
        showCloseButton
      >
        <DialogTitle className="sr-only">
          Go to project, chat, or file
        </DialogTitle>
        <Command label="Go to project, chat, or file">
          <CommandInput placeholder="Search projects, chats, files..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Projects">
              {projects.map((item) => (
                <CommandItem
                  key={`project-${item.id}`}
                  value={`${item.title} ${item.subtitle}`}
                  onSelect={() => handleSelectProject(item)}
                >
                  <CommandPaletteItem
                    type="project"
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Chats">
              {chats.map((item) => (
                <CommandItem
                  key={`chat-${item.id}`}
                  value={`${item.title} ${item.subtitle}`}
                  onSelect={() => handleSelectChat(item)}
                >
                  <CommandPaletteItem
                    type="chat"
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Files">
              {files.map((item) => (
                <CommandItem
                  key={`file-${item.projectId}-${item.path}`}
                  value={`${item.title} ${item.subtitle} ${item.path}`}
                  onSelect={() => handleSelectFile(item)}
                >
                  <CommandPaletteItem
                    type="file"
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
