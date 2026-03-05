import type { ChatMessage } from "@/types/message";

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content:
      "Can you add a loading spinner to the login button and fix the validation for empty email?",
    attachments: [
      {
        type: "projectFile",
        id: "att1",
        projectId: "p1",
        path: "src/components/LoginForm.tsx",
        projectName: "my-app",
      },
    ],
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "I'll add a loading state to the login button and fix the email validation. Let me look at the current implementation first.",
    toolCalls: [
      {
        kind: "read_file",
        id: "t1",
        path: "src/components/LoginForm.tsx",
        status: "success",
      },
      {
        kind: "write_file",
        id: "t2",
        path: "src/components/LoginForm.tsx",
        status: "success",
      },
      {
        kind: "run_command",
        id: "t3",
        text: "npm run lint",
        status: "success",
        output: `> my-app@1.0.0 lint
> eslint src/

src/components/LoginForm.tsx
  12:7  warning  'useCallback' is defined but never used  @typescript-eslint/no-unused-vars
  45:3  error    Missing dependency 'onSubmit' in useEffect     react-hooks/exhaustive-deps

✖ 2 problems (1 error, 1 warning)
  1 error and 1 warning potentially fixable with the \`--fix\` option.`,
      },
    ],
  },
  {
    id: "m3",
    role: "assistant",
    content:
      "I've made the changes. Here's what I did:\n\n1. **Loading spinner** — Added a `isLoading` state that shows a spinner when the form is submitting.\n2. **Email validation** — Added a check for empty strings and trimmed whitespace.\n\nHere's the updated validation logic:",
    codeBlocks: [
      {
        language: "typescript",
        code: `function validateEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(trimmed);
}`,
      },
    ],
  },
  {
    id: "m4",
    role: "assistant",
    content:
      "I've also updated the LoginForm component. Here's the diff for the changes:",
    diff: {
      id: "d1",
      filePath: "src/components/LoginForm.tsx",
      oldContent: `  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };`,
      newContent: `  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email");
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };`,
      unified: `--- a/src/components/LoginForm.tsx\n+++ b/src/components/LoginForm.tsx\n@@ -5,7 +5,14 @@\n-  await onSubmit(formData);\n+  const [isLoading, setIsLoading] = useState(false);\n   const handleSubmit = async (e: FormEvent) => {\n     e.preventDefault();\n+    if (!validateEmail(formData.email)) {\n+      setError("Please enter a valid email");\n+      return;\n+    }\n+    setIsLoading(true);\n     try {\n       await onSubmit(formData);\n+    } finally {\n+      setIsLoading(false);\n     }\n   };`,
    },
  },
  {
    id: "m5",
    role: "assistant",
    content: "All edits have been applied. Summary of changes:",
    filesChanged: {
      files: [
        {
          id: "fc1",
          filePath: "src/components/LoginForm.tsx",
          oldContent: "  await onSubmit(formData);",
          newContent: "  setIsLoading(true);\n  try {\n    await onSubmit(formData);\n  } finally {\n    setIsLoading(false);\n  }",
          unified: `--- a/src/components/LoginForm.tsx\n+++ b/src/components/LoginForm.tsx\n@@ -1,3 +1,8 @@\n-  await onSubmit(formData);\n+  setIsLoading(true);\n+  try {\n+    await onSubmit(formData);\n+  } finally {\n+    setIsLoading(false);\n+  }`,
        },
        {
          id: "fc2",
          filePath: "src/components/footer.tsx",
          oldContent: "export function Footer() {\n  return <footer />;\n}",
          newContent: "export function Footer() {\n  return (\n    <footer className=\"py-4\">\n      <p>© 2024</p>\n    </footer>\n  );\n}",
          unified: `--- a/src/components/footer.tsx\n+++ b/src/components/footer.tsx\n@@ -1,3 +1,9 @@\n export function Footer() {\n-  return <footer />;\n+  return (\n+    <footer className=\"py-4\">\n+      <p>© 2024</p>\n+    </footer>\n+  );\n }`,
        },
      ],
    },
  },
  {
    id: "m5b",
    role: "assistant",
    content: "I used the context7 MCP to fetch the latest React documentation for the hooks we need.",
    toolCalls: [
      {
        kind: "mcp_call",
        id: "mcp1",
        server: "user-context7",
        toolName: "get_documentation",
        arguments: {
          library: "react",
          topic: "useState",
          version: "18",
        },
        result: `# useState

\`useState\` is a React Hook that lets you add a state variable to your component.

## Reference

\`const [state, setState] = useState(initialState)\`

### Parameters

- \`initialState\`: The value you want the state to initially be. It can be a value of any type, but there is a special behavior for functions.

### Returns

\`useState\` returns an array with exactly two values:

1. The current state. During the first render, it will match the \`initialState\` you have passed.
2. The \`set\` function that lets you update the state to a different value and trigger a re-render.`,
        status: "success",
      },
    ],
  },
  {
    id: "m6",
    role: "assistant",
    content: "I delegated the test setup to a specialist agent.",
    subagent: {
      id: "sub1",
      name: "Test setup agent",
      status: "done",
      summary: "Added Jest config and sample test",
      messages: [
        {
          id: "sub-m1",
          role: "user",
          content: "Set up Jest for this project and add a sample test for LoginForm",
        },
        {
          id: "sub-m2",
          role: "assistant",
          content: "I've added Jest configuration and a sample test file.",
          toolCalls: [
            {
              kind: "write_file",
              id: "sub-t1",
              path: "jest.config.js",
              status: "success",
            },
            {
              kind: "search",
              id: "sub-t2",
              query: "LoginForm",
              resultCount: 3,
              status: "success",
            },
          ],
        },
      ],
    },
  },
];
