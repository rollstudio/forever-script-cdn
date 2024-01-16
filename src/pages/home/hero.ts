import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { queryElement } from '$utils/queryElement';

export const hero = () => {
  console.log('hero');

  gsap.registerPlugin(ScrollTrigger);

  const trigger = queryElement('.forever_trigger');
  if (!trigger) return;

  const reel = queryElement('.forever_reel', trigger);
  const textContent = queryElement('.forever_text-content', trigger);
  const reelText = queryElement('.forever_reel-text', trigger);
  const mask = queryElement('.forever_mask', trigger);
  if (!reel || !textContent || !reelText || !mask) return;

  const timeline = gsap.timeline({
    defaults: {
      ease: 'none',
      duration: 1,
    },
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  timeline.to(reel, { opacity: 1, duration: 0.1 }, '0');
  timeline.from(reel, { scale: 2 }, '0');
  timeline.to(textContent, { y: '-10rem', opacity: 0, duration: 0.1 }, '0');
  timeline.to(reelText, { y: '-4rem' }, '0');
  timeline.to(mask, { scale: 51, xPercent: -255, yPercent: 112.5 }, '0');
  timeline.to(mask, { opacity: 0, duration: 0.1 }, 0.7);
};
