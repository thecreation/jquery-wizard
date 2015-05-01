// Step
function Step() {
  return this.initialize.apply(this, Array.prototype.slice.call(arguments));
};

$.extend(Step.prototype, {
  TRANSITION_DURATION: 200,
  initialize: function(element, wizard, index) {
    this.$element = $(element);
    this.wizard = wizard;

    this.isOpen = false;
    this.transitioning = null;
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
      this.isOpen = true;
    }

    this.$element.attr('aria-expanded', this.isOpen);
    this.$panel.attr('aria-expanded', this.isOpen);

    var classes = this.wizard.options.classes;
    if(this.isOpen){
      this.$element.addClass(classes.step.active);
      this.$panel.addClass(classes.step.active);
    } else {
      this.$element.removeClass(classes.step.active);
      this.$panel.removeClass(classes.step.active);
    }
  },

  show: function(callback) {
    if(this.transitioning || this.isOpen) {
      return;
    }

    var classes = this.wizard.options.classes;

    this.$element
      .addClass(classes.step.active)
      .attr('aria-expanded', true);

    this.$panel
      .addClass(classes.panel.activing)
      .addClass(classes.panel.active)
      .attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function () {
      this.$panel
        .removeClass(classes.panel.activing)
        
      this.transitioning = 0;
      this.isOpen = true;

      if($.isFunction(callback)){
        callback();
      }
    }

    if (!Support.transition) {
      return complete.call(this);
    }

    this.$panel.one(Support.transition.end, $.proxy(complete, this));

    emulateTransitionEnd(this.$panel, this.TRANSITION_DURATION);
  },

  hide: function() {
    if(this.transitioning || !this.isOpen) {
      return;
    }

    var classes = this.wizard.options.classes;

    this.$element
      .removeClass(classes.step.active)
      .attr('aria-expanded', false);

    this.$panel
      .addClass(classes.panel.activing)
      .removeClass(classes.panel.active)
      .attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function (callback) {
      this.$panel
        .removeClass(classes.panel.activing);

      this.transitioning = 0;
      this.isOpen = false;

      if($.isFunction(callback)){
        callback();
      }
    }

    if (!Support.transition) {
      return complete.call(this);
    }

    this.$panel.one(Support.transition.end, $.proxy(complete, this));

    emulateTransitionEnd(this.$panel, this.TRANSITION_DURATION);
  },

  load: function() {

  },

  enable: function() {
    var classes = this.wizard.classes;
    this.$element.removeClass(classes.step.disabled);
  },

  disable: function() {
    var classes = this.wizard.classes;
    this.$element.addClass(classes.step.disabled);
  },

  validate: function() {

  },

  getPanel: function() {

  }
});
