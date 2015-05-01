/*! jquery wizard - v0.1.0 - 2015-05-02
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
    Wizard.defaults = {
        step: '.steps > li',

        classes: {
            step: {
                done: 'done',
                error: 'error',
                active: 'active',
                disabled: 'disabled'
            },

            panel: {
                active: 'active',
                activing: 'activing'
            }
        },

        keyNavigation: true,
        contentCache: true,

        // buttons: {
        //   next: {
        //     label: 'Next',
        //   },
        //   previous: {
        //     label: 'Previous',
        //   },
        //   finish: {
        //     lable: 'Finish'
        //   },
        // },

        hideButtonsOnDisabled: true,

        onReset: null,

        onNext: null,
        onPreview: null,

        onFirst: null,
        onLast: null,

        onShow: null,
        onHide: null,

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
            if (this.index === this.wizard.currentIndex()) {
                this.isOpen = true;
            }

            this.$element.attr('aria-expanded', this.isOpen);
            this.$panel.attr('aria-expanded', this.isOpen);

            var classes = this.wizard.options.classes;
            if (this.isOpen) {
                this.$element.addClass(classes.step.active);
                this.$panel.addClass(classes.step.active);
            } else {
                this.$element.removeClass(classes.step.active);
                this.$panel.removeClass(classes.step.active);
            }
        },

        show: function(callback) {
            if (this.transitioning || this.isOpen) {
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

            var complete = function() {
                this.$panel
                    .removeClass(classes.panel.activing)

                this.transitioning = 0;
                this.isOpen = true;

                if ($.isFunction(callback)) {
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
            if (this.transitioning || !this.isOpen) {
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

            var complete = function(callback) {
                this.$panel
                    .removeClass(classes.panel.activing);

                this.transitioning = 0;
                this.isOpen = false;

                if ($.isFunction(callback)) {
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
            this.transitioning = true;
            var self = this;

            this.current().hide();
            this.get(index).show(function() {
                self._current = index;
                self.transitioning = false;
            });
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

        preview: function() {
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

        },

        destroy: function() {

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
})(jQuery, document, window);
