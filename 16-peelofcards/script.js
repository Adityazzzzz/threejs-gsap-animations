import gsap from "https://esm.sh/gsap";
import { ScrollTrigger } from "https://esm.sh/gsap/ScrollTrigger";
import Lenis from "https://esm.sh/@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 2. Setup Card Variables
    const cards = document.querySelectorAll(".sticky-cards .card");
    const totalCards = cards.length;
    
    // We divide 1 by totalCards to get the scroll "chunk" for each card
    const segmentSize = 1 / totalCards;

    const cardYOffset = 10; // Vertical spacing between stacked cards
    const cardScaleStep = 0.05; // How much smaller each background card is

    // 3. Initial State Set
    cards.forEach((card, index) => {
        gsap.set(card, {
            xPercent: -50,
            yPercent: -50 - (index * cardYOffset),
            scale: 1 - (index * cardScaleStep),
            zIndex: totalCards - index
        });
    });

    // 4. Scroll Animation
    ScrollTrigger.create({
        trigger: ".sticky-cards",
        start: "top top",
        end: `+=${window.innerHeight * 5}px`, // Adjust length of the scroll here
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;

            // Determine which card is currently being "peeled"
            const activeIndex = Math.min(
                Math.floor(progress / segmentSize),
                totalCards - 1
            );

            // Progress of the current card's animation (0 to 1)
            const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

            cards.forEach((card, i) => {
                if (i < activeIndex) {
                    // CARD ALREADY PEELED OFF (Above the screen)
                    gsap.set(card, {
                        yPercent: -200, 
                        rotationX: 45,
                        opacity: 0
                    });
                } 
                else if (i === activeIndex) {
                    // CURRENTLY ACTIVE CARD (Peeling away)
                    gsap.set(card, {
                        yPercent: gsap.utils.interpolate(-50, -150, segProgress),
                        rotationX: gsap.utils.interpolate(0, 45, segProgress),
                        scale: 1,
                        opacity: 1
                    });
                } 
                else {
                    // CARDS WAITING IN THE STACK (Moving forward)
                    const behindIndex = i - activeIndex;
                    
                    // The magic math: (index - progress) keeps the movement fluid
                    const currentYOffset = (behindIndex - segProgress) * cardYOffset;
                    const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;

                    gsap.set(card, {
                        yPercent: -50 - currentYOffset,
                        rotationX: 0,
                        scale: currentScale,
                        opacity: 1
                    });
                }
            });
        },
    });
});