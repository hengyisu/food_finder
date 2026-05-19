const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AI Agent 完整指南";

const C = {
  bg: "0F172A", card: "1E293B", border: "334155",
  white: "F8FAFC", muted: "94A3B8",
  blue: "38BDF8", teal: "2DD4BF", amber: "FCD34D",
  purple: "C084FC", green: "4ADE80", coral: "FB7185",
};
const FONT = "Calibri";

function shadow() {
  return { type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.3 };
}

function header(s, chap, title, ac) {
  ac = ac || C.blue;
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.07, fill:{color:ac}, line:{color:ac} });
  if (chap) s.addText(chap, { x:0.5, y:0.15, w:9, h:0.3, fontSize:11, fontFace:FONT, color:ac, bold:true, charSpacing:3, margin:0 });
  s.addText(title, { x:0.5, y:0.48, w:9, h:0.65, fontSize:29, fontFace:FONT, color:C.white, bold:true, margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.18, w:9, h:0.025, fill:{color:C.border}, line:{color:C.border} });
}

function chIntro(s, num, title, sub, ac) {
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.08, fill:{color:ac}, line:{color:ac} });
  s.addText("CHAPTER  " + num, { x:0.5, y:0.25, w:9, h:0.4, fontSize:11, fontFace:FONT, color:ac, bold:true, charSpacing:4, margin:0 });
  s.addText(title, { x:0.5, y:0.75, w:9, h:0.9, fontSize:40, fontFace:FONT, color:C.white, bold:true, margin:0 });
  if (sub) s.addText(sub, { x:0.5, y:1.72, w:9, h:0.38, fontSize:15, fontFace:FONT, color:ac, margin:0 });
}

function leftBar(s, x, y, h, color) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w:0.06, h, fill:{color}, line:{color} });
}

function card(s, x, y, w, h, borderColor, bgColor) {
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: bgColor || C.card },
    line: { color: borderColor || C.border, width: 1 },
    shadow: shadow()
  });
}

function topBar(s, x, y, w, color) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h:0.07, fill:{color}, line:{color} });
}

// ══════════════════════════════════════════════════
// SLIDE 1 — Title
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.08, fill:{color:C.blue}, line:{color:C.blue} });
  s.addShape(pres.shapes.RECTANGLE, { x:7.2, y:0.08, w:2.8, h:5.545, fill:{color:"162032"}, line:{color:"162032"} });
  s.addShape(pres.shapes.RECTANGLE, { x:7.2, y:0.08, w:0.04, h:5.545, fill:{color:C.blue}, line:{color:C.blue} });
  s.addText("AI AGENT SERIES", { x:0.5, y:1.0, w:5, h:0.35, fontSize:11, fontFace:FONT, color:C.blue, bold:true, charSpacing:4, margin:0 });
  s.addText("AI Agent 完整指南", { x:0.5, y:1.45, w:6.5, h:1.1, fontSize:42, fontFace:FONT, color:C.white, bold:true, margin:0 });
  s.addText("從概念到實作：LLM → Workflow → Agent → 自建團隊", { x:0.5, y:2.68, w:6.4, h:0.45, fontSize:13.5, fontFace:FONT, color:C.muted, margin:0 });
  const pills = [
    { label:"第一章：什麼是 AI Agent", color:C.blue },
    { label:"第二章：agency-agents 實戰", color:C.green },
    { label:"第三章：自建 Agent 實踐 (onduty)", color:C.coral },
    { label:"第四章：AI Agent 組建自己的團隊", color:C.amber },
  ];
  pills.forEach((p,i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:3.3+i*0.47, w:4.6, h:0.38, fill:{color:"1A2A3A"}, line:{color:p.color, width:1} });
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:3.3+i*0.47, w:0.05, h:0.38, fill:{color:p.color}, line:{color:p.color} });
    s.addText(p.label, { x:0.65, y:3.3+i*0.47, w:4.3, h:0.38, fontSize:12, fontFace:FONT, color:p.color, margin:0, valign:"middle" });
  });
  s.addText("AGENT\nPLANNING\nMEMORY\nTOOLS", { x:7.4, y:1.5, w:2.4, h:3, fontSize:22, fontFace:FONT, color:"1E3A5F", bold:true, align:"center", valign:"middle", margin:0, lineSpacingMultiple:1.8 });
}

// ══════════════════════════════════════════════════
// SLIDE 2 — Ch1: 三階段演進
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "CHAPTER 1", "AI 三階段演進：從被動到自主");

  const stages = [
    { num:"01", title:"大型語言模型（LLM）", en:"Passive — 被動圖書管理員", color:C.muted,
      items:["幾乎讀過所有書，卻不知你的個人數據","天生被動：等待提示詞才有所回應","類比：「博學的實習生」——需要手把手指令","只會在櫃檯等你上前發問"] },
    { num:"02", title:"AI 工作流（Workflow）", en:"Rigid — 僵硬的導航地圖", color:C.amber,
      items:["人類提供固定「預設路徑」（Control Logic）","1→2→3 固定步驟，高效但極為脆弱","問天氣？工作流崩潰——無「天氣路徑」","⚠️ RAG ≠ Agent，RAG 只是「查資料」的工作流"] },
    { num:"03", title:"AI 智能體（Agent）", en:"Autonomous — 自主執行者", color:C.blue,
      items:["將「人類決策者」替換為「LLM」——關鍵轉變","使用 ReAct（Reason+Act）自主規劃行動","只需提供目標，AI 自行選擇工具執行","類比：「配備工具的工程師」——給目標自行完成"] },
  ];

  stages.forEach((st, i) => {
    const x = 0.35 + i*3.17, w = 3.0;
    card(s, x, 1.35, w, 3.9, st.color, C.card);
    topBar(s, x, 1.35, w, st.color);
    s.addShape(pres.shapes.OVAL, { x:x+0.18, y:1.5, w:0.48, h:0.48, fill:{color:"162032"}, line:{color:st.color, width:1.5} });
    s.addText(st.num, { x:x+0.18, y:1.5, w:0.48, h:0.48, fontSize:13, fontFace:FONT, color:st.color, bold:true, align:"center", valign:"middle", margin:0 });
    s.addText(st.title, { x:x+0.78, y:1.53, w:w-0.96, h:0.28, fontSize:12.5, fontFace:FONT, color:st.color, bold:true, margin:0 });
    s.addText(st.en, { x:x+0.18, y:2.04, w:w-0.36, h:0.26, fontSize:9.5, fontFace:FONT, color:C.muted, margin:0, italic:true });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.18, y:2.35, w:w-0.36, h:0.02, fill:{color:C.border}, line:{color:C.border} });
    st.items.forEach((item,j) => {
      s.addText([{text:item}], { x:x+0.18, y:2.44+j*0.65, w:w-0.36, h:0.6, fontSize:10.5, fontFace:FONT, color:j===3&&i===1?C.amber:C.white, margin:0, lineSpacingMultiple:1.25, bullet:{type:"bullet",code:"25B6",color:st.color,size:60} });
    });
  });

  // Arrows between stages
  [3.52, 6.69].forEach(ax => {
    s.addShape(pres.shapes.RECTANGLE, { x:ax, y:3.27, w:0.32, h:0.04, fill:{color:C.border}, line:{color:C.border} });
    s.addText("▶", { x:ax+0.28, y:3.22, w:0.18, h:0.14, fontSize:8, fontFace:FONT, color:C.border, margin:0 });
  });
}

