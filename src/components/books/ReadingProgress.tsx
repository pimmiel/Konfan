import { ProgressBar } from "@/components/ui/ProgressBar";

interface ReadingProgressProps {
  currentPage: number;
  totalPages?: number;
  className?: string;
}

export function ReadingProgress({ currentPage, totalPages, className = "" }: ReadingProgressProps) {
  const hasTotal = totalPages !== undefined && totalPages > 0;
  const label = hasTotal ? `หน้า ${currentPage} / ${totalPages}` : `หน้า ${currentPage}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {hasTotal && <ProgressBar value={currentPage / totalPages!} />}
      <span className="font-sans text-xs text-muted">{label}</span>
    </div>
  );
}
