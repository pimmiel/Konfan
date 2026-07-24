# ก่อนฝัน (Kònfăn) — Redesign Handoff สำหรับ Claude Code

> Brief สำหรับ implement ดีไซน์ใหม่โทนอบอุ่นก่อนฝัน ลงในโค้ดจริง (React + Tailwind + framer-motion ตาม stack เดิม)
> ต้นแบบดีไซน์อยู่ที่ `Konfan.dc.html` (เปิดดูใน browser ได้เลย) — ไฟล์นี้อธิบายทุกอย่างที่เห็นในต้นแบบ

---

## ภาพรวม

ยกเครื่องหน้าเว็บใหม่ทั้งหมด โทน **อบอุ่น เงียบ เหมาะกับช่วงก่อนฝัน** ยึดพาเลตต์ + ฟอนต์เดิมของแอป
มี **4 หน้า** และ **2 โหมด** (dusk / bedtime) สลับได้ ทุกหน้า responsive (มือถือ + เดสก์ท็อป)

Copy ทุกจุด **ไทย + อังกฤษคู่กัน** โทนอ่อนโยน (ห้ามใช้คำว่า "พิธีกรรม/ritual" — ดูน่ากลัว ใช้ "ช่วงเวลาเงียบๆ / a quiet moment" แทน)

---

## Design tokens

ใช้จาก `tailwind.config.js` + `index.css` เดิม ยืนยันค่า:

**Dusk (default) — parchment กลางวันนวล**
```
--paper   #EFE7D6   (พื้นหลัง)
--surface #F5EFE2   (การ์ด)
--ink     #3B2E3A   (ตัวหนังสือหลัก)
--muted   #6E5C6B   (ตัวหนังสือรอง)
--line    #D6CABA   (เส้น/ขอบ)
```

**Bedtime — night plum มืดอุ่น**
```
--paper   #2A2231
--surface #3B2E3A
--ink     #ECE0D8
--muted   #B09EAC
--line    #4E404E
```

**สี accent (ใช้ร่วมทั้งสองโหมด)**
```
honey / candlelight  #E0A458  (ปุ่มหลัก, moon, glow) + hover #C4842F
cream                #FFF3DE / #EFCB99  (แสงเปลวไฟ)
dried-rose           #C99BA0  (body เทียน)
sage                 #8B9D83  (hover ยืนยัน, reflection ที่เก็บแล้ว)
```

**ฟอนต์**
- หัวเรื่อง/บทกวี: **Fraunces** (serif, weight 500, มี italic)
- UI/ตัวเนื้อ: **Instrument Sans** + **Noto Sans Thai**

---

## Font pairing & scale
- H1 landing: Fraunces 500, `clamp(52px,12vw,84px)`
- H2 หัวหน้า: Fraunces 500, `clamp(28px,6vw,42px)`
- บทกวี: Fraunces 500, `clamp(21px,4.4vw,26px)`, line-height 1.5
- eyebrow: 11px, letter-spacing 0.24em, uppercase, --muted
- body: Instrument Sans 14–16px

Radius การ์ด/ปุ่ม: `18px` (การ์ด), `999px` (ปุ่ม/pill)
Glow การ์ดเด่น: `box-shadow: 0 0 40px -8px rgba(224,164,88,0.45)`
Easing มาตรฐาน: `cubic-bezier(0.22,1,0.36,1)`, transition 300–700ms

---

## บรรยากาศเคลื่อนไหว (ambient motion)
เบาๆ ไม่รบกวน เคารพ `prefers-reduced-motion`
1. **เทียนกระพริบ** (หน้า Landing) — เปลวไฟ scale/translate + opacity วน 2.4s, glow halo วน 3.5s
2. **ดาวกระพริบ** — จุดเล็ก 8 จุด fixed ทั่วจอ opacity twinkle 4–6.4s สุ่ม delay; opacity ดาวรวม: dusk 0.35 / bedtime 1.0
3. **Sky glow** — radial honey จางๆ ด้านบนจอ (fixed)
4. **Mood tint** — เลือกอารมณ์แล้ว radial สีอารมณ์จางลงมาจากขอบบน fade 1000ms (ทั้งจอ "อุ่นขึ้น" ตามอารมณ์)

Toggle ปิด/เปิด ambient ได้ (prop `ambientMotion`)

---

## หน้าที่ 1 — Landing (เปิดแอปครั้งแรก, ยังไม่มีในโค้ดเดิม)
กึ่งกลางจอแนวตั้ง:
- eyebrow: `ก่อนฝัน · before dream`
- เทียนกระพริบ (SVG/CSS)
- H1 `ก่อนฝัน` + subtitle italic `Kònfăn` (สี honey)
- tagline: `ช่วงเวลาเงียบๆ ก่อนหลับตา` / italic `A quiet moment before you close your eyes`
- ปุ่ม honey pill: `เริ่มค่ำคืนนี้ · Begin tonight` → ไปหน้า Tonight
- แถว 3 feature: 🕯️ เช็คอินอารมณ์ · 📖 ชั้นหนังสือ · 🌙 reflection ปิดวัน

