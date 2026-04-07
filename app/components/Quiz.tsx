'use client';

import { useState, useEffect, useRef } from 'react';
import {
  questions, TOTAL_Q, dims, dimColors,
  getOpts, getScaleHint, calcScores,
  loadResults, saveResult,
  saveResultRemote, loadResultsRemote,
  type ResultEntry, type LevelClass,
} from './data';

type Page = 'intro' | 'quiz' | 'loading' | 'result' | 'admin-login' | 'admin';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'smai2024';

const descs: Record<LevelClass, string> = {
  minimal:  'Нийгмийн сүлжээний хэрэглээ таны амьдралд тэнцвэртэй, эрүүл байдлаар оршиж байна.',
  mild:     'Зарим чиглэлд нийгмийн сүлжээнд хэт анхаарал хандуулах хандлага ажиглагдаж байна.',
  moderate: 'Нийгмийн сүлжээ таны өдрийн байдал, харилцааг мэдэгдэхүйц тодорхойлж байна.',
  high:     'Нийгмийн сүлжээний хэрэглээ таны ажил, харилцаа, эрүүл мэндэд тодорхой хохирол учруулж байна.',
  severe:   'Нийгмийн сүлжээний хэрэглээ таны амьдралын олон талд ноцтой нөлөөлж байна.',
};

const recs: Record<LevelClass, string[]> = {
  minimal:  ['Одоогийн тэнцвэрийг хадгалаарай', 'Оффлайн үйл ажиллагааг үргэлжлүүлэарай', 'Шаардлагатай үед дижитал детокс хийж болно'],
  mild:     ['Утасгүй цаг тогтмол гаргаарай', 'Мэдэгдлийг хязгаарлаарай', 'Идэвхтэй хэрэглэлийг идэвхгүй гүйлгэлттэй ялгаарай'],
  moderate: ['Өдөр тутмын хэрэглэлийн хязгаар тогтоо', 'Нийгмийн сүлжээгүй цагаа нэмэгдүүл', 'Байршилд суурилсан хориог ашигла'],
  high:     ['Мэргэжлийн дэмжлэг авахыг зөвлөж байна', 'Хэрэглэлийн хязгаарлагч аппликейшн суулга', 'Биеийн тамирын дасгал нэмэгдүүл'],
  severe:   ['Нэн даруй мэргэжлийн тусламж хайгаарай', 'Дижитал детокс программд бүртгүүлэх боломжийг авч үзэ', 'CBT, Mindfulness арга судлах'],
};

const levelLabel: Record<LevelClass, string> = { minimal: 'Хэвийн', mild: 'Хөнгөн', moderate: 'Дунд зэрэг', high: 'Хүчтэй', severe: 'Хүнд' };
const badgeClass: Record<LevelClass, string> = { minimal: 'badge-minimal', mild: 'badge-mild', moderate: 'badge-moderate', high: 'badge-high', severe: 'badge-severe' };

