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
    // $(targetLeft).load(`/who/${slug} #gallery-left`);
    // $(targetRight).load(`/who/${slug} #gallery-right`);

    let loadLeft = $.Deferred();
    let loadRight = $.Deferred();

    $(targetLeft).load(`/who/${slug} #gallery-left`, function () {
      loadLeft.resolve();
    });

    $(targetRight).load(`/who/${slug} #gallery-right`, function () {
      loadRight.resolve();
    });

    $.when(loadLeft, loadRight).done(function () {
      // Callback function to run after both loads complete
      console.log("Both loads are complete");

      // get the wrappers and initialize the swipers
      const wrappers = queryElements<HTMLDivElement>(
        ".slider-who_component",
        component
      );

      const swipers = wrappers.map((wrapper) => {
        const slider = queryElement<HTMLDivElement>(".swiper", wrapper);
        const customPagination = queryElement<HTMLDivElement>(
          ".swiper-bullet-wrapper",
          wrapper
        );
        const options = customPagination
          ? {
              ...defaultOptions,
              pagination: {
                el: customPagination,
                bulletClass: "swiper-bullet",
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
