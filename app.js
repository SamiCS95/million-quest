(() => {
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

/* ---------------- i18n ---------------- */
const T = {
  en: {
    tabGame:'Millionaire', tabWorld:'World trainer', startTitle:'Can you reach the million?',
    rule1:'15 questions, harder and harder.', rule2:'A timer on every question (you choose how long).',
    optDiff:'Difficulty', optCat:'Category', optTime:'Time per question', optRegion:'Continent', optAnswer:'Answer with',
    diff:{normal:'Normal', hard:'Hard', expert:'Expert'},
    cats:{all:'All', m:'Anime & manga', v:'Video games', f:'Films & series', u:'Music', z:'Fun & random', n:'Animals & nature', g:'Geography', h:'History', s:'Science', a:'Arts & books', p:'Sport & board games', c:'Everyday'},
    timeOff:'No timer', sec:'s',
    gamesTitle:'Games', gamesIntro:'3 lives. Every mistake or time-out costs one. How far can you go?',
    inputChoices:'4 choices', inputType:'Typing (harder)', gameFlag:'Guess the flag', gameCap:'Guess the capital',
    bestScore:n=>n?`Best: ${n}`:'No score yet', ok:'OK', skip:'Skip', gameOver:'Game over',
    typeCountry:'Type the country…', typeCapital:'Type the capital…', capitalOfQ:'Capital of', answerWas:'Answer: ',
    newBest:'New record! 🎉', yourBest:n=>`Your best: ${n}`, finalScore:n=>`${n} point${n>1?'s':''}`, combo:n=>`🔥 ×${n}`,
    rule3:'3 lifelines: 50:50, Ask the audience, Phone a friend.',
    rule4:'Safe levels at question 5 and 10. Walk away any time to keep your winnings.',
    start:'Start', walk:'Walk away', questionFor:'Question for', final:'Final answer', again:'Play again',
    best:'Best: ', audience:'The audience voted:', phone:'Your friend says:',
    phoneSure:(l,p)=>`"I'm pretty sure it's ${l}. Maybe ${p}% sure."`,
    phoneUnsure:(l,p)=>`"Hmm… I'd go with ${l}, but only ${p}% sure. Sorry!"`,
    winTitle:'MILLIONAIRE! 🏆', walkTitle:'You walked away', loseTitle:'Wrong answer', timeTitle:'Time is up ⏱️',
    correctWas:'The correct answer was: ', funFact:'Remember it:', walkConfirm:'Walk away with ', youTake:'You leave with',
    worldTitle:'Train your world knowledge', worldIntro:'Short sessions of 10 questions. The ones you miss come back more often until you know them.',
    modeFlag:'Flag → Country', modeCap:'Country → Capital', modeCapR:'Capital → Country', modeReview:'Review my mistakes',
    modeStudy:'Study list', studySub:'All flags & capitals', back:'← Back', next:'Next',
    all:'All', mastered:(m,t)=>`${m}/${t} mastered`, toReview:n=>n?`${n} to review`:'Nothing to review 🎉',
    whichCountry:'Which country has this flag?', capitalOf:'What is the capital of', capitalOfEnd:'?',
    whichCountryCap:'This is the capital of which country?', right:'Correct!', wrong:'Not quite.',
    capital:'Capital', score:(a,b)=>`${a}/${b}`, done:(a,b)=>`${a}/${b} correct`, perfect:'Perfect session! 🎉',
    keepGoing:'Missed ones will come back more often. Review them:', nothingReview:'No mistakes to review yet. Play a session first.',
    search:'Search a country or capital', credits:'Country data: mledoze/countries · Flags: flag-icons', cur:'$'
  },
  fr: {
    tabGame:'Millionnaire', tabWorld:'Culture G', startTitle:'Arriverez-vous au million\u00a0?',
    rule1:'15 questions, de plus en plus difficiles.', rule2:'Un chrono sur chaque question (vous choisissez la durée).',
    optDiff:'Difficulté', optCat:'Catégorie', optTime:'Temps par question', optRegion:'Continent', optAnswer:'Répondre avec',
    diff:{normal:'Normal', hard:'Difficile', expert:'Expert'},
    cats:{all:'Toutes', m:'Animes & mangas', v:'Jeux vidéo', f:'Films & séries', u:'Musique', z:'Fun & n\'importe quoi', n:'Animaux & nature', g:'Géographie', h:'Histoire', s:'Sciences', a:'Arts & livres', p:'Sport & jeux de société', c:'Vie courante'},
    timeOff:'Sans chrono', sec:'s',
    gamesTitle:'Jeux', gamesIntro:'3 vies. Chaque erreur ou temps écoulé en coûte une. Jusqu\'où irez-vous ?',
    inputChoices:'4 choix', inputType:'Écrire (plus dur)', gameFlag:'Devine le drapeau', gameCap:'Devine la capitale',
    bestScore:n=>n?`Record : ${n}`:'Pas encore de score', ok:'OK', skip:'Passer', gameOver:'Partie terminée',
    typeCountry:'Écrivez le pays…', typeCapital:'Écrivez la capitale…', capitalOfQ:'Capitale de', answerWas:'Réponse : ',
    newBest:'Nouveau record ! 🎉', yourBest:n=>`Votre record : ${n}`, finalScore:n=>`${n} point${n>1?'s':''}`, combo:n=>`🔥 ×${n}`,
    rule3:'3 jokers : 50:50, l\'avis du public, l\'appel à un ami.',
    rule4:'Paliers à la question 5 et 10. Abandonnez quand vous voulez pour garder vos gains.',
    start:'Commencer', walk:'Abandonner', questionFor:'Question pour', final:'Dernier mot', again:'Rejouer',
    best:'Record : ', audience:'Le public a voté :', phone:'Votre ami dit :',
    phoneSure:(l,p)=>`« Je suis presque sûr que c'est ${l}. Disons ${p} %. »`,
    phoneUnsure:(l,p)=>`« Hmm… je dirais ${l}, mais je ne suis sûr qu'à ${p} %. Désolé ! »`,
    winTitle:'MILLIONNAIRE ! 🏆', walkTitle:'Vous avez abandonné', loseTitle:'Mauvaise réponse', timeTitle:'Temps écoulé ⏱️',
    correctWas:'La bonne réponse était : ', funFact:'Pour t\'en souvenir :', walkConfirm:'Partir avec ', youTake:'Vous repartez avec',
    worldTitle:'Entraînez votre culture générale', worldIntro:'Sessions courtes de 10 questions. Celles que vous ratez reviennent plus souvent jusqu\'à ce que vous les sachiez.',
    modeFlag:'Drapeau → Pays', modeCap:'Pays → Capitale', modeCapR:'Capitale → Pays', modeReview:'Revoir mes erreurs',
    modeStudy:'Liste d\'étude', studySub:'Tous les drapeaux et capitales', back:'← Retour', next:'Suivant',
    all:'Tous', mastered:(m,t)=>`${m}/${t} maîtrisés`, toReview:n=>n?`${n} à revoir`:'Rien à revoir 🎉',
    whichCountry:'À quel pays appartient ce drapeau ?', capitalOf:'Quelle est la capitale de :', capitalOfEnd:' ?',
    whichCountryCap:'C\'est la capitale de quel pays ?', right:'Bonne réponse !', wrong:'Raté.',
    capital:'Capitale', score:(a,b)=>`${a}/${b}`, done:(a,b)=>`${a}/${b} bonnes réponses`, perfect:'Session parfaite ! 🎉',
    keepGoing:'Les erreurs reviendront plus souvent. À revoir :', nothingReview:'Aucune erreur à revoir. Jouez d\'abord une session.',
    search:'Chercher un pays ou une capitale', credits:'Données pays : mledoze/countries · Drapeaux : flag-icons', cur:'€'
  }
};
const REGIONS = ['Africa','Americas','Asia','Europe','Oceania'];
const REGION_EN = {Africa:'Africa',Americas:'Americas',Asia:'Asia',Europe:'Europe',Oceania:'Oceania'};
let lang = store.get('mq_lang', (navigator.language || 'en').startsWith('fr') ? 'fr' : 'en');
const t = k => T[lang][k];

function applyLang() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
  $('#ws-search').placeholder = t('search');
  buildLadder(); renderBest(); renderRegions(); renderProgress(); renderOptions(); renderGameCards();
  if (G.active) renderQuestion(true);
  if (W.active) renderWorldQ(true);
  if (G.endQ !== undefined) renderEndFact();
  if (typeof GG !== 'undefined' && GG.active && !GG.busy) renderGG();
  if (!$('#world-study').classList.contains('hidden')) renderStudy();
}
$$('.lang button').forEach(b => b.onclick = () => { lang = b.dataset.lang; store.set('mq_lang', lang); applyLang(); });

/* ---------------- tabs ---------------- */
$$('.tab').forEach(b => b.onclick = () => {
  $$('.tab').forEach(x => x.classList.toggle('active', x === b));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + b.dataset.tab));
});

