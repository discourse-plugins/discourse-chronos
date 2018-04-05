(function($) {
  $.fn.chronos = function(repeat) {
    function _formatTimezone(timezone) {
      return timezone.replace("/", ": ").replace("_", " ");
    }

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

      var previews = options.timezones.split("|").map(function(timezone) {
        var dateTime = moment
                          .utc(options.date + " " + options.time, "YYYY-MM-DD HH:mm")
                          .tz(timezone)
                          .format(options.format);

        if (dateTime.match(/TZ/)) {
          return dateTime.replace("TZ", _formatTimezone(timezone));
        } else {
          return dateTime + "(" + _formatTimezone(timezone) + ")";
        }
      });

      relativeTime = relativeTime.tz(moment.tz.guess()).format(options.format);

      $element
        .text(relativeTime.replace("TZ", _formatTimezone(moment.tz.guess()))).addClass("cooked")
        .attr("title", previews.join("\n"));

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
      options.timezones = $this.attr("data-timezones") || "Etc/UTC";

      processElement($this, options);
    });
  };
})(jQuery);
