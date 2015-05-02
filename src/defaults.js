Wizard.defaults = {
  step: '.steps > li',

  classes: {
    step: {
      done: 'done',
      error: 'error',
      active: 'active',
      disabled: 'disabled',
      activing: 'activing'
    },

    panel: {
      active: 'active',
      activing: 'activing'
    }
  },

  onStateChange: null,

  autoFocus: true,
  keyboard: true,
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

  validator: function(index){
    return true;
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
