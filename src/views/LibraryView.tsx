import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Display } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { BookList } from "@/components/books/BookList";
import { AddBookForm } from "@/components/books/AddBookForm";
import { useBookStore } from "@/store/useBookStore";

export function LibraryView() {
  const books = useBookStore((s) => s.books);
  const [showAddModal, setShowAddModal] = useState(false);

  const openModal = () => setShowAddModal(true);
  const closeModal = () => setShowAddModal(false);

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 pt-8 pb-24">
      <div className="flex items-center justify-between mb-8">
        <Display>ชั้นหนังสือ</Display>
        <Button variant="primary" size="sm" onClick={openModal}>
          เพิ่มหนังสือ
        </Button>
      </div>

      <BookList books={books} onAddClick={openModal} />

      <AnimatePresence>
        {showAddModal && (
          <Modal onClose={closeModal}>
            <AddBookForm onClose={closeModal} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
