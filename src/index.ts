import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { pages } from "./pages";
window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger);
  pages();
});
