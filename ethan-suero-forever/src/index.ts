import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { pages } from './pages';
window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('localhost');

  gsap.registerPlugin(ScrollTrigger);
  pages();
});
