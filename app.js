'use strict';

const STORAGE_KEY = 'vkp_articles';
const MAX_ARTICLES = 10;

// ── Keypad layout ──────────────────────────────────────────────────────────
const ROWS = [
  [
    { label: '`', value: '`' }, { label: '1', value: '1' }, { label: '2', value: '2' },
    { label: '3', value: '3' }, { label: '4', value: '4' }, { label: '5', value: '5' },
    { label: '6', value: '6' }, { label: '7', value: '7' }, { label: '8', value: '8' },
    { label: '9', value: '9' }, { label: '0', value: '0' }, { label: '-', value: '-' },
    { label: '=', value: '=' }, { label: '⌫', value: 'BACKSPACE', cls: 'key-wide key-special' },
  ],
  [
    { label: 'Tab', value: 'TAB', cls: 'key-wide key-special' },
    { label: 'Q', value: 'q' }, { label: 'W', value: 'w' }, { label: 'E', value: 'e' },
    { label: 'R', value: 'r' }, { label: 'T', value: 't' }, { label: 'Y', value: 'y' },
    { label: 'U', value: 'u' }, { label: 'I', value: 'i' }, { label: 'O', value: 'o' },
    { label: 'P', value: 'p' }, { label: '[', value: '[' }, { label: ']', value: ']' },
    { label: '\\', value: '\\' },
  ],
  [
    { label: 'Caps', value: 'CAPS', cls: 'key-wider key-special' },
    { label: 'A', value: 'a' }, { label: 'S', value: 's' }, { label: 'D', value: 'd' },
    { label: 'F', value: 'f' }, { label: 'G', value: 'g' }, { label: 'H', value: 'h' },
    { label: 'J', value: 'j' }, { label: 'K', value: 'k' }, { label: 'L', value: 'l' },
    { label: ';', value: ';' }, { label: "'", value: "'" },
    { label: 'Enter', value: 'ENTER', cls: 'key-wider key-special' },
  ],
  [
    { label: 'Shift', value: 'SHIFT', cls: 'key-wider key-special', id: 'key-shift' },
    { label: 'Z', value: 'z' }, { label: 'X', value: 'x' }, { label: 'C', value: 'c' },
    { label: 'V', value: 'v' }, { label: 'B', value: 'b' }, { label: 'N', value: 'n' },
    { label: 'M', value: 'm' }, { label: ',', value: ',' }, { label: '.', value: '.' },
    { label: '/', value: '/' },
    { label: 'Shift', value: 'SHIFT', cls: 'key-wider key-special' },
  ],
  [
    { label: 'Space', value: 'SPACE', cls: 'key-space' },
  ],
];

// Shift map for symbols
const SHIFT_MAP = {
  '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
  '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_',
  '=': '+', '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"',
  ',': '<', '.': '>', '/': '?',
};

// ── State ──────────────────────────────────────────────────────────────────
let capsOn = false;
let shiftOn = false;
let articles = loadArticles();
let openArticleIndex = null;

// ── DOM refs ───────────────────────────────────────────────────────────────
const typebox       = document.getElementById('typebox');
const keypadEl      = document.getElementById('keypad');
const saveBtn       = document.getElementById('save-btn');
const clearBtn      = document.getElementById('clear-btn');
const articleList   = document.getElementById('article-list');
const articleCount  = document.getElementById('article-count');
const modalOverlay  = document.getElementById('modal-overlay');
const modalTitle    = document.getElementById('modal-title');
const modalBody     = document.getElementById('modal-body');
const modalClose    = document.getElementById('modal-close');
const modalRestore  = document.getElementById('modal-restore');
const modalDelete   = document.getElementById('modal-delete');

// ── Build keypad ───────────────────────────────────────────────────────────
function buildKeypad() {
  keypadEl.innerHTML = '';
  ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'key-row';
    row.forEach(keyDef => {
      const btn = document.createElement('button');
      btn.className = 'key ' + (keyDef.cls || '');
      btn.textContent = keyDef.label;
      if (keyDef.id) btn.id = keyDef.id;
      btn.dataset.value = keyDef.value;
      btn.addEventListener('mousedown', e => {
        e.preventDefault(); // keep focus on typebox
        handleKey(keyDef.value, btn);
      });
      rowEl.appendChild(btn);
    });
    keypadEl.appendChild(rowEl);
  });
}

// ── Key handling ───────────────────────────────────────────────────────────
function handleKey(value, btnEl) {
  flashKey(btnEl);

  if (value === 'SHIFT') {
    shiftOn = !shiftOn;
    updateKeyLabels();
    return;
  }

  if (value === 'CAPS') {
    capsOn = !capsOn;
    updateKeyLabels();
    return;
  }

  typebox.focus();

  if (value === 'BACKSPACE') {
    const start = typebox.selectionStart;
    const end   = typebox.selectionEnd;
    if (start !== end) {
      insertText('');
    } else if (start > 0) {
      typebox.setSelectionRange(start - 1, start);
      insertText('');
    }
    return;
  }

  if (value === 'ENTER') {
    insertText('\n');
    return;
  }

  if (value === 'TAB') {
    insertText('  ');
    return;
  }

  if (value === 'SPACE') {
    insertText(' ');
    return;
  }

  // Regular character
  let ch = value;
  const isLetter = ch.length === 1 && ch.match(/[a-z]/i);
  const shouldUpper = capsOn !== shiftOn; // XOR: caps+shift = lower

  if (isLetter) {
    ch = shouldUpper ? ch.toUpperCase() : ch.toLowerCase();
  } else if (shiftOn && SHIFT_MAP[ch]) {
    ch = SHIFT_MAP[ch];
  }

  insertText(ch);

  if (shiftOn) {
    shiftOn = false;
    updateKeyLabels();
  }
}

