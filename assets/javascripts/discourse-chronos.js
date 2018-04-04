(function($) {
  $.fn.chronos = function(repeat) {
    function processElement($element, options) {
      repeat = repeat || true;

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      var relativeTime = moment.utc(options.date + " " + options.time, "YYYY-MM-DD HH:mm");

      if (options.recurring && relativeTime < moment().utc()) {
        var parts = options.recurring.split(".");
        relativeTime = relativeTime.add(parts[0], parts[1]);
      }

      relativeTime = relativeTime.tz(moment.tz.guess()).format(options.format);

      $element.text(relativeTime.replace("TZ", moment.tz.guess())).addClass("cooked");

      if (repeat) {
        this.timeout = setTimeout(function() {
          processElement($element, options);
        }, 10000);
      }
    }

    return this.each(function() {
      var $this = $(this);

      var options = {};
      options.format = $this.attr("data-format");
      options.date = $this.attr("data-date");
      options.time = $this.attr("data-time");
      options.recurring = $this.attr("data-recurring");

      processElement($this, options);
    });
  };
})(jQuery);
