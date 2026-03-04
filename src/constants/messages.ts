import type { ChatMessage } from "@/types/message";

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content:
      "Can you add a loading spinner to the login button and fix the validation for empty email?",
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "I'll add a loading state to the login button and fix the email validation. Let me look at the current implementation first.",
    toolCalls: [
      {
        id: "t1",
        verb: "reading",
        path: "src/components/LoginForm.tsx",
        status: "reading",
      },
      {
        id: "t2",
        verb: "wrote",
        path: "src/components/LoginForm.tsx",
        status: "wrote",
      },
      { id: "t3", verb: "running", text: "npm run lint...", status: "running" },
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
      unified: `--- a/src/components/LoginForm.tsx\n+++ b/src/components/LoginForm.tsx\n@@ -5,6 +5,7 @@\n+  const [isLoading, setIsLoading] = useState(false);\n   const handleSubmit = async (e: FormEvent) => {\n     e.preventDefault();\n+    if (!validateEmail(formData.email)) {\n+      setError("Please enter a valid email");\n+      return;\n+    }\n+    setIsLoading(true);\n     try {\n       await onSubmit(formData);\n+    } finally {\n+      setIsLoading(false);\n     }\n   };`,
    },
  },
];
