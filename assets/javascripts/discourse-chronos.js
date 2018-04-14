(function($) {
  $.fn.chronos = function(repeat) {
    function _formatTimezone(timezone) {
      return timezone.replace("_", " ").split("/");
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
        var dateTime = relativeTime.tz(timezone).format(options.format);
        var timezoneParts = _formatTimezone(timezone);

        if (dateTime.match(/TZ/)) {
          return dateTime.replace("TZ", timezoneParts.join(": "));
        } else {
          return timezoneParts[0] + "(" +timezoneParts[1] + ") " + dateTime;
        }
      });

      relativeTime = relativeTime.tz(moment.tz.guess()).format(options.format);

      var html = "<span>";
      html += relativeTime.replace("TZ", _formatTimezone(moment.tz.guess()).join(": "));
      html += "<i class='fa fa-globe d-icon d-icon-globe'>";
      html += "</span>";

      $element
        .html(html)
        .attr("title", previews.join("\n"))
        .attr("onclick", "alert('" + previews.join("\\n") + "');return false;")
        .addClass("cooked");

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