/* =========================================================
   TAB 1 — MILLIONAIRE GAME
   ========================================================= */
const PRIZES = [100,200,300,500,1000,2000,4000,8000,16000,32000,64000,125000,250000,500000,1000000];
const SAFE = [4, 9]; // index of safe levels (Q5, Q10)
const OPTS = Object.assign({ diff:'normal', cat:'all', time:60 }, store.get('mq_opts', {}));
// which question tier each of the 15 levels uses, per difficulty
const PLAN = {
  normal:[1,1,1,1,1, 2,2,2,2,2, 3,3,3,3,3],
  hard:  [2,2,2,2,2, 3,3,3,3,3, 4,4,4,4,4],
  expert:[3,3,3,3,3, 4,4,4,4,4, 4,4,4,4,4]
};
function chipRow(sel, items, current, onPick) {
  const wrap = $(sel); wrap.innerHTML = '';
  items.forEach(([val, label]) => {
    const b = document.createElement('button'); b.className = 'chip' + (String(current) === String(val) ? ' on' : '');
    b.textContent = label; b.onclick = () => onPick(val); wrap.appendChild(b);
  });
}
function renderOptions() {
  const save = () => { store.set('mq_opts', OPTS); renderOptions(); };
  chipRow('#opt-diff', Object.entries(t('diff')), OPTS.diff, v => { OPTS.diff = v; save(); });
  chipRow('#opt-cat', Object.entries(t('cats')), OPTS.cat, v => { OPTS.cat = v; save(); });
  chipRow('#opt-time', [[30, '30 ' + t('sec')], [60, '60 ' + t('sec')], [90, '90 ' + t('sec')], [0, t('timeOff')]], OPTS.time, v => { OPTS.time = +v; save(); });
}
const money = n => (lang === 'fr' ? n.toLocaleString('fr-FR') + ' €' : '$' + n.toLocaleString('en-US'));
const G = { active:false };

