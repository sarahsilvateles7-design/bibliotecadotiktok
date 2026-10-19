(() => {
  const root = document.documentElement;
  if (!root.classList.contains('bp-intro-active')) return;
  const key = 'bp-intro-completed-v2';
  const dialog = document.createElement('dialog');
  dialog.id = 'bp-intro';
  dialog.setAttribute('aria-label', 'Vídeo de abertura: Biblioteca de Prompts');
  dialog.innerHTML = `
    <div class="bp-studio" aria-hidden="true"><div class="bp-studio-grid"></div></div>
    <img class="bp-intro-brand" src="assets/intro-brand.png" alt="Biblioteca de Prompts">
    <h2 class="bp-stage-title" hidden>AVISO IMPORTANTE</h2>
    <div class="bp-intro-frame">
      <video autoplay playsinline preload="auto" disablepictureinpicture disableremoteplayback aria-label="Vídeo de abertura" poster="assets/intro-abertura-v4.jpg" src="assets/intro-abertura-v4.mp4"></video>
      <button class="bp-access-overlay" type="button" hidden disabled>GARANTIR MEU ACESSO</button>
    </div>
    <div class="bp-intro-actions" aria-live="polite">
      <button class="bp-intro-retry" type="button" hidden>Reproduzir vídeo</button>
      <button class="bp-intro-continue" type="button" hidden disabled>CONTINUAR →</button>
    </div>`;
  document.body.appendChild(dialog);
  const video = dialog.querySelector('video');
  // Decorative code streams, repeated for a seamless upward loop.
  const codeLines = [
    '<span>// creative engine · initializing</span>',
    '<b>const</b> idea = await capture();',
    'scene.light = <em>"cinematic"</em>;',
    '<b>await</b> compose(scene);',
    'frames.map(render.detail);',
    '<span>01001101 10110010 01101001</span>',
    'camera.lock({ motion: false });',
    '<b>const</b> prompt = build(idea);',
    'texture.resolve(<em>"realistic"</em>);',
    'timeline.sync(24);',
    '<span>// processing visual references</span>',
    'render.queue.push(nextFrame);',
    '<b>await</b> engine.prepare();',
    'sequence.seed = 0xA7F9;',
    'output.format = <em>"9:16"</em>;',
    '<span>11010010 00101101 10010110</span>',
    'details.enhance(scene);',
    '<b>return</b> imagination.create();'
  ];
  ['left', 'right', 'center'].forEach((side, index) => {
    const panel = document.createElement('div');
    panel.className = 'bp-code-panel bp-code-' + side;
    const lines = index ? [...codeLines.slice(8), ...codeLines.slice(0, 8)] : codeLines;
    const block = '<pre>' + [...lines, ...lines].join('\n') + '\n</pre>';
    panel.innerHTML = '<div class="bp-code-track">' + block + block + '</div>';
    dialog.querySelector('.bp-studio').appendChild(panel);
  });
  const proceed = dialog.querySelector('.bp-intro-continue');
  const retry = dialog.querySelector('.bp-intro-retry');
  const access = dialog.querySelector('.bp-access-overlay');
  const title = dialog.querySelector('.bp-stage-title');
  let stage = 0;
  let completed = false;
  const revealAccess = () => {
    access.hidden = false;
    access.disabled = false;
  };
  const nextStage = () => {
    stage += 1;
    completed = false;
    proceed.hidden = true;
    proceed.disabled = true;
    retry.hidden = true;
    retry.textContent = 'Reproduzir vídeo';
    dialog.classList.add('bp-black-stage');
    title.hidden = stage !== 1;
    dialog.setAttribute('aria-label', stage === 1 ? 'Aviso importante' : 'Boas-vindas');
    video.setAttribute('aria-label', stage === 1 ? 'Aviso importante' : 'Boas-vindas');
    video.removeAttribute('poster');
    video.src = stage === 1 ? 'assets/aviso-importante.mp4' : 'assets/boas-vindas.mp4';
    video.load();
    play();
  };
  video.addEventListener('timeupdate', () => {
    if (stage === 2 && video.currentTime >= 6.8) revealAccess();
  });
  let leaving = false;
  dialog.addEventListener('cancel', event => event.preventDefault());
  video.addEventListener('contextmenu', event => event.preventDefault());
  dialog.showModal();
  video.muted = false;
  video.volume = 1;
  const play = () => video.play().catch(() => { if (!completed) retry.hidden = false; });
  video.addEventListener('playing', () => { retry.hidden = true; });
  video.addEventListener('pause', () => { if (!video.ended && !completed) retry.hidden = false; });
  video.addEventListener('error', () => { retry.textContent = 'Tentar carregar o vídeo'; retry.hidden = false; });
  retry.addEventListener('click', () => {
    retry.hidden = true;
    if (video.error) video.load();
    play();
  });
  video.addEventListener('ended', () => {
    if (!video.ended) return;
    completed = true;
    retry.hidden = true;
    if (stage === 2) {
      revealAccess();
      access.focus({ preventScroll: true });
    } else {
      proceed.disabled = false;
      proceed.hidden = false;
      proceed.focus({ preventScroll: true });
    }
  });
  proceed.addEventListener('click', () => {
    if (!completed || leaving || stage >= 2) return;
    nextStage();
  });
  access.addEventListener('click', () => {
    if (stage !== 2 || access.disabled || leaving) return;
    leaving = true;
    try { sessionStorage.setItem(key, '1'); } catch (_) { /* Unavailable storage: intro remains session-safe when supported. */ }
    dialog.classList.add('bp-intro-exit');
    setTimeout(() => {
      video.pause();
      dialog.close();
      dialog.remove();
      root.classList.remove('bp-intro-active');
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280);
  });
  play();
})();
