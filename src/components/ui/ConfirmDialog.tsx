import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  title: string;
  warning?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  title,
  warning,
  confirmLabel = "ลบ · Delete",
  cancelLabel = "เก็บไว้ก่อน · Keep it",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal onClose={onClose} className="max-w-sm">
      <div className="flex flex-col gap-5">
        <p className="font-display text-xl text-ink leading-snug">{title}</p>

        {warning && (
          <p className="font-sans text-sm text-rose leading-relaxed">{warning}</p>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="quiet" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onConfirm}
            className="border-rose/40 text-rose hover:border-rose hover:bg-rose/10 hover:text-rose"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
