export const likert5agree = [
  '1 — Маш их санал зөрөх',
  '2 — Санал зөрөх',
  '3 — Дунд зэрэг',
  '4 — Санал нэгдэх',
  '5 — Маш их санал нэгдэх',
];

export const likert5freq = [
  '1 — Маш ховор',
  '2 — Ховор',
  '3 — Заримдаа',
  '4 — Олонтаа',
  '5 — Маш их',
];

export const acs4 = [
  '1 — Бараг хэзээ ч үгүй',
  '2 — Заримдаа',
  '3 — Олонтаа',
  '4 — Үргэлж',
];

export type Scale = 'agree5' | 'freq5' | 'acs4';

export interface Question {
  cat: string;
  en: string;
  mn: string;
  dim: number;
  scale: Scale;
  reverse?: boolean;
}

export const questions: Question[] = [
  { cat: 'FOMO шкала', en: 'I fear others will have more exciting experiences than me.', mn: 'Бусад хүмүүс надаас илүү сонирхолтой, үнэ цэнтэй зүйлсийг мэдэрч, туулж байгаа байх гэж би айдаг.', dim: 0, scale: 'agree5' },
  { cat: 'FOMO шкала', en: 'I get worried when I miss social events.', mn: 'Олон нийтийн арга хэмжээнд оролцож чадахгүй байх үедээ би санаа зовдог.', dim: 0, scale: 'agree5' },
  { cat: 'FOMO шкала', en: 'I feel left out when others share experiences online.', mn: 'Бусад хүмүүс өөрсдийн туршлага, үйл явдлаа онлайнаар хуваалцах үед би өөрийгөө орхигдсон мэт мэдэрдэг.', dim: 0, scale: 'agree5' },
  { cat: 'FOMO шкала', en: 'I check social media to see what others are doing.', mn: 'Бусад хүмүүс юу хийж байгааг мэдэхийн тулд би нийгмийн сүлжээгээ тогтмол шалгадаг.', dim: 0, scale: 'agree5' },
  { cat: 'FOMO шкала', en: "I feel anxious when I can't check social media.", mn: 'Нийгмийн сүлжээгээ шалгах боломжгүй үедээ би түгшүүр мэдэрдэг.', dim: 0, scale: 'agree5' },
  { cat: 'FOMO шкала', en: 'I am concerned about missing out on new information.', mn: 'Шинэ мэдээлэл, үйл явдлаас хоцрох вий гэж би санаа зовдог.', dim: 0, scale: 'agree5' },
  { cat: 'FOMO шкала', en: 'I often compare my experiences with others online.', mn: 'Би өөрийн туршлагаа бусад хүмүүсийн онлайнаар хуваалцсан зүйлтэй байнга харьцуулдаг.', dim: 0, scale: 'agree5' },
  { cat: 'FOMO шкала', en: 'I feel the need to be constantly connected.', mn: 'Үргэлж бусадтай холбоотой, мэдээлэлтэй байх хэрэгтэй юм шиг надад санагддаг.', dim: 0, scale: 'agree5' },
  { cat: 'FOMO шкала', en: 'I feel uncomfortable when I am not online.', mn: 'Би онлайн биш байх үедээ таагүй мэдрэмжтэй байдаг.', dim: 0, scale: 'agree5' },
  { cat: 'FOMO шкала', en: 'I get worried about what I might be missing.', mn: 'Би ямар нэгэн чухал зүйлээс хоцорч байх вий гэж санаа зовдог.', dim: 0, scale: 'agree5' },
  { cat: 'Донтолтын шкала (SMAS-2)', en: 'Spent a lot of time thinking about social media.', mn: 'Би цахим сүлжээний талаар маш их бодож, цаг зарцуулдаг байсан.', dim: 1, scale: 'freq5' },
  { cat: 'Донтолтын шкала (SMAS-2)', en: 'Felt an urge to use social media more and more.', mn: 'Би цахим сүлжээг улам их ашиглах хүсэл байнга төрдөг байсан.', dim: 1, scale: 'freq5' },
  { cat: 'Донтолтын шкала (SMAS-2)', en: 'Tried to cut down on social media without success.', mn: 'Би цахим сүлжээний хэрэглээгээ багасгахыг оролдсон ч бүтэлгүйтэж байсан.', dim: 1, scale: 'freq5' },
  { cat: 'Донтолтын шкала (SMAS-2)', en: 'Became restless if prohibited from using social media.', mn: 'Би цахим сүлжээгээ ашиглаж чадахгүй үед тайван бус, түгшсэн мэдрэмж төрдөг байсан.', dim: 1, scale: 'freq5' },
  { cat: 'Донтолтын шкала (SMAS-2)', en: 'Used social media so much that it affected your work/studies.', mn: 'Цахим сүлжээг хэт их ашигласнаас болж миний ажил/хичээлд сөргөөр нөлөөлж байсан.', dim: 1, scale: 'freq5' },
  { cat: 'Донтолтын шкала (SMAS-2)', en: 'Had conflicts with others due to social media use.', mn: 'Цахим сүлжээ ашигласнаас болж би бусад хүмүүстэй зөрчилдөх маргалдах тохиолдол гарч байсан.', dim: 1, scale: 'freq5' },
  { cat: 'Анхаарал хяналт (ACS)', en: 'I find it easy to concentrate on a task.', mn: 'Би нэгэн даалгаварт анхаарлаа төвлөрүүлэхэд хялбар байдаг.', dim: 3, scale: 'acs4', reverse: false },
  { cat: 'Анхаарал хяналт (ACS)', en: 'My concentration is easily disrupted.', mn: 'Миний анхаарал амархан сарнидаг.', dim: 3, scale: 'acs4', reverse: true },
  { cat: 'Анхаарал хяналт (ACS)', en: 'I can quickly switch my attention from one task to another.', mn: 'Би нэг даалгавраас нөгөөд анхаарлаа хурдан шилжүүлж чаддаг.', dim: 3, scale: 'acs4', reverse: false },
  { cat: 'Анхаарал хяналт (ACS)', en: 'I am able to maintain focus for a long time.', mn: 'Би удаан хугацаанд анхаарлаа төвлөрүүлж чаддаг.', dim: 3, scale: 'acs4', reverse: false },
  { cat: 'Анхаарал хяналт (ACS)', en: 'I have difficulty doing more than one thing at a time.', mn: 'Би нэгэн зэрэг хэд хэдэн зүйлийг хийхэд хүндрэлтэй байдаг.', dim: 3, scale: 'acs4', reverse: true },
];

