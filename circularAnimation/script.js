gsap.defaults({
  overwrite: "auto",
  force3D: true
});

const items = document.querySelectorAll(".item");
const container = document.querySelector(".container");

const count = items.length;
const step = (Math.PI * 2) / count;
const radius = 300;

let isOpen = false;

requestAnimationFrame(init);

function init() {
  const tl = gsap.timeline();

  items.forEach((item, i) => {
    const angle = i * step;

    const x = Math.round(Math.cos(angle) * radius);
    const y = Math.round(Math.sin(angle) * radius);
    const rotation = Math.round((angle * 180) / Math.PI - 90);

    gsap.set(item, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.001,
      transformOrigin: "50% 50%",
      transformPerspective: 1000
    });

    tl.to(item, {
      x,
      y,
      rotation,
      scale: 1,
      duration: 0.8,
      ease: "power3.out"
    }, i * 0.06);

    item.addEventListener("click", () => openItem(item, x, y, rotation));
  });
}

function openItem(item, x, y, rotation) {
  if (isOpen) return;
  isOpen = true;

  const clone = item.cloneNode(true);
  clone.style.position = "absolute";
  container.appendChild(clone);

  gsap.set(clone, {
    x,
    y,
    xPercent: -50,
    yPercent: -50,
    rotation,
    scale: 1,
    transformPerspective: 1000
  });

  gsap.set(item, { autoAlpha: 0 });

  gsap.to([...items].filter(i => i !== item), {
    scale: 0,
    duration: 0.4,
    ease: "power3.in"
  });

  gsap.to(clone, {
    x: 0,
    y: 0,
    scale: 3,
    rotation: 0,
    duration: 0.8,
    ease: "power3.out"
  });

  clone.addEventListener("click", () => closeItem(clone, item, x, y, rotation));
}

function closeItem(clone, item, x, y, rotation) {
  gsap.to(clone, {
    x,
    y,
    scale: 1,
    rotation,
    duration: 0.7,
    ease: "power3.inOut",
    onComplete: () => {
      clone.remove();
      gsap.set(item, { autoAlpha: 1 });
      gsap.to(items, {
        scale: 1,
        duration: 0.6,
        ease: "power3.out"
      });
      isOpen = false;
    }
  });
}