export default function Quiz() {
  const [page, setPage] = useState<Page>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(TOTAL_Q).fill(-1));
  const [userInfo, setUserInfo] = useState({ age: '', gender: '', usage: '' });
  const [formValid, setFormValid] = useState(false);
  const [result, setResult] = useState<ResultEntry | null>(null);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [allResults, setAllResults] = useState<ResultEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [modalEntry, setModalEntry] = useState<ResultEntry | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const ringRef = useRef<SVGCircleElement>(null);

  const circumference = 2 * Math.PI * 52;

  function checkForm(age: string, gender: string, usage: string) {
    const a = parseInt(age);
    setFormValid(a >= 17 && a <= 21 && gender !== '' && usage !== '');
  }

  function updateField(field: 'age' | 'gender' | 'usage', val: string) {
    const next = { ...userInfo, [field]: val };
    setUserInfo(next);
    checkForm(next.age, next.gender, next.usage);
  }

  function startQuiz() {
    setCurrent(0);
    setAnswers(new Array(TOTAL_Q).fill(-1));
    setPage('quiz');
    setAnimKey(k => k + 1);
  }

  function selectOption(i: number) {
    const next = [...answers];
    next[current] = i;
    setAnswers(next);
  }

  function nextQuestion() {
    if (answers[current] === -1) return;
    if (current === TOTAL_Q - 1) { analyzeWithAI(); return; }
    setCurrent(c => c + 1);
    setAnimKey(k => k + 1);
  }

  function prevQuestion() {
    if (current > 0) { setCurrent(c => c - 1); setAnimKey(k => k + 1); }
  }

  async function analyzeWithAI() {
    setPage('loading');
    const scores = calcScores(answers);
    const prompt = `Цахим сүлжээний хэрэглээний иж бүрэн тестийн үр дүнд дүн шинжилгээ хий.

Хэрэглэгч: Нас ${userInfo.age}, ${userInfo.gender}, хамгийн их ашигладаг платформ: ${userInfo.usage}

Нийт эрсдэлийн индекс: ${scores.pct}% — ${scores.level}

3 хэмжигдэхүүн:
  FOMO (Алдахаас айх): ${scores.dimPcts[0]}%
  SMAS-2 Донтолт: ${scores.dimPcts[1]}%
  Анхаарал хяналт (ACS): ${scores.dimPcts[3]}% (өндөр = сайн)

Монгол хэлээр 3–4 өгүүлбэрт:
1. Хэрэглэгчийн хамгийн тод хэв маяг ба хамгийн их анхаарал хандуулах хэмжигдэхүүн
2. Анхаарал ба нийгмийн сүлжээний хамаарлыг тайлбарла
3. Нас, хэрэглэлийн цагт тохирсон нэг практик зөвлөмж

Дулаахан, мэргэжлийн, хэтэрхий техникийн бус байх ёстой.`;

    let aiText = '';
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      aiText = data.text || '';
      if (!aiText && data.error) throw new Error(data.error);
    } catch {
      aiText = 'AI шинжилгээ одоогоор боломжгүй байна. Доорх үр дүн таны хариултад тулгуурласан болно.';
    }

    const entry: ResultEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...userInfo,
      ...scores,
      aiText,
      answers: [...answers],
    };
    saveResult(entry);
    await saveResultRemote(entry);
    setResult(entry);
    setPage('result');
  }

  useEffect(() => {
    if (page === 'result' && result && ringRef.current) {
      const offset = circumference - (result.pct / 100) * circumference;
      setTimeout(() => {
        if (ringRef.current) ringRef.current.style.strokeDashoffset = String(offset);
      }, 200);
    }
  }, [page, result]);

  function restartQuiz() {
    setUserInfo({ age: '', gender: '', usage: '' });
    setFormValid(false);
    setAnswers(new Array(TOTAL_Q).fill(-1));
    setCurrent(0);
    setPage('intro');
  }

  function adminLogin() {
    if (adminUser === ADMIN_USER && adminPass === ADMIN_PASS) {
      setLoginError(false);
      setActiveFilter('all');
      setPage('admin');
      loadResultsRemote().then(setAllResults);
    } else {
      setLoginError(true);
    }
  }

  function exportCSV() {
    if (!allResults.length) { alert('Дата байхгүй байна'); return; }
    const headers = ['#', 'Нас', 'Хүйс', 'Платформ', 'Нийт эрсдэл%', 'FOMO%', 'SMAS%', 'ACS%', 'Түвшин', 'Огноо'];
    const rows = allResults.map((r, i) => {
      const dp = r.dimPcts || [0, 0, 0, 0];
      return [i + 1, r.age, r.gender, r.usage, r.pct, dp[0], dp[1], dp[3], r.level, new Date(r.date).toLocaleDateString('mn-MN')];
    });
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `SMAI_data_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const filtered = activeFilter === 'all' ? allResults : allResults.filter(r => r.levelClass === activeFilter);
  const q = questions[current];
  const opts = q ? getOpts(q.scale) : [];
  const hint = q ? getScaleHint(q.scale) : null;
  const pct = ((current + 1) / TOTAL_Q) * 100;

  return (
    <div className="container">

      {/* INTRO */}
      {page === 'intro' && (
        <div id="page-intro" className="page active">
          <div className="badge">Сэтгэл зүйн үнэлгээ • FOMO + SMAS-2 + ACS</div>
          <h1>Цахим сүлжээний донтолтын<br /><span>тест</span></h1>
          <p className="subtitle">FOMO, SMAS-2, Анхаарал хяналт зэрэг 3 хэмжигдэхүүнийг хамарсан иж бүрэн үнэлгээ · ~10 минут</p>
          <div className="user-form">
            <h3>Таны мэдээлэл</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Нас *</label>
                <input type="number" placeholder="жишээ: 18" min={17} max={21} value={userInfo.age}
                  onChange={e => updateField('age', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Хүйс *</label>
                <select value={userInfo.gender} onChange={e => updateField('gender', e.target.value)}>
                  <option value="">— сонгох —</option>
                  <option>Эрэгтэй</option>
                  <option>Эмэгтэй</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group full">
                <label>Хамгийн их ашигладаг платформ *</label>
                <select value={userInfo.usage} onChange={e => updateField('usage', e.target.value)}>
                  <option value="">— сонгох —</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Twitter">Twitter</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Бусад">Бусад</option>
                </select>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button className="start-btn" onClick={startQuiz} disabled={!formValid}>Эхлэх →</button>
            </div>
          </div>
          <div className="meta-info">
            <div className="meta-item"><span>21</span> асуулт</div>
            <div className="meta-item"><span>3</span> хэмжигдэхүүн</div>
            <div className="meta-item"><span>~10</span> минут</div>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {page === 'quiz' && (
        <div id="page-quiz" className="page active">
          <div className="progress-bar-wrap">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: pct + '%' }} />
            </div>
            <div className="q-counter">{String(current + 1).padStart(2, '0')} / {TOTAL_Q}</div>
          </div>
          <div key={animKey} className="q-anim">
            <div className="category-tag">{q.cat}</div>
            {q.en && <div className="question-en">{q.en}</div>}
            <div className="question-text">
              {q.mn}
              {q.reverse && <div className="question-sub">⟲ Урвуу оноогоор тооцогдоно</div>}
            </div>
            {hint && (
              <div className="scale-hint">
                <span>{hint[0]}</span><span>{hint[1]}</span>
              </div>
            )}
            <div className="options">
              {opts.map((opt, i) => (
                <div key={i} className={`option${answers[current] === i ? ' selected' : ''}`} onClick={() => selectOption(i)}>
                  <div className="option-letter">{i + 1}</div>
                  <div className="option-text">{opt}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="nav-row">
            <button className="nav-btn" onClick={prevQuestion} disabled={current === 0}>← Өмнөх</button>
            <button className="nav-btn next-btn" onClick={nextQuestion} disabled={answers[current] === -1}>
              {current === TOTAL_Q - 1 ? 'Үр дүн харах →' : 'Дараах →'}
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {page === 'loading' && (
        <div id="page-loading" className="page active">
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="loading-spinner" />
            <div className="loading-title">AI шинжилгээ хийж байна</div>
            <p className="loading-sub">
              Таны хариултыг Claude AI задлан шинжилж байна<br />
              <span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
            </p>
          </div>
        </div>
      )}

      {/* RESULT */}
      {page === 'result' && result && (() => {
        const { pct, dimPcts, level, levelClass, aiText } = result;
        const offset = circumference - (pct / 100) * circumference;
        return (
          <div id="result" className="page active">
            <div className="result-header">
              <div className="score-ring">
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle className="ring-bg" cx="65" cy="65" r="52" />
                  <circle ref={ringRef} className="ring-fill" cx="65" cy="65" r="52"
                    stroke="url(#rg)"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                  <defs>
                    <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#ff3c6f" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="score-number">
                  <div className={`score-num level-${levelClass}`}>{pct}</div>
                  <div className="score-max">/ 100</div>
                </div>
              </div>
              <div className={`result-level level-${levelClass}`}>{level}</div>
              <p className="result-desc">{descs[levelClass]}</p>
            </div>

            <div className="result-grid">
              <div className="result-card">
                <div className="result-card-label">Эрсдэлийн индекс</div>
                <div className={`result-card-value level-${levelClass}`}>{pct}%</div>
              </div>
              <div className="result-card">
                <div className="result-card-label">Хамгийн өндөр эрсдэл</div>
                <div className="result-card-value" style={{ color: dimColors[0] }}>
                  {dimPcts[0] > dimPcts[1] ? 'FOMO' : 'Донтолт'}
                </div>
              </div>
            </div>

            <div className="dimension-bars">
              <div className="dim-title">Хэмжигдэхүүнүүдийн шинжилгээ</div>
              {dimPcts.map((p, i) => {
                if (i === 2) return null;
                return (
                  <div key={i} className="dim-row">
                    <div className="dim-label">
                      {dims[i]}<span style={{ fontSize: 9, color: 'var(--muted)' }}>{i === 3 ? ' ↑ өндөр = сайн' : ''}</span>
                    </div>
                    <div className="dim-track">
                      <div className="dim-fill" style={{ background: dimColors[i], width: p + '%' }} />
                    </div>
                    <div className="dim-pct">{p}%</div>
                  </div>
                );
              })}
            </div>

            {aiText && (
              <div className="ai-analysis-card">
                <div className="ai-label">Claude AI шинжилгээ</div>
                <div className="ai-text">{aiText}</div>
              </div>
            )}

            <div className="recommendations">
              <div className="rec-title">Зөвлөмжүүд</div>
              {recs[levelClass].map((r, i) => (
                <div key={i} className="rec-item">
                  <div className="rec-icon">→</div>
                  <div>{r}</div>
                </div>
              ))}
            </div>

            <button className="restart-btn" onClick={restartQuiz}>↺ Дахин хийх</button>
          </div>
        );
      })()}

      {/* ADMIN LOGIN */}
      {page === 'admin-login' && (
        <div id="page-admin-login" className="page active" style={{ textAlign: 'center' }}>
          <div className="login-card">
            <h2>Админ нэвтрэх</h2>
            <p>Судалгааны үр дүнг харах хэсэг</p>
            <div className="login-field">
              <label>Нэвтрэх нэр</label>
              <input type="text" placeholder="admin" value={adminUser} onChange={e => setAdminUser(e.target.value)} />
            </div>
            <div className="login-field">
              <label>Нууц үг</label>
              <input type="password" placeholder="••••••" value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && adminLogin()} />
            </div>
            <button className="login-btn" onClick={adminLogin}>Нэвтрэх</button>
            {loginError && <div className="login-error" style={{ display: 'block' }}>Нэвтрэх нэр эсвэл нууц үг буруу байна</div>}
            <div style={{ marginTop: 16 }}>
              <button className="admin-back" onClick={() => setPage('intro')}>← Буцах</button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {page === 'admin' && (() => {
        const total = allResults.length;
        const avgScore = total ? Math.round(allResults.reduce((s, r) => s + r.pct, 0) / total) : 0;
        const severe = allResults.filter(r => r.levelClass === 'severe' || r.levelClass === 'high').length;
        const avgFomo = total ? Math.round(allResults.reduce((s, r) => s + (r.dimPcts?.[0] || 0), 0) / total) : 0;
        const levels = ['all', 'minimal', 'mild', 'moderate', 'high', 'severe'] as const;
        const levelNames: Record<string, string> = { all: 'Бүгд', minimal: 'Хэвийн', mild: 'Хөнгөн', moderate: 'Дунд', high: 'Хүчтэй', severe: 'Хүнд' };

        return (
          <div id="page-admin" className="page active" style={{ maxWidth: 960, margin: '0 auto' }}>
            <div className="admin-header">
              <div className="admin-title">Админ <span>Хяналтын самбар</span></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-back" onClick={exportCSV}>↓ CSV татах</button>
                <button className="admin-back" onClick={() => setPage('intro')}>← Гарах</button>
              </div>
            </div>

            <div className="admin-stats">
              <div className="stat-card"><div className="stat-num">{total}</div><div className="stat-label">Нийт хэрэглэгч</div></div>
              <div className="stat-card"><div className="stat-num">{avgScore}%</div><div className="stat-label">Дундаж эрсдэл</div></div>
              <div className="stat-card"><div className="stat-num">{severe}</div><div className="stat-label">Өндөр эрсдэлтэй</div></div>
              <div className="stat-card"><div className="stat-num">{avgFomo}%</div><div className="stat-label">Дундаж FOMO</div></div>
            </div>

            <div className="admin-table-wrap">
              <div className="admin-table-header">
                <div className="admin-table-title">Бүх хэрэглэгчдийн үр дүн</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{filtered.length} бичлэг</div>
              </div>
              <div className="filter-row">
                {levels.map(l => (
                  <button key={l} className={`filter-btn${activeFilter === l ? ' active' : ''}`} onClick={() => setActiveFilter(l)}>
                    {levelNames[l]}
                  </button>
                ))}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>#</th><th>Нас</th><th>Хүйс</th><th>Платформ</th>
                      <th>FOMO%</th><th>SMAS%</th><th>ACS%</th>
                      <th>Нийт оноо</th><th>Түвшин</th><th>Огноо</th><th>Дэлгэрэнгүй</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={10}><div className="empty-state">Үр дүн олдсонгүй</div></td></tr>
                    ) : (
                      [...filtered].reverse().map((r, i) => {
                        const dp = r.dimPcts || [0, 0, 0, 0];
                        const dt = new Date(r.date).toLocaleDateString('mn-MN');
                        return (
                          <tr key={r.id}>
                            <td>{filtered.length - i}</td>
                            <td>{r.age}</td>
                            <td>{r.gender || '—'}</td>
                            <td>{r.usage || '—'}</td>
                            <td style={{ color: '#ff3c6f' }}>{dp[0]}%</td>
                            <td style={{ color: '#7c3aed' }}>{dp[1]}%</td>
                            <td style={{ color: '#06b6d4' }}>{dp[3]}%</td>
                            <td style={{ color: 'var(--accent3)', fontWeight: 500 }}>{r.pct}%</td>
                            <td><span className={`level-badge ${badgeClass[r.levelClass] || ''}`}>{levelLabel[r.levelClass] || r.level}</span></td>
                            <td style={{ color: 'var(--muted)' }}>{dt}</td>
                            <td><button className="filter-btn" style={{ padding: '4px 10px' }} onClick={() => setModalEntry(r)}>харах</button></td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL */}
      {modalEntry && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setModalEntry(null); }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setModalEntry(null)}>✕</button>
            <div className="modal-name">{modalEntry.age} нас · {modalEntry.gender} · {modalEntry.usage}</div>
            <div className="modal-meta">{new Date(modalEntry.date).toLocaleString('mn-MN')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: 'var(--accent3)' }}>{modalEntry.pct}%</span>
              <span className={`level-badge ${badgeClass[modalEntry.levelClass] || ''}`} style={{ fontSize: 12, padding: '5px 12px' }}>{modalEntry.level}</span>
            </div>
            <div className="modal-dims">
              {(modalEntry.dimPcts || []).map((p, i) => {
                if (i === 2) return null;
                return (
                  <div key={i} className="dim-row">
                    <div className="dim-label" style={{ fontSize: 11 }}>{dims[i]}</div>
                    <div className="dim-track"><div className="dim-fill" style={{ background: dimColors[i], width: p + '%' }} /></div>
                    <div className="dim-pct">{p}%</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Бүх хариултууд</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {questions.map((q, i) => {
                  const ans = modalEntry.answers[i];
                  const opts = getOpts(q.scale);
                  const rawVal = ans + 1;
                  const score = q.reverse ? opts.length + 1 - rawVal : rawVal;
                  return (
                    <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 12px', fontSize: 11 }}>
                      <div style={{ color: 'var(--accent2)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{q.cat}</div>
                      <div style={{ color: 'var(--text)', marginBottom: 4, lineHeight: 1.4 }}>{q.mn}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--muted)', fontSize: 10 }}>{ans >= 0 ? opts[ans] : '—'}</span>
                        <span style={{ color: 'var(--accent3)', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13 }}>{score} оноо</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {modalEntry.aiText && (
              <>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent2)', marginBottom: 8 }}>✦ AI Шинжилгээ</div>
                <div className="modal-ai">{modalEntry.aiText}</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Admin link */}
      <div className="admin-link" onClick={() => setPage('admin-login')} title="Админ">⚙ admin</div>
    </div>
  );
}
