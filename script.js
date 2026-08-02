(() => {
  const ducati = document.querySelector('.ducati');
  const title = document.querySelector('.hero-title');
  if (!ducati || !title) return;

  const duration = 2200; // ms, bike ride
  const titleDuration = 650; // ms, title fade
  const exitThreshold = 0.55; // fraction of ride at which the bike is safely off-screen
  const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

  ducati.style.transform = 'translateX(-115vw)';
  ducati.style.willChange = 'transform';

  let start = null;
  let fired = false;
  const rideFrame = (now) => {
    if (start === null) start = now;
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = ease(t);
    const vw = window.innerWidth / 100;
    const x = (-115 + eased * (125 - -115)) * vw;
    ducati.style.transform = `translateX(${x}px)`;

    if (!fired && t >= exitThreshold) {
      fired = true;
      ducati.classList.add('gone');
      fadeInTitle();
    }

    if (t < 1) {
      requestAnimationFrame(rideFrame);
    } else if (!fired) {
      fired = true;
      ducati.classList.add('gone');
      fadeInTitle();
    }
  };

  let titleStart = null;
  const fadeFrame = (now) => {
    if (titleStart === null) titleStart = now;
    const elapsed = now - titleStart;
    const t = Math.min(elapsed / titleDuration, 1);
    title.style.opacity = String(t);
    if (t < 1) requestAnimationFrame(fadeFrame);
  };
  const fadeInTitle = () => requestAnimationFrame(fadeFrame);

  requestAnimationFrame(rideFrame);

  // hard safety net: if rAF is somehow throttled/blocked, force the end state
  setTimeout(() => {
    ducati.classList.add('gone');
    title.style.opacity = '1';
  }, 3200);
})();

const slides = [...document.querySelectorAll('.slide')];
let currentSlide = 0;
window.setInterval(() => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 3000);

const skills = document.querySelector('.skills-canvas');
const ballerina = document.querySelector('.ballerina-hit');
const dancers = [...document.querySelectorAll('.dancer')];
const ballerinaStage = document.querySelector('.ballerina-stage');
ballerina.addEventListener('click', () => {
  if (skills.classList.contains('played')) return;
  ballerina.disabled = true;
  let frame = 0;
  const advance = () => {
    dancers.forEach((dancer, index) => dancer.classList.toggle('active', index === frame));
    ballerinaStage.style.left = ['1%', '19%', '38%', '57%', '76%'][frame];
    frame += 1;
    if (frame < dancers.length) window.setTimeout(advance, 360);
    else window.setTimeout(() => { ballerinaStage.style.left = '112%'; window.setTimeout(() => skills.classList.add('played'), 280); }, 420);
  };
  advance();
});


document.querySelector('#exhibition').addEventListener('click', (event) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  if (x > 0.75 && y > 0.28 && y < 0.64) window.open('https://beliapp.co/app/dhayarose', '_blank', 'noopener');
});
