(function($) {
  $.fn.chronos = function() {
    function processElement($element, options) {
      let relativeTime;
      const tz = $element.data("timezone") || moment.tz.guess();
      const datetime = moment(options.datetime).tz(tz);
        console.log(options.countdown, typeof options.countdown)
      if (options.countdown === true) {
        relativeTime = datetime.fromNow();
      } else {
        relativeTime = datetime.format(options.format);
      }

      $element.text(relativeTime);
      $element.attr("title", tz);
      $element.addClass("cooked");

      setTimeout(() => {
        processElement($element, options);
      }, 10000);
    }

    return this.each(function () {
      const $this = $(this);

      let options = {};
      options.format = $this.data("format");
      options.datetime = $this.data("datetime");
      options.countdown = $this.data("countdown");

      processElement($this, options);
    });
  };
})(jQuery);
