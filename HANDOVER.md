# ก่อนฝัน (Kònfăn) — Handover สำหรับ Claude Code

> เอกสารนี้คือ brief ให้ Claude Code ทำงานต่อ อ่านทั้งไฟล์ก่อนเริ่มลงมือ
> โฟลเดอร์นี้มี **scaffold ที่ build ผ่านแล้ว** อยู่ — อย่าสร้างใหม่ทับ ให้ต่อยอดจากของเดิม

---

## 0. North Star (เข็มทิศตัดสินใจ)

แอปคู่ใจ **"ก่อนนอน"** ที่ทำ 3 อย่าง: เก็บหนังสือที่กำลังอ่าน → เช็คอินอารมณ์แล้วได้บทกวีสั้นที่เข้ากับอารมณ์ → ให้ AI เขียน reflection อุ่นๆ ปิดท้ายวัน

**กฎข้อเดียวที่ตัดสินทุกอย่าง:** เปิดแอปแล้วต้องรู้สึก *สงบ* ถ้าฟีเจอร์ไหนทำให้รู้สึกเหมือน productivity app หรือ social feed → ตัดทิ้ง ความเงียบ ความช้า ความอบอุ่น คือฟีเจอร์

**Persona:** คนที่อยากมี ritual เล็กๆ ก่อนนอน แทนการ scroll มือถือ ใช้คนเดียว ส่วนตัว ไม่มี social

---

## 1. สิ่งที่ scaffold ไว้แล้ว (อย่าทำซ้ำ)

Stack: **Vite + React 18 + TypeScript + Tailwind + Framer Motion + Zustand**
รันได้เลย: `npm install && npm run dev` — build ผ่าน (`npm run build`) ทดสอบแล้ว

พร้อมใช้แล้ว:
- **Design tokens ครบ** — `tailwind.config.js` + `src/index.css` (โหมด dusk + bedtime สลับด้วย class `.dark`)
- **Type models** — `src/types/index.ts` (Book, Mood, Poem, MoodEntry) = single source of truth
- **ข้อมูลบทกวี** — `src/lib/poems.ts` (บทกวี**ต้นฉบับ** + logic จับคู่อารมณ์)
- **Storage layer** — `src/lib/storage.ts` (localStorage type-safe)
- **Stores** — `src/store/useBookStore.ts`, `useMoodStore.ts` (มี streak logic)
- **UI primitives** — `src/components/ui/` (Button, Card, Typography) ← *เมล็ดพันธุ์ของ Design System อนาคต*
- **Signature interaction ที่ทำงานได้จริง** — `MoodPicker` + `PoemCard` + `App.tsx` (หน้า Tonight + bedtime toggle + ambient tint)

**หน้าที่ของนายคือ build ส่วนที่เหลือรอบๆ นี้ ตาม pattern เดิม**

---

## 2. Design System (ยึดตามนี้เป๊ะ ห้าม improvise สี/ฟอนต์)

**คอนเซ็ปต์:** cottagecore ยามพลบค่ำ / แสงเทียนก่อนนอน — ไม่ใช่ cottagecore สว่างกลางวัน