// ══════════════════════════════════════════════════
// SLIDE 3 — Ch1: ReAct + 4-part loop
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "CHAPTER 1", "ReAct 框架：智能體「自己改作業」的能力");

  // Left: ReAct loop steps
  {
    const x=0.4, y=1.38, w=4.4;
    card(s, x, y, w, 3.85, C.teal);
    topBar(s, x, y, w, C.teal);
    s.addText("⚡  ReAct = Reason + Act", { x:x+0.18, y:y+0.15, w:w-0.36, h:0.38, fontSize:17, fontFace:FONT, color:C.teal, bold:true, margin:0 });
    s.addText("AI Agent 目前的標準配置框架", { x:x+0.18, y:y+0.57, w:w-0.36, h:0.25, fontSize:11, fontFace:FONT, color:C.muted, margin:0, italic:true });
    const steps = [
      { label:"💭  推理 (Reason)", color:C.blue,   desc:"大腦思考當前狀態，規劃下一步策略" },
      { label:"⚡  行動 (Act)",    color:C.teal,   desc:"自主選擇工具，調用 API 或執行指令" },
      { label:"👁️  觀察 (Observe)",color:C.purple, desc:"觀察環境反饋與工具執行結果" },
      { label:"🔁  迭代 (Iterate)",color:C.amber,  desc:"不斷循環直到目標達成" },
    ];
    steps.forEach((st,j) => {
      s.addShape(pres.shapes.RECTANGLE, { x:x+0.18, y:y+1.0+j*0.72, w:w-0.36, h:0.62, fill:{color:"162032"}, line:{color:st.color, width:1} });
      s.addShape(pres.shapes.RECTANGLE, { x:x+0.18, y:y+1.0+j*0.72, w:0.05, h:0.62, fill:{color:st.color}, line:{color:st.color} });
      s.addText(st.label, { x:x+0.3, y:y+1.05+j*0.72, w:w-0.55, h:0.26, fontSize:12, fontFace:FONT, color:st.color, bold:true, margin:0 });
      s.addText(st.desc, { x:x+0.3, y:y+1.33+j*0.72, w:w-0.55, h:0.24, fontSize:10.5, fontFace:FONT, color:C.muted, margin:0 });
    });
  }

  // Right top: example
  {
    const x=5.15, y=1.38;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:4.45, h:1.62, fill:{color:"1A2E1E"}, line:{color:C.green, width:1}, shadow:shadow() });
    s.addText("🎬  實例：視覺 Agent 自動找「滑雪者」片段", { x:x+0.15, y:y+0.1, w:4.2, h:0.3, fontSize:12, fontFace:FONT, color:C.green, bold:true, margin:0 });
    s.addText("推理：滑雪者 = 腳踩雪板在雪地飛馳的人\n行動：搜尋影格，觀察結果，迭代優化\n成果：無需人工標記，自主建立索引\n延伸：若 LinkedIn 貼文不夠吸引，主動加「自我批判」步驟重寫", { x:x+0.15, y:y+0.5, w:4.2, h:1.02, fontSize:10.5, fontFace:FONT, color:C.white, margin:0, lineSpacingMultiple:1.38 });
  }

  // Right bottom: 4 core elements
  {
    const x=5.15, y=3.1;
    s.addText("Agent 四大核心要素", { x, y, w:4.45, h:0.28, fontSize:12, fontFace:FONT, color:C.muted, bold:true, margin:0, align:"center" });
    const elems = [
      { icon:"🧠", label:"大腦 (LLM)", color:C.blue,   desc:"理解語境\n決策核心" },
      { icon:"📋", label:"規劃",        color:C.teal,   desc:"任務拆解\n自我修正" },
      { icon:"💾", label:"記憶",        color:C.purple, desc:"短期 Context\n+ RAG" },
      { icon:"🔧", label:"工具箱",      color:C.amber,  desc:"API / Shell\n瀏覽器" },
    ];
    elems.forEach((el,i) => {
      const ex = x + i*1.12;
      card(s, ex, y+0.36, 1.06, 1.75, el.color, C.card);
      topBar(s, ex, y+0.36, 1.06, el.color);
      s.addText(el.icon, { x:ex, y:y+0.5, w:1.06, h:0.4, fontSize:22, align:"center", margin:0 });
      s.addText(el.label, { x:ex+0.05, y:y+0.96, w:0.96, h:0.32, fontSize:10, fontFace:FONT, color:el.color, bold:true, align:"center", margin:0 });
      s.addText(el.desc, { x:ex+0.05, y:y+1.3, w:0.96, h:0.72, fontSize:9, fontFace:FONT, color:C.muted, align:"center", margin:0, lineSpacingMultiple:1.2 });
    });
  }
}

// ══════════════════════════════════════════════════
// SLIDE 4 — Ch1: 工作流 vs 智能體時代
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "CHAPTER 1", "工作流時代 vs 智能體時代");

  const cols = [1.7, 2.45, 2.45, 2.7];
  const hdrs = ["時代", "人類的角色", "AI 的角色", "關鍵特性"];
  let cx = 0.35;
  hdrs.forEach((h,i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:cx, y:1.38, w:cols[i], h:0.44, fill:{color:C.blue}, line:{color:C.blue} });
    s.addText(h, { x:cx+0.1, y:1.38, w:cols[i]-0.2, h:0.44, fontSize:13, fontFace:FONT, color:C.bg, bold:true, valign:"middle", margin:0 });
    cx += cols[i];
  });

  const rows = [
    { cells:["📚 LLM 時代","提問者\n（口令一個動作一個）","被動問答機器\n（給 Prompt 產輸出）","無工具調用，資訊孤島"], color:C.muted },
    { cells:["⚙️ 工作流時代","流程管理者\n（細緻定義每個 if-then）","固定路徑執行者\n（遵循預設步驟）","脆弱：偏離路徑即崩潰"], color:C.amber },
    { cells:["🤖 智能體時代","目標設定者\n（定義最終想達成的終點）","決策與執行者\n（自主推理、觀察、達成目標）","自主規劃，HITL 把關"], color:C.blue },
  ];

  rows.forEach((row,ri) => {
    let cx2 = 0.35;
    const highlight = ri===2;
    cols.forEach((cw,ci) => {
      s.addShape(pres.shapes.RECTANGLE, { x:cx2, y:1.86+ri*1.22, w:cw, h:1.12, fill:{color: highlight?"1A2A40":C.card}, line:{color: highlight?C.blue:C.border, width: highlight?1.5:1} });
      if (ci===0) s.addShape(pres.shapes.RECTANGLE, { x:cx2, y:1.86+ri*1.22, w:0.05, h:1.12, fill:{color:row.color}, line:{color:row.color} });
      s.addText(row.cells[ci], { x:cx2+0.12, y:1.9+ri*1.22, w:cw-0.22, h:1.02, fontSize:ci===0?13:11, fontFace:FONT, color:ci===0?row.color:C.white, bold:ci===0, margin:0, valign:"middle", lineSpacingMultiple:1.3 });
      cx2 += cw;
    });
  });

  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:5.28, w:9.3, h:0.4, fill:{color:"2A1A0A"}, line:{color:C.amber, width:1} });
  s.addText("⚠️  RAG ≠ Agent：RAG 的核心是「檢索（Retrieval）」找資訊；Agent 的核心是「推理（Reasoning）」——從一開始就自己決定要找什麼", { x:0.45, y:5.28, w:9.1, h:0.4, fontSize:11, fontFace:FONT, color:C.amber, margin:0, valign:"middle" });
}