function buildLadder() {
  const ol = $('#ladder'); ol.innerHTML = '';
  PRIZES.forEach((p, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="n">${i + 1}</span><span>${money(p)}</span>`;
    if (SAFE.includes(i) || i === 14) li.classList.add('safe');
    if (G.active) { if (i < G.level) li.classList.add('done'); if (i === G.level) li.classList.add('cur'); }
    ol.appendChild(li);
  });
  const cur = ol.querySelector('.cur'); if (cur && window.innerWidth <= 820) cur.scrollIntoView({inline:'center', block:'nearest'});
}
function renderBest() { const b = store.get('mq_best', 0); $('#best-score').textContent = b ? t('best') + money(b) : ''; }

function pickQuestions() {
  // Questions are stored by their English text so the "already seen" list survives new questions being added.
  const seen = new Set(store.get('mq_seen2', []));
  const used = new Set(), out = [];
  const all = QUESTIONS.map((q, i) => i);
  const catOk = i => OPTS.cat === 'all' || QUESTIONS[i][5] === OPTS.cat;
  PLAN[OPTS.diff].forEach(tier => {
    const free = all.filter(i => !used.has(i));
    // try, in order: right category + right tier + not seen → right category + right tier →
    // right category + nearest tier → any category + right tier
    const tries = [
      free.filter(i => catOk(i) && QUESTIONS[i][0] === tier && !seen.has(QUESTIONS[i][1])),
      free.filter(i => catOk(i) && QUESTIONS[i][0] === tier),
      free.filter(i => catOk(i) && Math.abs(QUESTIONS[i][0] - tier) === 1),
      free.filter(i => catOk(i)),
      free.filter(i => QUESTIONS[i][0] === tier),
      free
    ];
    const pool = tries.find(p => p.length);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    used.add(pick); out.push(pick); seen.add(QUESTIONS[pick][1]);
  });
  // forget "seen" once most of the bank has been played, so questions rotate forever
  store.set('mq_seen2', seen.size > QUESTIONS.length * 0.8 ? [] : [...seen]);
  return out; // already in ladder order (easiest tier first)
}

function startGame() {
  Object.assign(G, { active:true, level:0, qs:pickQuestions(), selected:null, locked:false, helper:null });
  ['#ll-5050','#ll-audience','#ll-phone'].forEach(id => $(id).disabled = false);
  show('#game-play'); nextQuestion();
}
function show(id) { ['#game-start','#game-play','#game-end'].forEach(x => $(x).classList.toggle('hidden', x !== id)); }

function nextQuestion() {
  const q = QUESTIONS[G.qs[G.level]];
  // order: indexes 0..3 of the answer list, shuffled; correct is index 0
  G.order = shuffle([0, 1, 2, 3]);
  G.removed = new Set(); G.selected = null; G.locked = false; G.helperHtml = null;
  $('#helper').classList.add('hidden');
  renderQuestion(); startTimer();
}

function renderQuestion(keepState) {
  const q = QUESTIONS[G.qs[G.level]];
  const [qt, ans] = lang === 'fr' ? [q[3], q[4]] : [q[1], q[2]];
  $('#question').textContent = qt;
  $('#now-prize').textContent = money(PRIZES[G.level]);
  $('#q-index').textContent = G.level + 1;
  const box = $('#answers'); box.innerHTML = '';
  G.order.forEach((ai, pos) => {
    const b = document.createElement('button');
    b.className = 'ans'; b.dataset.ai = ai;
    b.innerHTML = `<span class="k">${'ABCD'[pos]}:</span>${escapeHtml(ans[ai])}`;
    if (G.removed.has(ai)) b.classList.add('gone');
    if (G.selected === ai) b.classList.add('sel');
    b.disabled = G.locked;
    b.onclick = () => selectAnswer(ai);
    box.appendChild(b);
  });
  $('#btn-final').disabled = G.selected === null || G.locked;
  buildLadder();
  if (keepState && G.helper) renderHelper();
}
function selectAnswer(ai) {
  if (G.locked || G.removed.has(ai)) return;
  G.selected = ai;
  $$('#answers .ans').forEach(b => b.classList.toggle('sel', +b.dataset.ai === ai));
  $('#btn-final').disabled = false;
}

function startTimer() {
  clearInterval(G.timer);
  $('#timer').classList.toggle('hidden', !OPTS.time);
  if (!OPTS.time) return;
  G.timeLeft = OPTS.time; drawTimer();
  G.timer = setInterval(() => { G.timeLeft--; drawTimer(); if (G.timeLeft <= 0) { clearInterval(G.timer); timeUp(); } }, 1000);
}
function drawTimer() {
  $('#timer-num').textContent = G.timeLeft;
  $('#timer-ring').style.strokeDashoffset = 119.4 * (1 - G.timeLeft / OPTS.time);
  $('#timer').classList.toggle('warn', G.timeLeft <= 10);
}

function lockAndReveal(onDone) {
  G.locked = true; clearInterval(G.timer);
  $$('#answers .ans').forEach(b => b.disabled = true); $('#btn-final').disabled = true;
  setTimeout(() => {
    const correct = $(`#answers .ans[data-ai="0"]`);
    correct.classList.remove('sel'); correct.classList.add('ok', 'flash');
    if (G.selected !== null && G.selected !== 0) { const s = $(`#answers .ans[data-ai="${G.selected}"]`); s.classList.remove('sel'); s.classList.add('bad'); }
    setTimeout(onDone, 1800);
  }, 900);
}
$('#btn-final').onclick = () => {
  if (G.selected === null || G.locked) return;
  lockAndReveal(() => {
    if (G.selected === 0) {
      if (G.level === 14) return endGame('win', PRIZES[14]);
      G.level++; G.helper = null; nextQuestion();
    } else endGame('lose', safeAmount());
  });
};
function timeUp() { G.selected = null; lockAndReveal(() => endGame('time', safeAmount())); }
function safeAmount() { let s = 0; SAFE.forEach(i => { if (G.level > i) s = PRIZES[i]; }); return s; }
$('#btn-walk').onclick = () => {
  if (G.locked) return;
  const amount = G.level > 0 ? PRIZES[G.level - 1] : 0;
  if (!confirm(t('walkConfirm') + money(amount) + ' ?')) return;
  G.selected = null; clearInterval(G.timer); G.locked = true;
  endGame('walk', amount);
};
function endGame(kind, amount) {
  clearInterval(G.timer); G.active = false;
  const q = QUESTIONS[G.qs[G.level]];
  $('#end-title').textContent = { win:t('winTitle'), walk:t('walkTitle'), lose:t('loseTitle'), time:t('timeTitle') }[kind];
  $('#end-amount').textContent = money(amount);
  $('#end-detail').textContent = '';
  G.endQ = kind === 'win' ? null : q;
  renderEndFact();
  if (amount > store.get('mq_best', 0)) store.set('mq_best', amount);
  renderBest(); show('#game-end');
}
// After a wrong answer / time-out / walk-away: show the question, the right answer and a fun fact to remember it
function renderEndFact() {
  const box = $('#end-fact'), q = G.endQ;
  if (!q) { box.classList.add('hidden'); box.innerHTML = ''; return; }
  const fr = lang === 'fr';
  const fact = (window.FACTS || {})[q[1]];
  box.innerHTML =
    `<div class="fact-q">${escapeHtml(fr ? q[3] : q[1])}</div>` +
    `<div class="fact-a">✅ ${t('correctWas')}<b>${escapeHtml(fr ? q[4][0] : q[2][0])}</b></div>` +
    (fact ? `<div class="fact-f">💡 <b>${t('funFact')}</b> ${escapeHtml(fr ? fact[1] : fact[0])}</div>` : '');
  box.classList.remove('hidden');
}

