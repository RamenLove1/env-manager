import { useState, useEffect } from "react";

// =============================================
// 環境データ (GitHub で編集)
// =============================================
const ENVIRONMENTS = [
  { id: "home1", label: "家(モード1)", icon: "🏠", cost: "0円", hours: "いつでも", access: "家",
    permitted: ["仕事"],
    gray: ["仕事"],
    notes: "何もしていない状態を許可しない。\nスマホで開いて良いのはGoogle、Spotify、Slack、ドキュメント、スプレッドシートのみ。\n外出が必要ならば、外出後のことについて考えてはいけない。\nオフィスに行けないが仕事が必要な時にのみ、仕事をして良い。",
    担当: "生活基盤" },
  { id: "home2", label: "家(モード2)", icon: "🏠", cost: "0円", hours: "いつでも", access: "家",
    permitted: ["趣味", "ゲーム"],
    gray: [],
    notes: "特になし",
    担当: "趣味、ゲーム" },
  { id: "home3", label: "家(モード3)", icon: "🏠", cost: "0円", hours: "いつでも", access: "家",
    permitted: ["勉強", "仕事", "趣味", "ゲーム", "漫画", "Youtube"],
    gray: ["勉強", "仕事"],
    notes: "風邪をひいているときにのみ許可。かつその時は常に許可する。",
    担当: "療養" },
  { id: "outside", label: "外", icon: "🚶", cost: "0円", hours: "移動時、外食時等", access: "0秒",
    permitted: ["勉強", "趣味", "ゲーム"],
    gray: ["勉強", "趣味", "ゲーム"],
    notes: "ゲームは少量のもののみ。",
    担当: "環境移動" },
  { id: "univ1", label: "大学(モード1)", icon: "🎓", cost: "0円", hours: "9時~21時", access: "徒歩20分",
    permitted: ["勉強"],
    gray: [],
    notes: "推定努力密度：100%",
    担当: "勉強" },
  { id: "univ2", label: "大学(モード2)", icon: "🎓", cost: "0円", hours: "9時~21時", access: "徒歩20分",
    permitted: ["趣味"],
    gray: [],
    notes: "1日3時間まで。",
    担当: "趣味" },
  { id: "office", label: "オフィス", icon: "🏢", cost: "0円", hours: "10時~22時", access: "徒歩20分",
    permitted: ["仕事"],
    gray: [],
    notes: "推定努力密度：100%",
    担当: "仕事" },
  { id: "starbucks", label: "スターバックス", icon: "☕", cost: "2時間500~1000円(飲み物による)", hours: "8時~20時", access: "徒歩20分/家庭教師ついで",
    permitted: ["勉強", "仕事", "ゲーム"],
    gray: ["仕事", "ゲーム"],
    notes: "ゲームは少量のもののみ。\n推定努力密度：75%\n月間利用料目安：2000円(3回)",
    担当: "勉強(短時間)、ゲーム(少量)" },
  { id: "share1", label: "SHARE LOUNGE(モード1)", icon: "💼", cost: "1400円/時 3900円/日", hours: "8時~22時", access: "家庭教師ついで",
    permitted: ["勉強", "仕事", "ゲーム"],
    gray: ["仕事", "ゲーム"],
    notes: "ゲームは少量のもののみ。\n推定努力密度：75%\n月間利用料目安：4000円(1日)",
    担当: "勉強(長時間)、ゲーム(少量)" },
  { id: "share2", label: "SHARE LOUNGE(モード2)", icon: "💼", cost: "1400円/時 3900円/日", hours: "8時~22時", access: "家庭教師ついで",
    permitted: ["仕事", "趣味", "ゲーム"],
    gray: ["仕事", "ゲーム"],
    notes: "ゲームは少量のもののみ。\n月間利用料目安：4000円(1日)",
    担当: "趣味(長時間)、ゲーム(少量)" },
  { id: "kaikatsu1", label: "快活クラブ(モード1)", icon: "📚",
    cost: "平日: 1h600円/3h1200円/6h1700円/9h2200円/12h2600円/24h4500円/ナイト12h2200円\n休日: 1h600円/3h1400円/6h2000円/9h2500円/12h2900円/24h4800円",
    hours: "いつでも", access: "徒歩20分",
    permitted: ["勉強", "仕事", "ゲーム", "漫画"],
    gray: ["仕事", "ゲーム"],
    notes: "1日の最初の1回は勉強1時間で漫画1巻、その後は勉強2時間で漫画1巻。\nゲームは少量のもののみ。\n推定努力密度：50%\n月間利用料目安：10000円",
    担当: "漫画勉強" },
  { id: "kaikatsu2", label: "快活クラブ(モード2)", icon: "📚", cost: "平日: 1h600円/3h1200円/6h1700円/9h2200円/12h2600円/24h4500円/ナイト12h2200円\n休日: 1h600円/3h1400円/6h2000円/9h2500円/12h2900円/24h4800円", hours: "いつでも", access: "徒歩20分",
    permitted: ["趣味", "ゲーム", "漫画", "Youtube"],
    gray: [],
    notes: "12時間以上できるときのみ開始可能。\n月間利用料目安：10000円",
    担当: "完全開放" },
  { id: "kaikatsu3", label: "快活クラブ(モード3)", icon: "📚", cost: "平日: 1h600円/3h1200円/6h1700円/9h2200円/12h2600円/24h4500円/ナイト12h2200円\n休日: 1h600円/3h1400円/6h2000円/9h2500円/12h2900円/24h4800円", hours: "いつでも", access: "徒歩20分",
    permitted: ["ゲーム", "漫画"],
    gray: ["ゲーム"],
    notes: "1日1時間まで、漫画1巻のみ。\n月間利用料目安：10000円",
    担当: "外出誘発漫画" },
  { id: "jikka1", label: "実家系(モード1)", icon: "🏡", cost: "0円", hours: "帰省時", access: "帰省時",
    permitted: ["勉強", "仕事"],
    gray: [],
    notes: "特になし",
    担当: "勉強、仕事" },
  { id: "jikka2", label: "実家系(モード2)", icon: "🏡", cost: "0円", hours: "帰省時", access: "帰省時",
    permitted: ["勉強", "仕事", "趣味", "ゲーム", "漫画"],
    gray: [],
    notes: "家(モード2)の貯蔵を使用する。",
    担当: "勉強、仕事、趣味、リラックス" },
];

const PLACES = [
  { key: "home", label: "家", icon: "🏠", envIds: ["home1","home2","home3"], modeLabels: ["モード1","モード2","モード3"] },
  { key: "outside", label: "外", icon: "🚶", envIds: ["outside"], modeLabels: [] },
  { key: "univ", label: "大学", icon: "🎓", envIds: ["univ1","univ2"], modeLabels: ["モード1","モード2"] },
  { key: "office", label: "オフィス", icon: "🏢", envIds: ["office"], modeLabels: [] },
  { key: "starbucks", label: "スターバックス", icon: "☕", envIds: ["starbucks"], modeLabels: [] },
  { key: "share", label: "SHARE LOUNGE", icon: "💼", envIds: ["share1","share2"], modeLabels: ["モード1","モード2"] },
  { key: "kaikatsu", label: "快活クラブ", icon: "📚", envIds: ["kaikatsu1","kaikatsu2","kaikatsu3"], modeLabels: ["モード1","モード2","モード3"] },
  { key: "jikka", label: "実家系", icon: "🏡", envIds: ["jikka1","jikka2"], modeLabels: ["モード1","モード2"] },
];

// =============================================
// 規程データ (GitHub で編集)
// R(条文, [関連環境ID]) — envIds空 = 全環境共通
// =============================================
const R = (text, envIds = []) => ({ text, envIds });

const BASIC_RULES_SUBS = [
  { key: "general", title: "一般", rules: [
    R("スマホでYoutubeを見てはいけない。"),
    R("寝室の外にアラームと靴下を設置した場合、もしくはもういつ寝てもよく、いつ起きてもいい状態でのみ、布団に入って良い。（家のモード3時はいつでも良い）", ["home1","home2","home3"]),
    R("ある環境やモードの許可が終わったら、別の環境に移動する。（家の場合は寝ても良い）"),
    R("緊急要請を含む例外措置はしてはいけない。（命や財産が脅かされる程の事態ではその限りではない）"),
    R("違反判定の方法として、「これ違反じゃない？」と思った瞬間にやめるかGeminiで判別し、違反だと分かった次の瞬間にもそれを続けていたら違反とする。違反の判別をしなかった場合も違反とする。"),
    R("重要な時事に関するニュースは許可する。"),
    R("その他のニュースは、NewsPicks、ヤフーニュースのみなら許可する。"),
  ]},
  { key: "schedule", title: "外出・就寝時間", rules: [
    R("大学やその他の予定がある日は、準備+朝食+移動+外出誘発行動で計4h30mは使うことを想定し、さらにそこから移動する時間も考えて、6h30mは寝られるよう、前日の睡眠時刻を合わせる。特に、大学までの移動は最低30mとする。"),
    R("大学やその他の予定がある日は、朝食30m(外出後の場合)+移動+外出誘発行動で計4hは使うことを想定し、さらにそこから移動する時間も考えて、十分早く外出する。特に、大学までの移動は最低30mとする。"),
    R("想定外の事態で上記の外出が間に合わない場合、快活クラブ(モード3)を許可する。"),
    R("大学やその他の予定が朝9時30分までにある日は、快活クラブ(モード3)を許可する。その際、準備+朝食+移動+快活クラブ(モード3)で計2h30mは使うことを想定し、さらにそこから移動する時間も考えて、6h30mは寝られるよう、前日の睡眠時刻を合わせる。特に、大学までの移動は最低30mとする。"),
    R("快活クラブ(モード3)が許可されている日は、朝食30m(外出後の場合)+移動+快活クラブ(モード3)で計2hは使うことを想定し、さらにそこから移動する時間も考えて、十分早く外出する。特に、大学までの移動は最低30mとする。"),
    R("想定外の事態で上記の外出が間に合わない場合、できる限り早く外出し、朝食も抜く。それ以上の対応はしない。これによる遅れは違反とはしない。"),
  ]},
  { key: "permitted", title: "許可行動", rules: [
    R("管理内の環境では、計測外として明示的に指定されたものおよび、環境で明示的に許可されたもののみやってよい。"),
    R("管理外の環境では、計測外として明示的に指定されたものおよび、管理内の環境で制御されていないもののみやってよい。"),
  ]},
  { key: "control", title: "制御規定", rules: [
    R("制御規定では、好きな時に追加規定を入れられる。ただし、報酬などは設定できず、違反時には違反時規定に従った罰則を受ける。"),
    R("制御規定では、外出誘発ができなくなるようなものを追加してはいけない"),
    R("制御規定では、「テストで100点とる」など、成功を条件にしてはいけない。「勉強を10時間やる」など、やることそのものを条件にする。"),
  ]},
  { key: "excluded", title: "計測外", rules: [
    R("システムに関する作業は計測外とする。"),
    R("【計測外（12h30m）】\n・睡眠 7h\n・食事 1h30m\n・移動 1h\n・運動 30m\n・家事 15m\n・外出準備 15m\n・健康習慣 30m\n・コミュニケーション 30m\n・ロス 1h"),
  ]},
];

