// ============================================================
// STATE
// ============================================================
const STEPS = [
  { id: 'upload-video', label: 'Video' },
  { id: 'upload-subs',  label: 'Subtitles' },
  { id: 'language',     label: 'Language' },
  { id: 'characters',   label: 'Characters' },
  { id: 'assign',       label: 'Assign Lines' },
  { id: 'voices',       label: 'Voices' },
  { id: 'generate',     label: 'Generate' },
  { id: 'export',       label: 'Export' },
];

const LANGUAGES = [
  { code: 'si', name: 'Sinhala',    native: 'සිංහල',     flag: '🇱🇰' },
  { code: 'en', name: 'English',    native: 'English',   flag: '🇬🇧' },
  { code: 'es', name: 'Spanish',    native: 'Español',   flag: '🇪🇸' },
  { code: 'fr', name: 'French',     native: 'Français',  flag: '🇫🇷' },
  { code: 'de', name: 'German',     native: 'Deutsch',   flag: '🇩🇪' },
  { code: 'it', name: 'Italian',    native: 'Italiano',  flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese',   native: '日本語',     flag: '🇯🇵' },
  { code: 'ko', name: 'Korean',     native: '한국어',     flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese',    native: '中文',       flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi',      native: 'हिन्दी',      flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic',     native: 'العربية',   flag: '🇸🇦' },
  { code: 'ru', name: 'Russian',    native: 'Русский',   flag: '🇷🇺' },
];

const VOICES = {
  si: [
    { id: 'si-1', name: 'Nadeesha', desc: 'පැහැදිලි, ස්ත්‍රී'  },
    { id: 'si-2', name: 'Kasun',    desc: 'ගැඹුරු, පුරුෂ'    },
    { id: 'si-3', name: 'Ishara',   desc: 'උණුසුම්, ස්ත්‍රී'   },
    { id: 'si-4', name: 'Dilan',    desc: 'නිවේදක, පුරුෂ'    },
  ],
  en: [
    { id: 'en-1', name: 'Aria',  desc: 'Warm, neutral female' },
    { id: 'en-2', name: 'Kai',   desc: 'Deep male narrator' },
    { id: 'en-3', name: 'Nova',  desc: 'Bright, energetic female' },
    { id: 'en-4', name: 'Orion', desc: 'Calm male, documentary' },
  ],
  es: [
    { id: 'es-1', name: 'Lucía', desc: 'Cálida, femenina' },
    { id: 'es-2', name: 'Mateo', desc: 'Grave, masculina' },
    { id: 'es-3', name: 'Sofía', desc: 'Enérgica, joven' },
  ],
  fr: [
    { id: 'fr-1', name: 'Amélie', desc: 'Douce, féminine' },
    { id: 'fr-2', name: 'Théo',   desc: 'Grave, masculine' },
  ],
  de: [
    { id: 'de-1', name: 'Lena',  desc: 'Klar, weiblich' },
    { id: 'de-2', name: 'Jonas', desc: 'Tief, männlich' },
  ],
  it: [
    { id: 'it-1', name: 'Giulia', desc: 'Calda, femminile' },
    { id: 'it-2', name: 'Marco',  desc: 'Profonda, maschile' },
  ],
  pt: [
    { id: 'pt-1', name: 'Beatriz', desc: 'Suave, feminina' },
    { id: 'pt-2', name: 'Rafael',  desc: 'Grave, masculina' },
  ],
  ja: [
    { id: 'ja-1', name: 'Yuki',   desc: '明るい女性' },
    { id: 'ja-2', name: 'Haruto', desc: '落ち着いた男性' },
  ],
  ko: [
    { id: 'ko-1', name: 'Ji-woo', desc: '밝은 여성' },
    { id: 'ko-2', name: 'Min-ho', desc: '차분한 남성' },
  ],
  zh: [
    { id: 'zh-1', name: 'Ling', desc: '温柔女声' },
    { id: 'zh-2', name: 'Wei',  desc: '沉稳男声' },
  ],
  hi: [
    { id: 'hi-1', name: 'Priya', desc: 'मधुर महिला' },
    { id: 'hi-2', name: 'Arjun', desc: 'गहरी पुरुष' },
  ],
  ar: [
    { id: 'ar-1', name: 'Layla', desc: 'دافئ أنثوي' },
    { id: 'ar-2', name: 'Omar',  desc: 'عميق ذكوري' },
  ],
  ru: [
    { id: 'ru-1', name: 'Anya',   desc: 'Тёплый женский' },
    { id: 'ru-2', name: 'Dmitri', desc: 'Глубокий мужской' },
  ],
};

const COLORS = ['#6c5ce7','#00b894','#e17055','#0984e3','#fdcb6e','#e84393','#00cec9','#fd79a8','#a29bfe','#55efc4'];

let state = {
  step: 0,
  videoFile: null,
  videoURL: null,
  srtFile: null,
  srtName: null,
  language: null,
  characters: [],
  lines: [],
  generating: false,
  generatedCount: 0,
  renderResult: null,
};

// ============================================================
// UTILS
// ============================================================
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._to);
  t._to = setTimeout(() => t.classList.remove('show'), 2200);
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 1000);
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms).padStart(3,'0')}`;
}

function parseTime(str) {
  const m = str.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) return 0;
  return (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) + (+m[4]) / 1000;
}

function parseSRT(text) {
  const lines = [];
  const blocks = text.replace(/\r/g, '').split(/\n\n+/);
  for (const block of blocks) {
    const rows = block.split('\n').filter(r => r.trim());
    if (!rows.length) continue;
    let i = 0;
    if (/^\d+$/.test(rows[0].trim())) i = 1;
    const timeLine = rows[i];
    if (!timeLine || !timeLine.includes('-->')) continue;
    const [startS, endS] = timeLine.split('-->').map(s => s.trim().split(' ')[0]);
    const text = rows.slice(i + 1).join(' ').replace(/<[^>]+>/g, '').trim();
    if (!text) continue;
    lines.push({
      id: lines.length + 1,
      start: parseTime(startS),
      end: parseTime(endS),
      text,
      characterId: null,
      generated: false,
    });
  }
  return lines;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

// ============================================================
// STEPS
// ============================================================
function renderSteps() {
  const el = document.getElementById('steps');
  el.innerHTML = STEPS.map((s, i) => {
    const active = i === state.step ? 'active' : '';
    const done = i < state.step ? 'done' : '';
    return `<button class="step-chip ${active} ${done}" data-step="${i}">
      <span class="num">${i + 1}</span>${s.label}
    </button>`;
  }).join('');
  el.querySelectorAll('.step-chip').forEach(chip => {
    chip.onclick = () => goToStep(+chip.dataset.step);
  });
}

function canGoToStep(i) {
  if (i <= state.step) return true;
  if (i >= 1 && !state.videoFile) return false;
  if (i >= 2 && !state.srtFile) return false;
  if (i >= 3 && !state.language) return false;
  if (i >= 4 && state.characters.length === 0) return false;
  if (i >= 5 && !state.lines.some(l => l.characterId)) return false;
  if (i >= 6 && !state.lines.every(l => l.characterId)) return false;
  if (i >= 7 && state.characters.some(c => !c.voiceId)) return false;
  return true;
}

function goToStep(i) {
  if (!canGoToStep(i)) { toast('Complete the current steps first'); return; }
  state.step = i;
  render();
}

function nextStep() {
  if (state.step < STEPS.length - 1) {
    state.step++;
    render();
  }
}

// ============================================================
// VIEWS
// ============================================================
function renderContent() {
  const c = document.getElementById('content');
  const s = STEPS[state.step].id;
  if (s === 'upload-video')  c.innerHTML = viewUploadVideo();
  if (s === 'upload-subs')   c.innerHTML = viewUploadSubs();
  if (s === 'language')      c.innerHTML = viewLanguage();
  if (s === 'characters')    c.innerHTML = viewCharacters();
  if (s === 'assign')        c.innerHTML = viewAssign();
  if (s === 'voices')        c.innerHTML = viewVoices();
  if (s === 'generate')      c.innerHTML = viewGenerate();
  if (s === 'export')        c.innerHTML = viewExport();
  bindContent();
}

function viewUploadVideo() {
  return `
    <h1>Upload Video</h1>
    <p class="sub">Drop your source video file. We'll extract the audio track and detect duration automatically.</p>
    <div class="dropzone" id="videoDrop">
      <div class="icon">🎬</div>
      <div class="title">Drop video here or click to browse</div>
      <div class="hint">MP4, MOV, MKV, WEBM · up to 2 GB</div>
    </div>
    <input type="file" id="videoInput" accept="video/*" class="hidden">
    ${state.videoFile ? `
      <div class="card" style="margin-top:20px">
        <video class="video-preview" src="${state.videoURL}" controls></video>
        <div class="card-row">
          <div>
            <div style="font-weight:600;font-size:14px">${state.videoFile.name}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">${(state.videoFile.size/1024/1024).toFixed(1)} MB</div>
          </div>
          <button class="sm danger" id="removeVideo">Remove</button>
        </div>
      </div>
    ` : ''}
    <div class="actions-bottom">
      <button class="primary" id="nextBtn" ${!state.videoFile ? 'disabled' : ''}>Continue →</button>
    </div>
  `;
}

function viewUploadSubs() {
  return `
    <h1>Upload Subtitles</h1>
    <p class="sub">Provide an SRT or VTT file. Each subtitle block becomes a dialogue line you can assign to a character.</p>
    <div class="dropzone" id="srtDrop">
      <div class="icon">📝</div>
      <div class="title">Drop SRT / VTT here or click to browse</div>
      <div class="hint">.srt, .vtt · UTF-8</div>
    </div>
    <input type="file" id="srtInput" accept=".srt,.vtt,text/plain" class="hidden">
    ${state.srtFile ? `
      <div class="card" style="margin-top:20px">
        <div class="card-row">
          <div>
            <div style="font-weight:600;font-size:14px">${state.srtName}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">${state.lines.length} dialogue lines parsed</div>
          </div>
          <button class="sm danger" id="removeSrt">Remove</button>
        </div>
      </div>
      <div style="margin-top:16px" class="lines">
        ${state.lines.slice(0, 5).map(l => `
          <div class="line">
            <span class="time">${fmtTime(l.start)}</span>
            <span class="text">${escapeHtml(l.text)}</span>
          </div>
        `).join('')}
        ${state.lines.length > 5 ? `<div class="empty">+ ${state.lines.length - 5} more lines…</div>` : ''}
      </div>
    ` : ''}
    <div class="actions-bottom">
      <button id="backBtn">← Back</button>
      <button class="primary" id="nextBtn" ${!state.srtFile ? 'disabled' : ''}>Continue →</button>
    </div>
  `;
}

function viewLanguage() {
  return `
    <h1>Choose Target Language</h1>
    <p class="sub">Select the language you want to dub into. Voices will adapt to this language.</p>
    <div class="lang-grid">
      ${LANGUAGES.map(l => `
        <div class="lang-card ${state.language === l.code ? 'selected' : ''}" data-lang="${l.code}">
          <div class="flag">${l.flag}</div>
          <div class="name">${l.name}</div>
          <div class="native">${l.native}</div>
        </div>
      `).join('')}
    </div>
    <div class="actions-bottom">
      <button id="backBtn">← Back</button>
      <button class="primary" id="nextBtn" ${!state.language ? 'disabled' : ''}>Continue →</button>
    </div>
  `;
}

function viewCharacters() {
  return `
    <h1>Create Characters</h1>
    <p class="sub">Define every speaker in your video. Each character gets a name, color, and voice later.</p>
    <div class="card">
      <div class="card-row">
        <div style="font-size:13px;color:var(--muted)">${state.characters.length} character${state.characters.length === 1 ? '' : 's'}</div>
        <button class="primary sm" id="addChar">+ Add Character</button>
      </div>
    </div>
    ${state.characters.length === 0 ? `
      <div class="empty">No characters yet. Add one to get started.</div>
    ` : `
      <div class="char-grid">
        ${state.characters.map(ch => `
          <div class="char-card">
            <button class="char-del" data-del="${ch.id}">✕</button>
            <div class="char-avatar" style="background:${ch.color}">${ch.name[0]?.toUpperCase() || '?'}</div>
            <div class="char-name">${escapeHtml(ch.name)}</div>
            <div class="char-meta">${ch.gender} · ${ch.age}</div>
            <div class="char-voice">
              <span class="dot"></span>
              ${ch.voiceId ? VOICES[state.language]?.find(v => v.id === ch.voiceId)?.name || 'Voice set' : 'No voice selected'}
            </div>
          </div>
        `).join('')}
      </div>
    `}
    <div class="actions-bottom">
      <button id="backBtn">← Back</button>
      <button class="primary" id="nextBtn" ${state.characters.length === 0 ? 'disabled' : ''}>Continue →</button>
    </div>
  `;
}

function viewAssign() {
  const unassigned = state.lines.filter(l => !l.characterId).length;
  return `
    <h1>Assign Subtitle Lines</h1>
    <p class="sub">Map each dialogue line to a character. ${unassigned > 0
      ? `<strong style="color:var(--warn)">${unassigned} unassigned</strong>`
      : '<strong style="color:var(--ok)">All assigned ✓</strong>'}</p>
    <div class="card">
      <div class="card-row" style="flex-wrap:wrap">
        <div style="font-size:12px;color:var(--muted)">Quick actions</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="sm" id="assignAllFirst">Assign all → ${state.characters[0]?.name || '—'}</button>
          <button class="sm" id="clearAssign">Clear all</button>
        </div>
      </div>
    </div>
    <div class="lines">
      ${state.lines.map(l => {
        const ch = state.characters.find(c => c.id === l.characterId);
        return `
          <div class="line">
            <span class="time">${fmtTime(l.start)}</span>
            <span class="text">${escapeHtml(l.text)}</span>
            <button class="assign-btn ${ch ? '' : 'unassigned'}" data-line="${l.id}">
              ${ch ? `<span class="cdot" style="background:${ch.color}"></span>${escapeHtml(ch.name)}` : '+ Assign'}
            </button>
          </div>
        `;
      }).join('')}
    </div>
    <div class="actions-bottom">
      <button id="backBtn">← Back</button>
      <button class="primary" id="nextBtn" ${state.lines.some(l => !l.characterId) ? 'disabled' : ''}>Continue →</button>
    </div>
  `;
}

function viewVoices() {
  const voices = VOICES[state.language] || [];
  return `
    <h1>Select Voices</h1>
    <p class="sub">Pick a voice for each character. Voices are filtered by your target language.</p>
    <div class="char-grid">
      ${state.characters.map(ch => {
        return `
          <div class="char-card">
            <div class="char-avatar" style="background:${ch.color}">${ch.name[0]?.toUpperCase() || '?'}</div>
            <div class="char-name">${escapeHtml(ch.name)}</div>
            <div class="char-meta" style="margin-bottom:10px">${ch.gender} · ${ch.age}</div>
            <select data-voice="${ch.id}" style="width:100%;padding:8px 10px;background:var(--panel2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:inherit;font-size:13px;outline:none">
              <option value="">— Select voice —</option>
              ${voices.map(v => `<option value="${v.id}" ${ch.voiceId === v.id ? 'selected' : ''}>${v.name} — ${v.desc}</option>`).join('')}
            </select>
          </div>
        `;
      }).join('')}
    </div>
    <div class="actions-bottom">
      <button id="backBtn">← Back</button>
      <button class="primary" id="nextBtn" ${state.characters.some(c => !c.voiceId) ? 'disabled' : ''}>Continue →</button>
    </div>
  `;
}

function viewGenerate() {
  const total = state.lines.length;
  const done = state.lines.filter(l => l.generated).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const allDone = done === total && total > 0;
  return `
    <h1>Generate Dialogue</h1>
    <p class="sub">Synthesize each line using the assigned voice. Rendering happens on the backend.</p>
    <div class="card">
      <div class="card-row">
        <div>
          <div style="font-size:14px;font-weight:600">${done} / ${total} lines generated</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">${state.generating ? 'Synthesizing…' : allDone ? 'Complete ✓' : 'Ready to start'}</div>
        </div>
        <button class="primary sm" id="genBtn" ${state.generating || allDone ? 'disabled' : ''}>
          ${state.generating ? 'Generating…' : allDone ? 'Done' : 'Generate All'}
        </button>
      </div>
      <div class="progress"><div class="bar" style="width:${pct}%"></div></div>
    </div>
    <div>
      ${state.lines.map(l => {
        const ch = state.characters.find(c => c.id === l.characterId);
        const voice = VOICES[state.language]?.find(v => v.id === ch?.voiceId);
        const status = l.generated ? 'done' : (state.generating ? 'running' : 'pending');
        return `
          <div class="gen-line">
            <div class="gen-status ${status}">${l.generated ? '✓' : status === 'running' ? '⋯' : ''}</div>
            <div style="flex:1">
              <div class="gen-text">${escapeHtml(l.text)}</div>
              <div class="gen-char">${ch ? escapeHtml(ch.name) : '—'} · ${voice?.name || 'no voice'}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <div class="actions-bottom">
      <button id="backBtn">← Back</button>
      <button class="primary" id="nextBtn" ${!allDone ? 'disabled' : ''}>Continue →</button>
    </div>
  `;
}

function viewExport() {
  return `
    <h1>Export</h1>
    <p class="sub">Your dub is ready. Choose the deliverables you want to download.</p>
    <label class="export-opt">
      <input type="checkbox" checked data-exp="video">
      <div>
        <div style="font-weight:600;font-size:14px">Dubbed video (MP4)</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px">Original video with the new audio track mixed in</div>
      </div>
    </label>
    <label class="export-opt">
      <input type="checkbox" data-exp="audio">
      <div>
        <div style="font-weight:600;font-size:14px">Audio stem (WAV)</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px">Full dubbed audio track only</div>
      </div>
    </label>
    <label class="export-opt">
      <input type="checkbox" data-exp="stems">
      <div>
        <div style="font-weight:600;font-size:14px">Per-character stems</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px">One WAV per character — useful for re-mixing</div>
      </div>
    </label>
    <label class="export-opt">
      <input type="checkbox" checked data-exp="srt">
      <div>
        <div style="font-weight:600;font-size:14px">Translated SRT</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px">Subtitle file synced to the generated audio</div>
      </div>
    </label>
    <div class="actions-bottom">
      <button id="backBtn">← Back</button>
      <button class="primary" id="exportBtn">Download Export</button>
    </div>
  `;
}

// ============================================================
// SIDEBAR
// ============================================================
function renderSidebar() {
  const sb = document.getElementById('sidebar');
  const totalChars = state.characters.length;
  const totalLines = state.lines.length;
  const assignedLines = state.lines.filter(l => l.characterId).length;
  const genLines = state.lines.filter(l => l.generated).length;
  const lang = LANGUAGES.find(l => l.code === state.language);

  sb.innerHTML = `
    <div class="sb-section">
      <h2>Project</h2>
      <div class="sb-stat"><span>Video</span><span>${state.videoFile ? '✓' : '—'}</span></div>
      <div class="sb-stat"><span>Subtitles</span><span>${state.srtFile ? state.lines.length + ' lines' : '—'}</span></div>
      <div class="sb-stat"><span>Language</span><span>${lang ? lang.flag + ' ' + lang.name : '—'}</span></div>
      <div class="sb-stat"><span>Characters</span><span>${totalChars || '—'}</span></div>
      <div class="sb-stat"><span>Assigned</span><span>${assignedLines} / ${totalLines || '—'}</span></div>
      <div class="sb-stat"><span>Generated</span><span>${genLines} / ${totalLines || '—'}</span></div>
    </div>
    <div class="sb-section">
      <h2>Characters</h2>
      ${state.characters.length === 0 ? '<div style="font-size:12px;color:var(--muted)">None yet</div>' : state.characters.map(ch => {
        const voice = VOICES[state.language]?.find(v => v.id === ch.voiceId);
        return `
          <div style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13px">
            <span style="width:12px;height:12px;border-radius:50%;background:${ch.color}"></span>
            <span style="flex:1">${escapeHtml(ch.name)}</span>
            <span style="font-size:11px;color:var(--muted)">${voice?.name || '—'}</span>
          </div>
        `;
      }).join('')}
    </div>
    <div class="sb-section">
      <h2>Tips</h2>
      <div style="font-size:12px;color:var(--muted);line-height:1.6">
        • Add characters before assigning lines<br>
        • Use "Assign all" for monologues<br>
        • Generation runs on the render server
      </div>
    </div>
  `;
}

// ============================================================
// BINDINGS
// ============================================================
function bindContent() {
  document.getElementById('backBtn')?.addEventListener('click', () => goToStep(state.step - 1));
  document.getElementById('nextBtn')?.addEventListener('click', nextStep);

  const vDrop = document.getElementById('videoDrop');
  const vInput = document.getElementById('videoInput');
  if (vDrop && vInput) {
    vDrop.onclick = () => vInput.click();
    vInput.onchange = e => handleVideo(e.target.files[0]);
    ['dragover','dragenter'].forEach(ev => vDrop.addEventListener(ev, e => { e.preventDefault(); vDrop.classList.add('drag'); }));
    ['dragleave','drop'].forEach(ev => vDrop.addEventListener(ev, e => { e.preventDefault(); vDrop.classList.remove('drag'); }));
    vDrop.addEventListener('drop', e => handleVideo(e.dataTransfer.files[0]));
  }
  document.getElementById('removeVideo')?.addEventListener('click', () => {
    state.videoFile = null; state.videoURL = null; render();
  });

  const sDrop = document.getElementById('srtDrop');
  const sInput = document.getElementById('srtInput');
  if (sDrop && sInput) {
    sDrop.onclick = () => sInput.click();
    sInput.onchange = e => handleSRT(e.target.files[0]);
    ['dragover','dragenter'].forEach(ev => sDrop.addEventListener(ev, e => { e.preventDefault(); sDrop.classList.add('drag'); }));
    ['dragleave','drop'].forEach(ev => sDrop.addEventListener(ev, e => { e.preventDefault(); sDrop.classList.remove('drag'); }));
    sDrop.addEventListener('drop', e => handleSRT(e.dataTransfer.files[0]));
  }
  document.getElementById('removeSrt')?.addEventListener('click', () => {
    state.srtFile = null; state.srtName = null; state.lines = []; render();
  });

  document.querySelectorAll('[data-lang]').forEach(el => {
    el.onclick = () => { state.language = el.dataset.lang; render(); };
  });

  document.getElementById('addChar')?.addEventListener('click', openCharacterModal);
  document.querySelectorAll('[data-del]').forEach(btn => {
    btn.onclick = () => {
      state.characters = state.characters.filter(c => c.id !== +btn.dataset.del);
      state.lines.forEach(l => { if (l.characterId === +btn.dataset.del) l.characterId = null; });
      render();
    };
  });

  document.querySelectorAll('[data-line]').forEach(btn => {
    btn.onclick = () => openAssignModal(+btn.dataset.line);
  });
  document.getElementById('assignAllFirst')?.addEventListener('click', () => {
    if (!state.characters[0]) return;
    state.lines.forEach(l => { if (!l.characterId) l.characterId = state.characters[0].id; });
    render();
  });
  document.getElementById('clearAssign')?.addEventListener('click', () => {
    state.lines.forEach(l => l.characterId = null); render();
  });

  document.querySelectorAll('[data-voice]').forEach(sel => {
    sel.onchange = () => {
      const ch = state.characters.find(c => c.id === +sel.dataset.voice);
      if (ch) ch.voiceId = sel.value;
      renderSidebar();
      const nextBtn = document.getElementById('nextBtn');
      if (nextBtn) nextBtn.disabled = state.characters.some(c => !c.voiceId);
    };
  });

  document.getElementById('genBtn')?.addEventListener('click', runGeneration);
  document.getElementById('exportBtn')?.addEventListener('click', doExport);
}

// ============================================================
// HANDLERS
// ============================================================
function handleVideo(file) {
  if (!file || !file.type.startsWith('video/')) { toast('Please drop a video file'); return; }
  if (state.videoURL) URL.revokeObjectURL(state.videoURL);
  state.videoFile = file;
  state.videoURL = URL.createObjectURL(file);
  toast(`Loaded ${file.name}`);
  render();
}

async function handleSRT(file) {
  if (!file) return;
  const text = await file.text();
  const lines = parseSRT(text);
  if (!lines.length) { toast('No valid subtitle lines found'); return; }
  state.srtFile = file;
  state.srtName = file.name;
  state.lines = lines;
  toast(`Parsed ${lines.length} lines`);
  render();
}

function openCharacterModal() {
  const modal = document.getElementById('modal');
  const mc = document.getElementById('modalContent');
  let selColor = COLORS[state.characters.length % COLORS.length];
  mc.innerHTML = `
    <h3>New Character</h3>
    <div class="field">
      <label>Name</label>
      <input id="chName" placeholder="e.g. Narrator, Alice…" autofocus>
    </div>
    <div class="field">
      <label>Gender</label>
      <select id="chGender">
        <option>Female</option>
        <option>Male</option>
        <option>Neutral</option>
      </select>
    </div>
    <div class="field">
      <label>Age range</label>
      <select id="chAge">
        <option>Child</option>
        <option>Young adult</option>
        <option selected>Adult</option>
        <option>Senior</option>
      </select>
    </div>
    <div class="field">
      <label>Color</label>
      <div class="color-swatches" id="swatches">
        ${COLORS.map(c => `<div class="swatch ${c === selColor ? 'sel' : ''}" style="background:${c}" data-c="${c}"></div>`).join('')}
      </div>
    </div>
    <div class="modal-actions">
      <button id="cancelCh">Cancel</button>
      <button class="primary" id="saveCh">Add Character</button>
    </div>
  `;
  modal.classList.add('show');
  mc.querySelector('#chName').focus();
  mc.querySelectorAll('.swatch').forEach(sw => {
    sw.onclick = () => {
      selColor = sw.dataset.c;
      mc.querySelectorAll('.swatch').forEach(s => s.classList.toggle('sel', s === sw));
    };
  });
  mc.querySelector('#cancelCh').onclick = () => modal.classList.remove('show');
  mc.querySelector('#saveCh').onclick = () => {
    const name = mc.querySelector('#chName').value.trim();
    if (!name) { toast('Enter a name'); return; }
    state.characters.push({
      id: Date.now(),
      name,
      gender: mc.querySelector('#chGender').value,
      age: mc.querySelector('#chAge').value,
      color: selColor,
      voiceId: null,
    });
    modal.classList.remove('show');
    render();
  };
  modal.onclick = e => { if (e.target === modal) modal.classList.remove('show'); };
}

function openAssignModal(lineId) {
  const line = state.lines.find(l => l.id === lineId);
  if (!line) return;
  const modal = document.getElementById('modal');
  const mc = document.getElementById('modalContent');
  mc.innerHTML = `
    <h3>Assign Line ${line.id}</h3>
    <div style="background:var(--panel2);padding:12px;border-radius:8px;font-size:13px;line-height:1.5;margin-bottom:16px">
      ${escapeHtml(line.text)}
    </div>
    <div class="field">
      <label>Character</label>
      <select id="assignSel">
        <option value="">— Unassigned —</option>
        ${state.characters.map(c => `<option value="${c.id}" ${line.characterId === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
      </select>
    </div>
    <div class="modal-actions">
      <button id="cancelAssign">Cancel</button>
      <button class="primary" id="saveAssign">Save</button>
    </div>
  `;
  modal.classList.add('show');
  mc.querySelector('#cancelAssign').onclick = () => modal.classList.remove('show');
  mc.querySelector('#saveAssign').onclick = () => {
    const v = mc.querySelector('#assignSel').value;
    line.characterId = v ? +v : null;
    modal.classList.remove('show');
    render();
  };
  modal.onclick = e => { if (e.target === modal) modal.classList.remove('show'); };
}

// ============================================================
// RENDER CALLS
// ============================================================
const API = 'http://localhost:3001';

async function runGeneration() {
  if (state.generating) return;

  if (!state.videoFile) { toast('No video uploaded'); return; }

  state.generating = true;
  render();

  const form = new FormData();
  form.append('video', state.videoFile);
  form.append('project', new Blob([JSON.stringify({
    language: state.language,
    characters: state.characters,
    lines: state.lines,
  })], { type: 'application/json' }), 'project.json');

  try {
    const res = await fetch(`${API}/render`, { method: 'POST', body: form });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Render failed');
    }
    const data = await res.json();
    state.renderResult = data;
    state.lines.forEach(l => l.generated = true);
    toast('Render complete');
  } catch (e) {
    toast('Render failed: ' + e.message);
  } finally {
    state.generating = false;
    render();
  }
}

function doExport() {
  if (!state.renderResult) { toast('Render first'); return; }
  const r = state.renderResult;
  const picks = [...document.querySelectorAll('[data-exp]:checked')].map(i => i.dataset.exp);
  if (!picks.length) { toast('Select at least one format'); return; }

  if (picks.includes('video')) window.open(API + r.video, '_blank');
  if (picks.includes('audio')) window.open(API + r.audio, '_blank');
  if (picks.includes('srt'))   window.open(API + r.srt,   '_blank');
  if (picks.includes('stems')) toast('Stems export not yet wired — coming next');
}

// ============================================================
// RESET + INIT
// ============================================================
document.getElementById('resetBtn').onclick = () => {
  if (!confirm('Reset the entire project?')) return;
  if (state.videoURL) URL.revokeObjectURL(state.videoURL);
  state = {
    step: 0, videoFile: null, videoURL: null,
    srtFile: null, srtName: null, language: null,
    characters: [], lines: [], generating: false, generatedCount: 0,
    renderResult: null,
  };
  render();
};

function render() {
  renderSteps();
  renderContent();
  renderSidebar();
}

render();