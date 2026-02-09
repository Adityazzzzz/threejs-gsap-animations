console.clear();

let icons = document.querySelectorAll(".toolbarItem");
let dock = document.querySelector(".toolbar");
let firstIcon = icons[0];

let min = 48; // 40 + margin
let max = 120;
let bound = min * Math.PI;

gsap.set(icons, {
  transformOrigin: "50% 120%",  
  height: 40
});

gsap.set(dock, {
  position: "relative",  
  height: 60
});

dock.addEventListener("mousemove", (event) => {
  
  let offset = dock.getBoundingClientRect().left + firstIcon.offsetLeft;  
  updateIcons(event.clientX - offset);
});

dock.addEventListener("mouseleave", (event) => {
  
  gsap.to(icons, {
    duration: 0.3,
    scale: 1,
    x: 0
  });
});

// Add click handlers for each toolbar item
icons.forEach((icon, index) => {
  const link = icon.querySelector('.toolbarLink');
  const img = icon.querySelector('.toolbarImg');
  const altText = img.alt || `Icon ${index + 1}`;
  
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Animate the clicked icon
    gsap.to(icon, {
      duration: 0.1,
      scale: 0.8,
      onComplete: () => {
        gsap.to(icon, {
          duration: 0.2,
          scale: 1,
          ease: "elastic.out(1, 0.3)"
        });
      }
    });
    
    // Log which icon was clicked
    console.log(`${altText} was clicked!`);
    
    // Create a ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
    `;
    
    const rect = icon.getBoundingClientRect();
    ripple.style.left = (rect.left + rect.width / 2 - 10) + 'px';
    ripple.style.top = (rect.top + rect.height / 2 - 10) + 'px';
    
    document.body.appendChild(ripple);
    
    gsap.to(ripple, {
      duration: 0.6,
      scale: 4,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => {
        document.body.removeChild(ripple);
      }
    });
  });
});

function updateIcons(pointer) {
  
  for (let i = 0; i < icons.length; i++) {
    
    let icon = icons[i];        
    let distance = (i * min + min / 2) - pointer;    
    let x = 0;
    let scale = 1;
    
    if (-bound < distance && distance < bound) {
      
      let rad = distance / min * 0.5;
      scale = 1 + (max / min - 1) * Math.cos(rad);  
      x = 2 * (max - min) * Math.sin(rad);
      
    } else {
      
      x = (-bound < distance ? 2 : -2) * (max - min);    
    }
    
    gsap.to(icon, {
      duration: 0.3,
      x: x,
      scale: scale
    });    
  }
}