export const TOTAL_Q = questions.length;

export const dims = ['FOMO (Алдахаас айх)', 'SMAS-2 Донтолт', null, 'Анхаарал хяналт (ACS)'];
export const dimColors = ['#ff3c6f', '#7c3aed', '#06b6d4', '#f59e0b'];

export function getOpts(scale: Scale): string[] {
  switch (scale) {
    case 'agree5': return likert5agree;
    case 'freq5':  return likert5freq;
    case 'acs4':   return acs4;
  }
}

export function getScaleHint(scale: Scale): [string, string] | null {
  switch (scale) {
    case 'agree5': return ['1 = Маш их санал зөрөх', '5 = Маш их санал нэгдэх'];
    case 'freq5':  return ['1 = Маш ховор', '5 = Маш их'];
    case 'acs4':   return ['1 = Бараг хэзээ ч үгүй', '4 = Үргэлж'];
  }
}

export type LevelClass = 'minimal' | 'mild' | 'moderate' | 'high' | 'severe';

export interface ScoreResult {
  total: number;
  maxScore: number;
  pct: number;
  dimPcts: number[];
  level: string;
  levelClass: LevelClass;
}

export function calcScores(answers: number[]): ScoreResult {
  function rawScore(i: number) {
    const q = questions[i];
    const val = answers[i] + 1;
    const maxVal = getOpts(q.scale).length;
    return q.reverse ? maxVal + 1 - val : val;
  }

  const dimScores = [0, 0, 0, 0];
  const dimMaxes  = [0, 0, 0, 0];

  questions.forEach((q, i) => {
    const max = getOpts(q.scale).length;
    dimScores[q.dim] += rawScore(i);
    dimMaxes[q.dim]  += max;
  });

  const dimPcts = dimScores.map((s, i) => dimMaxes[i] ? Math.round((s / dimMaxes[i]) * 100) : 0);
  const acsRisk = 100 - dimPcts[3];
  const pct = Math.round(dimPcts[0] * 0.40 + dimPcts[1] * 0.45 + acsRisk * 0.15);
  const total = dimScores.reduce((a, b) => a + b, 0);
  const maxScore = dimMaxes.reduce((a, b) => a + b, 0);

  let level: string, levelClass: LevelClass;
  if      (pct <= 20) { level = 'Хэвийн хэрэглэгч';        levelClass = 'minimal'; }
  else if (pct <= 38) { level = 'Хөнгөн хамаарал';          levelClass = 'mild'; }
  else if (pct <= 57) { level = 'Дунд зэргийн хамаарал';    levelClass = 'moderate'; }
  else if (pct <= 74) { level = 'Хүчтэй хамаарал';          levelClass = 'high'; }
  else                { level = 'Хүнд хэлбэрийн хамаарал'; levelClass = 'severe'; }

  return { total, maxScore, pct, dimPcts, level, levelClass };
}

export interface ResultEntry extends ScoreResult {
  id: number;
  date: string;
  age: string;
  gender: string;
  usage: string;
  aiText: string;
  answers: number[];
}

const STORE_KEY = 'snas_v2_results';

export function loadResults(): ResultEntry[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
}

export function saveResult(entry: ResultEntry) {
  const all = loadResults();
  all.push(entry);
  localStorage.setItem(STORE_KEY, JSON.stringify(all));
}
