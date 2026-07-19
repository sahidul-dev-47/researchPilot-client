import { PaginationParams, SortParam } from "./api";

// ─── User Settings ────────────────────────────────────────────────────────
export interface UserSettings {
  theme: "light" | "dark";
  language: string;
  notificationPreference: boolean;
}

// ─── User ─────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "user" | "admin";
  bio?: string;
  bookmarks: string[];
  favoriteAI: string[];
  favoriteChats: string[];
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
}

// ─── Update User Inputs ───────────────────────────────────────────────────
export interface UpdateUserInput {
  name?: string;
  image?: string;
  bio?: string;
}

export interface UpdateSettingsInput {
  theme?: "light" | "dark";
  language?: string;
  notificationPreference?: boolean;
}

// ─── User Query Params ────────────────────────────────────────────────────
export interface UserQueryParams extends PaginationParams, SortParam {}
