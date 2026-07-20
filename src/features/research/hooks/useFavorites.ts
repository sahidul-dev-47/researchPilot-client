"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

const FAVORITES_KEY = "research_favorites_ids";

/**
 * Custom React hook to manage favoriting research projects locally in LocalStorage.
 * Aligns with backend restrictions (no research favorites table on database, only AI/Chats).
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse favorites from local storage", e);
    }
  }, []);

  const isFavorited = (researchId: string) => favorites.includes(researchId);

  const toggleFavorite = (researchId: string) => {
    let updated: string[];
    const favorited = isFavorited(researchId);
    if (favorited) {
      updated = favorites.filter((id) => id !== researchId);
      toast.success("Removed project from favorites.");
    } else {
      updated = [...favorites, researchId];
      toast.success("Saved project to favorites!");
    }
    setFavorites(updated);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to write favorites to local storage", e);
    }
  };

  return {
    favorites,
    isFavorited,
    toggleFavorite,
  };
}
