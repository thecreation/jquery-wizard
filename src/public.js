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

        this.setup();

        this.$element.on('click', this.options.step, function(e){
            var index = $(this).data('wizard-index');
            self.goTo(index);
        });

        if(this.options.keyboard){
            $(document).on('keyup', $.proxy(this.keydown, this));
        }
    },

    setup: function(){
        this.$buttons = $(this.options.templates.buttons.call(this));

        this.updateButton();

        if(this.options.buttonsAppendTo ==='this'){
            this.$buttons.appendTo(this.$element);
        } else {
            this.$buttons.appendTo(this.options.buttonsAppendTo);
        }
    },

    updateButton: function(){
        var classes = this.options.classes.button;
        var $back = this.$buttons.find('[data-wizard="back"]');
        var $next = this.$buttons.find('[data-wizard="next"]');
        var $finish = this.$buttons.find('[data-wizard="finish"]');

        if(this._current === 0){
            $back.addClass(classes.disabled);
        } else {
            $back.removeClass(classes.disabled);
        }

        if(this._current === this.length() - 1) {
            $next.addClass(classes.hide);
            $finish.removeClass(classes.hide);
        } else {
            $next.removeClass(classes.hide);
            $finish.addClass(classes.hide);
        }
    },

    keydown: function(e) {
        if (/input|textarea/i.test(e.target.tagName)) return;
        switch (e.which) {
            case 37: this.back(); break;
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

        var current = this.current();

        if(!current.validate()){
            current.leave('done');
            current.enter('error');

            return false;
        } else {
            current.leave('error');

            if(index > this._current) {
                current.enter('done');
            }
        }

        this.transitioning = true;
        var self = this;

        current.hide();
        this.get(index).show(function(){
            self._current = index;
            self.transitioning = false;

            self.updateButton();

            if(self.options.autoFocus){
                var $input = this.$pane.find(':input');
                if($input.length > 0) {
                    $input.eq(0).focus();
                } else {
                    this.$pane.focus();
                }
            }
        });
    },

    trigger: function(event, index){
        var method_arguments = Array.prototype.slice.call(arguments, 1);

        this.$element.trigger(event);
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

    back: function() {
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
        this._current = 0;

        $.each(this.steps, function(i, step){
            step.reset();
        });
    }
});
