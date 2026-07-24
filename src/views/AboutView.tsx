import { Eyebrow } from "@/components/ui/Typography";

interface AboutViewProps {
  onBack: () => void;
}

const SECTIONS = [
  {
    num: "1",
    headTh: "เนื้อหาที่เธอเก็บและแชร์",
    headEn: "Your content",
    bodyTh:
      "ประโยคและโน้ตที่เธอบันทึกในก่อนฝันเป็นของเธอ และเธอเป็นผู้รับผิดชอบสิ่งที่เลือกแชร์ออกไป",
    bodyEn:
      "The lines and notes you keep in Kònfăn are yours, and you're responsible for what you choose to share.",
  },
  {
    num: "2",
    headTh: "เคารพงานของผู้เขียน",
    headEn: "Respecting authors",
    bodyTh:
      "ประโยคจากหนังสือเป็นงานของผู้เขียนและสำนักพิมพ์ กรุณาแชร์เฉพาะข้อความสั้นๆ พร้อมเครดิตที่มาเสมอ และไม่แชร์เนื้อหาจากงานที่เจ้าของสิทธิ์ระบุห้ามเผยแพร่",
    bodyEn:
      "Lines from books belong to their authors and publishers. Please share only short excerpts, always with credit, and don't share material from works whose rights holders have asked not to be reproduced.",
  },
  {
    num: "3",
    headTh: "ข้อมูลของเธอเก็บไว้ที่ไหน",
    headEn: "Where your data lives",
    bodyTh:
      "ก่อนฝันเก็บข้อมูลไว้ในเครื่องของเธอเอง (ในเบราว์เซอร์/แอป) เราไม่ได้ส่งประโยคหรือโน้ตของเธอขึ้นเซิร์ฟเวอร์ การแชร์เกิดขึ้นจากเครื่องของเธอไปยังแอปที่เธอเลือกโดยตรง",
    bodyEn:
      "Kònfăn stores your data on your own device. We don't upload your lines or notes to any server; sharing goes directly from your device to the app you choose.",
  },
  {
    num: "4",
    headTh: "แจ้งเอาเนื้อหาออก",
    headEn: "Takedown",
    bodyTh:
      "หากเธอเป็นเจ้าของลิขสิทธิ์และพบเนื้อหาที่ละเมิดสิทธิ์ของเธอถูกเผยแพร่ผ่านบริการของเรา แจ้งได้ที่ [อีเมลติดต่อ] เราจะดำเนินการโดยเร็ว",
    bodyEn:
      "If you're a rights holder and find infringing content distributed through our service, contact [อีเมลติดต่อ] and we'll act promptly.",
  },
  {
    num: "5",
    headTh: "ให้ตามสภาพ",
    headEn: "As-is",
    bodyTh: "ก่อนฝันเป็นโปรเจคที่ทำด้วยใจ ให้บริการตามสภาพ เท่าที่ทำได้",
    bodyEn: "Kònfăn is a labor of love, provided as-is.",
  },
];

export function AboutView({ onBack }: AboutViewProps) {
  return (
    <main className="max-w-xl mx-auto px-6 pt-10 pb-24 flex flex-col gap-10">
      {/* Back */}
      <button
        onClick={onBack}
        className="self-start font-sans text-sm text-muted hover:text-ink transition-colors duration-300 ease-calm flex items-center gap-1.5"
        aria-label="กลับ"
      >
        <span aria-hidden>←</span> กลับ · Back
      </button>

      {/* Header */}
      <div className="space-y-2">
        <Eyebrow>ก่อนฝัน · Kònfăn</Eyebrow>
        <h1 className="font-display text-3xl text-ink leading-snug">
          ข้อตกลงการใช้งาน
        </h1>
        <p className="font-display italic text-muted text-lg">Terms of Use</p>
      </div>

      {/* Sections */}
      <ol className="flex flex-col gap-8">
        {SECTIONS.map((s) => (
          <li key={s.num} className="flex flex-col gap-2">
            <div className="flex items-baseline gap-3">
              <span className="font-sans text-xs text-muted shrink-0">{s.num}.</span>
              <div>
                <p className="font-sans text-sm font-medium text-ink">{s.headTh}</p>
                <p className="font-sans text-xs text-muted italic">{s.headEn}</p>
              </div>
            </div>
            <div className="pl-6 space-y-1.5 border-l border-line">
              <p className="font-sans text-sm text-ink leading-relaxed">{s.bodyTh}</p>
              <p className="font-sans text-xs text-muted leading-relaxed">{s.bodyEn}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Footer */}
      <div className="pt-4 border-t border-line space-y-1">
        <p className="font-sans text-xs text-muted">
          ปรับปรุงล่าสุด · Last updated:{" "}
          <span className="italic opacity-60">[วันที่]</span>
        </p>
        <p className="font-sans text-xs text-muted/60 leading-relaxed">
          ร่างนี้ยังไม่ผ่านการรีวิวจากนักกฎหมาย ก่อนเผยแพร่กับผู้ใช้จำนวนมากควรปรึกษาผู้เชี่ยวชาญด้านทรัพย์สินทางปัญญา/PDPA
        </p>
      </div>

      {/* Back again at bottom */}
      <button
        onClick={onBack}
        className="self-center font-sans text-xs text-muted hover:text-ink transition-colors duration-300 ease-calm"
      >
        ← กลับ · Back
      </button>
    </main>
  );
}
