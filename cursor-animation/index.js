const hero = document.querySelector('.hero'),
      heroMedia = hero.querySelector('.hero_media');

let isEnabled = false;
let count = 1;

const images = [
    'https://images.beta.cosmos.so/72c148c6-6224-4ecf-a2e8-e3189172d689?format=jpeg',
    'https://images.beta.cosmos.so/75c78d2f-f563-49a7-a287-2795d9500ca1?format=jpeg',
    'https://images.beta.cosmos.so/b3f7c891-6845-41a8-8760-a12e768f19bb?format=jpeg',
    'https://images.beta.cosmos.so/a770d134-aef9-47e1-b8c6-4bdac9b24d4f?format=jpeg',
    'https://images.beta.cosmos.so/d954a354-3c40-437e-99a1-7293a4485eab?format=jpeg'
];

const createImage = (event) => {
    const countIndex = (count = (count + 1) % images.length);
    
    const image = document.createElement('img');
    image.classList.add('hero_media_image');
    image.setAttribute('src', images[countIndex]);
    heroMedia.appendChild(image);

    // Hardcode the offset based on your CSS (30rem wide, 40rem high) 
    // to prevent jumping while the image loads.
    // Assuming 10px per rem based on your html font-size logic.
    const offsetX = 150; // (30rem * 10) / 2
    const offsetY = 200; // (40rem * 10) / 2

    image.style.top = `${event.clientY - offsetY}px`;
    image.style.left = `${event.clientX - offsetX}px`;
    
    animateImage(image);
};

const animateImage = (image) => {
    // Start at the cursor (yPercent: 0) and fade in slightly
    gsap.set(image, {
        autoAlpha: 0,
        scale: 0.8,
        yPercent: 0, 
        rotate: gsap.utils.random(-10, 10), // Use GSAP's random for better control
    });

    const tl = gsap.timeline();

    tl.to(image, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
    })
    .to(image, {
        autoAlpha: 0,
        yPercent: -50, // Gently float up as it disappears
        duration: 1,
        ease: "power2.in",
        onComplete: () => image.remove()
    }, "+=0.2"); // Hold the image for a moment before fading
};

window.addEventListener('mousemove', (event) => {
    if (!isEnabled) {
        isEnabled = true;
        
        setTimeout(() => (isEnabled = false), 160);
        createImage(event);
    }
});