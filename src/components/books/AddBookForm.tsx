import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Display } from "@/components/ui/Typography";
import { useBookStore } from "@/store/useBookStore";

interface AddBookFormProps {
  onClose: () => void;
}

export function AddBookForm({ onClose }: AddBookFormProps) {
  const addBook = useBookStore((s) => s.addBook);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("กรุณาใส่ชื่อหนังสือนะคะ");
      return;
    }
    addBook({
      title: title.trim(),
      author: author.trim(),
      currentPage: 0,
      totalPages: totalPages ? parseInt(totalPages, 10) : undefined,
    });
    onClose();
  };

  return (
    <div className="flex flex-col gap-6">
      <Display className="text-2xl">เพิ่มหนังสือ</Display>

      <div className="flex flex-col gap-4">
        <Input
          label="ชื่อหนังสือ"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(undefined);
          }}
          placeholder="ใส่ชื่อหนังสือที่นี่"
        />
        {error && (
          <p className="font-sans text-sm text-rose -mt-2">{error}</p>
        )}
        <Input
          label="ผู้แต่ง"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="ชื่อผู้แต่ง (ไม่บังคับ)"
        />
        <Input
          label="จำนวนหน้าทั้งหมด"
          value={totalPages}
          onChange={(e) => setTotalPages(e.target.value)}
          type="number"
          placeholder="เช่น 320 (ไม่บังคับ)"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="ghost" size="sm" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button variant="primary" size="sm" onClick={handleSubmit}>
          เพิ่มเลย
        </Button>
      </div>
    </div>
  );
}
