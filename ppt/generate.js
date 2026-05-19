const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AI Agent 簡報";

// ── Palette ──────────────────────────────────────────────
const C = {
  bg:       "0F172A",   // dark navy
  card:     "1E293B",   // card background
  border:   "334155",   // card border
  white:    "F8FAFC",
  muted:    "94A3B8",
  blue:     "38BDF8",   // sky blue accent
  teal:     "2DD4BF",
  amber:    "FCD34D",
  purple:   "C084FC",
  green:    "4ADE80",
  coral:    "FB7185",
};

const FONT = "Calibri";

// ── Helpers ───────────────────────────────────────────────
function makeShadow() {
  return { type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.3 };
}

function addSlideHeader(slide, chapterLabel, title, titleColor = C.white) {
  // Top accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.07,
    fill: { color: C.blue }, line: { color: C.blue }
  });
  if (chapterLabel) {
    slide.addText(chapterLabel, {
      x: 0.5, y: 0.15, w: 9, h: 0.3,
      fontSize: 11, fontFace: FONT, color: C.blue, bold: true,
      charSpacing: 3, margin: 0
    });
  }
  slide.addText(title, {
    x: 0.5, y: 0.48, w: 9, h: 0.65,
    fontSize: 30, fontFace: FONT, color: titleColor, bold: true, margin: 0
  });
  // Separator line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.18, w: 9, h: 0.025,
    fill: { color: C.border }, line: { color: C.border }
  });
}

