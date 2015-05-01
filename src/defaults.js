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

  buttons: {
    next: {
      label: 'Next',
    },
    previous: {
      label: 'Previous',
    },
    finish: {
      lable: 'Finish'
    },
  },

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
