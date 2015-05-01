$.extend(Wizard.prototype, {
  Constructor: Wizard,
  initialize: function(){
    this.steps = [];
    var self = this;

    this.$steps.each(function(index){
      self.steps.push(new Step(this, self, index));
    });

    $.each(this.steps, function(i, step){
      step.setup();
    });

    this.$element.on('click', this.options.step, function(e){
      var index = $(this).data('wizard-index');
      self.goTo(index);
    });
  },

  get: function(index) {
    if(index < this.length() && this.steps[index]){
      return this.steps[index];
    }
    return null;
  },

  goTo: function(index) {
    //this.current().hide();
    this.get(index).show();

    this._current = index;
  },

  length: function() {
    return this.steps.length;
  },

  current: function() {
    return this.get(this._current);
  },

  currentIndex: function() {
    return this._current;
  },

  next: function() {

  },

  preview: function() {

  },

  first: function() {
    return this.goTo(0);
  },

  finish: function() {
    return this.goTo(this.length() - 1);
  },

  reset: function() {

  },

  destroy: function() {

  }
});
