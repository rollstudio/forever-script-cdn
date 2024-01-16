export const autoNumbers = () => {
  console.log('autoNumbers');

  function enumerateListItems() {
    setTimeout(function () {
      $('.client-col-list, .swiper-wrapper.is-locations, .legal-col-list').each(function () {
        const childNumbers = $(this).find('.client-number, .location-number, .legal-number');
        childNumbers.each(function (index) {
          let number = index + 1;
          if (number < 10) number = '0' + number;
          $(this).text(number);
        });
      });
    }, 100);
  }

  enumerateListItems();
  $('.w-pagination-next').on('click', enumerateListItems);
};
