import { Display, Body, Eyebrow } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { BookCard } from "@/components/books/BookCard";
import type { Book } from "@/types";

interface BookListProps {
  books: Book[];
  onAddClick: () => void;
}

export function BookList({ books, onAddClick }: BookListProps) {
  const reading = books.filter((b) => b.status === "reading");
  const finished = books.filter((b) => b.status === "finished");

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Display className="text-2xl">ยังไม่มีหนังสือเลยนะ</Display>
        <Body className="text-muted max-w-xs">
          เริ่มเพิ่มหนังสือเล่มแรกของเธอสิ
        </Body>
        <Button variant="primary" size="md" onClick={onAddClick}>
          เพิ่มหนังสือ
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {reading.length > 0 && (
        <section className="flex flex-col gap-4">
          <Eyebrow>กำลังอ่าน · Reading</Eyebrow>
          {reading.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </section>
      )}

      {finished.length > 0 && (
        <section className="flex flex-col gap-4">
          <Eyebrow>อ่านจบแล้ว · Finished</Eyebrow>
          {finished.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </section>
      )}
    </div>
  );
}
