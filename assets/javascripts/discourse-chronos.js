(function($) {
  $.fn.chronos = function(repeat) {
    function processElement($element, options) {
      repeat = repeat || true;

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      const relativeTime = moment.utc(options.date + " " + options.time, "YYYY-MM-DD HH:mm")
        .tz(moment.tz.guess())
        .format(options.format);

      $element.text(relativeTime).addClass("cooked");

      if (repeat) {
        this.timeout = setTimeout(() => {
          processElement($element, options);
        }, 10000);
      }
    }

    return this.each(function () {
      const $this = $(this);

      let options = {};
      options.format = $this.data("format");
      options.date = $this.data("date");
      options.time = $this.data("time");

      processElement($this, options);
    });
  };
})(jQuery);
