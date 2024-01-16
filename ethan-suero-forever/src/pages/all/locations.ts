import gsap from 'gsap';
import Swiper from 'swiper';

export const locations = () => {
  console.log('locations');

  // get components
  const $components = $('.slider-main_component');
  $components.each(function (index) {
    const loopMode = $(this).attr('loop-mode') === 'true';
    let sliderDuration = 500;
    if ($(this).attr('slider-duration') !== undefined) {
      sliderDuration = +$(this).attr('slider-duration');
    }

    // init swiper
    const swiper = new Swiper($(this).find('.swiper')[0], {
      speed: sliderDuration,
      loop: loopMode,
      autoHeight: false,
      centeredSlides: loopMode,
      followFinger: true,
      slideToClickedSlide: false,
      slidesPerView: 'auto',
      rewind: false,
      mousewheel: {
        forceToAxis: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      slideActiveClass: 'is-active',
      slideDuplicateActiveClass: 'is-active',
    });

    // hover animation
    const $trigger = $(this).find('.swiper-slide.is-locations');
    const $target = $(this).find('.location-hover-list');
    $trigger.on('mouseenter', function () {
      const $this = $(this);
      const $index = $this.index();
      const $image = $target.find('.location-hover-image').eq($index);

      gsap.fromTo($image, { scale: 1 }, { scale: 1.1, duration: 0.5, ease: 'power1.out' });
      gsap.to($target, { xPercent: $index * -100, duration: 0.5, ease: 'back.out(1)' });
    });
  });
};