// ══════════════════════════════════════════════════
// SLIDE 5 — Ch2 Intro: agency-agents
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  chIntro(s, "2", "GitHub AI Agent 介紹", "agency-agents  ·  msitarzewski  ·  100+ 個專業 Agent", C.green);

  const pillars = [
    { icon:"🎯", label:"專業化",   sub:"Specialized",        desc:"100+ 個領域專業代理人" },
    { icon:"🧩", label:"性格驅動", sub:"Personality-Driven",  desc:"獨特口吻與思考邏輯" },
    { icon:"📦", label:"成果導向", sub:"Deliverable-Focused", desc:"產出代碼、策略或文件" },
    { icon:"🚀", label:"即戰力",   sub:"Production-Ready",    desc:"內建工作流與成功指標" },
  ];
  pillars.forEach((p,i) => {
    const x=0.4+i*2.32, y=2.3, w=2.15, h=2.9;
    card(s, x, y, w, h, C.border, C.card);
    topBar(s, x, y, w, C.green);
    s.addText(p.icon, { x, y:y+0.2, w, h:0.58, fontSize:30, align:"center", margin:0 });
    s.addText(p.label, { x:x+0.1, y:y+0.87, w:w-0.2, h:0.38, fontSize:14, fontFace:FONT, color:C.white, bold:true, align:"center", margin:0 });
    s.addText(p.sub, { x:x+0.1, y:y+1.28, w:w-0.2, h:0.28, fontSize:10, fontFace:FONT, color:C.green, align:"center", margin:0, italic:true });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.15, y:y+1.62, w:w-0.3, h:0.025, fill:{color:C.border}, line:{color:C.border} });
    s.addText(p.desc, { x:x+0.1, y:y+1.72, w:w-0.2, h:1.0, fontSize:12, fontFace:FONT, color:C.muted, align:"center", margin:0, lineSpacingMultiple:1.3 });
  });
}

// ══════════════════════════════════════════════════
// SLIDE 6 — Ch2: 為什麼算是 AI Agent？
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "CHAPTER 2", "為什麼它算是 AI Agent？", C.green);

  const reasons = [
    { num:"01", color:C.blue,   title:"轉變思維：問答 → 自主規劃", desc:"Profile 內含 Workflow 與 Critical Rules，LLM 讀取後啟動多步驟思考，主動規劃步驟，而非字面回答——這種自主規劃行為正是 Agent 的核心特徵。" },
    { num:"02", color:C.teal,   title:"定義環境邊界與工具（Tools）", desc:"透過 convert.sh 注入 Cursor / Claude Code 後，LLM 獲得讀寫代碼庫的「行動能力」，成為完整的工具箱 Agent，可操作本地文件與執行終端指令。" },
    { num:"03", color:C.purple, title:"動態反思（Reflection）機制", desc:"每個 Agent 有 Success Metrics，輸出前後對照指標進行自我審查（Self-Correction），而非一次性輸出結果——符合 Agent 架構的 Reflection 機制。" },
    { num:"04", color:C.amber,  title:"多代理協同（Multi-Agent System）", desc:"100+ 個 Agent 共享標準化接口：Architect 輸出的 Spec 成為 Developer 的輸入，透過共享上下文形成跨 Agent 的協作鏈——即 Agency（代理機構）。" },
  ];
  reasons.forEach((r,i) => {
    const row=Math.floor(i/2), col=i%2;
    const x=0.4+col*4.75, y=1.35+row*2.05, w=4.5, h=1.85;
    card(s, x, y, w, h, r.color, C.card);
    leftBar(s, x, y, h, r.color);
    s.addText(r.num, { x:x+0.18, y:y+0.12, w:0.55, h:0.4, fontSize:22, fontFace:FONT, color:r.color, bold:true, margin:0 });
    s.addText(r.title, { x:x+0.8, y:y+0.14, w:w-1.0, h:0.38, fontSize:13.5, fontFace:FONT, color:C.white, bold:true, margin:0 });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.18, y:y+0.6, w:w-0.36, h:0.018, fill:{color:C.border}, line:{color:C.border} });
    s.addText(r.desc, { x:x+0.18, y:y+0.68, w:w-0.36, h:1.05, fontSize:11.5, fontFace:FONT, color:C.muted, margin:0, lineSpacingMultiple:1.35 });
  });
}

// ══════════════════════════════════════════════════
// SLIDE 7 — Ch2: 5 個最有趣的 Agents
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "CHAPTER 2", "5 個最有趣的 Agents", C.green);

  const agents = [
    { icon:"😈", name:"惡魔代言人", en:"Devil's Advocate", color:C.coral, desc:"唯一任務就是「反駁你」——找出方案中所有漏洞、風險與盲點，是避免集體盲思（Groupthink）的神器。" },
    { icon:"🛡️", name:"品牌守護者", en:"Brand Guardian", color:C.blue, desc:"偏執狂品牌總監，用放大鏡檢查所有內容的視覺、語氣是否符合品牌設定，稍有偏離立刻跳出糾正。" },
    { icon:"🦄", name:"Reddit 大師", en:"Reddit Guru", color:C.amber, desc:"精通各 Subreddit 潛規則，把產品宣傳包裝成看起來像路人分享的爆款文章，讓廣告消失於社群。" },
    { icon:"💀", name:"程式碼死神", en:"Code Grim Reaper", color:C.purple, desc:"座右銘「沒有程式碼是最好的程式碼」，瘋狂刪除冗餘代碼，讓你的專案行數少一大半。" },
    { icon:"💰", name:"簡報黑客", en:"Pitch Deck Hacker", color:C.green, desc:"把複雜技術翻譯成 VC 聽得懂且興奮的商業故事，用 10 張投影片拿到投資人的錢。" },
  ];
  agents.forEach((a,i) => {
    const x=0.35+i*1.87, w=1.75, h=3.9;
    card(s, x, 1.35, w, h, a.color, C.card);
    topBar(s, x, 1.35, w, a.color);
    s.addText(a.icon, { x, y:1.5, w, h:0.6, fontSize:30, align:"center", margin:0 });
    s.addText(a.name, { x:x+0.08, y:2.18, w:w-0.16, h:0.4, fontSize:12.5, fontFace:FONT, color:a.color, bold:true, align:"center", margin:0 });
    s.addText(a.en, { x:x+0.08, y:2.6, w:w-0.16, h:0.26, fontSize:9, fontFace:FONT, color:C.muted, align:"center", margin:0, italic:true });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.12, y:2.92, w:w-0.24, h:0.02, fill:{color:C.border}, line:{color:C.border} });
    s.addText(a.desc, { x:x+0.1, y:3.02, w:w-0.2, h:2.15, fontSize:11, fontFace:FONT, color:C.white, margin:0, lineSpacingMultiple:1.3 });
  });
}

