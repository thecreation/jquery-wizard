// Step
function Step() {
  return this.initialize.apply(this, Array.prototype.slice.call(arguments));
};

$.extend(Step.prototype, {
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
    this.$element.attr('aria-expanded', this.isOpen);
    this.$panel.attr('aria-expanded', this.isOpen);
  },

  show: function() {
    if(this.transitioning || this.isOpen) {
      return;
    }

    var classes = this.wizard.options.classes;

    this.$element
      .addClass(classes.step.active)
      .attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function () {
      this.$panel
        .removeClass(classes.panel.activing)
        .addClass(classes.panel.active);

      this.transitioning = 0;
    }

    this.$panel.one(Support.transition.end, $.proxy(complete, this));

    this.$panel
      .addClass(classes.panel.activing)
      .attr('aria-expanded', true);

    if (!Support.transition) {
      return complete.call(this);
    }

  },

  hide: function() {
    if(this.transitioning || !this.isOpen) {
      return;
    }

    this.$element
      .removeClass(classes.step.active)
      .attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function () {
      this.$panel
        .removeClass(classes.panel.active)
        .removeClass(classes.panel.activing);

      this.transitioning = 0;
    }

    this.$panel.one(Support.transition.end, $.proxy(complete, this));

    this.$panel
      .addClass(classes.panel.activing)
      .attr('aria-expanded', false);

    if (!Support.transition) {
      return complete.call(this);
    }
  },

  load: function() {

  },

  enable: function() {

  },

  disable: function() {

  },

  validate: function() {

  },

  getPanel: function() {

  }
});