/* lifelines */
$('#ll-5050').onclick = () => {
  if (G.locked) return; $('#ll-5050').disabled = true;
  const wrong = shuffle([1, 2, 3].filter(i => !G.removed.has(i))).slice(0, 2);
  wrong.forEach(i => G.removed.add(i));
  if (wrong.includes(G.selected)) G.selected = null;
  renderQuestion(true);
};
$('#ll-audience').onclick = () => {
  if (G.locked) return; $('#ll-audience').disabled = true;
  const live = [0, 1, 2, 3].filter(i => !G.removed.has(i));
  const lvl = G.level;
  // the audience gets less reliable as questions get harder
  let favourite = 0;
  if (Math.random() < (lvl < 5 ? 0.03 : lvl < 10 ? 0.12 : 0.28)) favourite = shuffle(live.filter(i => i !== 0))[0];
  const share = Math.max(0.32, 0.82 - lvl * 0.035) * (live.length === 2 ? 1.15 : 1);
  const votes = {};
  let rest = 1 - Math.min(share, 0.95);
  votes[favourite] = Math.min(share, 0.95);
  const others = live.filter(i => i !== favourite);
  const weights = others.map(() => Math.random() + 0.2); const sum = weights.reduce((a, b) => a + b, 0);
  others.forEach((i, k) => votes[i] = rest * weights[k] / sum);
  G.helper = { type:'audience', votes };
  renderHelper();
};
$('#ll-phone').onclick = () => {
  if (G.locked) return; $('#ll-phone').disabled = true;
  const live = [0, 1, 2, 3].filter(i => !G.removed.has(i));
  const right = Math.random() < Math.max(0.45, 0.97 - G.level * 0.035);
  const pick = right ? 0 : shuffle(live.filter(i => i !== 0))[0];
  const conf = right ? 55 + Math.floor(Math.random() * (G.level < 8 ? 45 : 30)) : 30 + Math.floor(Math.random() * 30);
  G.helper = { type:'phone', pick, conf };
  renderHelper();
};
function renderHelper() {
  const h = G.helper, el = $('#helper'); if (!h) return;
  const letter = ai => 'ABCD'[G.order.indexOf(ai)];
  if (h.type === 'audience') {
    const bars = G.order.map(ai => {
      const v = G.removed.has(ai) ? 0 : Math.round((h.votes[ai] || 0) * 100);
      return `<div class="bar"><span>${v}%</span><i style="height:${v}%"></i><b>${letter(ai)}</b></div>`;
    }).join('');
    el.innerHTML = `<div class="muted small">${t('audience')}</div><div class="bars">${bars}</div>`;
  } else {
    const f = h.conf >= 60 ? t('phoneSure') : t('phoneUnsure');
    el.innerHTML = `<div class="muted small">📞 ${t('phone')}</div><p>${f(letter(h.pick), h.conf)}</p>`;
  }
  el.classList.remove('hidden');
}
$('#btn-start').onclick = startGame;
$('#btn-again').onclick = startGame;