// ══════════════════════════════════════════════════
// SLIDE 8 — Ch2: Software Architect Agent
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "CHAPTER 2  ·  AGENT SPOTLIGHT", "🏛️  Software Architect Agent", C.blue);

  // Left: identity + 5 missions
  {
    const x=0.4, y=1.38, w=4.4;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h:0.98, fill:{color:"1A2440"}, line:{color:C.blue, width:1}, shadow:shadow() });
    s.addText("🧠  身份定義", { x:x+0.15, y:y+0.1, w:w-0.3, h:0.26, fontSize:12, fontFace:FONT, color:C.blue, bold:true, margin:0 });
    s.addText("戰略型 · 務實主義 · 熟悉 Trade-off\n設計讓「接手的新團隊也能維護」的系統", { x:x+0.15, y:y+0.4, w:w-0.3, h:0.5, fontSize:11, fontFace:FONT, color:C.white, margin:0, lineSpacingMultiple:1.3 });
    const missions = [
      "Domain 建模：Bounded Context、Aggregate、Domain Event",
      "架構選型：Monolith vs Microservices vs Event-Driven vs CQRS",
      "Trade-off 分析：一致性 vs 可用性、耦合 vs 複製",
      "ADR 技術決策記錄：捕捉 WHY，不只是 WHAT",
      "演化策略：系統如何成長而不需要全面重寫",
    ];
    s.addText("核心使命", { x, y:y+1.06, w, h:0.26, fontSize:11, fontFace:FONT, color:C.muted, bold:true, margin:0 });
    missions.forEach((m,j) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y:y+1.38+j*0.52, w, h:0.46, fill:{color:C.card}, line:{color:C.border} });
      s.addShape(pres.shapes.OVAL, { x:x+0.1, y:y+1.46+j*0.52, w:0.3, h:0.3, fill:{color:C.blue}, line:{color:C.blue} });
      s.addText(String(j+1), { x:x+0.1, y:y+1.46+j*0.52, w:0.3, h:0.3, fontSize:9.5, fontFace:FONT, color:C.bg, bold:true, align:"center", valign:"middle", margin:0 });
      s.addText(m, { x:x+0.5, y:y+1.43+j*0.52, w:w-0.6, h:0.42, fontSize:10.5, fontFace:FONT, color:C.white, margin:0, lineSpacingMultiple:1.2 });
    });
  }

  // Right: architecture table + critical rules
  {
    const x=5.15, y=1.38, w=4.45;
    s.addText("架構選型矩陣", { x, y, w, h:0.28, fontSize:12, fontFace:FONT, color:C.muted, bold:true, margin:0 });
    const patterns = [
      { name:"Modular Monolith", use:"小團隊、邊界不明確", avoid:"需獨立擴展時" },
      { name:"Microservices",    use:"清晰 Domain、團隊自治", avoid:"小團隊早期產品" },
      { name:"Event-Driven",     use:"鬆耦合、異步工作流", avoid:"需強一致性時" },
      { name:"CQRS",             use:"讀寫不對稱、複雜查詢", avoid:"簡單 CRUD 場景" },
    ];
    ["架構模式","何時使用 ✅","何時避免 ❌"].forEach((h,ci) => {
      const cw=ci===0?1.55:1.45, cx=x+(ci===0?0:ci===1?1.55:3.0);
      s.addShape(pres.shapes.RECTANGLE, { x:cx, y:y+0.35, w:cw, h:0.33, fill:{color:C.blue}, line:{color:C.blue} });
      s.addText(h, { x:cx+0.05, y:y+0.35, w:cw-0.1, h:0.33, fontSize:10, fontFace:FONT, color:C.bg, bold:true, valign:"middle", margin:0 });
    });
    patterns.forEach((p,ri) => {
      const ry=y+0.72+ri*0.5;
      const cs=[{text:p.name,color:C.teal,w:1.55,x},{text:p.use,color:C.green,w:1.45,x:x+1.55},{text:p.avoid,color:C.coral,w:1.45,x:x+3.0}];
      cs.forEach(col => {
        s.addShape(pres.shapes.RECTANGLE, { x:col.x, y:ry, w:col.w, h:0.45, fill:{color:ri%2===0?C.card:"161F2E"}, line:{color:C.border} });
        s.addText(col.text, { x:col.x+0.08, y:ry+0.03, w:col.w-0.16, h:0.4, fontSize:10, fontFace:FONT, color:col.color, margin:0, valign:"middle", lineSpacingMultiple:1.15 });
      });
    });

    s.addText("關鍵原則", { x, y:y+2.82, w, h:0.26, fontSize:11, fontFace:FONT, color:C.muted, bold:true, margin:0 });
    const rules = [
      "不做「架構宇航員」：每個抽象必須能證明其複雜度代價",
      "Trade-off 優先於最佳實踐：說清楚放棄了什麼，不只說得到了什麼",
      "可逆性優先於最優：偏好容易改變的決策而非看起來最優的決策",
    ];
    rules.forEach((r,j) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y:y+3.14+j*0.44, w, h:0.38, fill:{color:C.card}, line:{color:C.border} });
      leftBar(s, x, y+3.14+j*0.44, 0.38, C.blue);
      s.addText(r, { x:x+0.12, y:y+3.17+j*0.44, w:w-0.2, h:0.32, fontSize:10, fontFace:FONT, color:C.white, margin:0, lineSpacingMultiple:1.2 });
    });
  }
}

