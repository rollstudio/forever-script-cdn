import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

export const staggerText = () => {
  console.log("staggerText");
  // Split text into spans
  const typeSplit = new SplitType("[text-split]", {
    types: "words,chars",
    tagName: "span",
  });

  // Link timelines to scroll position
  function createScrollTrigger(triggerElement, timeline) {
    // Reset tl when scroll out of view past bottom of screen
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(0);
        timeline.pause();
      },
    });
    // Play tl when scrolled into view (60% from top of screen)
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 80%",
      onEnter: () => timeline.play(),
    });
  }

  const staggerDefaults = {
    yPercent: 100,
    duration: 0.5,
    ease: "Power2.easeOut",
    stagger: { amount: 0.5 },
  };

  $("[letters-slide-up]").each(function (index) {
    const tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), staggerDefaults);
    createScrollTrigger($(this), tl);
  });

  $("[words-slide-up]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".word"), {
      ...staggerDefaults,
      opacity: 0,
    });
    createScrollTrigger($(this), tl);
  });

  // Avoid flash of unstyled content
  gsap.set("[text-split]", { opacity: 1 });

  // Page name copy from link
  $(".nav_link").on("click", function () {
    const linkText = $(this).text();
    $(".transition_text-block").text(linkText);
  });
};
