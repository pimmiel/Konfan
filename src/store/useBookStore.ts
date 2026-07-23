import { create } from "zustand";
import type { Book } from "@/types";
import { load, save, STORAGE_KEYS } from "@/lib/storage";

interface BookState {
  books: Book[];
  addBook: (input: Omit<Book, "id" | "addedAt" | "status">) => void;
  updateProgress: (id: string, currentPage: number) => void;
  finish: (id: string) => void;
  remove: (id: string) => void;
}

const persist = (books: Book[]) => save(STORAGE_KEYS.books, books);

export const useBookStore = create<BookState>((set, get) => ({
  books: load<Book[]>(STORAGE_KEYS.books, []),

  addBook: (input) => {
    const book: Book = {
      ...input,
      id: crypto.randomUUID(),
      status: "reading",
      addedAt: Date.now(),
    };
    const books = [book, ...get().books];
    persist(books);
    set({ books });
  },

  updateProgress: (id, currentPage) => {
    const books = get().books.map((b) =>
      b.id === id ? { ...b, currentPage } : b
    );
    persist(books);
    set({ books });
  },

  finish: (id) => {
    const books = get().books.map((b) =>
      b.id === id ? { ...b, status: "finished" as const } : b
    );
    persist(books);
    set({ books });
  },

  remove: (id) => {
    const books = get().books.filter((b) => b.id !== id);
    persist(books);
    set({ books });
  },
}));
