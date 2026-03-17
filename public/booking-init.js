window.addEventListener('load', function () {
  if (window.BookingWidget) {
    BookingWidget.init({
      project: 'assay',
      host: 'https://donnacha.app',
      buttonText: false,
    });
  }
});
