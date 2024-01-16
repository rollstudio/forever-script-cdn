export const transitions = () => {
  console.log('transitions');
  //Applies Page Transition from 991px
  function checkBreakpoint(x) {
    if (x.matches) {
      // Page transition
      const transitionTrigger = $('.transition_trigger');
      const introDurationMS = 1700;
      const exitDurationMS = 1700;
      const excludedClass = 'no-transition';

      // On Page Load
      if (transitionTrigger.length > 0) {
        transitionTrigger.click();
        $('body').addClass('no-scroll-transition');
        setTimeout(() => {
          $('body').removeClass('no-scroll-transition');
        }, introDurationMS);
      }
      // On Link Click
      $('a').on('click', function (e) {
        if (
          $(this).prop('hostname') == window.location.host &&
          $(this).attr('href').indexOf('#') === -1 &&
          !$(this).hasClass(excludedClass) &&
          $(this).attr('target') !== '_blank' &&
          transitionTrigger.length > 0
        ) {
          e.preventDefault();
          $('body').addClass('no-scroll-transition');
          const transitionURL = $(this).attr('href');
          transitionTrigger.click();
          setTimeout(function () {
            window.location = transitionURL;
          }, exitDurationMS);
        }
      });
      // On Back Button Tap
      window.onpageshow = function (event) {
        if (event.persisted) {
          window.location.reload();
        }
      };
      // Hide Transition on Window Width Resize
      setTimeout(() => {
        $(window).on('resize', function () {
          setTimeout(() => {
            $('.transition_component').css('display', 'none');
          }, 50);
        });
      }, introDurationMS);
    } else {
      $('.transition_component').css('display', 'none');
    }
  }
  const matchMediaDesktop = window.matchMedia('(min-width: 991px)');
  checkBreakpoint(matchMediaDesktop);
  matchMediaDesktop.addListener(checkBreakpoint);
};
