var Wizard = function(element, options) {
    this.$element = $(element);

    this.options = $.extend(true, {}, Wizard.defaults, options);

    this.$steps = this.$element.find(this.options.step);

    this.initialize();
}