// ══════════════════════════════════════════════════
// SLIDE 9 — Ch2: Code Reviewer Agent
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "CHAPTER 2  ·  AGENT SPOTLIGHT", "👁️  Code Reviewer Agent", C.purple);

  // Left: identity + missions
  {
    const x=0.4, y=1.38, w=4.4;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h:0.98, fill:{color:"1E1A2E"}, line:{color:C.purple, width:1}, shadow:shadow() });
    s.addText("🧠  身份定義", { x:x+0.15, y:y+0.1, w:w-0.3, h:0.26, fontSize:12, fontFace:FONT, color:C.purple, bold:true, margin:0 });
    s.addText("建設性 · 徹底 · 教育導向 · 尊重開發者\n像「導師」而非「守門人」，每個評論都在傳授知識", { x:x+0.15, y:y+0.4, w:w-0.3, h:0.5, fontSize:11, fontFace:FONT, color:C.white, margin:0, lineSpacingMultiple:1.3 });
    const missions = [
      { icon:"✅", text:"正確性：程式碼是否做了它應該做的事？" },
      { icon:"🔐", text:"安全性：是否有漏洞？輸入驗證？Auth 檢查？" },
      { icon:"🔧", text:"可維護性：6 個月後別人能否理解這段代碼？" },
      { icon:"⚡", text:"效能：是否有明顯瓶頸或 N+1 查詢問題？" },
      { icon:"🧪", text:"測試覆蓋：重要路徑是否都有測試？" },
    ];
    s.addText("核心使命（優先順序）", { x, y:y+1.06, w, h:0.26, fontSize:11, fontFace:FONT, color:C.muted, bold:true, margin:0 });
    missions.forEach((m,j) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y:y+1.38+j*0.52, w, h:0.46, fill:{color:C.card}, line:{color:C.border} });
      s.addText(m.icon+"  "+m.text, { x:x+0.15, y:y+1.42+j*0.52, w:w-0.25, h:0.38, fontSize:11, fontFace:FONT, color:C.white, margin:0, lineSpacingMultiple:1.2 });
    });
  }

  // Right: checklist + comment format
  {
    const x=5.15, y=1.38, w=4.45;
    s.addText("審查清單（優先級標記）", { x, y, w, h:0.28, fontSize:12, fontFace:FONT, color:C.muted, bold:true, margin:0 });

    const tiers = [
      { icon:"🔴", label:"Blocker（必須修）", color:C.coral,
        items:["安全漏洞（注入、XSS、Auth 繞過）","數據丟失或損壞風險","Race Condition 或 Deadlock","Breaking API 合約"] },
      { icon:"🟡", label:"Suggestion（應該修）", color:C.amber,
        items:["缺少輸入驗證","命名不清或邏輯混亂","重要行為缺少測試","N+1 查詢、效能問題"] },
      { icon:"💭", label:"Nit（加分項）", color:C.blue,
        items:["輕微命名改善","文件缺口","值得考慮的替代方案"] },
    ];

    let gy=y+0.35;
    tiers.forEach(tier => {
      s.addShape(pres.shapes.RECTANGLE, { x, y:gy, w, h:0.3, fill:{color:"161F2E"}, line:{color:tier.color} });
      s.addText(`${tier.icon}  ${tier.label}`, { x:x+0.12, y:gy+0.02, w:w-0.24, h:0.26, fontSize:11.5, fontFace:FONT, color:tier.color, bold:true, margin:0 });
      gy+=0.32;
      tier.items.forEach(item => {
        s.addShape(pres.shapes.RECTANGLE, { x, y:gy, w, h:0.29, fill:{color:C.card}, line:{color:C.border} });
        leftBar(s, x, gy, 0.29, tier.color);
        s.addText(item, { x:x+0.12, y:gy+0.03, w:w-0.2, h:0.23, fontSize:10.5, fontFace:FONT, color:C.white, margin:0 });
        gy+=0.31;
      });
      gy+=0.06;
    });

    s.addShape(pres.shapes.RECTANGLE, { x, y:gy, w, h:0.62, fill:{color:"1A0F0F"}, line:{color:C.coral, width:1} });
    s.addText("🔴  Security: SQL Injection  |  Line 42: 輸入直接拼接 SQL\n→  建議：改用 parameterized query\n   db.query('SELECT * FROM users WHERE id=$1', [id])", { x:x+0.12, y:gy+0.06, w:w-0.24, h:0.52, fontSize:9.5, fontFace:FONT, color:C.white, margin:0, lineSpacingMultiple:1.38 });
  }
}

// ══════════════════════════════════════════════════
// SLIDE 10 — Ch2: Multi-Agent 四大痛點
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "CHAPTER 2", "Multi-Agent 為何效果不好？4 大痛點", C.green);

  const pains = [
    { num:"痛點 1", color:C.coral,  problem:"上下文污染（Context Pollution）", fix:"串聯/星狀架構：每個 Agent 只讀當前任務相關的 Context；輸出固化為靜態 Spec 作為下一個 Agent 的輸入" },
    { num:"痛點 2", color:C.amber,  problem:"職責模糊：過度擬人化",           fix:"用 I/O Schema 取代性格描述：輸出必須是標準 JSON，包含 status(APPROVED/REJECTED) / bugs[] / review_comments" },
    { num:"痛點 3", color:C.purple, problem:"缺乏客觀真相環境（Ground Truth）",fix:"引入自動化 Tooling 作為裁判：自動執行 pytest / npm test，把 Terminal 錯誤訊息直接餵回給 Developer Agent" },
    { num:"痛點 4", color:C.blue,   problem:"動態路由失控（無窮迴圈）",        fix:"退回靜態工作流（Deterministic Workflow）：Python/Node.js 硬編碼流程，失敗最多重試 3 次，再轉 Human-in-the-loop" },
  ];
  pains.forEach((p,i) => {
    const y=1.35+i*1.06;
    card(s, 0.4, y, 9.2, 0.92, C.border, C.card);
    leftBar(s, 0.4, y, 0.92, p.color);
    s.addText(p.num, { x:0.58, y:y+0.06, w:0.95, h:0.28, fontSize:10.5, fontFace:FONT, color:p.color, bold:true, charSpacing:1, margin:0 });
    s.addText("❌  "+p.problem, { x:1.48, y:y+0.06, w:7.8, h:0.32, fontSize:13.5, fontFace:FONT, color:C.white, bold:true, margin:0 });
    s.addShape(pres.shapes.RECTANGLE, { x:0.58, y:y+0.44, w:9.0, h:0.02, fill:{color:C.border}, line:{color:C.border} });
    s.addText("✅  "+p.fix, { x:0.58, y:y+0.52, w:9.0, h:0.36, fontSize:11.5, fontFace:FONT, color:C.muted, margin:0, lineSpacingMultiple:1.25 });
  });
}

