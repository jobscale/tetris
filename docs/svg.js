/* eslint-env browser */
const drawSvg = async () => {
  const wait = n => new Promise(resolve => {
    setTimeout(resolve, n);
  });
  const area = document.querySelector('#svg-area');
  const w3 = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(w3, 'svg');
  svg.setAttributeNS(null, 'viewBox', '0 0 1000 1000');
  area.append(svg);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const shape = document.createElementNS(w3, 'circle');
      svg.append(shape);
      shape.setAttributeNS(null, 'r', 45);
      shape.setAttributeNS(null, 'cx', 95 + (j * 100));
      shape.setAttributeNS(null, 'cy', 95 + (i * 100));
      const color = `#${`${i}0`.slice(-2)}${`${i * j}0`.slice(-2)}${`${j}0`.slice(-2)}`;
      shape.setAttributeNS(null, 'fill', color);
    }
  }
  const list = Array.from(svg.querySelectorAll('circle'));
  while (list.length) {
    const i = Math.floor(Math.random() * list.length);
    await wait(50);
    const color = `#${`00000${Math.floor(Math.random() * 1000000)}`.slice(-6)}`;
    list[i].setAttributeNS(null, 'fill', color);
  }
};

window.addEventListener('DOMContentLoaded', drawSvg);