function addCard(slide, x, y, w, h, accentColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.card },
    line: { color: C.border, width: 1 },
    shadow: makeShadow()
  });
  // Left accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h,
    fill: { color: accentColor }, line: { color: accentColor }
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Top bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: C.blue }, line: { color: C.blue }
  });

  // Decorative right block
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.2, y: 0.08, w: 2.8, h: 5.545,
    fill: { color: "162032" }, line: { color: "162032" }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.2, y: 0.08, w: 0.04, h: 5.545,
    fill: { color: C.blue }, line: { color: C.blue }
  });

  // Tag
  s.addText("AI AGENT SERIES", {
    x: 0.5, y: 1.1, w: 5, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.blue, bold: true,
    charSpacing: 4, margin: 0
  });

  // Title
  s.addText("什麼是 AI Agent？", {
    x: 0.5, y: 1.55, w: 6.5, h: 1.2,
    fontSize: 44, fontFace: FONT, color: C.white, bold: true, margin: 0
  });

  // Subtitle
  s.addText("從 LLM → Prompt → 工具調用 → 自主執行者", {
    x: 0.5, y: 2.85, w: 6.4, h: 0.5,
    fontSize: 16, fontFace: FONT, color: C.muted, margin: 0
  });

  // Chapter pills
  const pills = ["第一章：AI Agent 核心概念", "第二章：agency-agents 實戰"];
  pills.forEach((p, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 3.55 + i * 0.5, w: 4.2, h: 0.35,
      fill: { color: "1E3A5F" }, line: { color: C.blue, width: 1 }
    });
    s.addText(p, {
      x: 0.6, y: 3.55 + i * 0.5, w: 4.1, h: 0.35,
      fontSize: 12, fontFace: FONT, color: C.blue, margin: 0, valign: "middle"
    });
  });

  // Right side decorative text
  s.addText("AGENT\nPLANNING\nMEMORY\nTOOLS", {
    x: 7.4, y: 1.5, w: 2.4, h: 3,
    fontSize: 22, fontFace: FONT, color: "1E3A5F", bold: true,
    align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.8
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 2 — Chatbot vs AI Agent
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addSlideHeader(s, "CHAPTER 1", "Chatbot vs AI Agent：核心差異");

  const cols = [
    {
      title: "💬 Chatbot（問答機器人）",
      color: C.muted,
      points: [
        "被動回應：等待輸入，逐步指令",
        "給一個 Prompt → 得到一個輸出",
        "無法自主規劃多步驟流程",
        "沒有工具調用能力",
        "本質：被動（Reactive）",
      ]
    },
    {
      title: "🤖 AI Agent（自主執行者）",
      color: C.blue,
      points: [
        "主動執行：給予目標自行規劃",
        "拆解任務 → 調用工具 → 反思修正",
        "能操作外部 API、資料庫、瀏覽器",
        "遇到錯誤能自我調整策略",
        "本質：主動（Proactive）",
      ]
    }
  ];

  cols.forEach((col, i) => {
    const x = 0.4 + i * 4.8;
    const w = 4.5;
    // Card background
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.35, w, h: 3.8,
      fill: { color: C.card }, line: { color: col.color, width: i === 1 ? 2 : 1 },
      shadow: makeShadow()
    });
    // Top stripe
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.35, w, h: 0.08,
      fill: { color: col.color }, line: { color: col.color }
    });
    // Title
    s.addText(col.title, {
      x: x + 0.15, y: 1.5, w: w - 0.3, h: 0.5,
      fontSize: 15, fontFace: FONT, color: col.color, bold: true, margin: 0
    });
    // Points
    col.points.forEach((pt, j) => {
      s.addText([{ text: pt, options: {} }], {
        x: x + 0.15, y: 2.1 + j * 0.52, w: w - 0.3, h: 0.45,
        fontSize: 13, fontFace: FONT, color: C.white, margin: 0,
        bullet: { type: "bullet", code: "25B6", color: col.color, size: 70 }
      });
    });
  });

  // Bottom analogy
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.05, w: 9.2, h: 0.46,
    fill: { color: "1E3A5F" }, line: { color: C.blue, width: 1 }
  });
  s.addText("💡  類比：傳統 LLM 像「博學的實習生」，需要你手把手指令；AI Agent 像「配備工具的工程師」，給他目標他自行完成", {
    x: 0.5, y: 5.05, w: 9, h: 0.46,
    fontSize: 11.5, fontFace: FONT, color: C.amber, margin: 0, valign: "middle"
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 3 — AI Agent 四大核心要素
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addSlideHeader(s, "CHAPTER 1", "AI Agent 四大核心要素");

  const items = [
    { icon: "🧠", label: "大腦 (LLM/Core)", color: C.blue,
      desc: "理解語境、意圖識別、決策核心\n負責整合所有資訊並規劃行動" },
    { icon: "📋", label: "規劃 (Planning)", color: C.teal,
      desc: "子任務拆解（Step-by-step 流程）\n反思與自我修正（Reflection / Critique）" },
    { icon: "💾", label: "記憶 (Memory)", color: C.purple,
      desc: "短期：當前 Context 與暫存狀態\n長期：Vector DB / RAG 儲存領域知識" },
    { icon: "🔧", label: "工具箱 (Tools)", color: C.amber,
      desc: "外部 API、Linux Shell、資料庫查詢\nPlaywright 瀏覽器自動化等" },
  ];

  const positions = [
    { x: 0.4, y: 1.38 },
    { x: 5.15, y: 1.38 },
    { x: 0.4, y: 3.3 },
    { x: 5.15, y: 3.3 },
  ];

  items.forEach((item, i) => {
    const { x, y } = positions[i];
    const w = 4.45, h = 1.78;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card }, line: { color: item.color, width: 1 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.07,
      fill: { color: item.color }, line: { color: item.color }
    });
    // Icon circle
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.18, y: y + 0.18, w: 0.55, h: 0.55,
      fill: { color: C.bg }, line: { color: item.color, width: 1.5 }
    });
    s.addText(item.icon, {
      x: x + 0.18, y: y + 0.18, w: 0.55, h: 0.55,
      fontSize: 20, align: "center", valign: "middle", margin: 0
    });
    s.addText(item.label, {
      x: x + 0.84, y: y + 0.2, w: w - 1.0, h: 0.38,
      fontSize: 15, fontFace: FONT, color: item.color, bold: true, margin: 0
    });
    s.addText(item.desc, {
      x: x + 0.18, y: y + 0.7, w: w - 0.36, h: 0.95,
      fontSize: 12.5, fontFace: FONT, color: C.white, margin: 0,
      lineSpacingMultiple: 1.4
    });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 4 — 核心技術模式
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addSlideHeader(s, "CHAPTER 1", "核心技術模式（Design Patterns）");

  // ReAct card
  {
    const x = 0.4, y = 1.38, w = 4.4, h = 3.8;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card }, line: { color: C.teal, width: 2 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.07, fill: { color: C.teal }, line: { color: C.teal }
    });
    s.addText("⚡  ReAct 模式", {
      x: x + 0.18, y: y + 0.15, w: w - 0.36, h: 0.4,
      fontSize: 17, fontFace: FONT, color: C.teal, bold: true, margin: 0
    });
    s.addText("Reason + Act", {
      x: x + 0.18, y: y + 0.58, w: w - 0.36, h: 0.28,
      fontSize: 12, fontFace: FONT, color: C.muted, margin: 0, italic: true
    });
    const steps = [
      { label: "1. Reason",  desc: "大腦思考當前狀態與策略" },
      { label: "2. Act",     desc: "執行工具調用或輸出行動" },
      { label: "3. Observe", desc: "觀察環境反饋與執行結果" },
      { label: "4. Loop",    desc: "重複直到目標完成" },
    ];
    steps.forEach((st, j) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.18, y: y + 1.0 + j * 0.7, w: w - 0.36, h: 0.58,
        fill: { color: "162032" }, line: { color: "334155", width: 1 }
      });
      s.addText(st.label, {
        x: x + 0.28, y: y + 1.04 + j * 0.7, w: 1.3, h: 0.28,
        fontSize: 12, fontFace: FONT, color: C.teal, bold: true, margin: 0
      });
      s.addText(st.desc, {
        x: x + 0.28, y: y + 1.32 + j * 0.7, w: w - 0.6, h: 0.24,
        fontSize: 11, fontFace: FONT, color: C.muted, margin: 0
      });
    });
  }

  // Multi-Agent card
  {
    const x = 5.2, y = 1.38, w = 4.4, h = 3.8;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card }, line: { color: C.purple, width: 2 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.07, fill: { color: C.purple }, line: { color: C.purple }
    });
    s.addText("🤝  Multi-Agent 系統", {
      x: x + 0.18, y: y + 0.15, w: w - 0.36, h: 0.4,
      fontSize: 17, fontFace: FONT, color: C.purple, bold: true, margin: 0
    });
    s.addText("多代理人協作分工", {
      x: x + 0.18, y: y + 0.58, w: w - 0.36, h: 0.28,
      fontSize: 12, fontFace: FONT, color: C.muted, margin: 0, italic: true
    });
    const roles = [
      { name: "Software Architect", task: "定義模塊邊界與資料流", color: C.blue },
      { name: "Code Reviewer",      task: "掃描 PR、檢查安全漏洞", color: C.teal },
      { name: "Security Engineer",  task: "OWASP 漏洞挖掘防禦", color: C.coral },
      { name: "Test Engineer",      task: "自動生成 E2E 測試腳本", color: C.amber },
    ];
    roles.forEach((r, j) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.18, y: y + 1.0 + j * 0.7, w: w - 0.36, h: 0.58,
        fill: { color: "162032" }, line: { color: r.color, width: 1 }
      });
      s.addText(r.name, {
        x: x + 0.28, y: y + 1.04 + j * 0.7, w: w - 0.6, h: 0.26,
        fontSize: 11.5, fontFace: FONT, color: r.color, bold: true, margin: 0
      });
      s.addText(r.task, {
        x: x + 0.28, y: y + 1.3 + j * 0.7, w: w - 0.6, h: 0.24,
        fontSize: 11, fontFace: FONT, color: C.muted, margin: 0
      });
    });
  }
}