/* =========================================================
   TAB 2 — WORLD TRAINER (spaced repetition, Leitner boxes 0-5)
   ========================================================= */
const W = { active:false, region:store.get('mq_region', 'all') };
const cname = c => lang === 'fr' ? c.fr : c.en;
const ccap = c => lang === 'fr' ? c.capFr : c.capEn;
const flag = c => `flags/${c.c}.svg`;
const boxes = () => store.get('mq_boxes', { flag:{}, cap:{}, capr:{} });
const mistakes = () => store.get('mq_mistakes', []); // [[mode, code], ...]
const poolFor = (mode, region) => COUNTRIES.filter(c => (region === 'all' || c.r === region) && (mode === 'flag' || c.cq));

function renderRegions() {
  const wrap = $('#regions'); wrap.innerHTML = '';
  ['all', ...REGIONS].forEach(r => {
    const b = document.createElement('button'); b.className = 'chip' + (W.region === r ? ' on' : '');
    b.textContent = r === 'all' ? t('all') : (lang === 'fr' ? REGION_FR[r] : REGION_EN[r]);
    b.onclick = () => { W.region = r; store.set('mq_region', r); renderRegions(); renderProgress(); };
    wrap.appendChild(b);
  });
}
function renderProgress() {
  const bx = boxes();
  ['flag', 'cap', 'capr'].forEach(m => {
    const pool = poolFor(m, W.region);
    const done = pool.filter(c => (bx[m][c.c] || 0) >= 3).length;
    $('#prog-' + m).textContent = t('mastered')(done, pool.length);
  });
  $('#prog-review').textContent = t('toReview')(mistakes().length);
}

$$('.mode').forEach(b => b.onclick = () => {
  const m = b.dataset.mode;
  if (m === 'study') return openStudy();
  if (m === 'review' && !mistakes().length) return alert(t('nothingReview'));
  startWorld(m);
});

function weightedPick(pool, mode, n) {
  const bx = boxes()[mode] || {};
  const items = pool.map(c => ({ c, w: Math.pow(2, 5 - Math.min(5, bx[c.c] || 0)) + Math.random() }));
  const out = [];
  while (out.length < n && items.length) {
    const total = items.reduce((a, x) => a + x.w, 0); let r = Math.random() * total;
    const i = items.findIndex(x => (r -= x.w) <= 0); out.push(items.splice(i < 0 ? 0 : i, 1)[0].c);
  }
  return out;
}
function startWorld(mode) {
  let qs;
  if (mode === 'review') {
    qs = shuffle(mistakes()).slice(0, 10).map(([m, code]) => ({ mode:m, c:COUNTRIES.find(x => x.c === code) })).filter(x => x.c);
  } else {
    qs = weightedPick(poolFor(mode, W.region), mode, 10).map(c => ({ mode, c }));
  }
  Object.assign(W, { active:true, startMode:mode, qs, i:0, score:0, missed:[] });
  wshow('#world-quiz'); nextWorldQ();
}
function wshow(id) { ['#world-home','#world-quiz','#world-done','#world-study','#world-game','#world-gameover'].forEach(x => $(x).classList.toggle('hidden', x !== id)); }

