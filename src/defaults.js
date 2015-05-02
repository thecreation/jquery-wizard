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