// ════════════════════════════════════════════════════════
// SLIDE 5 — Chapter 2 Intro: agency-agents
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: C.green }, line: { color: C.green }
  });

  s.addText("CHAPTER  2", {
    x: 0.5, y: 0.25, w: 9, h: 0.4,
    fontSize: 11, fontFace: FONT, color: C.green, bold: true,
    charSpacing: 4, margin: 0
  });

  s.addText("GitHub AI Agent 介紹", {
    x: 0.5, y: 0.75, w: 9, h: 0.9,
    fontSize: 40, fontFace: FONT, color: C.white, bold: true, margin: 0
  });

  s.addText("agency-agents  ·  msitarzewski", {
    x: 0.5, y: 1.72, w: 9, h: 0.38,
    fontSize: 15, fontFace: FONT, color: C.green, margin: 0
  });

  // 4 pillars
  const pillars = [
    { icon: "🎯", label: "專業化",   sub: "Specialized",        desc: "100+ 個領域專業代理人" },
    { icon: "🧩", label: "性格驅動", sub: "Personality-Driven",  desc: "獨特口吻與思考邏輯" },
    { icon: "📦", label: "成果導向", sub: "Deliverable-Focused", desc: "產出代碼、策略或文件" },
    { icon: "🚀", label: "即戰力",   sub: "Production-Ready",    desc: "內建工作流與成功指標" },
  ];

  pillars.forEach((p, i) => {
    const x = 0.4 + i * 2.32, y = 2.55, w = 2.15, h = 2.75;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card }, line: { color: C.border },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.07,
      fill: { color: C.green }, line: { color: C.green }
    });
    s.addText(p.icon, {
      x, y: y + 0.2, w, h: 0.55,
      fontSize: 28, align: "center", valign: "middle", margin: 0
    });
    s.addText(p.label, {
      x: x + 0.1, y: y + 0.83, w: w - 0.2, h: 0.38,
      fontSize: 14, fontFace: FONT, color: C.white, bold: true,
      align: "center", margin: 0
    });
    s.addText(p.sub, {
      x: x + 0.1, y: y + 1.22, w: w - 0.2, h: 0.28,
      fontSize: 10, fontFace: FONT, color: C.green,
      align: "center", margin: 0, italic: true
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.15, y: y + 1.55, w: w - 0.3, h: 0.025,
      fill: { color: C.border }, line: { color: C.border }
    });
    s.addText(p.desc, {
      x: x + 0.1, y: y + 1.65, w: w - 0.2, h: 0.7,
      fontSize: 11, fontFace: FONT, color: C.muted,
      align: "center", margin: 0, lineSpacingMultiple: 1.3
    });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 6 — 為什麼算是 AI Agent？（4個原因）
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addSlideHeader(s, "CHAPTER 2", "為什麼它算是 AI Agent？");

  const reasons = [
    { num: "01", color: C.blue,
      title: "轉變思維：問答 → 自主規劃",
      desc: "Profile 內含 Workflow 與 Critical Rules，LLM 讀取後會啟動多步驟思考，主動規劃「第一步→第二步→第三步」，而非字面回答。" },
    { num: "02", color: C.teal,
      title: "定義環境邊界與工具（Tools）",
      desc: "透過 convert.sh 注入 Cursor / Claude Code 後，LLM 獲得讀寫代碼庫的「行動能力」，成為完整的工具箱 Agent。" },
    { num: "03", color: C.purple,
      title: "動態反思（Reflection）機制",
      desc: "每個 Agent 有 Success Metrics，輸出前後會對照指標進行自我審查（Self-Correction），而非一次性輸出結果。" },
    { num: "04", color: C.amber,
      title: "多代理協同（Multi-Agent System）",
      desc: "100+ 個 Agent 共享標準化接口：Architect 輸出的 Spec 成為 Developer 的輸入，形成跨 Agent 的協作鏈。" },
  ];

  reasons.forEach((r, i) => {
    const row = Math.floor(i / 2), col = i % 2;
    const x = 0.4 + col * 4.75, y = 1.35 + row * 2.0;
    const w = 4.5, h = 1.82;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card }, line: { color: r.color, width: 1 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.06, h,
      fill: { color: r.color }, line: { color: r.color }
    });
    s.addText(r.num, {
      x: x + 0.18, y: y + 0.12, w: 0.55, h: 0.4,
      fontSize: 22, fontFace: FONT, color: r.color, bold: true, margin: 0
    });
    s.addText(r.title, {
      x: x + 0.8, y: y + 0.12, w: w - 1.0, h: 0.42,
      fontSize: 13.5, fontFace: FONT, color: C.white, bold: true, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.18, y: y + 0.6, w: w - 0.36, h: 0.018,
      fill: { color: C.border }, line: { color: C.border }
    });
    s.addText(r.desc, {
      x: x + 0.18, y: y + 0.68, w: w - 0.36, h: 1.0,
      fontSize: 11.5, fontFace: FONT, color: C.muted, margin: 0,
      lineSpacingMultiple: 1.35
    });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 7 — 5 個最有趣的 Agent
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addSlideHeader(s, "CHAPTER 2", "5 個最有趣的 Agents");

  const agents = [
    { icon: "😈", name: "惡魔代言人", en: "Devil's Advocate",
      color: C.coral,
      desc: "唯一任務就是「反駁你」——找出方案中所有沒想到的漏洞、風險與盲點，是避免集體盲思的神器。" },
    { icon: "🛡️", name: "品牌守護者", en: "Brand Guardian",
      color: C.blue,
      desc: "偏執狂級別的品牌總監，用放大鏡檢查所有內容的視覺、語氣是否符合品牌設定。" },
    { icon: "🦄", name: "Reddit 大師", en: "Reddit Guru",
      color: C.amber,
      desc: "精通各 Subreddit 潛規則，把產品宣傳包裝成看起來像路人分享的爆款文章。" },
    { icon: "💀", name: "程式碼死神", en: "Code Grim Reaper",
      color: C.purple,
      desc: "座右銘「沒有程式碼是最好的程式碼」，瘋狂刪除冗餘代碼，讓你的專案行數少一大半。" },
    { icon: "💰", name: "簡報黑客", en: "Pitch Deck Hacker",
      color: C.green,
      desc: "專為新創融資設計，把複雜技術翻譯成 VC 聽得懂且興奮的商業故事，用 10 張投影片拿到錢。" },
  ];

  agents.forEach((a, i) => {
    const x = 0.4 + i * 1.84;
    const y = 1.35;
    const w = 1.72, h = 3.85;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card }, line: { color: a.color, width: 1 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.07,
      fill: { color: a.color }, line: { color: a.color }
    });
    s.addText(a.icon, {
      x, y: y + 0.15, w, h: 0.6,
      fontSize: 30, align: "center", margin: 0
    });
    s.addText(a.name, {
      x: x + 0.08, y: y + 0.83, w: w - 0.16, h: 0.42,
      fontSize: 12.5, fontFace: FONT, color: a.color, bold: true,
      align: "center", margin: 0
    });
    s.addText(a.en, {
      x: x + 0.08, y: y + 1.27, w: w - 0.16, h: 0.28,
      fontSize: 9.5, fontFace: FONT, color: C.muted,
      align: "center", margin: 0, italic: true
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.12, y: y + 1.62, w: w - 0.24, h: 0.02,
      fill: { color: C.border }, line: { color: C.border }
    });
    s.addText(a.desc, {
      x: x + 0.1, y: y + 1.72, w: w - 0.2, h: 1.98,
      fontSize: 11, fontFace: FONT, color: C.white, margin: 0,
      lineSpacingMultiple: 1.3, align: "left"
    });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 8 — 對工程師有用的 Agents
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addSlideHeader(s, "CHAPTER 2", "對工程師最有即戰力的 Agents");

  const agents = [
    { icon: "🏛️", name: "Software Architect", color: C.blue,
      desc: "定義模塊邊界、資料流向、技術選型，輸出可供其他 Agent 使用的 Spec 文件" },
    { icon: "🔍", name: "Code Reviewer",       color: C.teal,
      desc: "掃描 PR Diff，抓記憶體洩漏、Async 邊界條件漏洞與違反 SOLID 原則的代碼" },
    { icon: "🔐", name: "Security Engineer",   color: C.coral,
      desc: "檢查 OWASP Top 10、XSS、SQL 注入及套件依賴安全風險" },
    { icon: "🧪", name: "Test Engineer",       color: C.purple,
      desc: "自動生成 Unit Test 及 Playwright E2E 測試，涵蓋 Happy Path 與 Edge Cases" },
    { icon: "⚙️", name: "DevOps Specialist",   color: C.amber,
      desc: "優化 Dockerfile、撰寫 GitHub Actions CI/CD Pipeline、確保 headless 環境依賴正確安裝" },
  ];

  agents.forEach((a, i) => {
    const y = 1.38 + i * 0.84;
    const h = 0.78;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 9.2, h,
      fill: { color: C.card }, line: { color: C.border },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 0.06, h,
      fill: { color: a.color }, line: { color: a.color }
    });
    // Number badge
    s.addShape(pres.shapes.OVAL, {
      x: 0.58, y: y + 0.16, w: 0.44, h: 0.44,
      fill: { color: a.color }, line: { color: a.color }
    });
    s.addText(String(i + 1), {
      x: 0.58, y: y + 0.16, w: 0.44, h: 0.44,
      fontSize: 13, fontFace: FONT, color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    s.addText(a.icon + "  " + a.name, {
      x: 1.15, y: y + 0.08, w: 3.2, h: 0.35,
      fontSize: 14, fontFace: FONT, color: a.color, bold: true, margin: 0
    });
    s.addText(a.desc, {
      x: 1.15, y: y + 0.44, w: 8.2, h: 0.3,
      fontSize: 11.5, fontFace: FONT, color: C.muted, margin: 0
    });
    // Separator vertical
    s.addShape(pres.shapes.RECTANGLE, {
      x: 4.42, y: y + 0.1, w: 0.02, h: h - 0.2,
      fill: { color: C.border }, line: { color: C.border }
    });
    s.addText("即戰力 ★★★★★", {
      x: 4.58, y: y + 0.22, w: 2.2, h: 0.35,
      fontSize: 11, fontFace: FONT, color: C.amber, margin: 0
    });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 9 — Multi-Agent 四大痛點
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addSlideHeader(s, "CHAPTER 2", "Multi-Agent 為何效果不好？（4 大痛點）");

  const pains = [
    { num: "痛點 1", color: C.coral,
      problem: "上下文污染（Context Pollution）",
      fix: "串聯 / 星狀架構：每個 Agent 只讀與當下任務絕對相關的 Context，輸出固化為靜態 Spec" },
    { num: "痛點 2", color: C.amber,
      problem: "職責模糊：過度擬人化",
      fix: "用 I/O Schema 取代性格描述：輸出必須是標準 JSON，包含 status / vulnerabilities / suggestions" },
    { num: "痛點 3", color: C.purple,
      problem: "缺乏客觀真相（Ground Truth）",
      fix: "引入自動化 Tooling 作為裁判：自動執行 npm test / pytest，用 Terminal 錯誤直接餵回 Agent" },
    { num: "痛點 4", color: C.blue,
      problem: "動態路由失控（無窮迴圈）",
      fix: "退回靜態工作流（Deterministic Workflow）：用 Python/Node.js 硬編碼流程，失敗最多重試 3 次再 Human-in-the-loop" },
  ];

  pains.forEach((p, i) => {
    const y = 1.35 + i * 1.05;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 9.2, h: 0.9,
      fill: { color: C.card }, line: { color: C.border },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 0.06, h: 0.9,
      fill: { color: p.color }, line: { color: p.color }
    });
    s.addText(p.num, {
      x: 0.6, y: y + 0.08, w: 1.1, h: 0.3,
      fontSize: 11, fontFace: FONT, color: p.color, bold: true,
      charSpacing: 1, margin: 0
    });
    s.addText("❌  " + p.problem, {
      x: 0.6, y: y + 0.08, w: 4.2, h: 0.35,
      fontSize: 13, fontFace: FONT, color: C.white, bold: true, margin: 0
    });
    s.addText("✅  " + p.fix, {
      x: 0.6, y: y + 0.48, w: 8.7, h: 0.36,
      fontSize: 11.5, fontFace: FONT, color: C.muted, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 4.85, y: y + 0.12, w: 0.02, h: 0.65,
      fill: { color: C.border }, line: { color: C.border }
    });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 10 — AI Agent 落地場景
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addSlideHeader(s, "CHAPTER 1 + 2", "AI Agent 能為團隊解決什麼問題？");

  const cases = [
    { icon: "⚙️", title: "研發與運維自動化", color: C.blue,
      items: [
        "自動掃描 PR、檢查資安漏洞、提出效能重構建議",
        "Agent + Playwright：UI 變更時 Agent 自主修正定位點",
        "根據規格書自動產生測試案例與 API 文件",
      ] },
    { icon: "📚", title: "企業內部知識管理", color: C.teal,
      items: [
        "Enterprise RAG + Agent：不只回答問題，更能主動執行",
        "根據內部 SOP 自動生成 Checklist 與合規文件",
        "跨部門知識庫整合與自動摘要報告",
      ] },
    { icon: "📊", title: "資料分析與報表自動化", color: C.purple,
      items: [
        "給予自然語言指令，Agent 自行撰寫 SQL 撈取資料",
        "自動用 Python 繪製圖表並產出分析報告",
        "分層治理：大模型決策規劃 + 小模型執行常規任務",
      ] },
  ];

  cases.forEach((c, i) => {
    const x = 0.4 + i * 3.1;
    const w = 2.95, y = 1.38, h = 3.85;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card }, line: { color: c.color, width: 1 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.07,
      fill: { color: c.color }, line: { color: c.color }
    });
    s.addText(c.icon, {
      x, y: y + 0.12, w, h: 0.5,
      fontSize: 26, align: "center", margin: 0
    });
    s.addText(c.title, {
      x: x + 0.12, y: y + 0.7, w: w - 0.24, h: 0.45,
      fontSize: 14, fontFace: FONT, color: c.color, bold: true,
      align: "center", margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.15, y: y + 1.22, w: w - 0.3, h: 0.02,
      fill: { color: C.border }, line: { color: C.border }
    });
    c.items.forEach((item, j) => {
      s.addText([{ text: item, options: {} }], {
        x: x + 0.15, y: y + 1.35 + j * 0.82, w: w - 0.3, h: 0.75,
        fontSize: 11.5, fontFace: FONT, color: C.white, margin: 0,
        bullet: { type: "bullet", code: "25B6", color: c.color, size: 70 },
        lineSpacingMultiple: 1.25
      });
    });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 11 — QA 準備
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addSlideHeader(s, "Q&A PREP", "面對提問的預備答案");

  const qas = [
    { q: "Q1：幻覺（Hallucination）與失控問題怎麼辦？",
      color: C.coral,
      a: "強調 Human-in-the-Loop（HITL）：在關鍵節點（部署到 Production、敏感 API、財務操作）設立 Approval Gate。Agent 負責前 80% 繁瑣工作，人類負責最後 20% 把關。" },
    { q: "Q2：Token 成本與 Latency 會不會太高？",
      color: C.amber,
      a: "分層治理策略：複雜決策規劃用大模型（Gemini Pro / GPT-4），常規工具執行、語意判斷調用輕量小模型（Gemini Flash），在效果與成本之間取得平衡。" },
    { q: "Q3：這會取代工程師嗎？",
      color: C.green,
      a: "不會，反而能解放我們。Agent 處理重複性高的 Toil，工程師角色從 Coder 轉變為 Agent Conductor，負責定義 Tooling、制定規範與審視結果。" },
  ];

  qas.forEach((qa, i) => {
    const y = 1.38 + i * 1.38;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 9.2, h: 1.22,
      fill: { color: C.card }, line: { color: qa.color, width: 1 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 0.06, h: 1.22,
      fill: { color: qa.color }, line: { color: qa.color }
    });
    s.addText(qa.q, {
      x: 0.6, y: y + 0.1, w: 8.8, h: 0.38,
      fontSize: 13.5, fontFace: FONT, color: qa.color, bold: true, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: y + 0.52, w: 8.8, h: 0.02,
      fill: { color: C.border }, line: { color: C.border }
    });
    s.addText("→  " + qa.a, {
      x: 0.6, y: y + 0.6, w: 8.8, h: 0.55,
      fontSize: 12, fontFace: FONT, color: C.white, margin: 0,
      lineSpacingMultiple: 1.3
    });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 12 — Action Plan
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addSlideHeader(s, "ACTION PLAN", "行動建議：從 POC 到落地");

  // Timeline steps
  const steps = [
    { num: "01", label: "定義低風險高頻率痛點", color: C.blue,
      desc: "選擇「自動化代碼審查與優化小隊」作為 POC，從內部專案開始降低風險" },
    { num: "02", label: "組建 Agent 團隊", color: C.teal,
      desc: "一個 Agent 負責掃漏洞（Security），一個負責看 Code Style（Reviewer）" },
    { num: "03", label: "實驗環境跑兩週", color: C.purple,
      desc: "評估幫助資深人員省下多少 Review 時間，收集量化指標" },
    { num: "04", label: "評估結果，決定擴大", color: C.amber,
      desc: "根據 POC 數據，決定是否引入 Test Engineer、DevOps Specialist 等更多 Agent" },
  ];

  // Arrow connector line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.32, y: 3.0, w: 7.4, h: 0.04,
    fill: { color: C.border }, line: { color: C.border }
  });

  steps.forEach((st, i) => {
    const x = 0.4 + i * 2.3;
    // Circle
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.52, y: 2.73, w: 0.56, h: 0.56,
      fill: { color: st.color }, line: { color: st.color }
    });
    s.addText(st.num, {
      x: x + 0.52, y: 2.73, w: 0.56, h: 0.56,
      fontSize: 12, fontFace: FONT, color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    // Card below
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.38, w: 2.15, h: 1.9,
      fill: { color: C.card }, line: { color: st.color, width: 1 },
      shadow: makeShadow()
    });
    s.addText(st.label, {
      x: x + 0.1, y: 3.44, w: 1.95, h: 0.45,
      fontSize: 12, fontFace: FONT, color: st.color, bold: true,
      margin: 0, lineSpacingMultiple: 1.2
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.1, y: 3.93, w: 1.95, h: 0.02,
      fill: { color: C.border }, line: { color: C.border }
    });
    s.addText(st.desc, {
      x: x + 0.1, y: 4.0, w: 1.95, h: 1.2,
      fontSize: 11, fontFace: FONT, color: C.muted, margin: 0,
      lineSpacingMultiple: 1.3
    });
  });

  // Top tip box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.38, w: 9.2, h: 1.15,
    fill: { color: "1E3A5F" }, line: { color: C.blue, width: 1 }
  });
  s.addText("💡  推薦起點", {
    x: 0.6, y: 1.45, w: 2, h: 0.32,
    fontSize: 13, fontFace: FONT, color: C.blue, bold: true, margin: 0
  });
  s.addText("建議先從一個低風險、高頻率的內部痛點出發——建立「自動化代碼審查與優化小隊」。利用 agency-agents 框架，在實驗環境跑兩週，評估能幫資深人員省下多少 Review 時間，再決定是否擴大應用。技術高度 ✓  實務可行性 ✓", {
    x: 0.6, y: 1.8, w: 8.8, h: 0.65,
    fontSize: 12, fontFace: FONT, color: C.white, margin: 0,
    lineSpacingMultiple: 1.3
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 13 — Closing
// ════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: "060D1A" };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: C.blue }, line: { color: C.blue }
  });

  s.addText("THANK YOU", {
    x: 0.5, y: 1.2, w: 9, h: 1.1,
    fontSize: 52, fontFace: FONT, color: C.white, bold: true,
    align: "center", margin: 0, charSpacing: 6
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: 2.4, w: 5, h: 0.04,
    fill: { color: C.blue }, line: { color: C.blue }
  });

  s.addText("AI Agent 不是遙遠的未來，是現在就能落地的工程工具", {
    x: 0.5, y: 2.6, w: 9, h: 0.5,
    fontSize: 15, fontFace: FONT, color: C.muted,
    align: "center", margin: 0, italic: true
  });

  const topics = ["什麼是 AI Agent", "agency-agents 實戰", "Multi-Agent 陷阱", "POC 行動計劃"];
  topics.forEach((t, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.9 + i * 2.1, y: 3.4, w: 1.85, h: 0.5,
      fill: { color: C.card }, line: { color: C.border }
    });
    s.addText(t, {
      x: 0.9 + i * 2.1, y: 3.4, w: 1.85, h: 0.5,
      fontSize: 11, fontFace: FONT, color: C.muted,
      align: "center", valign: "middle", margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.2, w: 10, h: 0.425,
    fill: { color: C.card }, line: { color: C.card }
  });
  s.addText("github.com/msitarzewski/agency-agents", {
    x: 0, y: 5.2, w: 10, h: 0.425,
    fontSize: 12, fontFace: FONT, color: C.muted,
    align: "center", valign: "middle", margin: 0
  });
}

// ════════════════════════════════════════════════════════
// Write file
// ════════════════════════════════════════════════════════
pres.writeFile({ fileName: "AI_Agent_簡報.pptx" })
  .then(() => console.log("✅  AI_Agent_簡報.pptx generated successfully"))
  .catch(err => { console.error(err); process.exit(1); });