## หน้าที่ 2 — Tonight (เช็คอินอารมณ์ + บทกวี)
1. **Moon-phase streak** — พระจันทร์ 7 ดวง คืนที่เช็คอินติดกันเป็นจันทร์เต็มดวงสีhoney (glow), คืนที่ยังไม่ได้เป็นวงกลมโปร่งขอบ --line. label `N คืนติดกัน · N-night streak`
2. Greeting: eyebrow `คืนนี้ · Tonight` + H2 `ปิดวันด้วยลมหายใจช้าๆ` + italic `Close the day with a slow breath` + แถบ "กำลังอ่าน: <ชื่อหนังสือ>"
3. **Mood picker** — 5 อารมณ์ ปุ่มการ์ด (glyph + ไทย + อังกฤษ italic) เลือกได้ มีวงขอบ honey + glow เมื่อ active:
   - calm 🌙 สงบ / Calm — tint #8B9D83
   - tender 🌸 อ่อนโยน / Tender — #C99BA0
   - weary 🍂 เหนื่อยล้า / Weary — #C4842F
   - hopeful 🕯️ มีหวัง / Hopeful — #E0A458
   - restless 🌾 ใจไม่นิ่ง / Restless — #6E5C6B
4. **Poem card** — โผล่หลังเลือกอารมณ์ (fade-up) บทกวีต้นฉบับ ไทย (Fraunces) + อังกฤษ (italic, มีเส้นคั่น) ดูบทกวีทั้ง 5 ใน `Konfan.dc.html` (object `POEMS`) — คัดลอกไปใช้ได้เลย
5. **Reflection card** (ขอบ dashed) — textarea `วันนี้ฉันรู้สึก… · today I felt…` + ปุ่ม `เก็บค่ำคืนนี้ · Keep tonight`. กดแล้วแสดงข้อความที่เก็บ + `เก็บไว้แล้ว ราตรีสวัสดิ์นะ · Kept. Sleep softly.` **และ prepend คืนนี้เข้าหน้า History**

## หน้าที่ 3 — Library (ชั้นหนังสือ)
- หัว `ชั้นหนังสือ / Your shelf` + ปุ่ม honey `+ เพิ่มหนังสือ`
- section **กำลังอ่าน · Reading**: การ์ดหนังสือ (ชื่อ Fraunces + ผู้เขียน), แถบ progress honey + `หน้า X / Y`, ปุ่ม `+10 หน้า` / `อ่านจบแล้ว` / `ลบ`
- section **อ่านจบแล้ว · Finished**: การ์ดแถวเตี้ย opacity 0.85 + badge `✓ อ่านจบ`
- empty state 📚 `ยังไม่มีหนังสือเลยนะ / Add your first book`
- **modal เพิ่มหนังสือ**: overlay เบลอ + การ์ด, input ชื่อ/ผู้เขียน/จำนวนหน้า, ปุ่ม `ยกเลิก` / `เก็บขึ้นชั้น`

## หน้าที่ 4 — History / บันทึกค่ำคืน (ใหม่)
- หัว `บันทึกค่ำคืน / Nights you've closed` + streak label
- **ไทม์ไลน์แนวตั้ง** เส้น --line กลาง, แต่ละคืนเป็นดวงจันทร์สีตามอารมณ์คืนนั้น
- แต่ละการ์ด: glyph+ชื่ออารมณ์ (ไทย+อังกฤษ) + วันที่ (คืนนี้/เมื่อคืน/N คืนก่อน) + บรรทัดแรกของบทกวี + reflection ในเครื่องหมายคำพูด (สี sage, ถ้ามี)
- ปิดท้าย italic กลางจอ: `ทุกคืนที่ผ่านมา เธอกลับมาหาตัวเองเสมอ / Every night, you came back to yourself.`

---

## Navigation
- **Bottom nav** fixed (dusk/bedtime surface) 3 แท็บ: 🕯️ คืนนี้ · 📚 ชั้นหนังสือ · 🌙 บันทึก. แท็บ active สี honey
- Header: โลโก้ `ก่อนฝัน` (กลับ Landing) ซ้าย + ปุ่ม toggle โหมด ขวา (`🕯️ เปิดโหมดก่อนนอน` ↔ `🌙 โหมดก่อนนอน`)

---

## State / behavior ที่ต้อง implement
- `page`: landing | tonight | library | history
- `mode`: dusk | bedtime (สลับ + transition สี 700ms)
- `mood`: null | key → คุมทั้ง poem, tint, mood card active
- reflection: text + kept flag; kept → prepend เข้า history
- books: currentPage/totalPages/status(reading|finished); +10 หน้า, finish, remove, add
- history: array {mood, date, poemLine, reflection}
- streak: จำนวน moon เต็ม
- ambientMotion: bool เปิด/ปิดดาว+เคลื่อนไหว

ทั้งหมดควรเก็บลง localStorage (ตาม store เดิมของแอป) เพื่อคงสถานะข้ามวัน

---

## หมายเหตุ
- โครงสร้าง markup + สไตล์ทั้งหมดดูได้จาก `Konfan.dc.html` (inline styles, ค่าจริงทุกตัว) — Claude Code แปลงเป็น component + Tailwind classes ตาม pattern เดิมของ repo (`components/ui`, `components/mood`, `components/books`, `views`)
- บทกวีทั้ง 5 อารมณ์ (ไทย 3 บรรทัด + อังกฤษ 3 บรรทัด) อยู่ครบใน object `POEMS` ในไฟล์ต้นแบบ
- อย่าเพิ่ม section/copy เกินจากนี้โดยไม่ถาม