function nextWorldQ() {
  const { mode, c } = W.qs[W.i];
  // distractors: same region first, so it's not too easy
  const base = COUNTRIES.filter(x => x.c !== c.c && (mode === 'flag' || x.cq));
  const same = shuffle(base.filter(x => x.r === c.r)), other = shuffle(base.filter(x => x.r !== c.r));
  W.choices = shuffle([c, ...[...same, ...other].slice(0, 3)]);
  W.answered = null;
  renderWorldQ();
}
function renderWorldQ() {
  const { mode, c } = W.qs[W.i];
  $('#wq-progress').textContent = `${W.i + 1} / ${W.qs.length}`;
  $('#wq-score').textContent = '✓ ' + W.score;
  const p = $('#wq-prompt');
  if (mode === 'flag') p.innerHTML = `<span class="sub">${t('whichCountry')}</span><img src="${flag(c)}" alt="flag">`;
  else if (mode === 'cap') p.innerHTML = `<span class="sub">${t('capitalOf')}</span>${escapeHtml(cname(c))}${t('capitalOfEnd')}`;
  else p.innerHTML = `<span class="sub">${t('whichCountryCap')}</span>${escapeHtml(ccap(c))}`;
  const box = $('#wq-answers'); box.innerHTML = '';
  W.choices.forEach((x, k) => {
    const b = document.createElement('button'); b.className = 'ans';
    b.innerHTML = `<span class="k">${'ABCD'[k]}:</span>${escapeHtml(mode === 'cap' ? ccap(x) : cname(x))}`;
    if (W.answered) { b.disabled = true; if (x.c === c.c) b.classList.add('ok'); else if (x.c === W.answered) b.classList.add('bad'); }
    b.onclick = () => answerWorld(x);
    box.appendChild(b);
  });
  if (W.answered) renderFeedback(); else { $('#wq-feedback').classList.add('hidden'); $('#wq-next').classList.add('hidden'); }
}
function answerWorld(x) {
  if (W.answered) return;
  const { mode, c } = W.qs[W.i];
  const ok = x.c === c.c; W.answered = x.c; W.lastOk = ok;
  const bx = boxes(); const cur = bx[mode][c.c] || 0;
  bx[mode][c.c] = ok ? Math.min(5, cur + 1) : 0; store.set('mq_boxes', bx);
  let ms = mistakes().filter(([m, code]) => !(m === mode && code === c.c));
  if (!ok) { ms.push([mode, c.c]); W.missed.push(c); } else W.score++;
  store.set('mq_mistakes', ms);
  renderWorldQ();
}
function renderFeedback() {
  const { c } = W.qs[W.i]; const fb = $('#wq-feedback');
  fb.className = 'feedback' + (W.lastOk ? '' : ' bad');
  fb.innerHTML = `<img src="${flag(c)}" alt=""><div><b>${W.lastOk ? t('right') : t('wrong')}</b><br>${escapeHtml(cname(c))} — ${t('capital')} : <b>${escapeHtml(ccap(c))}</b></div>`;
  $('#wq-next').classList.remove('hidden'); $('#wq-next').focus();
}
$('#wq-next').onclick = () => { W.i++; if (W.i >= W.qs.length) return endWorld(); nextWorldQ(); };
$('#wq-back').onclick = () => { W.active = false; renderProgress(); wshow('#world-home'); };
function endWorld() {
  W.active = false;
  $('#wd-title').textContent = W.missed.length ? t('done')(W.score, W.qs.length) : t('perfect');
  $('#wd-detail').textContent = W.missed.length ? t('keepGoing') : t('done')(W.score, W.qs.length);
  $('#wd-missed').innerHTML = W.missed.map(c => `<div><img src="${flag(c)}" alt=""><span><b>${escapeHtml(cname(c))}</b><br>${escapeHtml(ccap(c))}</span></div>`).join('');
  renderProgress(); wshow('#world-done');
}
$('#wd-again').onclick = () => startWorld(W.startMode === 'review' && !mistakes().length ? 'flag' : W.startMode);
$('#wd-home').onclick = () => { renderProgress(); wshow('#world-home'); };

