import type { FileTreeNode } from "@/types/fileTree";

export const MOCK_FILE_TREE: Record<string, FileTreeNode[]> = {
  "1": [
    {
      name: "src",
      path: "src",
      type: "folder",
      children: [
        {
          name: "app",
          path: "src/app",
          type: "folder",
          children: [
            {
              name: "page.tsx",
              path: "src/app/page.tsx",
              type: "file",
              status: "modified",
            },
            { name: "layout.tsx", path: "src/app/layout.tsx", type: "file" },
            { name: "globals.css", path: "src/app/globals.css", type: "file" },
          ],
        },
        {
          name: "components",
          path: "src/components",
          type: "folder",
          children: [
            {
              name: "titlebar.tsx",
              path: "src/components/titlebar.tsx",
              type: "file",
              status: "new",
            },
            {
              name: "sidebar-left.tsx",
              path: "src/components/sidebar-left.tsx",
              type: "file",
              status: "new",
            },
          ],
        },
        { name: "main.ts", path: "src/main.ts", type: "file" },
      ],
    },
    { name: "package.json", path: "package.json", type: "file" },
    { name: "tsconfig.json", path: "tsconfig.json", type: "file" },
  ],
  "2": [
    {
      name: "src",
      path: "src",
      type: "folder",
      children: [
        {
          name: "api",
          path: "src/api",
          type: "folder",
          children: [
            { name: "routes.ts", path: "src/api/routes.ts", type: "file" },
            {
              name: "handlers.ts",
              path: "src/api/handlers.ts",
              type: "file",
              status: "modified",
            },
          ],
        },
        { name: "index.ts", path: "src/index.ts", type: "file" },
      ],
    },
    { name: "Dockerfile", path: "Dockerfile", type: "file", status: "new" },
  ],
  "3": [
    {
      name: "components",
      path: "components",
      type: "folder",
      children: [
        {
          name: "Hero.tsx",
          path: "components/Hero.tsx",
          type: "file",
          status: "deleted",
        },
        { name: "Footer.tsx", path: "components/Footer.tsx", type: "file" },
      ],
    },
    { name: "index.html", path: "index.html", type: "file" },
  ],
};
