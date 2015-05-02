// Step
function Step() {
  return this.initialize.apply(this, Array.prototype.slice.call(arguments));
};

$.extend(Step.prototype, {
  TRANSITION_DURATION: 200,
  initialize: function(element, wizard, index) {
    this.$element = $(element);
    this.wizard = wizard;

    this.events = {};

    this.states = {
      done: false,
      error: false,
      active: false,
      disabled: false,
      activing: false
    };

    this.index = index;

    this.$element.data('wizard-index', index);

    var selector = this.$element.data('target');

    if (!selector) {
      selector = this.$element.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
    }

    this.$panel = $(selector);
  },

  setup: function() {
    if(this.index === this.wizard.currentIndex()){
      this.enter('active');
    }

    this.$element.attr('aria-expanded', this.is('active'));
    this.$panel.attr('aria-expanded', this.is('active'));

    var classes = this.wizard.options.classes;
    if(this.is('active')){
      this.$panel.addClass(classes.step.active);
    } else {
      this.$panel.removeClass(classes.step.active);
    }
  },

  show: function(callback) {
    if(this.is('activing') || this.is('active')) {
      return;
    }

    this.enter('activing');

    var classes = this.wizard.options.classes;

    this.$element
      .attr('aria-expanded', true);

    this.$panel
      .addClass(classes.panel.activing)
      .addClass(classes.panel.active)
      .attr('aria-expanded', true);

    var complete = function () {
      this.$panel
        .removeClass(classes.panel.activing)

      this.leave('activing');
      this.enter('active')

      if($.isFunction(callback)){
        callback.call(this);
      }
    }

    if (!Support.transition) {
      return complete.call(this);
    }

    this.$panel.one(Support.transition.end, $.proxy(complete, this));

    emulateTransitionEnd(this.$panel, this.TRANSITION_DURATION);
  },

  hide: function() {
    if(this.is('activing') || !this.is('active')) {
      return;
    }

    this.enter('activing');

    var classes = this.wizard.options.classes;

    this.$element
      .attr('aria-expanded', false);

    this.$panel
      .addClass(classes.panel.activing)
      .removeClass(classes.panel.active)
      .attr('aria-expanded', false);

    var complete = function (callback) {
      this.$panel
        .removeClass(classes.panel.activing);

      this.leave('activing');
      this.leave('active');

      if($.isFunction(callback)){
        callback.call(this);
      }
    }

    if (!Support.transition) {
      return complete.call(this);
    }

    this.$panel.one(Support.transition.end, $.proxy(complete, this));

    emulateTransitionEnd(this.$panel, this.TRANSITION_DURATION);
  },

  empty: function() {
    this.$panel.empty();
  },

  showLoading: function() {
    var self = this;
  },

  hideLoading: function() {
    var self = this;
  },

  load: function(object) {
    var options = object.options;
    var self = this;

    function setContent(content) {
      self.$panel.html(content);
      self.hideLoading();

      self.trigger(self, 'afterLoad', object);
    }

    if (object.content) {
      setContent(object.content);
    } else if (object.url) {
      this.showLoading();

      $.ajax(object.url, object.settings || {}).done(function(data) {
        setContent(data);
      }).fail(function(){

      });
    } else {
      setContent('');
    }
  },

  on: function(event, handler){
    if($.isFunction(handler)){
      this.events[event] = handler;
    }
  },

  trigger: function(event) {
    var method_arguments = Array.prototype.slice.call(arguments, 1);

    if($.isFunction(this.events[event])){
      this.events[event].apply(this, method_arguments);
    }
    this.wizard.trigger(event, this.index, method_arguments);
  },

  /**
   * Checks whether the carousel is in a specific state or not.
   */
  is: function(state) {
      return this.states[state] && this.states[state] === true;
  },

  /**
   * Enters a state.
   */
  enter: function(state) {
    this.states[state] = true;

    var classes = this.wizard.options.classes;
    this.$element.addClass(classes.step[state]);

    this.trigger('enter'+capitalizeFirst(state));
  },

  /**
   * Leaves a state.
   */
  leave: function(state) {
    this.states[state] = false;

    var classes = this.wizard.options.classes;
    this.$element.removeClass(classes.step[state]);

    this.trigger('leave'+capitalizeFirst(state));
  },

  validate: function() {
    //return this.wizard.validate(this.index);
  },

  getPanel: function() {
    return this.$panel;
  }
});
