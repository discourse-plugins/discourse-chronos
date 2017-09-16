module ::DiscourseChronos
  PLUGIN_NAME = "discourse-chronos"

  class Engine < ::Rails::Engine
    engine_name DiscourseChronos::PLUGIN_NAME
    isolate_namespace DiscourseChronos
  end
end
