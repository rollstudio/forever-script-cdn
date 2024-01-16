import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const who = () => {
  console.log('who');
  const defaultOptions = {
    effect: 'slide',
    loop: false,
    slidesPerView: 1,
    speed: 500,
    // autoHeight: false,
    // centeredSlides: false,
    // followFinger: true,
    // freeMode: false,
    // slideToClickedSlide: false,
    // rewind: false,
    // mousewheel: {
    //   forceToAxis: true,
    // },
    // keyboard: {
    //   enabled: true,
    //   onlyInViewport: true,
    // },
  };

  const components = queryElements<HTMLDivElement>('.who_component');
  components.forEach((component) => {
    const wrappers = queryElements<HTMLDivElement>('.slider-who_component', component);
    const swipers = wrappers.map((wrapper) => {
      const slider = queryElement<HTMLDivElement>('.swiper', wrapper);
      const customPagination = queryElement<HTMLDivElement>('.swiper-bullet-wrapper', wrapper);
      const options = customPagination
        ? {
            ...defaultOptions,
            pagination: {
              el: customPagination,
              bulletClass: 'swiper-bullet',
              bulletActiveClass: 'is-active',
              bulletElement: 'div',
              clickable: true,
              enabled: true,
            },
          }
        : { ...defaultOptions };

      const swiper = new Swiper(slider, options);
      return swiper;
    });

    swipers[0].controller.control = swipers[1];
    swipers[1].controller.control = swipers[0];
  });
};
