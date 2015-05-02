/*! jquery wizard - v0.1.0 - 2015-05-03
 * https://github.com/amazingSurge/jquery-wizard
 * Copyright (c) 2015 amazingSurge; Licensed GPL */
(function($, document, window, undefined) {
    "use strict";

    var Support = (function() {
        var style = $('<support>').get(0).style,
            prefixes = ['webkit', 'Moz', 'O', 'ms'],
            events = {
                transition: {
                    end: {
                        WebkitTransition: 'webkitTransitionEnd',
                        MozTransition: 'transitionend',
                        OTransition: 'oTransitionEnd',
                        transition: 'transitionend'
                    }
                }
            },
            tests = {
                csstransitions: function() {
                    return !!test('transition');
                }
            };

        function test(property, prefixed) {
            var result = false,
                upper = property.charAt(0).toUpperCase() + property.slice(1);

            if (style[property] !== undefined) {
                result = property;
            }
            if (!result) {
                $.each(prefixes, function(i, prefix) {
                    if (style[prefix + upper] !== undefined) {
                        result = '-' + prefix.toLowerCase() + '-' + upper;
                        return false;
                    }
                });
            }

            if (prefixed) {
                return result;
            }
            if (result) {
                return true;
            } else {
                return false;
            }
        }

        function prefixed(property) {
            return test(property, true);
        }
        var support = {};
        if (tests.csstransitions()) {
            /* jshint -W053 */
            support.transition = new String(prefixed('transition'))
            support.transition.end = events.transition.end[support.transition];
        }

        return support;
    })();


    var Wizard = function(element, options) {
        this.$element = $(element);

        this.options = $.extend(true, {}, Wizard.defaults, options);

        this.$steps = this.$element.find(this.options.step);

        this.initialize();
    }

    function emulateTransitionEnd($el, duration) {
        var called = false;

        $el.one(Support.transition.end, function() {
            called = true;
        });
        var callback = function() {
            if (!called) {
                $el.trigger(Support.transition.end);
            }
        }
        setTimeout(callback, duration);
        return this;
    }

    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    Wizard.defaults = {
        step: '.steps > li',

        classes: {
            step: {
                done: 'done',
                error: 'error',
                active: 'active',
                disabled: 'disabled',
                activing: 'activing',
                loading: 'loading'
            },

            panel: {
                active: 'active',
                activing: 'activing',
            }
        },

        autoFocus: true,
        keyboard: true,
        contentCache: true,

        // buttons: {
        //     next: {
        //         label: 'Next',
        //     },
        //     previous: {
        //         label: 'Previous',
        //     },
        //     finish: {
        //         lable: 'Finish'
        //     },
        // },

        loading: {
            show: function(step) {},
            hide: function(step) {},
            fail: function(step) {},
        },

        onReset: null,

        onNext: null,
        onprev: null,

        onFirst: null,
        onLast: null,

        onShow: null,
        onHide: null,
        onLoad: null,
        onLoaded: null,

        onInit: null,
        onDestroy: null,

        onChanging: null,
        onChanged: null,

        onFinishing: null,
        onFinished: null,

        onContentLoaded: null,
    };

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
            this.validator = function() {
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

            var selector = this.$element.data('target');

            if (!selector) {
                selector = this.$element.attr('href');
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
            }

            this.$panel = $(selector);
        },

        setup: function() {
            if (this.index === this.wizard.currentIndex()) {
                this.enter('active');
            }

            this.$element.attr('aria-expanded', this.is('active'));
            this.$panel.attr('aria-expanded', this.is('active'));

            var classes = this.wizard.options.classes;
            if (this.is('active')) {
                this.$panel.addClass(classes.step.active);
            } else {
                this.$panel.removeClass(classes.step.active);
            }
        },

        show: function(callback) {
            if (this.is('activing') || this.is('active')) {
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

            var complete = function() {
                this.$panel
                    .removeClass(classes.panel.activing)

                this.leave('activing');
                this.enter('active')

                if ($.isFunction(callback)) {
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
            if (this.is('activing') || !this.is('active')) {
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

            var complete = function(callback) {
                this.$panel
                    .removeClass(classes.panel.activing);

                this.leave('activing');
                this.leave('active');

                if ($.isFunction(callback)) {
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

        load: function(object) {
            var options = object.options;
            var self = this;

            this.enter('loading');

            function setContent(content) {
                self.$panel.html(content);

                self.wizard.options.loading.hide.call(self.wizard, self);

                self.leave('loading');
            }

            if (object.content) {
                setContent(object.content);
            } else if (object.url) {
                self.wizard.options.loading.show.call(self.wizard, self);

                $.ajax(object.url, object.settings || {}).done(function(data) {
                    setContent(data);
                }).fail(function() {
                    self.wizard.options.loading.fail.call(self.wizard, self);
                });
            } else {
                setContent('');
            }
        },

        on: function(event, handler) {
            if ($.isFunction(handler)) {
                if ($.isArray(this.events[event])) {
                    this.events[event].push(handler);
                } else {
                    this.events[event] = [handler];
                }
            }

            return this;
        },

        off: function(event, handler) {
            if ($.isFunction(handler) && $.isArray(this.events[event])) {
                $.each(this.events[event], function(i, f) {
                    if (f === handler) {
                        delete this.events[event][i];
                        return false;
                    }
                });
            }

            return this;
        },

        trigger: function(event) {
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if ($.isArray(this.events[event])) {
                for (var i in this.events[event]) {
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

            this.trigger('enter' + capitalizeFirst(state));
        },

        /**
         * Leaves a state.
         */
        leave: function(state) {
            if (this.states[state]) {
                this.states[state] = false;

                var classes = this.wizard.options.classes;
                this.$element.removeClass(classes.step[state]);

                this.trigger('leave' + capitalizeFirst(state));
            }
        },

        reset: function() {
            for (var state in this.states) {
                this.leave(state);
            }
            this.setup();

            return this;
        },

        setValidator: function(validator) {
            if ($.isFunction(validator)) {
                this.validator = validator;
            }

            return this;
        },

        validate: function() {
            return this.validator.call(this.$panel.get(0), this);
        },

        getPanel: function() {
            return this.$panel;
        }
    });
    $.extend(Wizard.prototype, {
        Constructor: Wizard,
        initialize: function() {
            this.steps = [];
            var self = this;

            this.$steps.each(function(index) {
                self.steps.push(new Step(this, self, index));
            });

            this._current = 0;
            this.transitioning = null;

            $.each(this.steps, function(i, step) {
                step.setup();
            });

            this.$element.on('click', this.options.step, function(e) {
                var index = $(this).data('wizard-index');
                self.goTo(index);
            });

            if (this.options.keyboard) {
                $(document).on('keyup', $.proxy(this._keydown, this));
            }
        },

        _keydown: function(e) {
            if (/input|textarea/i.test(e.target.tagName)) return;
            switch (e.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return;
            }

            e.preventDefault();
        },

        get: function(index) {
            if (index < this.length() && this.steps[index]) {
                return this.steps[index];
            }
            return null;
        },

        goTo: function(index) {
            if (index === this._current || this.transitioning === true) {
                return;
            }

            var current = this.current();

            if (!current.validate()) {
                current.leave('done');
                current.enter('error');

                return false;
            } else {
                current.leave('error');

                if (index > this._current) {
                    current.enter('done');
                }
            }

            this.transitioning = true;
            var self = this;

            current.hide();
            this.get(index).show(function() {
                self._current = index;
                self.transitioning = false;

                if (self.options.autoFocus) {
                    var $input = this.$panel.find(':input');
                    if ($input.length > 0) {
                        $input.eq(0).focus();
                    } else {
                        this.$panel.focus();
                    }
                }
            });
        },

        trigger: function(event, index) {
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
            if (this._current < this.length() - 1) {
                this.goTo(this._current + 1);
            }

            return false;
        },

        prev: function() {
            if (this._current > 0) {
                this.goTo(this._current - 1);
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

            $.each(this.steps, function(i, step) {
                step.reset();
            });
        }
    });

    $.fn.wizard = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)$/.test(method))) {
                var api = this.first().data('wizard');
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, 'wizard');
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, 'wizard')) {
                    $.data(this, 'wizard', new Wizard(this, options));
                }
            });
        }
    };

    $(document).on('click', '[data-wizard]', function(e) {
        var href;
        var $this = $(this);
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''));

        var wizard = $target.data('wizard');

        if (!wizard) {
            return;
        }

        var method = $this.data('wizard');

        if (/^(prev|next|first|finish|reset)$/.test(method)) {
            wizard[method]();
        }

        e.preventDefault();
    });
})(jQuery, document, window);
