import { queryElement } from "$utils/queryElement";
import { queryElements } from "$utils/queryElements";

export const who = () => {
  console.log("who");
  const defaultOptions = {
    effect: "slide",
    loop: false,
    slidesPerView: 1,
    speed: 500,
  };

  const components = queryElements<HTMLDivElement>(".sliders_section");
  components.forEach((component, index) => {
    // remove the 'is-first' class from all but the first component
    if (index !== 0) component.classList.remove("is-first");

    // get the desired duration of the slider
    const duration = component.dataset.duration
      ? parseInt(component.dataset.duration)
      : 2000;

    // get the targets
    const targetLeft = queryElement<HTMLDivElement>(
      '[data-gallery-target="left"]',
      component
    );
    const targetRight = queryElement<HTMLDivElement>(
      '[data-gallery-target="right"]',
      component
    );

    // get the slug of the relevant page and retrieve the galleries
    const { slug } = component.dataset;
    let loadLeft = $.Deferred();
    let loadRight = $.Deferred();

    $(targetLeft).load(`/who/${slug} #gallery-left`, function () {
      loadLeft.resolve();
    });

    $(targetRight).load(`/who/${slug} #gallery-right`, function () {
      loadRight.resolve();
    });

    // Callback function to run after both loads complete
    $.when(loadLeft, loadRight).done(function () {
      // get the wrappers and initialize the swipers
      const wrappers = queryElements<HTMLDivElement>(
        ".slider-who_component",
        component
      );

      console.log(wrappers);

      const swipers = wrappers.map((wrapper) => {
        const slider = queryElement<HTMLDivElement>(".swiper", wrapper);
        const customPagination = queryElement<HTMLDivElement>(
          ".swiper-bullet-wrapper",
          wrapper
        );

        const bulletTemplate = queryElement<HTMLDivElement>(
          '[data-bullet="template"]',
          wrapper
        );

        const options = bulletTemplate
          ? {
              ...defaultOptions,
              autoplay: {
                delay: duration,
              },
              pagination: {
                el: customPagination,
                renderBullet: function (index: number, className: string) {
                  const bulletClone = bulletTemplate.cloneNode(
                    true
                  ) as HTMLDivElement;
                  bulletClone.classList.add(className);
                  const bulletAsString = bulletClone.outerHTML;
                  console.log(index);
                  console.log(className);
                  return bulletAsString;
                },
                bulletClass: "bullet_wrapper",
                bulletActiveClass: "is-active",
                bulletElement: "div",
                clickable: true,
                enabled: true,
              },
            }
          : { ...defaultOptions };

        const swiper = new Swiper(slider, options);
        return swiper;
      });

      console.log(swipers);

      // link the controllers
      swipers[0].controller.control = swipers[1];
      swipers[1].controller.control = swipers[0];
    });
  });
};
