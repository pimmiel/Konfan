import { create } from "zustand";
import type { Book } from "@/types";
import { load, save, STORAGE_KEYS } from "@/lib/storage";
import { usePassageStore } from "@/store/usePassageStore";

interface BookState {
  books: Book[];
  activeBookId: string | null;
  addBook: (input: Omit<Book, "id" | "addedAt" | "status">) => void;
  updateProgress: (id: string, currentPage: number) => void;
  finish: (id: string, closingFeeling?: string) => void;
  remove: (id: string) => void;
  setActiveBook: (id: string | null) => void;
}

const persistBooks = (books: Book[]) => save(STORAGE_KEYS.books, books);
const persistActive = (id: string | null) => save(STORAGE_KEYS.activeBook, id);

function deriveActiveBook(books: Book[], current: string | null): string | null {
  if (current && books.some((b) => b.id === current && b.status === "reading")) {
    return current;
  }
  return books.find((b) => b.status === "reading")?.id ?? null;
}

export const useBookStore = create<BookState>((set, get) => {
  const books = load<Book[]>(STORAGE_KEYS.books, []);
  const savedActive = load<string | null>(STORAGE_KEYS.activeBook, null);
  const activeBookId = deriveActiveBook(books, savedActive);

  return {
    books,
    activeBookId,

    addBook: (input) => {
      const book: Book = {
        ...input,
        id: crypto.randomUUID(),
        status: "reading",
        addedAt: Date.now(),
      };
      const books = [book, ...get().books];
      persistBooks(books);
      // auto-set as active if nothing active yet
      const activeBookId = get().activeBookId ?? book.id;
      persistActive(activeBookId);
      set({ books, activeBookId });
    },

    updateProgress: (id, currentPage) => {
      const books = get().books.map((b) =>
        b.id === id ? { ...b, currentPage } : b
      );
      persistBooks(books);
      set({ books });
    },

    finish: (id, closingFeeling) => {
      const books = get().books.map((b) =>
        b.id === id
          ? { ...b, status: "finished" as const, ...(closingFeeling ? { closingFeeling } : {}) }
          : b
      );
      persistBooks(books);

      // reset activeBookId if the finished book was active
      let { activeBookId } = get();
      if (activeBookId === id) {
        activeBookId = books.find((b) => b.status === "reading")?.id ?? null;
        persistActive(activeBookId);
      }

      set({ books, activeBookId });
    },

    remove: (id) => {
      const books = get().books.filter((b) => b.id !== id);
      persistBooks(books);

      let { activeBookId } = get();
      if (activeBookId === id) {
        activeBookId = books.find((b) => b.status === "reading")?.id ?? null;
        persistActive(activeBookId);
      }

      usePassageStore.getState().removeByBook(id);
      set({ books, activeBookId });
    },

    setActiveBook: (id) => {
      persistActive(id);
      set({ activeBookId: id });
    },
  };
});
