import type { DiffBlock } from "@/types/message";

export const MOCK_PROJECT_DIFFS: Record<string, DiffBlock[]> = {
  "1": [
    {
      id: "pd1-1",
      filePath: "src/components/settings/settings-panel.tsx",
      oldContent: "",
      newContent: "",
      unified: `--- a/src/components/settings/settings-panel.tsx
+++ b/src/components/settings/settings-panel.tsx
@@ -86,6 +86,7 @@
 {activeSection === "account" && <AccountSection />}
 {activeSection === "keyboardShortcuts" && <KeyboardShortcutsSection />}
 {activeSection === "models" && <ModelsSection />}
+{activeSection === "acpList" && <AcpListSection />}
 </div>
 </div>
 </DialogContent>`,
    },
    {
      id: "pd1-2",
      filePath: "src/components/titlebar.tsx",
      oldContent: "",
      newContent: "",
      unified: `--- a/src/components/titlebar.tsx
+++ b/src/components/titlebar.tsx
@@ -128,7 +128,7 @@
         </span>
         <div className="flex items-center gap-1">
-          <SidebarIcon className="size-5 rotate-180" weight="fill" />
+          <SidebarIcon className="size-5 rotate-180" aria-hidden weight="fill" />
         </div>
       </Button>
     </Tooltip>`,
    },
  ],
  "2": [
    {
      id: "pd2-1",
      filePath: "src/api/handlers.ts",
      oldContent: "",
      newContent: "",
      unified: `--- a/src/api/handlers.ts
+++ b/src/api/handlers.ts
@@ -1,5 +1,6 @@
 export function handleRequest(req: Request) {
+  const validated = validateRequest(req);
   return process(req);
 }`,
    },
    {
      id: "pd2-2",
      filePath: "src/api/routes.ts",
      oldContent: "",
      newContent: "",
      unified: `--- a/src/api/routes.ts
+++ b/src/api/routes.ts
@@ -10,6 +10,7 @@
   get: getHandler,
   post: postHandler,
+  patch: patchHandler,
 };`,
    },
  ],
  "3": [
    {
      id: "pd3-1",
      filePath: "components/Header.tsx",
      oldContent: "",
      newContent: "",
      unified: `--- a/components/Header.tsx
+++ b/components/Header.tsx
@@ -1,3 +1,4 @@
 export function Header() {
+  const [open, setOpen] = useState(false);
   return <header />;
 }`,
    },
    {
      id: "pd3-2",
      filePath: "components/Footer.tsx",
      oldContent: "",
      newContent: "",
      unified: `--- a/components/Footer.tsx
+++ b/components/Footer.tsx
@@ -1,2 +1,3 @@
 export function Footer() {
+  const year = new Date().getFullYear();
   return <footer />;
 }`,
    },
  ],
};
