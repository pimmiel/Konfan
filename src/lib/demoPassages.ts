export interface DemoPassage {
  text: string;
  note: string;
  bookTitle: string;
  author: string;
}

export const DEMO_PASSAGES: DemoPassage[] = [
  {
    text: "บางคืนความเงียบไม่ได้ว่างเปล่า มันแค่กำลังฟังเธออยู่",
    note: "อ่านแล้วรู้สึกว่าความเหงาก็เป็นเพื่อนได้",
    bookTitle: "ลมหายใจของราตรี",
    author: "(ตัวอย่าง)",
  },
  {
    text: "เราไม่ได้เก็บหนังสือไว้เพราะอ่านจบ แต่เพราะบางบรรทัดยังอ่านเราอยู่",
    note: "",
    bookTitle: "หน้าที่พับไว้",
    author: "(ตัวอย่าง)",
  },
  {
    text: "โตขึ้นแปลว่าเรียนรู้ที่จะใจดีกับคนที่เราเคยเป็น",
    note: "อยากจำประโยคนี้ไว้ตอนโทษตัวเอง",
    bookTitle: "จดหมายถึงเมื่อวาน",
    author: "(ตัวอย่าง)",
  },
];
