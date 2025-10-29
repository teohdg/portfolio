class TextScramble {
  constructor(textNode) {
    this.node = textNode;
    this.chars = '!<>-_\\/[]{}—=+*^?#@%$&';
    this.frame = 0;
    this.queue = [];
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.node.nodeValue;
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    return new Promise(resolve => {
      this.resolve = resolve;
      this.update();
    });
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += char;
      } else {
        output += from;
      }
    }

    this.node.nodeValue = output;

    if (complete === this.queue.length) {
      if (this.resolve) this.resolve();
    } else {
      this.frame++;
      requestAnimationFrame(this.update);
    }
  }
}

// Scramble all text nodes safely, including inside links
function scrambleElement(el) {
  el.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
      const fx = new TextScramble(node);
      fx.setText(node.nodeValue);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      scrambleElement(node); // recurse
    }
  });
}

// Run scramble on page load
window.addEventListener('load', () => {
  const elements = document.querySelectorAll('.info-block');
  elements.forEach(el => scrambleElement(el));
});