const VIOLATION_RULES = [
  R("ある環境、モードで違反が起きた場合、即座に別の環境に移動する。（家の場合は寝ても良い）"),
  R("違反の当日~2日後はその環境、モードは使用不可（外をのぞく）。"),
  R("Youtubeによる違反の場合は、当日~2日後は家、快活クラブへの持ち込みは禁止で、その環境へ移動する前に必ずコインロッカーに預ける。"),
  R("スマホでYoutubeを見てしまった場合は、当日~2日後は家、快活クラブへの持ち込みは禁止で、その環境へ移動する前に必ずコインロッカーに預ける。"),
  R("快活クラブ(モード1)中にYoutubeをやってしまった場合は、快活クラブからモード2をなくし、機能を宝島に移行させる。", ["kaikatsu1"]),
  R("家にいるが、どのモードでもない（起床直後など）時はすぐに別の環境に移動するべきであるが、これをしなかった場合、当日と翌日は家に入ってはいけない。"),
];

const RESET_RULES = [
  R("環境「外」で違反時規定が破られた場合、3時間適当散歩を行って心をリセットする。", ["outside"]),
];

const DEFAULT_PERIOD_RULES = [
  {
    id: 1, label: "初週", startDate: "2026-04-06", endDate: "2026-04-12",
    guidelines: { "勉強": "5h", "仕事": "2h30m", "趣味": "2h", "リラックス": "1h30m" },
    choices: [
      "大学(モード1)で勉強",
      "オフィスで仕事",
      "快活クラブ(モード1)で漫画勉強",
      "スターバックスで勉強",
      "SHARE LOUNGE(モード1)で勉強",
    ],
    rules: [
      { text: "1h勉強または仕事をするごとに、0時までに就寝するごとに、家(モード2)の許可を10m貯蔵できる。", envIds: ["home2"], storageTag: "home2" },
      { text: "1h勉強または仕事をするごとに、快活クラブ(モード2)の許可を10m貯蔵できる。", envIds: ["kaikatsu2"], storageTag: "kaikatsu2" },
      R("その日の大学の授業をすべて受けて帰ってきて、家(モード2)の許可が2h以上あれば、それを使用できる。", ["univ1","univ2","home2"]),
      R("大学(モード2)は許可しない。", ["univ2"]),
      R("SHARE LOUNGE(モード2)は月に一度まで。", ["share2"]),
      R("10時までに外での用事がある場合、快活クラブ(モード3)を外出誘発用に許可する。", ["kaikatsu3"]),
    ],
    effects: [
      { envId: "home2", type: "storage_threshold", storageKey: "home2", threshold: 120, label: "家(モード2)貯蔵 2h以上で開始可能" },
      { envId: "jikka2", type: "storage_threshold", storageKey: "home2", threshold: 120, label: "家(モード2)貯蔵 2h以上で開始可能" },
      { envId: "kaikatsu2", type: "storage_threshold", storageKey: "kaikatsu2", threshold: 1, label: "快活クラブ(モード2)貯蔵 1m以上で開始可能" },
      { envId: "univ2", type: "denied" },
      { envId: "share2", type: "count_limit", storageKey: "share2_count", limit: 1, label: "SHARE LOUNGE(モード2)回数 1回まで" },
    ],
  },
];

const DEFAULT_CONTROL_RULES = [
  // { id: 1, label: "タイトル", startDate: "2026-04-06", endDate: "2026-04-12", rules: [...], effects: [...] }
];

const PHILOSOPHY = [
  R("環境による制限を利用し、勉強、仕事の量を保証しつつ、娯楽の量を制御する。"),
  R("家には制限がないので、勉強や仕事が必要な日は、朝やる気があるうちに他の環境に移動するよう仕向ける。", ["home1","home2","home3"]),
  R("やる気がない日でも、家(モード1)よりも良い環境があれば移動するだろうから、そのような環境は常に1つは許可しておく。外に出るとやる気が出て厳しい環境に移動できるようになることもあるから、そのような場合はそれを利用してもいい。", ["home1"]),
  R("快活クラブ(モード3)は短時間で外出を誘発する用途のみに使う。"),
  R("家、大学、SHARE LOUNGE、快活クラブのモード2は、モード1よりも確実に良いものなので、休息日等でなければ許可を条件付きにする。"),
  R("家(モード2)からは簡単には抜けられないので、勉強や仕事が必要な日は、もう寝てもいいような状態になってから許可する。そうすれば、別の環境に移動できなくても、寝てしまえば解決する。"),
  R("家以外の環境でのモチベーション維持のため、努力して帰ってきた場合にのみモード2を許可するようにする。"),
  R("家(モード3)が使用されたあとや、帰省後は、娯楽に対する欲求が一時的に強まるので、制限をかなり緩めた回復期を設ける。"),
  R("外出が必要な日は、朝起きてから外出までその日の予定を考えることはしないようにし、朝食、運動、外出準備のみに徹する。その後どこへ行くか、何をするかは、外出後の自分に任せる。", ["home1"]),
];

const RULE_SECTIONS = [
  { key: "basic", title: "📜 基本規程", subs: BASIC_RULES_SUBS },
  { key: "violation", title: "🚨 違反時規定", rules: VIOLATION_RULES },
  { key: "reset", title: "🔄 リセット規定", rules: RESET_RULES },
  { key: "philosophy", title: "💡 システムの理念", rules: PHILOSOPHY },
];

// =============================================
// 動的データ (localStorage に保存)
// =============================================
const DEFAULT_DYN = {
  currentEnv: null, violations: [], storage: {},
  streak: 0, streakRewards: [],
  periodRules: DEFAULT_PERIOD_RULES,
  controlRules: DEFAULT_CONTROL_RULES,
};

