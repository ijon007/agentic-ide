import type { Chat } from "@/types/chat";

export const MOCK_CHATS: Chat[] = [
  {
    id: "c1",
    projectId: "1",
    title: "Fix login validation bug",
    timestamp: new Date(Date.now() - 3_600_000),
  },
  {
    id: "c2",
    projectId: "1",
    title: "Add dark mode support",
    timestamp: new Date(Date.now() - 7_200_000),
  },
  {
    id: "c3",
    projectId: "1",
    title: "Refactor auth module",
    timestamp: new Date(Date.now() - 86_400_000),
  },
  {
    id: "c4",
    projectId: "1",
    title: "Implement rate limiting",
    timestamp: new Date(Date.now() - 172_800_000),
  },
  {
    id: "c5",
    projectId: "2",
    title: "Add GraphQL endpoint",
    timestamp: new Date(Date.now() - 3_600_000),
  },
  {
    id: "c6",
    projectId: "2",
    title: "Optimize database queries",
    timestamp: new Date(Date.now() - 14_400_000),
  },
  {
    id: "c7",
    projectId: "2",
    title: "Setup Redis caching",
    timestamp: new Date(Date.now() - 86_400_000),
  },
  {
    id: "c8",
    projectId: "3",
    title: "Redesign hero section",
    timestamp: new Date(Date.now() - 7_200_000),
  },
  {
    id: "c9",
    projectId: "3",
    title: "Add contact form",
    timestamp: new Date(Date.now() - 43_200_000),
  },
];
