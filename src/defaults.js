Wizard.defaults = {
    step: '.wizard-steps > li',
    pane: '.wizard-content > pane',
    buttonsAppendTo: 'this',
    templates: {
        buttons: function(){
            var options = this.options;
            return '<div class="wizard-buttons">'+
                '<a class="'+options.classes.button.back+'" href="#'+this.id+'" data-wizard="back" role="button">'+options.buttonLabels.back+'</a>' +
                '<a class="'+options.classes.button.next+'" href="#'+this.id+'" data-wizard="next" role="button">'+options.buttonLabels.next+'</a>' +
                '<a class="'+options.classes.button.finish+'" href="#'+this.id+'" data-wizard="finish" role="button">'+options.buttonLabels.finish+'</a>' +
            '</div>';
        }
    },

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
            activing: 'activing'
        },

        button: {
            hide: 'hide',
            disabled: 'disabled',
            next: '',
            back: '',
            finish: ''
        }
    },

    autoFocus: true,
    keyboard: true,

    buttonLabels: {
        next: 'Next',
        back: 'Back',
        finish: 'Finish'
    },

    loading: {
        show: function(step) {},
        hide: function(step) {},
        fail: function(step) {},
    },

    onReset: null,

    onNext: null,
    onBack: null,

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