function loadDyn() {
  try { const r = localStorage.getItem("env-mgr-dyn-v9"); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveDyn(d) {
  try { localStorage.setItem("env-mgr-dyn-v9", JSON.stringify(d)); } catch {}
}

// =============================================
// ヘルパー
// =============================================
function isBanned(envId, violations) {
  const now = new Date();
  return violations.some(v => v.envId !== "outside" && v.envId === envId && new Date(v.bannedUntil) >= now);
}
function getBanEnd(envId, violations) {
  let latest = null;
  violations.forEach(v => { if (v.envId === envId && v.envId !== "outside") { const d = new Date(v.bannedUntil); if (!latest || d > latest) latest = d; } });
  return latest;
}
function hasDeviceBan(violations) {
  const now = new Date(); let pc = false, phone = false;
  violations.forEach(v => { if (new Date(v.bannedUntil) < now) return; if (v.type === "youtube_pc") pc = true; if (v.type === "youtube_phone") phone = true; });
  return { pc, phone };
}
function fmtDate(d) { const dt = new Date(d); return `${dt.getMonth()+1}/${dt.getDate()}`; }
function envLabel(id) { return ENVIRONMENTS.find(e => e.id === id)?.label || id; }
function ruleMatch(rule, filt) { return !filt || rule.envIds.length === 0 || rule.envIds.includes(filt); }
function fmtTime(mins) { const h = Math.floor(mins / 60); const m = mins % 60; return h > 0 ? `${h}h${m > 0 ? m + "m" : ""}` : `${m}m`; }

// 期間が今日を含むか判定
function isPeriodActive(period) {
  if (!period.startDate || !period.endDate) return true; // 日付未設定なら常にアクティブ
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(period.startDate + "T00:00:00");
  const end = new Date(period.endDate + "T23:59:59");
  return today >= start && today <= end;
}

function periodDisplayLabel(p) {
  const s = p.startDate || ""; const e = p.endDate || "";
  const range = s && e ? `${s.slice(5).replace("-","/")}~${e.slice(5).replace("-","/")}` : "";
  return range ? `${range} ${p.label}` : p.label;
}

// 記録キー定義
const STORAGE_KEYS = [
  { key: "home2", label: "家(モード2) 貯蔵", unit: "min" },
  { key: "kaikatsu2", label: "快活クラブ(モード2) 貯蔵", unit: "min" },
  { key: "share2_count", label: "SHARE LOUNGE(モード2) 回数", unit: "count" },
  { key: "study_mins", label: "勉強 合計時間", unit: "min" },
  { key: "work_mins", label: "仕事 合計時間", unit: "min" },
];

// アクティブな期間から特定storageKeyにタグ付けされたルールを収集
function collectStorageRules(dyn, storageKey) {
  const results = [];
  (dyn.periodRules || []).filter(isPeriodActive).forEach(p => {
    (p.rules || []).forEach(r => {
      if (r.storageTag === storageKey) results.push({ text: r.text, source: periodDisplayLabel(p) });
    });
  });
  (dyn.controlRules || []).filter(isPeriodActive).forEach(p => {
    (p.rules || []).forEach(r => {
      if (r.storageTag === storageKey) results.push({ text: r.text, source: periodDisplayLabel(p) });
    });
  });
  return results;
}

// effectを解決して表示用データを返す
function resolveEffect(eff, storage, source, periodStartDate) {
  const base = { envId: eff.envId, type: eff.type, source };
  if (eff.type === "denied") {
    return { ...base, blocked: true, color: "red", icon: "🚫", text: "不許可" };
  }
  if (eff.type === "count_limit") {
    const current = storage[eff.storageKey] || 0;
    const over = current >= eff.limit;
    return { ...base, blocked: over, color: over ? "red" : "orange",
      icon: over ? "🚫" : "📏",
      text: `${eff.label}（現在${current}/${eff.limit}回）` };
  }
  if (eff.type === "storage_threshold") {
    const current = storage[eff.storageKey] || 0;
    const sk = STORAGE_KEYS.find(s => s.key === eff.storageKey);
    const met = current >= eff.threshold;
    const curStr = sk?.unit === "min" ? fmtTime(current) : `${current}`;
    const thrStr = sk?.unit === "min" ? fmtTime(eff.threshold) : `${eff.threshold}`;
    return { ...base, blocked: !met, color: met ? "green" : "yellow",
      icon: met ? "✅" : "⚠️",
      text: `${eff.label}（${curStr} / ${thrStr}）` };
  }
  if (eff.type === "time_ratio") {
    // n分の記録値があるとき、24時までk*n分であれば許可
    // → 必要値 = (24 - 現在時) * 60 / k
    const current = storage[eff.storageKey] || 0;
    const sk = STORAGE_KEYS.find(s => s.key === eff.storageKey);
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    const remaining = Math.max(0, (24 - h) * 60);
    const threshold = Math.max(0, Math.ceil(remaining / eff.k));
    const met = current >= threshold;
    const curStr = sk?.unit === "min" ? fmtTime(current) : `${current}`;
    const thrStr = sk?.unit === "min" ? fmtTime(threshold) : `${threshold}`;
    return { ...base, blocked: !met, color: met ? "green" : "yellow",
      icon: met ? "✅" : "⚠️",
      text: `${eff.label}（${curStr} / ${thrStr} @${Math.floor(h)}時）` };
  }
  if (eff.type === "period_day_ratio") {
    // 期間のn日目においてk*n時間の記録値があれば許可
    // → 必要値 = k * dayNum * 60 (分)
    const current = storage[eff.storageKey] || 0;
    const sk = STORAGE_KEYS.find(s => s.key === eff.storageKey);
    let dayNum = 1;
    if (periodStartDate) {
      const start = new Date(periodStartDate + "T00:00:00");
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dayNum = Math.max(1, Math.floor((today - start) / 86400000) + 1);
    }
    const threshold = Math.max(0, Math.ceil(eff.k * dayNum * 60));
    const met = current >= threshold;
    const curStr = sk?.unit === "min" ? fmtTime(current) : `${current}`;
    const thrStr = sk?.unit === "min" ? fmtTime(threshold) : `${threshold}`;
    return { ...base, blocked: !met, color: met ? "green" : "yellow",
      icon: met ? "✅" : "⚠️",
      text: `${eff.label}（${curStr} / ${thrStr} ${dayNum}日目）` };
  }
  // unknown type fallback
  return { ...base, blocked: false, color: "yellow", icon: "❓", text: "不明な影響タイプ" };
}

// 全effects集約（アクティブな期間のみ） → { envId: [resolved] }
function collectEffects(dyn) {
  const map = {};
  const st = dyn.storage || {};
  const add = (eff, source, startDate) => {
    if (!eff.envId) return;
    if (!map[eff.envId]) map[eff.envId] = [];
    map[eff.envId].push(resolveEffect(eff, st, source, startDate));
  };
  (dyn.periodRules || []).filter(isPeriodActive).forEach(p => (p.effects || []).forEach(e => add(e, `📅${periodDisplayLabel(p)}`, p.startDate)));
  (dyn.controlRules || []).filter(isPeriodActive).forEach(p => (p.effects || []).forEach(e => add(e, `🔧${periodDisplayLabel(p)}`, p.startDate)));
  return map;
}

function EffectBadge({ effect }) {
  const colorMap = {
    red: { bg: C.redDim, fg: C.red },
    yellow: { bg: C.yellowDim, fg: C.yellow },
    orange: { bg: C.orangeDim, fg: C.orange },
    green: { bg: C.greenDim, fg: C.green },
  };
  const c = colorMap[effect.color] || colorMap.yellow;
  return (
    <div style={{ fontSize: 11, lineHeight: 1.4, padding: "3px 8px", borderRadius: 6, background: c.bg, color: c.fg, marginTop: 4 }}>
      {effect.icon} {effect.text}{effect.source && <span style={{ color: C.textDim, marginLeft: 6 }}>({effect.source})</span>}
    </div>
  );
}

// =============================================
// スタイル
// =============================================
const C = {
  bg: "#0f1117", card: "#1a1d27", accent: "#4f8cff", accentDim: "#2a4a8a",
  red: "#ff5a5a", redDim: "#6b2a2a", green: "#3dd68c", greenDim: "#1a4a36",
  yellow: "#ffc84f", yellowDim: "#5a4520", text: "#e8eaf0", textDim: "#7a7f8e",
  border: "#2a2d3a", orange: "#ff9f43", orangeDim: "#4a3318",
};
const S = {
  app: { background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'Noto Sans JP','Hiragino Sans',sans-serif", fontSize: 14, padding: "0 0 80px 0" },
  header: { padding: "16px 20px 8px", fontSize: 18, fontWeight: 700, letterSpacing: 1 },
  tabs: { display: "flex", position: "fixed", bottom: 0, left: 0, right: 0, background: C.card, borderTop: `1px solid ${C.border}`, zIndex: 100 },
  tab: (a) => ({ flex: 1, padding: "10px 0 12px", textAlign: "center", fontSize: 10, color: a ? C.accent : C.textDim, background: "none", border: "none", cursor: "pointer", fontWeight: a ? 700 : 400 }),
  tabIcon: { display: "block", fontSize: 17, marginBottom: 2 },
  card: { background: C.card, borderRadius: 12, margin: "8px 12px", padding: "14px 16px", border: `1px solid ${C.border}` },
  badge: (c) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: c === "red" ? C.redDim : C.greenDim, color: c === "red" ? C.red : C.green, marginLeft: 6 }),
  btn: (c = C.accent) => ({ background: c, color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%" }),
  btnSm: (c = C.accent) => ({ background: c, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }),
  btnOutline: { background: "none", color: C.accent, border: `1px solid ${C.accent}`, borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" },
  input: { background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, width: "100%", boxSizing: "border-box" },
  chip: (a) => ({ display: "inline-block", padding: "4px 10px", borderRadius: 20, fontSize: 12, margin: "2px 4px 2px 0", background: a ? C.accentDim : C.bg, color: a ? C.accent : C.textDim, border: `1px solid ${a ? C.accent : C.border}` }),
  permitted: { display: "inline-block", padding: "3px 8px", borderRadius: 6, fontSize: 11, margin: "2px 3px 2px 0", background: C.greenDim, color: C.green },
  envTag: { display: "inline-block", padding: "1px 6px", borderRadius: 4, fontSize: 10, margin: "1px 2px", background: C.orangeDim, color: C.orange },
  section: { color: C.textDim, fontSize: 12, fontWeight: 600, padding: "12px 20px 4px", letterSpacing: 1 },
  warn: { background: "#3a1a1a", border: `1px solid ${C.red}`, borderRadius: 10, margin: "8px 12px", padding: "12px 16px", color: C.red, fontSize: 13 },
};

// =============================================
// 共通コンポーネント
// =============================================
function TabBar({ tab, setTab }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "ホーム" },
    { id: "storage", icon: "💰", label: "記録" },
    { id: "violation", icon: "⚠️", label: "違反" },
    { id: "rules", icon: "📋", label: "規程" },
  ];
  return <div style={S.tabs}>{tabs.map(t => <button key={t.id} style={S.tab(tab===t.id)} onClick={()=>setTab(t.id)}><span style={S.tabIcon}>{t.icon}</span>{t.label}</button>)}</div>;
}

function DeviceWarning({ violations, currentEnv }) {
  const { pc, phone } = hasDeviceBan(violations);
  if (!pc && !phone) return null;
  const restricted = ["home1","home2","home3","kaikatsu1","kaikatsu2","kaikatsu3"].includes(currentEnv);
  if (!restricted) return null;
  return <div style={S.warn}>{pc && <div>⚠️ PC持ち込み禁止中（コインロッカーへ）</div>}{phone && <div>⚠️ スマホ持ち込み禁止中（コインロッカーへ）</div>}</div>;
}

function Toggle({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "none", border: "none", color: C.text, cursor: "pointer" }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
        <span style={{ color: C.textDim, fontSize: 16, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
      </button>
      {open && <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${C.border}` }}>{children}</div>}
    </div>
  );
}

function RuleList({ rules, filterEnvId }) {
  const filtered = rules.filter(r => ruleMatch(r, filterEnvId));
  if (filtered.length === 0) return <div style={{ color: C.textDim, fontSize: 12, padding: "8px 0" }}>（該当する条文なし）</div>;
  return filtered.map((r, i) => (
    <div key={i} style={{ fontSize: 12, lineHeight: 1.6, color: C.text, padding: "6px 0", borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", whiteSpace: "pre-line" }}>
      {r.text}
      {r.envIds.length > 0 && <div style={{ marginTop: 2 }}>{r.envIds.map(id => <span key={id} style={S.envTag}>{envLabel(id)}</span>)}</div>}
    </div>
  ));
}

// =============================================
// ホームタブ
// =============================================
function HomeTab({ dyn, setDyn }) {
  const { currentEnv, violations } = dyn;
  const cur = ENVIRONMENTS.find(e => e.id === currentEnv);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const effects = collectEffects(dyn);

  const setEnv = (id) => { const n = { ...dyn, currentEnv: id }; setDyn(n); saveDyn(n); setSelectorOpen(false); setSelectedPlace(null); };
  const clearEnv = () => { const n = { ...dyn, currentEnv: null }; setDyn(n); saveDyn(n); };
  const curPlace = currentEnv ? PLACES.find(p => p.envIds.includes(currentEnv)) : null;
  const isDenied = (eid) => (effects[eid] || []).some(e => e.blocked);

  return (
    <div>
      <div style={S.header}>環境管理システム</div>
      <DeviceWarning violations={violations} currentEnv={currentEnv} />

      <div style={S.card}>
        <div style={{ color: C.textDim, fontSize: 11, marginBottom: 6 }}>現在の環境</div>
        {cur ? (
          (() => {
            const graySet = new Set(cur.gray || []);
            const noteLines = (cur.notes || "").split("\n");
            const density = noteLines.find(l => l.startsWith("推定努力密度"));
            const monthlyCost = noteLines.find(l => l.startsWith("月間利用料目安"));
            const ruleLines = noteLines.filter(l => !l.startsWith("推定努力密度") && !l.startsWith("月間利用料目安") && l.trim() !== "特になし").join("\n").trim();
            return (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{cur.icon} {cur.label}{isBanned(currentEnv, violations) && <span style={S.badge("red")}>使用禁止中</span>}</div>
                <div style={{ marginTop: 8 }}>{cur.permitted.map(a => <span key={a} style={{ ...S.permitted, ...(graySet.has(a) ? { background: C.yellowDim, color: C.yellow } : {}) }}>{a}</span>)}</div>
                {cur.担当 && <div style={{ color: C.yellow, fontSize: 12, marginTop: 6 }}>担当: {cur.担当}</div>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8, fontSize: 11, color: C.textDim }}>
                  <div>💰 {cur.cost}</div>
                  <div>🕐 {cur.hours}</div>
                  <div>📍 {cur.access}</div>
                </div>
                {(density || monthlyCost) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6, fontSize: 11, color: C.accent }}>
                    {density && <div>📊 {density}</div>}
                    {monthlyCost && <div>💳 {monthlyCost}</div>}
                  </div>
                )}
                {(effects[currentEnv] || []).map((eff, i) => <EffectBadge key={i} effect={eff} />)}
                {ruleLines && (
                  <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 8, background: C.bg, border: `1px solid ${C.yellow}44`, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    <div style={{ fontSize: 10, color: C.yellow, marginBottom: 4, fontWeight: 600 }}>📌 ルール</div>
                    <div style={{ fontSize: 12, color: C.text }}>{ruleLines}</div>
                  </div>
                )}
              </div>
            );
          })()
        ) : <div style={{ color: C.textDim, fontSize: 13 }}>未選択</div>}
      </div>

      {!selectorOpen ? (
        <div style={{ padding: "0 12px", display: "flex", gap: 8 }}>
          <button style={{ ...S.btn(), flex: 1 }} onClick={() => setSelectorOpen(true)}>{currentEnv ? "環境を変更" : "環境を選択"}</button>
          {currentEnv && <button style={{ ...S.btnOutline, flex: "0 0 auto" }} onClick={clearEnv}>解除</button>}
        </div>
      ) : !selectedPlace ? (
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>場所を選択</div>
            <button style={{ background: "none", border: "none", color: C.textDim, fontSize: 13, cursor: "pointer" }} onClick={() => setSelectorOpen(false)}>✕</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PLACES.map(p => {
              const allBanned = p.envIds.every(id => isBanned(id, violations));
              const allBlocked = p.envIds.every(id => isDenied(id) || isBanned(id, violations));
              const isCur = curPlace?.key === p.key;
              return (
                <button key={p.key} onClick={() => { if (allBanned) return; setSelectedPlace(p); }}
                  style={{ background: isCur ? C.accentDim : C.bg, border: `1px solid ${isCur ? C.accent : allBlocked ? C.red+"44" : C.border}`, borderRadius: 10, padding: "14px 10px", cursor: allBanned ? "default" : "pointer", opacity: allBanned ? 0.4 : allBlocked ? 0.5 : 1, textAlign: "center", color: C.text }}>
                  <div style={{ fontSize: 22 }}>{p.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{p.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedPlace.icon} {selectedPlace.label} — モード選択</div>
            <button style={{ background: "none", border: "none", color: C.textDim, fontSize: 13, cursor: "pointer" }} onClick={() => setSelectedPlace(null)}>← 戻る</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedPlace.envIds.map((eid, i) => {
              const env = ENVIRONMENTS.find(e => e.id === eid);
              const banned = isBanned(eid, violations); const banEnd = getBanEnd(eid, violations); const isAct = currentEnv === eid;
              const denied = isDenied(eid);
              const envEffects = effects[eid] || [];
              const blocked = banned || denied;
              const graySet = new Set(env.gray || []);
              return (
                <button key={eid} onClick={() => !blocked && setEnv(eid)}
                  style={{ background: isAct ? C.accentDim : C.bg, border: `1px solid ${isAct ? C.accent : blocked ? C.red+"44" : C.border}`, borderRadius: 10, padding: "12px 14px", cursor: blocked ? "default" : "pointer", opacity: blocked ? 0.5 : 1, textAlign: "left", color: C.text }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{selectedPlace.modeLabels[i] || env.label}</div>
                  <div style={{ marginTop: 6 }}>{env.permitted.map(a => <span key={a} style={{ ...S.permitted, ...(graySet.has(a) ? { background: C.yellowDim, color: C.yellow } : {}) }}>{a}</span>)}</div>
                  {env.担当 && <div style={{ color: C.yellow, fontSize: 11, marginTop: 4 }}>担当: {env.担当}</div>}
                  {envEffects.map((eff, ei) => <EffectBadge key={ei} effect={eff} />)}
                  {env.notes && env.notes !== "特になし" && (() => { const filtered = env.notes.split("\n").filter(l => !l.startsWith("推定努力密度") && !l.startsWith("月間利用料目安")).join("\n").trim(); return filtered ? <div style={{ color: C.textDim, fontSize: 11, marginTop: 4, whiteSpace: "pre-line" }}>{filtered}</div> : null; })()}
                  {banned && <div style={{ color: C.red, fontSize: 11, marginTop: 4 }}>🚫 {fmtDate(banEnd)}まで使用禁止</div>}
                  {isAct && <div style={{ color: C.accent, fontSize: 11, marginTop: 4 }}>● 現在地</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Toggle title="🚶 起床・外出後の選択肢" defaultOpen={!currentEnv || currentEnv.startsWith("home")}>
          {dyn.periodRules.filter(isPeriodActive).map((p, pi) => {
            if (!(p.choices || []).length) return null;
            return (
              <div key={p.id} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: C.textDim, marginBottom: 6 }}>{periodDisplayLabel(p)}</div>
                {p.choices.map((c, i) => (
                  <div key={i} style={{ fontSize: 13, color: C.text, padding: "4px 0 4px 10px", borderLeft: `2px solid ${C.accent}` }}>{c}</div>
                ))}
              </div>
            );
          })}
          {dyn.periodRules.filter(isPeriodActive).every(p => !(p.choices || []).length) && (
            <div style={{ fontSize: 12, color: C.textDim }}>（現在の期間に選択肢が設定されていません）</div>
          )}
        </Toggle>
      </div>

      <div style={{ marginTop: 8 }}>
        <Toggle title="📋 やること表">
          <div style={{ overflowX: "auto", margin: "8px -8px 0" }}>
            <table style={{ borderCollapse: "collapse", fontSize: 11, width: "100%", minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}`, position: "sticky", left: 0, background: C.card, zIndex: 1, fontWeight: 600, textAlign: "left", minWidth: 100 }}>環境</th>
                  {["勉強","仕事","趣味","ゲーム","漫画","YT"].map(a => (
                    <th key={a} style={{ padding: "6px 4px", borderBottom: `1px solid ${C.border}`, fontWeight: 600, textAlign: "center", minWidth: 36 }}>{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ENVIRONMENTS.map(env => (
                  <tr key={env.id}>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${C.border}`, position: "sticky", left: 0, background: C.card, zIndex: 1, fontWeight: 500, whiteSpace: "nowrap" }}>{env.label}</td>
                    {["勉強","仕事","趣味","ゲーム","漫画","Youtube"].map(a => {
                      const isPermitted = env.permitted.includes(a);
                      const isGray = (env.gray || []).includes(a);
                      return (
                        <td key={a} style={{ padding: "5px 4px", borderBottom: `1px solid ${C.border}`, textAlign: "center",
                          color: !isPermitted ? C.border : isGray ? C.textDim : C.green }}>
                          {!isPermitted ? "" : isGray ? "△" : "◯"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Toggle>
      </div>
    </div>
  );
}

// =============================================
// 記録タブ
// =============================================
function TimeCard({ id, label, color, steps, mins, onAdjust, editTarget, amount, setAmount, onSetDirect, onStartEdit, onCancelEdit, storageRules }) {
  return (
    <div style={S.card}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: mins > 0 ? color : C.textDim }}>{fmtTime(mins)}</div>
      {storageRules && storageRules.length > 0 && (
        <div style={{ marginTop: 6, padding: "6px 8px", borderRadius: 6, background: C.bg, border: `1px solid ${C.border}` }}>
          {storageRules.map((r, i) => (
            <div key={i} style={{ fontSize: 11, color: C.text, lineHeight: 1.5, padding: "2px 0" }}>
              {r.text}
              <span style={{ color: C.textDim, fontSize: 10, marginLeft: 4 }}>({r.source})</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {steps.map(s => <button key={s} style={{ ...S.btnOutline, flex: 1 }} onClick={() => onAdjust(id, s)}>{s > 0 ? "+" : ""}{Math.abs(s) >= 60 ? `${s/60}h` : `${s}m`}</button>)}
      </div>
      {editTarget === id ? (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input style={{ ...S.input, flex: 1 }} type="number" placeholder="分" value={amount} onChange={e => setAmount(e.target.value)} />
          <button style={S.btnOutline} onClick={() => onSetDirect(id)}>設定</button>
          <button style={{ ...S.btnOutline, color: C.textDim, borderColor: C.textDim }} onClick={onCancelEdit}>×</button>
        </div>
      ) : <button style={{ ...S.btnOutline, marginTop: 8, width: "100%", textAlign: "center" }} onClick={() => onStartEdit(id)}>直接入力</button>}
    </div>
  );
}

function StorageTab({ dyn, setDyn }) {
  const [editTarget, setEditTarget] = useState(null);
  const [amount, setAmount] = useState("");
  const st = dyn.storage;
  const upd = (key, val) => { const n = { ...dyn, storage: { ...st, [key]: val } }; setDyn(n); saveDyn(n); };
  const adjust = (key, d) => upd(key, Math.max(0, (st[key] || 0) + d));
  const setDirect = (key) => { const v = parseInt(amount); if (isNaN(v)) return; upd(key, Math.max(0, v)); setEditTarget(null); setAmount(""); };
  const startEdit = (id) => { setEditTarget(id); setAmount(String(st[id] || 0)); };
  const cancelEdit = () => setEditTarget(null);

  const tcProps = { editTarget, amount, setAmount, onAdjust: adjust, onSetDirect: setDirect, onStartEdit: startEdit, onCancelEdit: cancelEdit };

  return (
    <div>
      <div style={S.header}>記録・貯蔵管理</div>
      <div style={S.section}>活動記録</div>
      <TimeCard id="study_mins" label="勉強 合計時間" color={C.accent} steps={[-60, -10, 10, 60]} mins={st.study_mins || 0} storageRules={collectStorageRules(dyn, "study_mins")} {...tcProps} />
      <TimeCard id="work_mins" label="仕事 合計時間" color={C.accent} steps={[-60, -10, 10, 60]} mins={st.work_mins || 0} storageRules={collectStorageRules(dyn, "work_mins")} {...tcProps} />
      <div style={S.section}>貯蔵ポイント</div>
      <TimeCard id="home2" label="家(モード2) 貯蔵" color={C.green} steps={[-60, -10, 10, 60]} mins={st.home2 || 0} storageRules={collectStorageRules(dyn, "home2")} {...tcProps} />
      <TimeCard id="kaikatsu2" label="快活クラブ(モード2) 貯蔵" color={C.green} steps={[-60, -10, 10, 60]} mins={st.kaikatsu2 || 0} storageRules={collectStorageRules(dyn, "kaikatsu2")} {...tcProps} />
      <div style={S.section}>利用回数</div>
      <div style={S.card}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>SHARE LOUNGE(モード2) 使用回数</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: (st.share2_count || 0) > 0 ? C.yellow : C.textDim }}>{st.share2_count || 0}回</div>
        {(() => { const sr = collectStorageRules(dyn, "share2_count"); return sr.length > 0 && (
          <div style={{ marginTop: 6, padding: "6px 8px", borderRadius: 6, background: C.bg, border: `1px solid ${C.border}` }}>
            {sr.map((r, i) => (
              <div key={i} style={{ fontSize: 11, color: C.text, lineHeight: 1.5, padding: "2px 0" }}>
                {r.text}
                <span style={{ color: C.textDim, fontSize: 10, marginLeft: 4 }}>({r.source})</span>
              </div>
            ))}
          </div>
        ); })()}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button style={{ ...S.btnOutline, flex: 1 }} onClick={() => adjust("share2_count", -1)}>-1</button>
          <button style={{ ...S.btnOutline, flex: 1 }} onClick={() => adjust("share2_count", 1)}>+1</button>
        </div>
      </div>

      <div style={S.section}>無違反連続日数</div>
      <StreakCard dyn={dyn} setDyn={setDyn} />
    </div>
  );
}

function StreakCard({ dyn, setDyn }) {
  const [editDays, setEditDays] = useState(false);
  const [daysInput, setDaysInput] = useState("");
  const [newDays, setNewDays] = useState("");
  const [newReward, setNewReward] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const streak = dyn.streak || 0;
  const rewards = dyn.streakRewards || [];
  const save = (n) => { setDyn(n); saveDyn(n); };
  const adjust = (d) => save({ ...dyn, streak: Math.max(0, streak + d) });
  const setDirect = () => { const v = parseInt(daysInput); if (isNaN(v)) return; save({ ...dyn, streak: Math.max(0, v) }); setEditDays(false); setDaysInput(""); };
  const addReward = () => { if (!newDays.trim() || !newReward.trim()) return; const d = parseInt(newDays); if (isNaN(d) || d <= 0) return; save({ ...dyn, streakRewards: [...rewards, { days: d, reward: newReward.trim() }].sort((a, b) => a.days - b.days) }); setNewDays(""); setNewReward(""); };
  const delReward = (i) => { save({ ...dyn, streakRewards: rewards.filter((_, j) => j !== i) }); setConfirmDel(null); };

  const nextReward = rewards.find(r => r.days > streak);

  return (
    <div style={S.card}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>🔥 無違反連続日数</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: streak > 0 ? C.accent : C.textDim }}>{streak}日</div>
      {nextReward && <div style={{ fontSize: 11, color: C.yellow, marginTop: 4 }}>次の報酬まであと {nextReward.days - streak}日（{nextReward.days}日目: {nextReward.reward}）</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button style={{ ...S.btnOutline, flex: 1 }} onClick={() => adjust(-1)}>-1</button>
        <button style={{ ...S.btnOutline, flex: 1 }} onClick={() => adjust(1)}>+1</button>
      </div>
      {editDays ? (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input style={{ ...S.input, flex: 1 }} type="number" placeholder="日数" value={daysInput} onChange={e => setDaysInput(e.target.value)} />
          <button style={S.btnOutline} onClick={setDirect}>設定</button>
          <button style={{ ...S.btnOutline, color: C.textDim, borderColor: C.textDim }} onClick={() => setEditDays(false)}>×</button>
        </div>
      ) : <button style={{ ...S.btnOutline, marginTop: 8, width: "100%", textAlign: "center" }} onClick={() => { setEditDays(true); setDaysInput(String(streak)); }}>直接入力</button>}

      <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 10 }}>
        <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 8 }}>🎁 報酬設定</div>
        {rewards.length > 0 ? rewards.map((r, i) => (
          <div key={i} style={{ padding: "6px 0", borderBottom: i < rewards.length - 1 ? `1px solid ${C.border}` : "none" }}>
            {confirmDel === i ? (
              <div style={{ background: C.redDim, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 12, color: C.red, marginBottom: 8 }}>この報酬を削除しますか？</div>
                <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>「{r.days}日目: {r.reward}」</div>
                <div style={{ display: "flex", gap: 8 }}><button style={S.btnSm(C.red)} onClick={() => delReward(i)}>削除する</button><button style={S.btnSm(C.textDim)} onClick={() => setConfirmDel(null)}>やめる</button></div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: r.days <= streak ? C.green : C.accent, fontWeight: 600 }}>{r.days}日目</span>
                  <span style={{ color: C.text, marginLeft: 8 }}>{r.reward}</span>
                  {r.days <= streak && <span style={{ color: C.green, marginLeft: 6, fontSize: 10 }}>✓達成</span>}
                </div>
                <button style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 13 }} onClick={() => setConfirmDel(i)}>×</button>
              </div>
            )}
          </div>
        )) : <div style={{ fontSize: 11, color: C.textDim }}>報酬が未設定です</div>}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input style={{ ...S.input, width: 60 }} type="number" placeholder="日数" value={newDays} onChange={e => setNewDays(e.target.value)} />
          <input style={{ ...S.input, flex: 1 }} placeholder="報酬内容" value={newReward} onChange={e => setNewReward(e.target.value)} />
          <button style={S.btnOutline} onClick={addReward}>追加</button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// 違反タブ
// =============================================
function ViolationTab({ dyn, setDyn }) {
  const [showForm, setShowForm] = useState(false);
  const [selEnv, setSelEnv] = useState("");
  const [selType, setSelType] = useState("general");
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const [selDate, setSelDate] = useState(getToday());
  const vTypes = [
    { id: "general", label: "一般違反" },
    { id: "youtube_pc", label: "Youtube違反" },
    { id: "youtube_phone", label: "スマホでYoutube" },
    { id: "no_mode_home", label: "家(無モード)での滞在" },
    { id: "kaikatsu1_youtube", label: "快活(モード1)でYoutube" },
  ];

  // 環境選択の制御
  const envFixed = selType === "kaikatsu1_youtube" || selType === "no_mode_home";
  const getFixedEnv = (type) => {
    if (type === "kaikatsu1_youtube") return "kaikatsu1";
    if (type === "no_mode_home") return "home1"; // 家(無モード)として記録
    return "";
  };

  const handleTypeChange = (type) => {
    setSelType(type);
    if (type === "kaikatsu1_youtube" || type === "no_mode_home") {
      setSelEnv(getFixedEnv(type));
    }
  };

  const add = () => {
    const envId = envFixed ? getFixedEnv(selType) : selEnv;
    if (!envId) return;
    const d = new Date(selDate + "T12:00:00"); const bu = new Date(d);
    bu.setDate(bu.getDate() + (selType === "no_mode_home" ? 1 : 2));
    bu.setHours(23, 59, 59);
    const v = { id: Date.now(), envId, type: selType, date: d.toISOString(), bannedUntil: bu.toISOString() };
    const n = { ...dyn, violations: [...dyn.violations, v] }; setDyn(n); saveDyn(n);
    setShowForm(false); setSelEnv(""); setSelType("general"); setSelDate(getToday());
  };
  const remove = (vid) => { const n = { ...dyn, violations: dyn.violations.filter(v => v.id !== vid) }; setDyn(n); saveDyn(n); };
  const active = dyn.violations.filter(v => new Date(v.bannedUntil) >= new Date());
  const past = dyn.violations.filter(v => new Date(v.bannedUntil) < new Date()).slice(-10);

  // デバイス禁止の期限を取得
  const getDeviceBanEnd = (type) => {
    let latest = null;
    const now = new Date();
    dyn.violations.forEach(v => {
      if (new Date(v.bannedUntil) < now) return;
      if (v.type === type) {
        const d = new Date(v.bannedUntil);
        if (!latest || d > latest) latest = d;
      }
    });
    return latest;
  };
  // youtube_pc, kaikatsu1_youtube → PC禁止, youtube_phone → スマホ禁止
  const pcBanEnd = (() => {
    let latest = null; const now = new Date();
    dyn.violations.forEach(v => {
      if (new Date(v.bannedUntil) < now) return;
      if (v.type === "youtube_pc" || v.type === "kaikatsu1_youtube") {
        const d = new Date(v.bannedUntil); if (!latest || d > latest) latest = d;
      }
    });
    return latest;
  })();
  const phoneBanEnd = getDeviceBanEnd("youtube_phone");

  // 家(無モード)違反 → 家全体の禁止期限
  const homeBanEnd = (() => {
    let latest = null; const now = new Date();
    dyn.violations.forEach(v => {
      if (new Date(v.bannedUntil) < now) return;
      if (v.type === "no_mode_home") {
        const d = new Date(v.bannedUntil); if (!latest || d > latest) latest = d;
      }
    });
    return latest;
  })();

  return (
    <div>
      <div style={S.header}>違反・罰則管理</div>

      {!showForm ? (
        <div style={{ padding: "0 12px", marginBottom: 8 }}><button style={S.btn(C.red)} onClick={() => { setSelDate(getToday()); setShowForm(true); }}>違反を記録</button></div>
      ) : (
        <div style={S.card}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>違反の記録</div>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>発生日 (YYYY-MM-DD)</div>
          <input type="text" style={{ ...S.input, marginBottom: 8 }} value={selDate} onChange={e => setSelDate(e.target.value)} placeholder="2026-04-08" />
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>違反種別</div>
          <select style={{ ...S.input, marginBottom: 8 }} value={selType} onChange={e => handleTypeChange(e.target.value)}>
            {vTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          {envFixed ? (
            <div style={{ ...S.input, marginBottom: 8, color: C.textDim, background: C.bg }}>
              {selType === "kaikatsu1_youtube" ? "快活クラブ(モード1)" : "家(無モード)"}
            </div>
          ) : (
            <select style={{ ...S.input, marginBottom: 8 }} value={selEnv} onChange={e => setSelEnv(e.target.value)}>
              <option value="">環境を選択</option>
              {ENVIRONMENTS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
            </select>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...S.btn(C.red), flex: 1 }} onClick={add}>記録する</button>
            <button style={{ ...S.btnOutline, flex: 1 }} onClick={() => setShowForm(false)}>キャンセル</button>
          </div>
        </div>
      )}

      {(active.length > 0 || pcBanEnd || phoneBanEnd || homeBanEnd) && <>
        <div style={S.section}>有効な罰則</div>

        {pcBanEnd && (
          <div style={{ ...S.card, borderColor: C.red }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 600, color: C.red }}>⚠️ PC持ち込み禁止</div><div style={{ fontSize: 11, color: C.textDim }}>家・快活クラブではコインロッカーへ</div></div>
              <div style={{ fontSize: 12, color: C.red }}>~{fmtDate(pcBanEnd)}</div>
            </div>
          </div>
        )}
        {phoneBanEnd && (
          <div style={{ ...S.card, borderColor: C.red }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 600, color: C.red }}>⚠️ スマホ持ち込み禁止</div><div style={{ fontSize: 11, color: C.textDim }}>家・快活クラブではコインロッカーへ</div></div>
              <div style={{ fontSize: 12, color: C.red }}>~{fmtDate(phoneBanEnd)}</div>
            </div>
          </div>
        )}
        {homeBanEnd && (
          <div style={{ ...S.card, borderColor: C.red }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 600, color: C.red }}>⚠️ 家への入室禁止</div><div style={{ fontSize: 11, color: C.textDim }}>家(無モード)での滞在による罰則</div></div>
              <div style={{ fontSize: 12, color: C.red }}>~{fmtDate(homeBanEnd)}</div>
            </div>
          </div>
        )}

        {active.map(v => {
          const env = ENVIRONMENTS.find(e => e.id === v.envId);
          const vt = vTypes.find(t => t.id === v.type);
          const envName = v.type === "no_mode_home" ? "家(無モード)" : (env?.label || v.envId);
          return (
            <div key={v.id} style={{ ...S.card, borderColor: C.red }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontWeight: 600, color: C.red }}>{envName}</div><div style={{ fontSize: 11, color: C.textDim }}>{vt?.label} | {fmtDate(v.date)}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, color: C.red }}>~{fmtDate(v.bannedUntil)}</div><button style={{ fontSize: 11, color: C.textDim, background: "none", border: "none", cursor: "pointer", marginTop: 4 }} onClick={() => remove(v.id)}>取消</button></div>
              </div>
            </div>
          );
        })}
      </>}
      {past.length > 0 && <>
        <div style={S.section}>過去の違反</div>
        {past.map(v => {
          const env = ENVIRONMENTS.find(e => e.id === v.envId);
          const envName = v.type === "no_mode_home" ? "家(無モード)" : (env?.label || v.envId);
          return <div key={v.id} style={{ ...S.card, opacity: 0.5 }}><span style={{ fontWeight: 600 }}>{envName}</span><span style={{ fontSize: 11, color: C.textDim, marginLeft: 8 }}>{fmtDate(v.date)}</span><button style={{ float: "right", fontSize: 11, color: C.textDim, background: "none", border: "none", cursor: "pointer" }} onClick={() => remove(v.id)}>削除</button></div>;
        })}
      </>}
    </div>
  );
}

// =============================================
// 編集可能な条文リスト
// =============================================
function EditableRuleList({ rules, onUpdate, filterEnvId }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftEnvIds, setDraftEnvIds] = useState([]);
  const [draftStorageTag, setDraftStorageTag] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState("");
  const [editEnvIds, setEditEnvIds] = useState([]);
  const [editStorageTag, setEditStorageTag] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const [showEnvPicker, setShowEnvPicker] = useState(null);

  const filtered = rules.map((r, i) => ({ r, i })).filter(({ r }) => ruleMatch(r, filterEnvId));
  const add = () => { if (!draft.trim()) return; onUpdate([...rules, { text: draft.trim(), envIds: [...draftEnvIds], ...(draftStorageTag ? { storageTag: draftStorageTag } : {}) }]); setDraft(""); setDraftEnvIds([]); setDraftStorageTag(""); };
  const remove = (i) => { onUpdate(rules.filter((_, idx) => idx !== i)); setConfirmDel(null); };
  const saveEdit = () => {
    if (editIdx === null) return;
    const n = [...rules];
    const upd = { ...n[editIdx], text: editText, envIds: [...editEnvIds] };
    if (editStorageTag) upd.storageTag = editStorageTag; else delete upd.storageTag;
    n[editIdx] = upd; onUpdate(n); setEditIdx(null); setShowEnvPicker(null);
  };
  const toggleEnv = (list, setList, id) => setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

  const EnvPicker = ({ envIds, setEnvIds }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4, padding: 6, background: C.bg, borderRadius: 6 }}>
      {ENVIRONMENTS.map(e => (
        <span key={e.id} style={{ ...S.chip(envIds.includes(e.id)), fontSize: 10, padding: "2px 6px", cursor: "pointer" }} onClick={() => toggleEnv(envIds, setEnvIds, e.id)}>{e.label}</span>
      ))}
    </div>
  );

  const EnvTags = ({ envIds, onToggle }) => (
    <div style={{ marginTop: 2, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
      {envIds.length === 0 ? <span style={{ fontSize: 10, color: C.textDim }}>全環境共通</span>
        : envIds.map(id => <span key={id} style={S.envTag}>{envLabel(id)}</span>)}
      <button style={{ background: "none", border: "none", color: C.accent, fontSize: 10, cursor: "pointer", padding: "0 4px" }} onClick={onToggle}>
        {showEnvPicker ? "閉じる" : "環境"}
      </button>
    </div>
  );

  const StorageTagBadge = ({ tag }) => {
    if (!tag) return null;
    const sk = STORAGE_KEYS.find(s => s.key === tag);
    return <span style={{ display: "inline-block", padding: "1px 6px", borderRadius: 4, fontSize: 10, background: C.accentDim, color: C.accent, marginLeft: 4 }}>📊 {sk?.label || tag}</span>;
  };

  const StorageTagSelect = ({ value, onChange }) => (
    <select style={{ ...S.input, fontSize: 11, marginTop: 4 }} value={value} onChange={e => onChange(e.target.value)}>
      <option value="">記録タグなし</option>
      {STORAGE_KEYS.map(s => <option key={s.key} value={s.key}>📊 {s.label}</option>)}
    </select>
  );

  if (!editing) {
    return (
      <div>
        {filtered.length === 0 && <div style={{ color: C.textDim, fontSize: 12, padding: "8px 0" }}>{filterEnvId ? "（該当する条文なし）" : "（条文なし）"}</div>}
        {filtered.map(({ r, i }) => (
          <div key={i} style={{ fontSize: 12, lineHeight: 1.6, color: C.text, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
            {r.text}
            <div style={{ marginTop: 2 }}>
              {r.envIds.length > 0 && r.envIds.map(id => <span key={id} style={S.envTag}>{envLabel(id)}</span>)}
              <StorageTagBadge tag={r.storageTag} />
            </div>
          </div>
        ))}
        <button style={{ ...S.btnSm(), marginTop: 8 }} onClick={() => setEditing(true)}>編集</button>
      </div>
    );
  }

  return (
    <div>
      {rules.map((r, i) => (
        <div key={i} style={{ padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
          {confirmDel === i ? (
            <div style={{ background: C.redDim, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 12, color: C.red, marginBottom: 8 }}>この条文を削除しますか？</div>
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>「{r.text.length > 40 ? r.text.slice(0, 40) + "…" : r.text}」</div>
              <div style={{ display: "flex", gap: 8 }}><button style={S.btnSm(C.red)} onClick={() => remove(i)}>削除する</button><button style={S.btnSm(C.textDim)} onClick={() => setConfirmDel(null)}>やめる</button></div>
            </div>
          ) : editIdx === i ? (
            <div>
              <textarea style={{ ...S.input, fontSize: 12, minHeight: 60 }} value={editText} onChange={e => setEditText(e.target.value)} />
              <EnvTags envIds={editEnvIds} onToggle={() => setShowEnvPicker(showEnvPicker === "edit" ? null : "edit")} />
              {showEnvPicker === "edit" && <EnvPicker envIds={editEnvIds} setEnvIds={setEditEnvIds} />}
              <StorageTagSelect value={editStorageTag} onChange={setEditStorageTag} />
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}><button style={S.btnSm()} onClick={saveEdit}>保存</button><button style={S.btnSm(C.textDim)} onClick={() => { setEditIdx(null); setShowEnvPicker(null); }}>取消</button></div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5 }}>
                {r.text}
                <div style={{ marginTop: 2 }}>
                  {r.envIds.length > 0 && r.envIds.map(id => <span key={id} style={S.envTag}>{envLabel(id)}</span>)}
                  <StorageTagBadge tag={r.storageTag} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                <button style={{ background: "none", border: "none", color: C.accent, fontSize: 11, cursor: "pointer", padding: "2px 4px" }} onClick={() => { setEditIdx(i); setEditText(r.text); setEditEnvIds([...(r.envIds || [])]); setEditStorageTag(r.storageTag || ""); setConfirmDel(null); setShowEnvPicker(null); }}>✎</button>
                <button style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer", padding: "2px 4px" }} onClick={() => setConfirmDel(i)}>✕</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: 10 }}>
        <textarea style={{ ...S.input, fontSize: 12, minHeight: 50, marginBottom: 4 }} value={draft} onChange={e => setDraft(e.target.value)} placeholder="新しい条文を入力..." />
        <EnvTags envIds={draftEnvIds} onToggle={() => setShowEnvPicker(showEnvPicker === "new" ? null : "new")} />
        {showEnvPicker === "new" && <EnvPicker envIds={draftEnvIds} setEnvIds={setDraftEnvIds} />}
        <StorageTagSelect value={draftStorageTag} onChange={setDraftStorageTag} />
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button style={S.btnSm()} onClick={add}>追加</button>
          <button style={S.btnSm(C.green)} onClick={() => { setEditing(false); setConfirmDel(null); setShowEnvPicker(null); }}>完了</button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// 期間ブロック（期間別 / 制御 共通）
// =============================================
// =============================================
// 環境への影響エディタ
// =============================================
const EFFECT_TYPES = [
  { id: "denied", label: "🚫 不許可" },
  { id: "count_limit", label: "📏 回数制限" },
  { id: "storage_threshold", label: "⚠️ 記録値で許可（固定値）" },
  { id: "time_ratio", label: "🕐 記録値で許可（残り時間比率）" },
  { id: "period_day_ratio", label: "📆 記録値で許可（日数比率）" },
];

function EffectsEditor({ effects = [], onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [newType, setNewType] = useState("denied");
  const [newEnv, setNewEnv] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newNum, setNewNum] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const add = () => {
    if (!newEnv) return;
    const eff = { envId: newEnv, type: newType };
    if (newType === "denied") {
      // no extra fields
    } else if (newType === "count_limit") {
      if (!newKey || !newNum) return;
      const skLabel = STORAGE_KEYS.find(s => s.key === newKey)?.label || newKey;
      eff.storageKey = newKey; eff.limit = parseInt(newNum) || 1; eff.label = newLabel || `${skLabel} ${parseInt(newNum)}回まで`;
    } else if (newType === "storage_threshold") {
      if (!newKey || !newNum) return;
      const skLabel = STORAGE_KEYS.find(s => s.key === newKey)?.label || newKey;
      eff.storageKey = newKey; eff.threshold = parseInt(newNum) || 0; eff.label = newLabel || `${skLabel} ${fmtTime(parseInt(newNum))}以上で開始可能`;
    } else if (newType === "time_ratio") {
      if (!newKey || !newNum) return;
      const skLabel = STORAGE_KEYS.find(s => s.key === newKey)?.label || newKey;
      eff.storageKey = newKey; eff.k = parseFloat(newNum) || 2; eff.label = newLabel || `${skLabel} 24時まで k=${newNum} で許可`;
    } else if (newType === "period_day_ratio") {
      if (!newKey || !newNum) return;
      const skLabel = STORAGE_KEYS.find(s => s.key === newKey)?.label || newKey;
      eff.storageKey = newKey; eff.k = parseFloat(newNum) || 1; eff.label = newLabel || `${skLabel} n日目に${newNum}×n時間で許可`;
    }
    onUpdate([...effects, eff]);
    setNewEnv(""); setNewType("denied"); setNewKey(""); setNewNum(""); setNewLabel("");
  };
  const remove = (i) => onUpdate(effects.filter((_, idx) => idx !== i));

  const describeEffect = (eff) => {
    if (eff.type === "denied") return "不許可";
    if (eff.type === "count_limit") {
      const sk = STORAGE_KEYS.find(s => s.key === eff.storageKey);
      return `回数制限: ${eff.label}（${sk?.label || eff.storageKey} ≤ ${eff.limit}）`;
    }
    if (eff.type === "storage_threshold") {
      const sk = STORAGE_KEYS.find(s => s.key === eff.storageKey);
      const thr = sk?.unit === "min" ? fmtTime(eff.threshold) : eff.threshold;
      return `記録値で許可: ${eff.label}（${sk?.label || eff.storageKey} ≥ ${thr}）`;
    }
    if (eff.type === "time_ratio") {
      const sk = STORAGE_KEYS.find(s => s.key === eff.storageKey);
      return `記録値(残り時間比率): ${eff.label}（${sk?.label || eff.storageKey}, k=${eff.k}）`;
    }
    if (eff.type === "period_day_ratio") {
      const sk = STORAGE_KEYS.find(s => s.key === eff.storageKey);
      return `記録値(日数比率): ${eff.label}（${sk?.label || eff.storageKey}, k=${eff.k}）`;
    }
    return `不明な影響タイプ`;
  };

  if (!editing) {
    return (
      <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 8 }}>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>環境への影響</div>
        {effects.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textDim }}>（なし）</div>
        ) : effects.map((eff, i) => (
          <div key={i} style={{ fontSize: 11, color: C.text, padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: C.yellow }}>{envLabel(eff.envId)}</span> — {describeEffect(eff)}
          </div>
        ))}
        <button style={{ ...S.btnSm(), marginTop: 6 }} onClick={() => setEditing(true)}>影響を編集</button>
      </div>
    );
  }

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 8 }}>
      <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}>環境への影響</div>
      {effects.map((eff, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ flex: 1, fontSize: 11 }}>
            <span style={{ color: C.yellow }}>{envLabel(eff.envId)}</span> — {describeEffect(eff)}
          </div>
          <button style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer" }} onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <div style={{ marginTop: 8, padding: 10, background: C.bg, borderRadius: 8 }}>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}>影響を追加</div>
        <select style={{ ...S.input, marginBottom: 6 }} value={newEnv} onChange={e => setNewEnv(e.target.value)}>
          <option value="">対象環境を選択</option>
          {ENVIRONMENTS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
        </select>
        <select style={{ ...S.input, marginBottom: 6 }} value={newType} onChange={e => setNewType(e.target.value)}>
          {EFFECT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        {(newType === "count_limit" || newType === "storage_threshold" || newType === "time_ratio" || newType === "period_day_ratio") && (
          <select style={{ ...S.input, marginBottom: 6 }} value={newKey} onChange={e => setNewKey(e.target.value)}>
            <option value="">参照する記録を選択</option>
            {STORAGE_KEYS.filter(s => newType === "count_limit" ? s.unit === "count" : s.unit === "min").map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        )}
        {newType === "count_limit" && (
          <input style={{ ...S.input, marginBottom: 6 }} type="number" value={newNum} onChange={e => setNewNum(e.target.value)} placeholder="上限回数（例: 1）" />
        )}
        {newType === "storage_threshold" && (
          <input style={{ ...S.input, marginBottom: 6 }} type="number" value={newNum} onChange={e => setNewNum(e.target.value)} placeholder="必要な値（分）（例: 180 = 3h）" />
        )}
        {newType === "time_ratio" && (
          <>
            <input style={{ ...S.input, marginBottom: 4 }} type="number" step="0.1" value={newNum} onChange={e => setNewNum(e.target.value)} placeholder="k の値（例: 2）" />
            <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6, lineHeight: 1.4 }}>
              n分の記録値があるとき、24時まで k×n 分なら許可。必要値 = 残り時間 ÷ k
            </div>
          </>
        )}
        {newType === "period_day_ratio" && (
          <>
            <input style={{ ...S.input, marginBottom: 4 }} type="number" step="0.1" value={newNum} onChange={e => setNewNum(e.target.value)} placeholder="k の値（例: 1）" />
            <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6, lineHeight: 1.4 }}>
              期間のn日目に k×n 時間の記録値があれば許可。必要値 = k × n日目 × 60分
            </div>
          </>
        )}
        {newType !== "denied" && (
          <input style={{ ...S.input, marginBottom: 6 }} value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="表示テキスト（例: 月に一度まで）" />
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btnSm()} onClick={add}>追加</button>
          <button style={S.btnSm(C.green)} onClick={() => setEditing(false)}>完了</button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// 選択肢エディタ
// =============================================
function ChoicesEditor({ title, items = [], onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (!editing) {
    return (
      <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 8 }}>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>{title}</div>
        {items.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textDim }}>（未設定）</div>
        ) : items.map((item, i) => (
          <div key={i} style={{ fontSize: 12, color: C.text, padding: "3px 0" }}>• {item}</div>
        ))}
        <button style={{ ...S.btnSm(), marginTop: 6 }} onClick={() => { setDraft(items.join("\n")); setEditing(true); }}>編集</button>
      </div>
    );
  }

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 8 }}>
      <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>{title}（1行1項目）</div>
      <textarea style={{ ...S.input, fontSize: 12, minHeight: 80 }} value={draft} onChange={e => setDraft(e.target.value)} />
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button style={S.btnSm()} onClick={() => { onUpdate(draft.split("\n").filter(l => l.trim())); setEditing(false); }}>保存</button>
        <button style={S.btnSm(C.textDim)} onClick={() => setEditing(false)}>取消</button>
      </div>
    </div>
  );
}

// =============================================
// 期間ブロック
// =============================================
function PeriodBlock({ period, onUpdate, onDelete, filterEnvId, hasGuidelines }) {
  const [open, setOpen] = useState(isPeriodActive(period));
  const [editMeta, setEditMeta] = useState(false);
  const [label, setLabel] = useState(period.label);
  const [startDate, setStartDate] = useState(period.startDate || "");
  const [endDate, setEndDate] = useState(period.endDate || "");
  const [guidelines, setGuidelines] = useState(hasGuidelines ? JSON.stringify(period.guidelines || {}, null, 2) : "");
  const [confirmDel, setConfirmDel] = useState(false);
  const active = isPeriodActive(period);

  const saveMeta = () => {
    const upd = { ...period, label, startDate, endDate };
    if (hasGuidelines) {
      try { upd.guidelines = JSON.parse(guidelines); } catch { alert("JSON形式が不正です"); return; }
    }
    onUpdate(upd);
    setEditMeta(false);
  };

  const displayLabel = periodDisplayLabel(period);

  return (
    <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${active ? C.accent + "44" : C.border}`, marginTop: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "none", border: "none", color: C.text, cursor: "pointer" }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>
          {displayLabel}
          {active && <span style={{ fontSize: 10, color: C.green, marginLeft: 6 }}>● 有効</span>}
          {!active && <span style={{ fontSize: 10, color: C.textDim, marginLeft: 6 }}>○ 期間外</span>}
        </span>
        <span style={{ color: C.textDim, fontSize: 14, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 12px 12px", borderTop: `1px solid ${C.border}` }}>
          {hasGuidelines && period.guidelines && Object.keys(period.guidelines).length > 0 && !editMeta && (
            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>活動目安</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {Object.entries(period.guidelines).map(([k, v]) => <span key={k} style={S.chip(true)}>{k}: {v}</span>)}
              </div>
            </div>
          )}

          <EditableRuleList rules={period.rules || []} onUpdate={(rules) => onUpdate({ ...period, rules })} filterEnvId={filterEnvId} />

          <EffectsEditor effects={period.effects || []} onUpdate={(effects) => onUpdate({ ...period, effects })} />

          {hasGuidelines && (
            <ChoicesEditor title="🚶 起床・外出後の選択肢" items={period.choices || []} onUpdate={(items) => onUpdate({ ...period, choices: items })} />
          )}

          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 8 }}>
            {!editMeta ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={S.btnSm()} onClick={() => { setLabel(period.label); setStartDate(period.startDate || ""); setEndDate(period.endDate || ""); if (hasGuidelines) setGuidelines(JSON.stringify(period.guidelines || {}, null, 2)); setEditMeta(true); }}>設定を編集</button>
                {!confirmDel ? (
                  <button style={S.btnSm(C.red)} onClick={() => setConfirmDel(true)}>この期間を削除</button>
                ) : (
                  <span style={{ display: "flex", gap: 4 }}>
                    <button style={S.btnSm(C.red)} onClick={() => { onDelete(); setConfirmDel(false); }}>削除する</button>
                    <button style={S.btnSm(C.textDim)} onClick={() => setConfirmDel(false)}>やめる</button>
                  </span>
                )}
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>タイトル</div>
                  <input style={S.input} value={label} onChange={e => setLabel(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>開始日 (YYYY-MM-DD)</div>
                    <input style={S.input} value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="2026-04-06" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>終了日 (YYYY-MM-DD)</div>
                    <input style={S.input} value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="2026-04-12" />
                  </div>
                </div>
                {hasGuidelines && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>活動目安 (JSON)</div>
                    <textarea style={{ ...S.input, height: 100, fontFamily: "monospace", fontSize: 12 }} value={guidelines} onChange={e => setGuidelines(e.target.value)} />
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={S.btnSm()} onClick={saveMeta}>保存</button>
                  <button style={S.btnSm(C.textDim)} onClick={() => setEditMeta(false)}>取消</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// 規程タブ
// =============================================
function RulesTab({ dyn, setDyn }) {
  const [filterEnvId, setFilterEnvId] = useState("");

  const updPeriod = (idx, p) => { const l = [...dyn.periodRules]; l[idx] = p; const n = { ...dyn, periodRules: l }; setDyn(n); saveDyn(n); };
  const delPeriod = (idx) => { const n = { ...dyn, periodRules: dyn.periodRules.filter((_, i) => i !== idx) }; setDyn(n); saveDyn(n); };
  const addPeriod = (copyFrom) => {
    const base = copyFrom
      ? { ...JSON.parse(JSON.stringify(copyFrom)), id: Date.now(), label: copyFrom.label + "（コピー）", startDate: "", endDate: "" }
      : { id: Date.now(), label: "新しい期間", startDate: "", endDate: "", guidelines: { "勉強": "5h", "仕事": "2h30m", "趣味": "2h", "リラックス": "1h30m" }, choices: [], rules: [], effects: [] };
    const n = { ...dyn, periodRules: [...dyn.periodRules, base] }; setDyn(n); saveDyn(n);
  };
  const [showAddPeriod, setShowAddPeriod] = useState(false);

  const updControl = (idx, p) => { const l = [...dyn.controlRules]; l[idx] = p; const n = { ...dyn, controlRules: l }; setDyn(n); saveDyn(n); };
  const delControl = (idx) => { const n = { ...dyn, controlRules: dyn.controlRules.filter((_, i) => i !== idx) }; setDyn(n); saveDyn(n); };
  const addControl = () => { const n = { ...dyn, controlRules: [...dyn.controlRules, { id: Date.now(), label: "新しい期間", startDate: "", endDate: "", rules: [], effects: [] }] }; setDyn(n); saveDyn(n); };

  return (
    <div>
      <div style={S.header}>規程一覧</div>

      <div style={S.card}>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}>環境でフィルター</div>
        <select style={S.input} value={filterEnvId} onChange={e => setFilterEnvId(e.target.value)}>
          <option value="">すべて表示</option>
          {ENVIRONMENTS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
        </select>
      </div>

      <Toggle title="📅 期間別規程" defaultOpen={true}>
        {dyn.periodRules.map((p, i) => (
          <PeriodBlock key={p.id} period={p} onUpdate={(u) => updPeriod(i, u)} onDelete={() => delPeriod(i)} filterEnvId={filterEnvId} hasGuidelines={true} />
        ))}
        {!showAddPeriod ? (
          <button style={{ ...S.btn(), marginTop: 10 }} onClick={() => setShowAddPeriod(true)}>＋ 期間を追加</button>
        ) : (
          <div style={{ marginTop: 10, padding: 10, background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>追加方法を選択</div>
            <button style={{ ...S.btn(), marginBottom: 6 }} onClick={() => { addPeriod(null); setShowAddPeriod(false); }}>新規作成</button>
            {dyn.periodRules.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4, marginTop: 4 }}>既存の期間からコピー</div>
                {dyn.periodRules.map(p => (
                  <button key={p.id} style={{ ...S.btnOutline, width: "100%", textAlign: "left", marginBottom: 4 }} onClick={() => { addPeriod(p); setShowAddPeriod(false); }}>
                    {periodDisplayLabel(p)}
                  </button>
                ))}
              </>
            )}
            <button style={{ ...S.btnOutline, width: "100%", marginTop: 4, color: C.textDim, borderColor: C.textDim }} onClick={() => setShowAddPeriod(false)}>キャンセル</button>
          </div>
        )}
      </Toggle>

      <Toggle title="🔧 制御規定">
        {dyn.controlRules.map((p, i) => (
          <PeriodBlock key={p.id} period={p} onUpdate={(u) => updControl(i, u)} onDelete={() => delControl(i)} filterEnvId={filterEnvId} hasGuidelines={false} />
        ))}
        <button style={{ ...S.btn(), marginTop: 10 }} onClick={addControl}>＋ 期間を追加</button>
      </Toggle>

      {RULE_SECTIONS.map(s => (
        <Toggle key={s.key} title={s.title}>
          {s.subs ? s.subs.map(sub => (
            <Toggle key={sub.key} title={sub.title}>
              <RuleList rules={sub.rules} filterEnvId={filterEnvId} />
            </Toggle>
          )) : <RuleList rules={s.rules} filterEnvId={filterEnvId} />}
        </Toggle>
      ))}
    </div>
  );
}

// =============================================
// メイン
// =============================================
export default function App() {
  const [tab, setTab] = useState("home");
  const [dyn, setDyn] = useState(DEFAULT_DYN);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadDyn();
    if (saved) setDyn({ ...DEFAULT_DYN, ...saved });
    setLoaded(true);
  }, []);

  if (!loaded) return <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center" }}>読込中...</div>;

  const hasActiveViolation = dyn.violations.some(v => new Date(v.bannedUntil) >= new Date());

  return (
    <div style={{ ...S.app, background: hasActiveViolation ? "#2a0a0a" : C.bg }}>
      {tab === "home" && <HomeTab dyn={dyn} setDyn={setDyn} />}
      {tab === "storage" && <StorageTab dyn={dyn} setDyn={setDyn} />}
      {tab === "violation" && <ViolationTab dyn={dyn} setDyn={setDyn} />}
      {tab === "rules" && <RulesTab dyn={dyn} setDyn={setDyn} />}
      <TabBar tab={tab} setTab={setTab} />
    </div>
  );
}
