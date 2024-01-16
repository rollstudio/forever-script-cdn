import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { parseStringToNumber } from '$utils/parseStringToNumber';
import { queryElement } from '$utils/queryElement';

export const culture = () => {
  console.log('culture');
  gsap.registerPlugin(ScrollTrigger);

  const component = queryElement<HTMLDivElement>('[data-culture="component"]');
  if (!component) return;

  const accordion = queryElement<HTMLDivElement>('[data-culture="accordion"]', component);
  const marquee = queryElement<HTMLDivElement>('[data-culture="marquee"]', component);
  if (!accordion || !marquee) return;

  const list = accordion.firstElementChild as HTMLDivElement;
  if (!list) return;

  const items = [...list.children] as HTMLDivElement[];
  if (items.length === 0) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 992px)', () => {
    // get the height of the first child
    const firstChildHeight = items[0].offsetHeight;

    // get the height multiplier
    const cultureHeightMultiplier = ((): number => {
      const value = accordion.getAttribute('culture-height-multiplier') ?? 1;
      const parsed = parseStringToNumber(value);
      if (!parsed) return 1;
      return parsed as number;
    })();

    // get the scrub value
    const culterScrub = (() => {
      const value = accordion.getAttribute('culture-scrub-value') ?? true;
      if (value === 'true') return true;
      const parsed = parseStringToNumber(value as string);
      if (!parsed) return true;
      return parsed;
    })();

    // set the height of the accordion and component
    const accordionHeight = accordion.offsetHeight * cultureHeightMultiplier;
    accordion.style.height = `${accordionHeight}px`;
    const marqueeHeight = marquee.offsetHeight;
    component.style.height = `${accordionHeight + marqueeHeight}px`;

    // set the height of the list to the height of the first child
    const containerHeight = (items.length - 1) * 8 + firstChildHeight;
    list.style.height = `${containerHeight}px`;
    list.style.position = 'sticky';
    list.style.top = `${window.innerHeight - containerHeight - marqueeHeight}px`;
    list.style.overflow = 'hidden';

    // place the marquee
    marquee.style.position = 'sticky';
    marquee.style.bottom = `0px`;

    // create the marquee timeline
    const marqueeTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: component,
        start: `top ${window.innerHeight - containerHeight - marqueeHeight}`,
        end: `+=${containerHeight}`,
        scrub: 0,
      },
    });

    marqueeTimeline.from(marquee, { marginTop: containerHeight, ease: 'none' }, 0);

    // for all but the first child, set their position to absolute and add their offset
    items.forEach((item, index) => {
      if (index === 0) return;

      item.style.position = 'absolute';
      item.style.top = firstChildHeight + (index - 1) * 8 + 'px';
    });

    // create the timeline with configurable scrub
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: component,
        start: `top ${window.innerHeight - containerHeight - marqueeHeight}`,
        end: 'bottom bottom',
        scrub: culterScrub,
      },
    });

    // animate each child to the top of the accordion minus dynamic offset
    items.forEach((item, index) => {
      if (index === 0) return;
      timeline.to(item, {
        top: index * 8 + 'px',
      });
    });

    return () => {
      // set the height of the accordion
      component.style.removeProperty('height');
      accordion.style.removeProperty('height');

      // set the height of the list to the height of the first child
      list.style.removeProperty('height');
      list.style.removeProperty('position');
      list.style.removeProperty('top');
      list.style.removeProperty('overflow');

      marquee.style.removeProperty('position');
      marquee.style.removeProperty('bottom');

      // for all but the first child, set their position to absolute and add their offset
      items.forEach((item, index) => {
        if (index === 0) return;

        item.style.removeProperty('position');
        item.style.removeProperty('top');
      });
    };
  });
};
