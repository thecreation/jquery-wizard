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
        this.validator = function(){
            return true;
        };

        this.states = {
            done: false,
            error: false,
            active: false,
            disabled: false,
            activing: false
        };

        this.index = index;
        this.$element.data('wizard-index', index);

        this.$pane = this.wizard.options.getPane.call(this.wizard, index, element);
    },

    setup: function() {
        var current = this.wizard.currentIndex();
        if(this.index === current){
            this.enter('active');
        }

        this.$element.attr('aria-expanded', this.is('active'));
        this.$pane.attr('aria-expanded', this.is('active'));

        var classes = this.wizard.options.classes;
        if(this.is('active')){
            this.$pane.addClass(classes.pane.active);
        } else {
            this.$pane.removeClass(classes.pane.active);
        }
    },

    show: function(callback) {
        if(this.is('activing') || this.is('active')) {
            return;
        }

        this.trigger('beforeShow');
        this.enter('activing');

        var classes = this.wizard.options.classes;

        this.$element
            .attr('aria-expanded', true);

        this.$pane
            .addClass(classes.pane.activing)
            .addClass(classes.pane.active)
            .attr('aria-expanded', true);

        var complete = function () {
            this.$pane
                .removeClass(classes.pane.activing)

            this.leave('activing');
            this.enter('active');
            this.trigger('afterShow');

            if($.isFunction(callback)){
                callback.call(this);
            }
        }

        if (!Support.transition) {
            return complete.call(this);
        }

        this.$pane.one(Support.transition.end, $.proxy(complete, this));

        emulateTransitionEnd(this.$pane, this.TRANSITION_DURATION);
    },

    hide: function(callback) {
        if(this.is('activing') || !this.is('active')) {
            return;
        }

        this.trigger('beforeHide');
        this.enter('activing');

        var classes = this.wizard.options.classes;

        this.$element
            .attr('aria-expanded', false);

        this.$pane
            .addClass(classes.pane.activing)
            .removeClass(classes.pane.active)
            .attr('aria-expanded', false);

        var complete = function () {
            this.$pane
                .removeClass(classes.pane.activing);

            this.leave('activing');
            this.leave('active');
            this.trigger('afterHide');

            if($.isFunction(callback)){
                callback.call(this);
            }
        }

        if (!Support.transition) {
            return complete.call(this);
        }

        this.$pane.one(Support.transition.end, $.proxy(complete, this));

        emulateTransitionEnd(this.$pane, this.TRANSITION_DURATION);
    },

    empty: function() {
        this.$pane.empty();
    },

    load: function(object) {
        var options = object.options;
        var self = this;

        this.trigger('beforeLoad');
        this.enter('loading');

        function setContent(content) {
            self.$pane.html(content);

            self.wizard.options.loading.hide.call(self.wizard, self);

            self.leave('loading');
            self.trigger('afterLoad');
        }

        if (object.content) {
            setContent(object.content);
        } else if (object.url) {
            self.wizard.options.loading.show.call(self.wizard, self);

            $.ajax(object.url, object.settings || {}).done(function(data) {
                setContent(data);
            }).fail(function(){
                self.wizard.options.loading.fail.call(self.wizard, self);
            });
        } else {
            setContent('');
        }
    },

    on: function(event, handler){
        if($.isFunction(handler)){
            if($.isArray(this.events[event])){
                this.events[event].push(handler);
            } else {
                this.events[event] = [handler];
            }
        }

        return this;
    },

    off: function(event, handler){
        if($.isFunction(handler) && $.isArray(this.events[event])){
            $.each(this.events[event], function(i, f){
                if(f === handler) {
                    delete this.events[event][i];
                    return false;
                }
            });
        }

        return this;
    },

    trigger: function(event) {
        var method_arguments = Array.prototype.slice.call(arguments, 1);

        if($.isArray(this.events[event])){
            for(var i in this.events[event]){
                this.events[event][i].apply(this, method_arguments);
            }
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
    },

    /**
     * Leaves a state.
     */
    leave: function(state) {
        if(this.states[state]){
            this.states[state] = false;

            var classes = this.wizard.options.classes;
            this.$element.removeClass(classes.step[state]);
        }
    },

    reset: function(){
        for(var state in this.states){
            this.leave(state);
        }
        this.setup();

        return this;
    },

    setValidator: function(validator) {
        if($.isFunction(validator)){
            this.validator = validator;
        }

        return this;
    },

    validate: function() {
        return this.validator.call(this.$pane.get(0), this);
    },

    getPane: function() {
        return this.$pane;
    }
});
