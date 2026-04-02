document.addEventListener('DOMContentLoaded', () => {
  const output = document.querySelector('[data-contact-terminal-output]');
  const replayButton = document.querySelector('[data-contact-replay]');
  if (!output) return;

  let runId = 0;
  const lines = [
    { type: 'command', text: './join_lab --show-contact' },
    { type: 'highlight', text: 'AiSec Lab // contributor intake terminal' },
    { type: 'text', text: '' },
    { type: 'text', text: 'Are you interested to contribute in any of these projects?' },
    { type: 'text', text: 'Join our lab and send an email to sarefin1[at][universityname].edu.' },
    { type: 'text', text: '' },
    { type: 'text', text: 'Or send a message here:' },
    {
      type: 'link',
      label: 'University of Dayton contact form',
      href: 'https://udayton.edu/_resources/contact_form.php?cmsId=76ac207d0a480e99411d8665a6867a10',
    },
  ];

  replayButton?.addEventListener('click', () => {
    startSequence();
  });

  startSequence();

  async function startSequence() {
    runId += 1;
    const currentRun = runId;
    output.innerHTML = '';

    for (const line of lines) {
      if (currentRun !== runId) return;
      if (line.type === 'command') {
        appendCommandLine(line.text);
        await wait(220);
        continue;
      }
      if (line.type === 'highlight') {
        await typeLine(line.text, 'terminal-green', currentRun);
        await wait(120);
        continue;
      }
      if (line.type === 'link') {
        appendLinkLine(line.label, line.href);
        await wait(140);
        continue;
      }
      if (!line.text) {
        appendPlainLine('');
        await wait(90);
        continue;
      }
      await typeLine(line.text, '', currentRun);
      await wait(80);
    }
  }

  function appendCommandLine(text) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="prompt">└─$</span>${escapeHTML(text)}`;
    output.appendChild(line);
    scrollToBottom();
  }

  function appendPlainLine(text) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    output.appendChild(line);
    scrollToBottom();
  }

  function appendLinkLine(label, href) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="terminal-orange">${escapeHTML(label)}</span>: <a class="terminal-link" href="${escapeAttr(
      href,
    )}" target="_blank" rel="noopener">${escapeHTML(href)}</a>`;
    output.appendChild(line);
    scrollToBottom();
  }

  async function typeLine(text, className, currentRun) {
    const line = document.createElement('div');
    line.className = ['terminal-line', className].filter(Boolean).join(' ');
    output.appendChild(line);

    for (const char of text) {
      if (currentRun !== runId) return;
      line.textContent += char;
      scrollToBottom();
      await wait(14);
    }
  }

  function scrollToBottom() {
    const terminalWindow = output.closest('.terminal-window');
    if (terminalWindow) {
      terminalWindow.scrollTop = terminalWindow.scrollHeight;
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function escapeHTML(value = '') {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(value = '') {
    return String(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
});