// ══════════════════════════════════════════════════
// SLIDE 11 — Ch3: onduty.md 值班人員
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  chIntro(s, "3", "自建 Agent 實踐", "值班人員 Agent (onduty.md)  ·  GitOps VM 支援系統", C.coral);

  // Left: 4 components
  const comps = [
    { icon:"🎭", label:"角色/大腦 (Persona/Brain)", color:C.coral, desc:"聰明萬能的值班人員，熟悉 GitOps VM 流程，熱心助人，同樣的錯誤不會犯第二次" },
    { icon:"👁️", label:"感知 (Perception)", color:C.blue, desc:"解讀 VM 種類（VMware/tVM）、問題描述、廠區（FAB）等每一個明確與隱含訊號" },
    { icon:"🗺️", label:"規劃 (Planning)", color:C.teal, desc:"先問清楚：廠區？Cloud Type？發生了什麼？錯誤訊息？確保資訊完整後才給方案" },
    { icon:"⚡", label:"行動 (Action)", color:C.amber, desc:"輸出格式：報案內容 + VM name + job id + 解決方案，使用者反駁則立即更新模型給新推薦" },
  ];
  comps.forEach((c,i) => {
    const y=2.25+i*0.83;
    s.addShape(pres.shapes.RECTANGLE, { x:0.35, y, w:4.5, h:0.74, fill:{color:C.card}, line:{color:c.color, width:1}, shadow:shadow() });
    leftBar(s, 0.35, y, 0.74, c.color);
    s.addText(c.icon+"  "+c.label, { x:0.52, y:y+0.06, w:4.2, h:0.26, fontSize:12, fontFace:FONT, color:c.color, bold:true, margin:0 });
    s.addText(c.desc, { x:0.52, y:y+0.34, w:4.2, h:0.36, fontSize:10.5, fontFace:FONT, color:C.muted, margin:0, lineSpacingMultiple:1.2 });
  });

  // Right: knowledge domain + action format
  {
    const x=5.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y:2.25, w:4.45, h:1.28, fill:{color:"2A1818"}, line:{color:C.coral, width:1}, shadow:shadow() });
    s.addText("🧠  知識領域", { x:x+0.15, y:2.35, w:4.2, h:0.26, fontSize:12, fontFace:FONT, color:C.coral, bold:true, margin:0 });
    const domains = ["GitOps VM","Cluster Management","VMware","DFW","DNS"];
    domains.forEach((d,i) => {
      const dx=x+0.15+(i%3)*1.4, dy=2.7+Math.floor(i/3)*0.4;
      s.addShape(pres.shapes.RECTANGLE, { x:dx, y:dy, w:1.3, h:0.32, fill:{color:"3A1A1A"}, line:{color:C.coral, width:1} });
      s.addText(d, { x:dx, y:dy, w:1.3, h:0.32, fontSize:11, fontFace:FONT, color:C.coral, align:"center", valign:"middle", margin:0 });
    });

    s.addShape(pres.shapes.RECTANGLE, { x, y:3.65, w:4.45, h:1.55, fill:{color:C.card}, line:{color:C.border, width:1}, shadow:shadow() });
    s.addText("📋  回覆格式（Action Output）", { x:x+0.15, y:3.75, w:4.2, h:0.26, fontSize:12, fontFace:FONT, color:C.muted, bold:true, margin:0 });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.15, y:4.08, w:4.15, h:1.02, fill:{color:"161F2E"}, line:{color:C.border} });
    s.addText("報案內容：[針對情境的具體說明]\nVM name：[vm-fab12-001]\njob id：[job-20250520-abc]\n解決方案：[逐步可執行的修復步驟]", { x:x+0.25, y:4.13, w:3.95, h:0.9, fontSize:10.5, fontFace:FONT, color:C.white, margin:0, lineSpacingMultiple:1.38 });

    s.addShape(pres.shapes.RECTANGLE, { x, y:5.28, w:4.45, h:0.38, fill:{color:"1A2A1A"}, line:{color:C.green, width:1} });
    s.addText("🔧  工具：可使用 TKMS MCP 搜尋解決方案  |  失敗時請人為介入", { x:x+0.12, y:5.28, w:4.2, h:0.38, fontSize:10.5, fontFace:FONT, color:C.green, margin:0, valign:"middle" });
  }
}