/* study list */
function openStudy() { wshow('#world-study'); $('#ws-search').value = ''; renderStudy(); }
function norm(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
function renderStudy() {
  const q = norm($('#ws-search').value || '');
  const list = COUNTRIES.filter(c => W.region === 'all' || c.r === W.region)
    .filter(c => !q || [c.en, c.fr, c.capEn, c.capFr].some(s => norm(s).includes(q)))
    .sort((a, b) => cname(a).localeCompare(cname(b), lang));
  $('#ws-grid').innerHTML = list.map(c => `<div class="study-item"><img loading="lazy" src="${flag(c)}" alt=""><span><b>${escapeHtml(cname(c))}</b>${escapeHtml(ccap(c))}</span></div>`).join('');
}
$('#ws-search').oninput = renderStudy;
$('#ws-back').onclick = () => { renderProgress(); wshow('#world-home'); };

/* =========================================================
   TAB 2 — GAMES: Guess the flag / Guess the capital (3 lives)
   ========================================================= */
const GG = { active:false, input:store.get('mq_input', 'choices') };
const ALIAS = { // extra accepted spellings for typed answers (already accent/space-insensitive)
  us:['usa','us','unitedstatesofamerica','america','etatsunisdamerique'], gb:['uk','greatbritain','britain','grandebretagne'],
  cd:['drc','rdc','democraticrepublicofthecongo','republiquedemocratiqueducongo','congokinshasa'],
  cg:['republicofthecongo','congobrazzaville'], ci:['cotedivoire','ivorycoast'], cz:['czechrepublic','republiquetcheque'],
  mm:['burma','myanmar'], tr:['turkey','turkiye','turquie'], sz:['swaziland'], mk:['macedonia','macedoine'],
  ae:['uae','emirates','eau','emirats'], cv:['caboverde','capeverde','capvert'], tl:['easttimor','timorleste'],
  va:['vatican','holysee','saintsiege'], nl:['holland','hollande'], ps:['stateofpalestine'], md:['moldavia'],
  st:['saotome','saotomeandprincipe','saotomeetprincipe'], kn:['stkittsandnevis','saintkitts'], lc:['stlucia'],
  vc:['stvincent','saintvincent'], vn:['vietnam','vietnam'], sv:['elsalvador'], kp:['dprk','coreedunord'], kr:['coreedusud'],
  ba:['bosnia','bosnie'], tt:['trinidad'], ag:['antigua'], pg:['papuanewguinea'], fm:['micronesia'], bn:['bruneidarussalam'],
  la:['laos'], ru:['russianfederation'], sy:['syria'], ir:['iran'], gw:['guineabissau'], gq:['equatorialguinea']
};
const CAP_ALIAS = {
  ua:['kiev','kyiv','kiev'], bo:['lapaz','sucre'], za:['pretoria','capetown','lecap','bloemfontein'], sz:['mbabane','lobamba'],
  lk:['kotte','srijayawardenepura','colombo'], mn:['ulaanbaatar','oulanbator','ulanbator'], cn:['peking','beijing','pekin'],
  in:['delhi','newdelhi','newdehli'], us:['washington','washingtondc'], mx:['mexicocity','mexico'], kw:['kuwait','koweit','koweitcity'],
  pa:['panama','panamacity'], gt:['guatemala','guatemalacity'], va:['vatican','vaticancity'], sm:['sanmarino','saintmarin'],
  sg:['singapore','singapour'], lu:['luxembourg'], mc:['monaco'], dj:['djibouti'], kg:['bishkek','bichkek'], am:['yerevan','erevan'],
  kz:['astana','nursultan'], mm:['naypyidaw','naypyitaw','naypyitaw'], bd:['dhaka','dacca'], np:['kathmandu','katmandou']
};
const bestKey = g => `mq_best_${g}_${GG.input}`;
function renderGameCards() {
  chipRow('#opt-input', [['choices', t('inputChoices')], ['type', t('inputType')]], GG.input, v => { GG.input = v; store.set('mq_input', v); renderGameCards(); });
  ['flag', 'cap'].forEach(g => $('#best-' + g).textContent = t('bestScore')(store.get(bestKey(g), 0)));
}
$$('.mode.game').forEach(b => b.onclick = () => startGG(b.dataset.game));

function startGG(game) {
  const pool = poolFor(game === 'flag' ? 'flag' : 'cap', W.region);
  Object.assign(GG, { active:true, game, deck:shuffle(pool), i:0, lives:3, score:0, combo:0, missed:[], busy:false });
  wshow('#world-game'); nextGG();
}
function nextGG() {
  if (GG.i >= GG.deck.length) { GG.deck = shuffle(GG.deck); GG.i = 0; } // went through every country: reshuffle
  const c = GG.deck[GG.i];
  GG.cur = c; GG.busy = false;
  const base = COUNTRIES.filter(x => x.c !== c.c && (GG.game === 'flag' || x.cq));
  const same = shuffle(base.filter(x => x.r === c.r)), other = shuffle(base.filter(x => x.r !== c.r));
  GG.choices = shuffle([c, ...[...same, ...other].slice(0, 3)]);
  $('#gg-feedback').classList.add('hidden');
  renderGG();
  GG.limit = GG.input === 'type' ? 20 : 12;
  GG.start = Date.now(); clearInterval(GG.timer);
  GG.timer = setInterval(tickGG, 200); tickGG();
  if (GG.input === 'type') { const inp = $('#gg-input'); inp.value = ''; inp.focus(); }
}
function tickGG() {
  const left = Math.max(0, GG.limit - (Date.now() - GG.start) / 1000);
  $('#gg-timefill').style.width = (100 * left / GG.limit) + '%';
  $('.gg-timebar').classList.toggle('warn', left < 4);
  if (left <= 0) resolveGG(false, true);
}
function renderGG() {
  const c = GG.cur;
  renderGGHud();
  $('#gg-prompt').innerHTML = GG.game === 'flag'
    ? `<span class="sub">${t('whichCountry')}</span><img src="${flag(c)}" alt="flag">`
    : `<span class="sub">${t('capitalOf')}</span>${escapeHtml(cname(c))}${t('capitalOfEnd')}`;
  const typing = GG.input === 'type';
  $('#gg-form').classList.toggle('hidden', !typing);
  $('#gg-answers').classList.toggle('hidden', typing);
  $('#gg-input').placeholder = GG.game === 'flag' ? t('typeCountry') : t('typeCapital');
  if (!typing) {
    const box = $('#gg-answers'); box.innerHTML = '';
    GG.choices.forEach((x, k) => {
      const b = document.createElement('button'); b.className = 'ans'; b.dataset.c = x.c;
      b.innerHTML = `<span class="k">${'ABCD'[k]}:</span>${escapeHtml(GG.game === 'cap' ? ccap(x) : cname(x))}`;
      b.onclick = () => { if (!GG.busy) { GG.picked = x.c; resolveGG(x.c === c.c); } };
      box.appendChild(b);
    });
  }
}
function key(s) { return norm(s).replace(/^(the|le|la|les|l')\s+/, '').replace(/[^a-z0-9]/g, ''); }
function lev(a, b) { // edit distance, to forgive small typos
  const d = Array.from({ length:a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function targetsOf(c) {
  return GG.game === 'flag' ? [c.en, c.fr].map(key).concat(ALIAS[c.c] || []) : [c.capEn, c.capFr].map(key).concat(CAP_ALIAS[c.c] || []);
}
function typedOk(text, c) {
  const k = key(text); if (!k) return false;
  const mine = targetsOf(c);
  if (mine.includes(k)) return true;
  // typed exactly another country's name (e.g. "Gambia" for Zambia) → wrong, even if it's 1 letter away
  if (COUNTRIES.some(o => o.c !== c.c && targetsOf(o).includes(k))) return false;
  return mine.some(tg => { const tol = tg.length <= 4 ? 0 : tg.length <= 8 ? 1 : 2; return lev(k, tg) <= tol; });
}
$('#gg-form').onsubmit = e => { e.preventDefault(); if (!GG.busy && $('#gg-input').value.trim()) resolveGG(typedOk($('#gg-input').value, GG.cur)); };
$('#gg-skip').onclick = () => { if (!GG.busy) resolveGG(false); };
function resolveGG(ok, timeout) {
  if (GG.busy || !GG.active) return;
  GG.busy = true; clearInterval(GG.timer);
  const c = GG.cur;
  if (ok) { GG.score++; GG.combo++; } else { GG.lives--; GG.combo = 0; GG.missed.push(c); }
  $$('#gg-answers .ans').forEach(b => { b.disabled = true; if (b.dataset.c === c.c) b.classList.add('ok'); else if (b.dataset.c === GG.picked) b.classList.add('bad'); });
  GG.picked = null;
  const fb = $('#gg-feedback');
  fb.className = 'feedback' + (ok ? '' : ' bad');
  fb.innerHTML = `<img src="${flag(c)}" alt=""><div><b>${ok ? t('right') : (timeout ? '⏱️ ' : '') + t('wrong')}</b><br>${escapeHtml(cname(c))} — ${t('capital')} : <b>${escapeHtml(ccap(c))}</b></div>`;
  renderGGHud();
  // also feed the training progress, so games count toward "mastered"
  const mode = GG.game === 'flag' ? 'flag' : 'cap';
  const bx = boxes(); bx[mode][c.c] = ok ? Math.min(5, (bx[mode][c.c] || 0) + 1) : 0; store.set('mq_boxes', bx);
  let ms = mistakes().filter(([m, code]) => !(m === mode && code === c.c)); if (!ok) ms.push([mode, c.c]); store.set('mq_mistakes', ms);
  setTimeout(() => {
    if (!GG.active) return;
    if (GG.lives <= 0) return endGG();
    GG.i++; nextGG();
  }, ok ? 900 : 2200);
}
function renderGGHud() {
  $('#gg-lives').textContent = '❤️'.repeat(Math.max(0, GG.lives)) + '🖤'.repeat(3 - Math.max(0, GG.lives));
  $('#gg-score').innerHTML = `${GG.score} ${GG.combo >= 3 ? `<span class="combo">${t('combo')(GG.combo)}</span>` : ''}`;
}
function endGG() {
  GG.active = false; clearInterval(GG.timer);
  const prev = store.get(bestKey(GG.game), 0);
  if (GG.score > prev) store.set(bestKey(GG.game), GG.score);
  $('#go-score').textContent = t('finalScore')(GG.score);
  $('#go-best').textContent = GG.score > prev ? t('newBest') : t('yourBest')(prev);
  $('#go-missed').innerHTML = GG.missed.map(c => `<div><img src="${flag(c)}" alt=""><span><b>${escapeHtml(cname(c))}</b><br>${escapeHtml(ccap(c))}</span></div>`).join('');
  renderGameCards(); renderProgress(); wshow('#world-gameover');
}
$('#gg-back').onclick = () => { GG.active = false; clearInterval(GG.timer); renderGameCards(); renderProgress(); wshow('#world-home'); };
$('#go-again').onclick = () => startGG(GG.game);
$('#go-home').onclick = () => { renderGameCards(); renderProgress(); wshow('#world-home'); };

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch])); }

applyLang();
})();
