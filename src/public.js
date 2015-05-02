$.extend(Wizard.prototype, {
  Constructor: Wizard,
  initialize: function(){
    this.steps = [];
    var self = this;

    this.$steps.each(function(index){
      self.steps.push(new Step(this, self, index));
    });

    this._current = 0;
    this.transitioning = null;

    $.each(this.steps, function(i, step){
      step.setup();
    });

    this.$element.on('click', this.options.step, function(e){
      var index = $(this).data('wizard-index');
      self.goTo(index);
    });

    if(this.options.keyboard){
      $(document).on('keyup', $.proxy(this._keydown, this));
    }
  },

  _keydown: function(e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37: this.prev(); break;
      case 39: this.next(); break;
      default: return;
    }

    e.preventDefault();
  },

  get: function(index) {
    if(index < this.length() && this.steps[index]){
      return this.steps[index];
    }
    return null;
  },

  goTo: function(index) {
    if(index === this._current || this.transitioning === true){
      return;
    }

    this.transitioning = true;
    var self = this;

    this.current().hide();
    this.get(index).show(function(){
      self._current = index;
      self.transitioning = false;

      if(self.options.autoFocus){
        var $input = this.$panel.find(':input');
        if($input.length > 0) {
          $input.eq(0).focus();
        } else {
          this.$panel.focus();
        }
      }
    });
  },

  trigger: function(){

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
    if(this._current < this.length() - 1){
      this.goTo(this._current + 1);
    }

    return false;
  },

  prev: function() {
    if(this._current > 0) {
      this.goTo(this._current -1);
    }
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
