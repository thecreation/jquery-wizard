// Step
function Step() {
    return this.initialize.apply(this, Array.prototype.slice.call(arguments));
};

$.extend(Step.prototype, {
    initialize: function(options) {
        this.options = options;
        this._instance = null;

    },
    setup: function() {

    },

    show: function() {

    },

    hide: function() {

    },

    load: function() {

    },

    enable: function() {

    },

    disable: function() {
        
    },

    validate: function() {

    }
});