// ══════════════════════════════════════════════════
// SLIDE 12 — Ch3: 感知 → 規劃 → 行動 詳細
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "CHAPTER 3", "值班人員 Agent：感知 → 規劃 → 行動", C.coral);

  // Left: Perception table + Planning
  {
    const x=0.4, y=1.38, w=4.4;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h:0.32, fill:{color:C.coral}, line:{color:C.coral} });
    s.addText("👁️  感知（Perception）— 明確訊號解析", { x:x+0.12, y, w:w-0.24, h:0.32, fontSize:12, fontFace:FONT, color:C.bg, bold:true, margin:0, valign:"middle" });
    const perceptions = [
      { type:"VM 種類", example:"VMware / tVM", info:"確認底層虛擬化技術" },
      { type:"問題描述", example:"Error provision", info:"定義故障類型" },
      { type:"廠區資訊", example:"FAB12",         info:"縮小排查範圍" },
      { type:"錯誤訊息", example:"job id / log",  info:"直接定位根因" },
    ];
    [["輸入類型",1.3],["範例",1.55],["提取資訊",1.55]].forEach(([h,cw],ci) => {
      const cx=x+(ci===0?0:ci===1?1.3:2.85);
      s.addShape(pres.shapes.RECTANGLE, { x:cx, y:y+0.35, w:cw, h:0.3, fill:{color:"2A1818"}, line:{color:C.border} });
      s.addText(h, { x:cx+0.06, y:y+0.35, w:cw-0.12, h:0.3, fontSize:10, fontFace:FONT, color:C.muted, bold:true, margin:0, valign:"middle" });
    });
    perceptions.forEach((p,ri) => {
      const ry=y+0.69+ri*0.38;
      [[p.type,1.3,x,C.coral],[p.example,1.55,x+1.3,C.white],[p.info,1.55,x+2.85,C.muted]].forEach(([text,cw,cx,color]) => {
        s.addShape(pres.shapes.RECTANGLE, { x:cx, y:ry, w:cw, h:0.33, fill:{color:ri%2===0?C.card:"161F2E"}, line:{color:C.border} });
        s.addText(text, { x:cx+0.08, y:ry+0.04, w:cw-0.16, h:0.25, fontSize:10, fontFace:FONT, color, margin:0 });
      });
    });

    const py=y+2.28;
    s.addShape(pres.shapes.RECTANGLE, { x, y:py, w, h:0.32, fill:{color:"2A1818"}, line:{color:C.coral} });
    s.addText("🗺️  規劃（Planning）— 第一步先問清楚", { x:x+0.12, y:py, w:w-0.24, h:0.32, fontSize:12, fontFace:FONT, color:C.coral, bold:true, margin:0, valign:"middle" });
    const planItems = ["發生在哪個廠區？（FAB?）","哪一種 Cloud Type？（VMware / tVM）","發生了什麼事情？","錯誤訊息是什麼？（job id / log）"];
    planItems.forEach((item,j) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y:py+0.36+j*0.4, w, h:0.35, fill:{color:C.card}, line:{color:C.border} });
      s.addShape(pres.shapes.OVAL, { x:x+0.1, y:py+0.42+j*0.4, w:0.24, h:0.24, fill:{color:C.coral}, line:{color:C.coral} });
      s.addText(String(j+1), { x:x+0.1, y:py+0.42+j*0.4, w:0.24, h:0.24, fontSize:9, fontFace:FONT, color:C.bg, bold:true, align:"center", valign:"middle", margin:0 });
      s.addText(item, { x:x+0.44, y:py+0.44+j*0.4, w:w-0.54, h:0.28, fontSize:11, fontFace:FONT, color:C.white, margin:0 });
    });
  }

  // Right: Action + Refinement rules
  {
    const x=5.15, y=1.38, w=4.45;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h:0.32, fill:{color:C.coral}, line:{color:C.coral} });
    s.addText("⚡  行動（Action）— 回覆結構", { x:x+0.12, y, w:w-0.24, h:0.32, fontSize:12, fontFace:FONT, color:C.bg, bold:true, margin:0, valign:"middle" });
    const actionFields = [
      { field:"報案內容", desc:"針對使用者情境的一句具體說明", color:C.coral },
      { field:"VM name", desc:"虛擬機器名稱（例：fab12-tvm-001）", color:C.teal },
      { field:"job id",  desc:"工作任務 ID，用於追蹤問題根因", color:C.blue },
      { field:"解決方案", desc:"逐步提供可執行的修復步驟", color:C.green },
    ];
    actionFields.forEach((af,j) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y:y+0.37+j*0.5, w, h:0.44, fill:{color:C.card}, line:{color:af.color, width:1} });
      leftBar(s, x, y+0.37+j*0.5, 0.44, af.color);
      s.addText(af.field, { x:x+0.15, y:y+0.4+j*0.5, w:1.2, h:0.22, fontSize:11.5, fontFace:FONT, color:af.color, bold:true, margin:0 });
      s.addText(af.desc, { x:x+0.15, y:y+0.62+j*0.5, w:w-0.25, h:0.18, fontSize:10, fontFace:FONT, color:C.muted, margin:0 });
    });

    const ry2=y+2.42;
    s.addShape(pres.shapes.RECTANGLE, { x, y:ry2, w, h:0.32, fill:{color:"2A1818"}, line:{color:C.coral} });
    s.addText("🔄  回饋精煉規則", { x:x+0.12, y:ry2, w:w-0.24, h:0.32, fontSize:12, fontFace:FONT, color:C.coral, bold:true, margin:0, valign:"middle" });
    const refineRules = [
      "使用者反駁 → 把反駁視為新感知資料，更新模型",
      "不重新解釋被否決的選項，立即給出修正推薦",
      "使用者執行後回來 → 詢問評價，更新偏好檔案",
      "🔧  工具：使用 TKMS MCP 搜尋解決方案",
    ];
    refineRules.forEach((r,j) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y:ry2+0.36+j*0.42, w, h:0.37, fill:{color:C.card}, line:{color:C.border} });
      leftBar(s, x, ry2+0.36+j*0.42, 0.37, j===3?C.amber:C.coral);
      s.addText(r, { x:x+0.12, y:ry2+0.4+j*0.42, w:w-0.2, h:0.3, fontSize:10.5, fontFace:FONT, color:j===3?C.amber:C.white, margin:0 });
    });
  }
}

// ══════════════════════════════════════════════════
// SLIDE 13 — Ch4 Intro
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  chIntro(s, "4", "AI Agent 組建自己的團隊", "main.py + run_now.py  ·  Brainstorm → Architect → Developer → Reviewer", C.amber);

  const steps = [
    { icon:"🧠", step:"Step 0", title:"Brainstorming", desc:"多輪互動問答\n引導生成 spec\n儲存至文件", color:C.blue },
    { icon:"🏛️", step:"Step 1", title:"Software Architect", desc:"解析 spec\n規劃目錄結構\n輸出 JSON", color:C.teal },
    { icon:"💻", step:"Step 2", title:"Senior Developer", desc:"逐檔生成代碼\n最多 3 次\n自動修正", color:C.purple },
    { icon:"🔍", step:"Step 3", title:"Code Reviewer", desc:"審查輸出\nAPPROVED 通過\nREJECTED 退件", color:C.amber },
  ];

  steps.forEach((c,i) => {
    const x=0.35+i*2.35, w=2.2, h=2.65;
    card(s, x, 2.28, w, h, c.color, C.card);
    topBar(s, x, 2.28, w, c.color);
    s.addText(c.icon, { x, y:2.38, w, h:0.65, fontSize:32, align:"center", margin:0 });
    s.addText(c.step, { x:x+0.1, y:3.1, w:w-0.2, h:0.26, fontSize:10, fontFace:FONT, color:c.color, bold:true, align:"center", margin:0 });
    s.addText(c.title, { x:x+0.1, y:3.38, w:w-0.2, h:0.32, fontSize:13.5, fontFace:FONT, color:C.white, bold:true, align:"center", margin:0 });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.15, y:3.76, w:w-0.3, h:0.02, fill:{color:C.border}, line:{color:C.border} });
    s.addText(c.desc, { x:x+0.1, y:3.84, w:w-0.2, h:1.0, fontSize:11.5, fontFace:FONT, color:C.muted, align:"center", margin:0, lineSpacingMultiple:1.35 });
    if (i<3) {
      s.addShape(pres.shapes.RECTANGLE, { x:x+w+0.02, y:3.58, w:0.3, h:0.04, fill:{color:C.border}, line:{color:C.border} });
      s.addText("▶", { x:x+w+0.28, y:3.54, w:0.18, h:0.14, fontSize:8, fontFace:FONT, color:C.border, margin:0 });
    }
  });
}