function insertText(text) {
  const start = typebox.selectionStart;
  const end   = typebox.selectionEnd;
  const val   = typebox.value;
  typebox.value = val.slice(0, start) + text + val.slice(end);
  const cursor = start + text.length;
  typebox.setSelectionRange(cursor, cursor);
}

function flashKey(btn) {
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);
}

function updateKeyLabels() {
  document.querySelectorAll('.key').forEach(btn => {
    const val = btn.dataset.value;
    if (!val) return;
    const isLetter = val.length === 1 && val.match(/[a-z]/i);
    const shouldUpper = capsOn !== shiftOn;

    if (isLetter) {
      btn.textContent = shouldUpper ? val.toUpperCase() : val.toLowerCase();
    } else if (val.length === 1 && SHIFT_MAP[val]) {
      btn.textContent = shiftOn ? SHIFT_MAP[val] : val;
    }
  });

  // Highlight shift keys when active
  document.querySelectorAll('[data-value="SHIFT"]').forEach(btn => {
    btn.classList.toggle('pressed', shiftOn);
  });
  // Highlight caps when active
  document.querySelectorAll('[data-value="CAPS"]').forEach(btn => {
    btn.classList.toggle('pressed', capsOn);
  });
}

// ── Physical keyboard support ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.target !== typebox) return;
  // Highlight matching virtual key
  const key = e.key;
  document.querySelectorAll('.key').forEach(btn => {
    const v = btn.dataset.value;
    if (
      (key === v) ||
      (key.toLowerCase() === v.toLowerCase() && v.length === 1) ||
      (key === 'Backspace' && v === 'BACKSPACE') ||
      (key === 'Enter'     && v === 'ENTER') ||
      (key === 'Tab'       && v === 'TAB') ||
      (key === ' '         && v === 'SPACE') ||
      (key === 'CapsLock'  && v === 'CAPS') ||
      (key === 'Shift'     && v === 'SHIFT')
    ) {
      flashKey(btn);
    }
  });
});

// ── Articles ───────────────────────────────────────────────────────────────
function loadArticles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveArticles() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

function saveCurrentArticle() {
  const text = typebox.value.trim();
  if (!text) {
    showToast('Nothing to save — typebox is empty.');
    return;
  }

  const title = deriveTitle(text);
  const article = { title, text, savedAt: Date.now() };
  articles.unshift(article);
  if (articles.length > MAX_ARTICLES) articles = articles.slice(0, MAX_ARTICLES);
  saveArticles();
  renderArticleList();
  showToast('Article saved!');
}

function deriveTitle(text) {
  const first = text.split('\n')[0].trim();
  return first.length > 50 ? first.slice(0, 47) + '…' : first || 'Untitled';
}

function renderArticleList() {
  articleCount.textContent = articles.length;
  if (!articles.length) {
    articleList.innerHTML = '<li class="empty-state">No articles saved yet.</li>';
    return;
  }

  articleList.innerHTML = '';
  articles.forEach((art, i) => {
    const li = document.createElement('li');
    li.className = 'article-item';
    li.innerHTML = `
      <div class="article-item-title">${escHtml(art.title)}</div>
      <div class="article-item-meta">${formatDate(art.savedAt)} &bull; ${wordCount(art.text)} words</div>
    `;
    li.addEventListener('click', () => openModal(i));
    articleList.appendChild(li);
  });
}

function openModal(index) {
  openArticleIndex = index;
  const art = articles[index];
  modalTitle.textContent = art.title;
  modalBody.textContent  = art.text;
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  openArticleIndex = null;
  modalOverlay.classList.add('hidden');
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

modalRestore.addEventListener('click', () => {
  if (openArticleIndex === null) return;
  typebox.value = articles[openArticleIndex].text;
  typebox.focus();
  closeModal();
  showToast('Restored to editor.');
});

modalDelete.addEventListener('click', () => {
  if (openArticleIndex === null) return;
  articles.splice(openArticleIndex, 1);
  saveArticles();
  renderArticleList();
  closeModal();
  showToast('Article deleted.');
});

// ── Controls ───────────────────────────────────────────────────────────────
saveBtn.addEventListener('click', saveCurrentArticle);
clearBtn.addEventListener('click', () => {
  typebox.value = '';
  typebox.focus();
});

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Init ───────────────────────────────────────────────────────────────────
buildKeypad();
renderArticleList();
typebox.focus();
