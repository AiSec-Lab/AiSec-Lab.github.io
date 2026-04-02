document.addEventListener('DOMContentLoaded', async () => {
  const output = document.querySelector('[data-slideshow-output]');
  const title = document.querySelector('[data-slideshow-title]');
  const counter = document.querySelector('[data-slideshow-counter]');
  const toggleButton = document.querySelector('[data-action="toggle"]');
  const prevButton = document.querySelector('[data-action="prev"]');
  const nextButton = document.querySelector('[data-action="next"]');
  const restartButton = document.querySelector('[data-action="restart"]');

  if (!output || !title || !counter || !window.AiSecSlideshowData?.buildSlides) return;

  const slides = await window.AiSecSlideshowData.buildSlides();
  if (!slides.length) return;

  let currentIndex = 0;
  let autoPlay = true;
  let timeoutId = null;
  let renderId = 0;
  let isRendering = false;

  prevButton?.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextButton?.addEventListener('click', () => goToSlide(currentIndex + 1));
  restartButton?.addEventListener('click', () => goToSlide(0));
  toggleButton?.addEventListener('click', () => {
    autoPlay = !autoPlay;
    updateStatus();
    if (!autoPlay) {
      clearQueuedSlide();
      return;
    }
    if (!isRendering) {
      queueNextSlide(slides[currentIndex]?.duration || 8600);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToSlide(currentIndex + 1);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToSlide(currentIndex - 1);
      return;
    }
    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      toggleButton?.click();
      return;
    }
    if (event.key.toLowerCase() === 'r') {
      event.preventDefault();
      goToSlide(0);
    }
  });

  updateStatus();
  await renderSlide(currentIndex);

  async function goToSlide(nextIndex) {
    currentIndex = normalizeIndex(nextIndex);
    clearQueuedSlide();
    await renderSlide(currentIndex);
  }

  async function renderSlide(index) {
    const slide = slides[index];
    if (!slide) return;

    renderId += 1;
    const activeRender = renderId;
    isRendering = true;
    output.innerHTML = '';
    title.textContent = slide.title || 'AiSec Lab';
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    updateStatus();

    appendCommandBlock(slide.command || './aiseclab', slide.path || '~');
    await wait(180);

    for (const line of slide.lines || []) {
      if (activeRender !== renderId) return;
      await typeLine(line.text || '', line.tone || '', activeRender);
      await wait(100);
    }

    if (activeRender !== renderId) return;
    isRendering = false;
    if (autoPlay) queueNextSlide(slide.duration || 8600);
  }

  function queueNextSlide(delay) {
    clearQueuedSlide();
    timeoutId = window.setTimeout(() => {
      goToSlide(currentIndex + 1);
    }, delay);
  }

  function clearQueuedSlide() {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function updateStatus() {
    if (toggleButton) {
      toggleButton.textContent = autoPlay ? 'Pause' : 'Resume';
    }
  }

  function normalizeIndex(index) {
    if (index < 0) return slides.length - 1;
    if (index >= slides.length) return 0;
    return index;
  }

  function appendCommandBlock(text, pathLabel) {
    const headerLine = document.createElement('div');
    headerLine.className = 'slideshow-line prompt-header';
    headerLine.innerHTML =
      `<span class="slideshow-terminal-green">┌──(visitor@aiseclab)-</span><span class="slideshow-terminal-home">[${escapeHTML(pathLabel)}]</span>`;
    output.appendChild(headerLine);

    const commandLine = document.createElement('div');
    commandLine.className = 'slideshow-line command';
    commandLine.innerHTML = `<span class="prompt">└─$</span>${escapeHTML(text)}`;
    output.appendChild(commandLine);
  }

  async function typeLine(text, tone, activeRender) {
    const line = document.createElement('div');
    line.className = ['slideshow-line', tone].filter(Boolean).join(' ');
    output.appendChild(line);

    for (const char of String(text)) {
      if (activeRender !== renderId) return;
      line.textContent += char;
      await wait(11);
    }
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function escapeHTML(value = '') {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});