// ══════════════════════════════════════════════════
// SLIDE 14 — Ch4: Pipeline 流程圖
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "CHAPTER 4", "Pipeline 流程圖：main.py 與 run_now.py", C.amber);

  // Row 1: User → Brainstorm → Spec saved
  const bx=(x,y,w,h,text,color,textColor,fs)=>{
    s.addShape(pres.shapes.RECTANGLE,{x,y,w,h,fill:{color:C.card},line:{color:color,width:1.5}});
    s.addText(text,{x:x+0.06,y:y+0.04,w:w-0.12,h:h-0.08,fontSize:fs||10,fontFace:FONT,color:textColor||C.white,align:"center",valign:"middle",margin:0,lineSpacingMultiple:1.3});
  };
  const arr=(x1,y1,x2,y2)=>{
    if(Math.abs(y1-y2)<0.05){
      s.addShape(pres.shapes.RECTANGLE,{x:Math.min(x1,x2),y:y1-0.015,w:Math.abs(x2-x1),h:0.03,fill:{color:C.border},line:{color:C.border}});
    } else {
      s.addShape(pres.shapes.RECTANGLE,{x:x1-0.015,y:Math.min(y1,y2),w:0.03,h:Math.abs(y2-y1),fill:{color:C.border},line:{color:C.border}});
    }
  };

  // Row 1 (y=1.38)
  bx(0.3,1.38,1.55,0.58,"使用者\n輸入需求",C.blue,C.blue,10.5);
  arr(1.85,1.67,2.1,1.67);
  bx(2.1,1.38,2.5,0.58,"Step 0\nBrainstorming\n（多輪 Q&A）",C.blue,C.white,10);
  s.addText("⟵ 互動問答", {x:2.1,y:1.98,w:2.5,h:0.22,fontSize:9,fontFace:FONT,color:C.muted,align:"center",margin:0});
  arr(4.6,1.67,4.85,1.67);
  bx(4.85,1.38,1.8,0.58,"[SPEC_READY]\n觸發",C.green,C.green,10);
  arr(6.65,1.67,6.9,1.67);
  bx(6.9,1.38,2.8,0.58,"Spec 儲存至\ndocs/superpowers/specs/\n(run_now.py 可跳過此步)",C.teal,C.white,9);

  // Arrow down
  arr(8.3,1.96,8.3,2.28);

  // Row 2 (y=2.28): Architect
  bx(2.5,2.28,7.1,0.62,"Step 1  Software Architect  →  解析 spec → 規劃 project_name + files[] 目錄結構 JSON",C.teal,C.white,11);
  arr(5.05,2.28,5.05,2.04);

  // Arrow down from architect center
  arr(6.05,2.9,6.05,3.22);

  // Row 3 (y=3.22): For each file loop
  s.addShape(pres.shapes.RECTANGLE,{x:0.3,y:3.22,w:9.4,h:2.12,fill:{color:"161F2E"},line:{color:C.border,width:1}});
  s.addText("For each file in spec.files  （最多重試 3 次）",{x:0.4,y:3.24,w:9.2,h:0.26,fontSize:10.5,fontFace:FONT,color:C.muted,bold:true,margin:0});

  bx(0.48,3.56,2.8,0.62,"Step 2  Senior Developer\n→ 生成完整程式碼",C.purple,C.white,11);
  arr(3.28,3.87,3.58,3.87);
  bx(3.58,3.56,3.1,0.62,"Step 3  Code Reviewer\n→ 審查代碼品質",C.amber,C.white,11);

  // APPROVED path
  arr(6.68,3.87,6.98,3.87);
  s.addShape(pres.shapes.RECTANGLE,{x:6.98,y:3.56,w:1.2,h:0.62,fill:{color:"1A2E1A"},line:{color:C.green,width:1.5}});
  s.addText("✅\nAPPROVED",{x:6.98,y:3.56,w:1.2,h:0.62,fontSize:10,fontFace:FONT,color:C.green,align:"center",valign:"middle",margin:0,bold:true});
  arr(8.18,3.87,8.48,3.87);
  s.addShape(pres.shapes.RECTANGLE,{x:8.48,y:3.56,w:1.2,h:0.62,fill:{color:"1A2A1A"},line:{color:C.teal,width:1}});
  s.addText("下一個\n檔案",{x:8.48,y:3.56,w:1.2,h:0.62,fontSize:10,fontFace:FONT,color:C.teal,align:"center",valign:"middle",margin:0});

  // REJECTED path (loop back)
  s.addShape(pres.shapes.RECTANGLE,{x:3.58,y:4.28,w:3.1,h:0.5,fill:{color:"2A1A0A"},line:{color:C.coral,width:1}});
  s.addText("❌  REJECTED → 補充 bug 回饋 → 重新生成（max 3×）",{x:3.68,y:4.28,w:2.9,h:0.5,fontSize:10,fontFace:FONT,color:C.coral,margin:0,valign:"middle"});
  arr(3.58,4.53,3.2,4.53);
  arr(3.2,4.53,3.2,3.87); // loop back up-left
  // Arrow tip back to developer
  s.addText("↑",{x:3.1,y:3.75,w:0.25,h:0.2,fontSize:12,fontFace:FONT,color:C.coral,margin:0,align:"center"});

  // Row 4: Human in the loop
  s.addShape(pres.shapes.RECTANGLE,{x:0.3,y:5.38,w:9.4,h:0.38,fill:{color:"2A1818"},line:{color:C.coral,width:1}});
  s.addText("🚨  超過最大重試次數（3×）→ Human In The Loop 介入  ·  run_now.py 直接使用預建 SPEC 跳過 Brainstorm，加快測試流程",{x:0.42,y:5.38,w:9.2,h:0.38,fontSize:10,fontFace:FONT,color:C.coral,margin:0,valign:"middle"});
}

// ══════════════════════════════════════════════════
// SLIDE 15 — Closing
// ══════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: "060D1A" };
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.08, fill:{color:C.blue}, line:{color:C.blue} });
  s.addText("THANK YOU", { x:0.5, y:1.1, w:9, h:1.0, fontSize:52, fontFace:FONT, color:C.white, bold:true, align:"center", margin:0, charSpacing:6 });
  s.addShape(pres.shapes.RECTANGLE, { x:2.5, y:2.22, w:5, h:0.04, fill:{color:C.blue}, line:{color:C.blue} });
  s.addText("AI Agent 不是遙遠的未來，是現在就能落地的工程工具", { x:0.5, y:2.38, w:9, h:0.45, fontSize:15, fontFace:FONT, color:C.muted, align:"center", margin:0, italic:true });

  const topics = [
    { label:"Ch1  LLM → Workflow → Agent", color:C.blue },
    { label:"Ch2  agency-agents 實戰", color:C.green },
    { label:"Ch3  自建 onduty Agent", color:C.coral },
    { label:"Ch4  AI Agent 組建團隊", color:C.amber },
  ];
  topics.forEach((t,i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.6+i*2.22, y:3.1, w:2.08, h:0.52, fill:{color:C.card}, line:{color:t.color, width:1} });
    s.addShape(pres.shapes.RECTANGLE, { x:0.6+i*2.22, y:3.1, w:0.05, h:0.52, fill:{color:t.color}, line:{color:t.color} });
    s.addText(t.label, { x:0.72+i*2.22, y:3.1, w:1.9, h:0.52, fontSize:10.5, fontFace:FONT, color:t.color, margin:0, valign:"middle", lineSpacingMultiple:1.2 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:C.card}, line:{color:C.card} });
  s.addText("github.com/msitarzewski/agency-agents", { x:0, y:5.2, w:10, h:0.425, fontSize:12, fontFace:FONT, color:C.muted, align:"center", valign:"middle", margin:0 });
}

pres.writeFile({ fileName: "AI_Agent_簡報.pptx" })
  .then(() => console.log("✅  AI_Agent_簡報.pptx generated (15 slides)"))
  .catch(err => { console.error(err); process.exit(1); });
