Wizard.defaults = {
    step: '.steps > li',
    buttonsAppendTo: '',
    templates: {
        button: function(action, label){
            return '<li class="'+action+'"><a href="'+this.id+'" data-wizard="'+action+'" role="button">'+label+'</a></li>';
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

        buttons: {
            disabled: '',
            prev: '',
            next: '',
            finish: ''
        }
    },

    autoFocus: true,
    keyboard: true,

    buttonLabels: {
        next: 'Next',
        previous:'Previous',
        finish: 'Finish'
    },

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