**พาเลตต์** (เรียกผ่าน Tailwind semantic tokens เท่านั้น อย่า hardcode hex ใน component):
- `paper` / `surface` / `ink` / `muted` / `line` — ผูกกับ CSS var สลับตามโหมด
- `honey` (#E0A458 แสงเทียน = accent หลัก **ไม่ใช่ terracotta**), `sage` (#8B9D83), `plum` (#3B2E3A ทไวไลต์ / #2A2231 ก่อนนอน), `rose` (#C99BA0)

**ฟอนต์:**
- `font-display` = Fraunces (หัวเรื่อง + บทกวี — ตัว serif วรรณกรรมนุ่มๆ)
- `font-sans` = Instrument Sans + Noto Sans Thai (body + UI)
- บทกวี/reflection ใช้ class `.prose-poem`

**รูปทรง & เงา:** มุมโค้งนุ่ม (`rounded-card` 18px), เงาแบบ candle-glow ฟุ้ง (`shadow-glow`) ห้ามเงา drop shadow แข็งๆ

**Motion:** easing `ease-calm` = cubic-bezier(0.22,1,0.36,1) ช้า นุ่ม เคารพ `prefers-reduced-motion` (ตั้ง global ไว้แล้วใน index.css)

**Signature element:** MoodPicker ที่เลือกอารมณ์แล้ว **ทั้งหน้าอุ่นขึ้นตาม tint ของอารมณ์** — นี่คือสิ่งที่คนจะจำแอปได้ อย่าทำให้มันจืด

**Quality floor (ต้องมีทุกหน้า):** responsive ถึงมือถือ, focus-visible ชัด (ตั้งไว้แล้ว), keyboard ใช้ได้, reduced-motion ทำงาน

---

## 3. Feature Spec

### MVP — เป้าหมาย: เสร็จ + deploy ได้ (ส่วนใหญ่มีแล้ว เหลือฝั่งหนังสือ)
- [x] เช็คอินอารมณ์ (5 อารมณ์) → ได้บทกวีจาก JSON
- [x] Bedtime mode (หรี่จอ + เปลี่ยนธีม) + persist
- [x] Ambient tint ตามอารมณ์
- [ ] **หน้า Library:** เพิ่ม/ดู/ลบหนังสือที่กำลังอ่าน (ชื่อ, ผู้เขียน, หน้าปัจจุบัน/หน้าทั้งหมด)
- [ ] **BookCard** + แถบความคืบหน้าการอ่าน + ปุ่ม "อ่านจบแล้ว"
- [ ] **AddBookForm** (โมดัล — ใช้ Card + Button; **ห้ามใช้ `<form>` tag ถ้าจะย้ายไป artifact ทีหลัง** ใช้ onClick handler)
- [ ] **Navigation** ระหว่าง Tonight ↔ Library (bottom nav บนมือถือ, side บน desktop)
- [ ] เชื่อมหนังสือที่อ่านอยู่เข้ากับหน้า Tonight (โชว์ "กำลังอ่าน...")

### v2 — ความว้าว
- [ ] **AI reflection ผ่าน Claude API** (ดูสเปค section 5 — **ต้องมี serverless proxy เท่านั้น**)
- [ ] History / log การเช็คอินย้อนหลัง
- [ ] **Moon-phase streak indicator** — ใช้ `useMoodStore.streak()` ที่มีอยู่แล้ว วาดพระจันทร์ตามจำนวนวันติดกัน
- [ ] Bedtime mode แบบ full: timer + fade จอลงเรื่อยๆ

### Nice-to-have (ทำเมื่อว่าง)
- [ ] ดึงปกหนังสืออัตโนมัติจาก **Open Library Covers API** (`https://covers.openlibrary.org`) — fallback เป็น placeholder ทอลาย
- [ ] สถิติการอ่านเป็นกราฟ (แนะนำ recharts)
- [ ] เสียง ambient (ฝน/เตาผิง) — ต้องมีปุ่มปิด default เงียบ
- [ ] PWA (installable + offline) — vite-plugin-pwa
- [ ] สลับภาษา ไทย↔อังกฤษ (i18n) — โชว์สกิลได้ดี เพราะบทกวีมีสองภาษาอยู่แล้ว
- [ ] Cloud sync + auth ด้วย Supabase (ทำหลังสุด)

---

## 4. File Architecture (ต่อจากของที่มี)

```
src/
  types/index.ts          ✅ มีแล้ว
  lib/
    storage.ts            ✅  poems.ts ✅
    claude.ts             ⬜ client เรียก /api/reflect (section 5)
    covers.ts             ⬜ Open Library helper (nice-to-have)
  store/
    useBookStore.ts       ✅  useMoodStore.ts ✅
  hooks/
    useReflection.ts      ⬜ เรียก claude.ts + loading/error state
  components/
    ui/                   ✅ Button, Card, Typography — เพิ่ม Input, Modal, ProgressBar ที่นี่
    layout/  AppShell.tsx ⬜  Nav.tsx ⬜
    books/   BookList.tsx ⬜  BookCard.tsx ⬜  AddBookForm.tsx ⬜  ReadingProgress.tsx ⬜
    mood/    MoodPicker.tsx ✅  PoemCard.tsx ✅
    reflection/ ReflectionCard.tsx ⬜
    bedtime/ BedtimeMode.tsx ⬜
  views/  TonightView.tsx ⬜ (แยก logic ออกจาก App.tsx)  LibraryView.tsx ⬜
api/
  reflect.ts              ⬜ Vercel serverless function (section 5)
```

**Convention:** primitive ที่ reusable → `ui/`, ผูกกับ feature → โฟลเดอร์ feature นั้น เพราะ `ui/` คือของที่จะสกัดไปทำ Design System แยกทีหลัง (ดู section 7)

---

## 5. Claude API — serverless proxy (สำคัญเรื่อง security)

**ห้ามเรียก Claude API ตรงจาก frontend เด็ดขาด** เพราะ API key จะหลุดใน bundle ต้องมี serverless function คั่นเสมอ

`api/reflect.ts` (Vercel Function):
- รับ POST `{ mood, poemLines, currentBook? }`
- อ่าน `process.env.ANTHROPIC_API_KEY` (ตั้งใน Vercel env ไม่ commit)
- เรียก Anthropic `/v1/messages`, model `claude-sonnet-4-6`, max_tokens ~200
- system prompt: "เธอคือเพื่อนอ่อนโยนที่ช่วยปิดวัน เขียน reflection สั้น 2-3 ประโยค ภาษาอบอุ่น ไม่สั่งสอน ไม่ให้คำแนะนำเชิง productivity ตอบภาษาเดียวกับ input"
- ส่งกลับเฉพาะ text ที่ parse แล้ว (filter block `type === "text"`)
- ใส่ try/catch — ถ้า fail ให้ frontend โชว์ข้อความนุ่มๆ ("คืนนี้ขอเงียบสักหน่อยนะ") ไม่ใช่ error แดงๆ

`src/lib/claude.ts` ฝั่ง client: fetch `/api/reflect` เท่านั้น ไม่มี key ใดๆ

> อย่าลืม: จุดนี้เอาไปเล่าตอนสัมภาษณ์ได้ — "แยก proxy กัน key หลุด" คือ signal ว่าเข้าใจ security

---

## 6. ลำดับลงมือ (ทำตามนี้ อย่าข้ามไปทำ AI ก่อน)

1. **แยก `App.tsx` → `TonightView` + `AppShell`** วาง navigation (Tonight / Library)
2. **เพิ่ม ui primitives ที่ขาด:** `Input`, `Modal`, `ProgressBar` (ตาม pattern Button/Card)
3. **ฝั่งหนังสือ:** `AddBookForm` → `BookCard` → `BookList` → `LibraryView` (ต่อ `useBookStore` ที่มีแล้ว)
4. **เชื่อมหนังสือเข้าหน้า Tonight** — MVP สมบูรณ์ตรงนี้
5. **Deploy Vercel** ให้ live ก่อน (ยังไม่ต้องมี AI)
6. **ต่อ Claude API** ผ่าน proxy (section 5) → `ReflectionCard` + `useReflection`
7. **Moon-phase streak** แล้วค่อยหยิบ nice-to-have

**กฎเหล็ก:** อย่าแตะ AI จนกว่าจะถึงข้อ 6 คนติดหล่มตรงนี้แล้วโปรเจคไม่เสร็จ ทำ MVP ให้ deploy ได้ก่อน

---

## 7. เส้นทางอนาคต — สกัดเป็น Design System

`src/components/ui/` ถูกออกแบบให้แยกออกไปเป็น package ต่างหากได้ทีหลัง (โปรเจค Design System ที่คุยกันไว้) ตอนสร้าง primitive:
- อย่าให้ import อะไรจาก feature หรือ store (ต้องเป็นอิสระ)
- รับค่าผ่าน props เท่านั้น สีอ่านจาก token
- เขียนให้ประกอบง่าย (composable)
ทำแบบนี้แล้ววันหน้า `cp -r src/components/ui` ออกไปตั้งเป็น library + Storybook + publish npm ได้เลย

---

## 8. Guardrails (ห้ามพลาด)

- **ลิขสิทธิ์:** บทกวีใน `poems.ts` เป็น**ต้นฉบับทั้งหมด** ห้ามเอาบทกวีของกวีจริง (Rupi Kaur, Atticus ฯลฯ) มาใส่ในโค้ด เขียนใหม่เองหรือให้ AI แต่งสด
- **API key:** ไม่มี key ใน frontend/repo เด็ดขาด (section 5)
- **ไม่มี browser storage ใน artifact:** ถ้าย้ายไป Claude artifact ทีหลัง ห้าม localStorage — ตอนนี้อยู่ใน Vite standalone จึงใช้ได้
- **a11y & reduced-motion:** รักษา quality floor ทุกหน้า
- **โทน copy:** ภาษาอ่อนโยน สั้น ไม่สั่งสอน error ก็ต้องนุ่ม ("เก็บไว้ก่อนนะ" ไม่ใช่ "Error 500")

---

## 9. วิธีรัน

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # ตรวจ type + build production
```

Deploy: push ขึ้น GitHub → import ใน Vercel → ตั้ง env `ANTHROPIC_API_KEY` (เฉพาะตอนถึง v2)
