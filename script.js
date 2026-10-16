// ---------- hero bike ride ----------
(() => {
  const ducati = document.querySelector('.ducati');
  const title = document.querySelector('.hero-title');
  if (!ducati || !title) return;

  // The bike drives left to right at a steady pace and is fully off screen at the
  // end of the ride (start/end are chosen so it is off screen at both ends).
  const duration = 3800;      // ms for the whole ride (bike is visible almost the entire time)
  const titleDuration = 250;  // ms, quick title fade
  const fromVw = -95, toVw = 95;
  const fadeWhenTailPassesVw = 70; // start the title as the bike's tail clears this point

  ducati.style.transform = `translateX(${fromVw}vw)`;
  ducati.style.willChange = 'transform';

  let start = null, titleStarted = false, titleStart = null;

  const showTitle = (now) => {
    if (titleStart === null) titleStart = now;
    const t = Math.min((now - titleStart) / titleDuration, 1);
    title.style.opacity = String(t);
    if (t < 1) requestAnimationFrame(showTitle);
  };
  const startTitle = () => {
    if (titleStarted) return;
    titleStarted = true;
    requestAnimationFrame(showTitle);
  };
  const finish = () => {
    ducati.style.display = 'none';
    ducati.classList.add('gone');
    startTitle();
  };

  const rideFrame = (now) => {
    if (start === null) start = now;
    const t = Math.min((now - start) / duration, 1);
    const vw = window.innerWidth / 100;
    const xVw = fromVw + t * (toVw - fromVw);
    ducati.style.transform = `translateX(${xVw * vw}px)`;
    // the bike's left edge sits at 9% of the page, so its tail is at (9 + xVw) vw
    if (9 + xVw > fadeWhenTailPassesVw) startTitle();
    if (t < 1) requestAnimationFrame(rideFrame);
    else finish();
  };
  requestAnimationFrame(rideFrame);

  // safety net in case animation frames are throttled
  setTimeout(() => { finish(); title.style.opacity = '1'; }, duration + 1500);
})();

// ---------- exhibition slideshow ----------
const slides = [...document.querySelectorAll('.slide')];
let currentSlide = 0;
window.setInterval(() => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 3000);

document.querySelector('#exhibition').addEventListener('click', (event) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  if (x > 0.75 && y > 0.28 && y < 0.64) window.open('https://beliapp.co/app/dhayarose', '_blank', 'noopener');
});

// ---------- ballerina twirl -> reveal My Work folders ----------
const work = document.querySelector('.work-canvas');
const ballerina = document.querySelector('.ballerina-hit');
const dancers = [...document.querySelectorAll('.dancer')];
const ballerinaStage = document.querySelector('.ballerina-stage');
if (work && ballerina) {
  ballerina.addEventListener('click', () => {
    if (work.classList.contains('played')) return;
    ballerina.disabled = true;
    let frame = 0;
    const advance = () => {
      dancers.forEach((dancer, index) => dancer.classList.toggle('active', index === frame));
      ballerinaStage.style.left = ['1%', '19%', '38%', '57%', '76%'][frame];
      frame += 1;
      if (frame < dancers.length) window.setTimeout(advance, 360);
      else window.setTimeout(() => { ballerinaStage.style.left = '112%'; window.setTimeout(() => work.classList.add('played'), 280); }, 420);
    };
    advance();
  });
}

// ---------- palette: drag the brush onto a shade ----------
(() => {
  const brush = document.querySelector('.brush');
  const zones = [...document.querySelectorAll('.drop-zone')];
  if (!brush || !zones.length) return;

  const restLeft = brush.style.left;
  const restTop = brush.style.top;
  let originX = 0, originY = 0, pointerId = null;

  const zoneUnder = (clientX, clientY) => zones.find((z) => {
    const r = z.getBoundingClientRect();
    return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
  });

  const onPointerDown = (e) => {
    pointerId = e.pointerId;
    brush.setPointerCapture(pointerId);
    brush.classList.add('dragging');
    const r = brush.getBoundingClientRect();
    originX = e.clientX - r.left;
    originY = e.clientY - r.top;
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (e.pointerId !== pointerId) return;
    const parent = brush.closest('.palette-canvas').getBoundingClientRect();
    const x = e.clientX - parent.left - originX;
    const y = e.clientY - parent.top - originY;
    brush.style.left = `${(x / parent.width) * 100}%`;
    brush.style.top = `${(y / parent.height) * 100}%`;
    zones.forEach((z) => z.classList.toggle('drag-over', zoneUnder(e.clientX, e.clientY) === z));
  };

  const onPointerUp = (e) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    brush.classList.remove('dragging');
    zones.forEach((z) => z.classList.remove('drag-over'));
    const hit = zoneUnder(e.clientX, e.clientY);
    if (hit) {
      window.location.hash = hit.dataset.target;
    }
    brush.style.left = restLeft;
    brush.style.top = restTop;
  };

  brush.addEventListener('pointerdown', onPointerDown);
  brush.addEventListener('pointermove', onPointerMove);
  brush.addEventListener('pointerup', onPointerUp);
  brush.addEventListener('pointercancel', onPointerUp);
})();

// reset brush position whenever returning to the palette
window.addEventListener('hashchange', () => {
  const brush = document.querySelector('.brush');
  if (window.location.hash === '#palette' && brush) {
    brush.style.left = '';
    brush.style.top = '';
  }
});

// if the page loads directly on a shade fragment (e.g. a shared/certification link),
// make sure it actually scrolls into view once the :target display kicks in
if (/^#shade-\d$/.test(window.location.hash)) {
  const jumpToShade = () => {
    const target = document.querySelector(window.location.hash);
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
  };
  window.addEventListener('load', () => {
    jumpToShade();
    setTimeout(jumpToShade, 150);
    setTimeout(jumpToShade, 500);
  });
}
