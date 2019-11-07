const EventEmitter = require('events');

/* eslint no-underscore-dangle: ["error", { "allow": ["_show", "_hide"] }] */

export default class Modal extends EventEmitter {
  constructor(element) {
    super();
    this.element = element;
    this.id = element.getAttribute('id');
    this.modalDialog = null;
    this.modalDocument = null;
    this.closeTriggers = null;
    this.isAlert = element.dataset.alert === 'true';
    this.title = element.dataset.title;
    this.showHash = element.dataset.hideHash !== 'true';
    this.backgroundScroll = element.dataset.backgroundScroll === 'true';
    this.focusableElements = null;
    this.eventListeners = [];
    this.activeClass = 'modal--active';
    this.beforeShowClass = 'modal--before-show';
    this.beforeHideClass = 'modal--before-hide';
    this.beforeShowAnimation = null;
    this.afterShowAnimation = null;
    this.beforeHideAnimation = null;
    this.afterHideAnimation = null;
    this.showTimeout = element.dataset.showTimeout || 0;
    this.hideTimeout = element.dataset.hideTimeout || 0;
    this.init();
  }

  init() {
    // DOM Setup
    this.addA11Y();
    // Focusable elements (for TAB key)
    this.focusableElements = [...this.element.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [contenteditable], [tabindex]:not([tabindex^="-"])')];
    this.closeTriggers = [...this.element.querySelectorAll('.js-modal-close')];
  }

  addA11Y() {
    this.element.setAttribute('aria-hidden', true);

    // Create va-wrap ; va-m
    this.modalVaWrap = document.createElement('div');
    this.modalVaWrap.classList.add('modal__va-wrap');
    this.modalVaM = document.createElement('div');
    this.modalVaM.classList.add('modal__va-m');

    // Create modal wrapper
    this.modalDialog = document.createElement('div');
    const role = this.isAlert ? 'alertdialog' : 'dialog';
    this.modalDialog.setAttribute('role', role);
    this.modalDialog.classList.add('modal__dialog');
    if (this.title) {
      this.modalDialog.setAttribute('aria-labelledby', this.title);
    }

    // Create content wrapper
    this.modalDocument = document.createElement('div');
    this.modalDocument.setAttribute('role', 'document');

    // Wrap content with content wrapper and then wrap content wrapper with modal wrapper
    const originalHtml = this.element.innerHTML;
    this.element.innerHTML = '';
    this.element.appendChild(this.modalVaWrap);
    this.modalVaWrap.appendChild(this.modalVaM);
    this.modalVaM.appendChild(this.modalDialog);
    this.modalDialog.appendChild(this.modalDocument);
    this.modalDocument.innerHTML = originalHtml;
  }

  /* Show / Hide functionality */

  show() {
    this.element.classList.add(this.beforeShowClass);
    if (this.beforeShowAnimation) {
      this.beforeShowAnimation.once('finished', () => {
        this._show();
      });
      this.beforeShowAnimation.start();
    } else {
      setTimeout(() => {
        this._show();
      }, this.showTimeout);
    }
  }

  _show() {
    this.element.setAttribute('aria-hidden', false);
    this.modalDialog.setAttribute('tabindex', -1);
    this.modalDialog.scrollTop = 0;
    this.addEventListeners();
    this.element.classList.remove(this.beforeShowClass);
    this.element.classList.add(this.activeClass);
    this.emit('show');

    if (this.afterShowAnimation) {
      this.afterShowAnimation.start();
    }

    // Set focus
    setTimeout(() => {
      this.modalDialog.focus();
    }, 50);
  }

  hide() {
    this.element.classList.add(this.beforeHideClass);
    if (this.beforeHideAnimation) {
      this.beforeHideAnimation.once('finished', () => {
        this._hide();
      });
      this.beforeHideAnimation.start();
    } else {
      setTimeout(() => {
        this._hide();
      }, this.hideTimeout);
    }
  }

  _hide() {
    this.element.setAttribute('aria-hidden', true);
    this.modalDialog.removeAttribute('tabindex');

    this.removeEventListeners();
    this.element.classList.remove(this.beforeHideClass);
    this.element.classList.remove(this.activeClass);
    this.emit('hide');

    if (this.afterHideAnimation) {
      this.afterHideAnimation.start();
    }
  }

  /* Event Listeners */

  onModalVaMClick(e) {
    if (e.target === this.modalVaM) {
      this.hide();
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 27) { // ESC
      this.hide();
    }

    if (e.keyCode === 9) { // TAB
      const focusedIndex = this.focusableElements.indexOf(document.activeElement);
      if (e.shiftKey && (focusedIndex === 0 || focusedIndex === -1)) {
        this.focusableElements[this.focusableElements.length - 1].focus();
        e.preventDefault();
      } else if (!e.shiftKey && focusedIndex === this.focusableElements.length - 1) {
        this.focusableElements[0].focus();
        e.preventDefault();
      }
    }
  }

  addEventListeners() {
    // Close modal
    const onModalVaMClick = (e) => { this.onModalVaMClick(e); };
    this.element.addEventListener('click', onModalVaMClick);
    this.eventListeners.push({ ctx: this.modalDialog, type: 'click', fn: onModalVaMClick });

    const onCloseTriggerClick = () => { this.hide(); };
    this.closeTriggers.forEach((closeTrigger) => {
      closeTrigger.addEventListener('click', onCloseTriggerClick);
      this.eventListeners.push({ ctx: closeTrigger, type: 'click', fn: onCloseTriggerClick });
    });

    // Keydown
    const onDocumentKeyDown = (e) => { this.onKeyDown(e); };
    document.addEventListener('keydown', onDocumentKeyDown);
    this.eventListeners.push({ ctx: document, type: 'keydown', fn: onDocumentKeyDown });
  }

  removeEventListeners() {
    this.eventListeners.forEach((listener) => {
      listener.ctx.removeEventListener(listener.type, listener.fn);
    });
  }

  /* Animations */

  setBeforeShowAnimation(animation) {
    this.beforeShowAnimation = animation;
  }

  setAfterShowAnimation(animation) {
    this.afterShowAnimation = animation;
  }

  setBeforeHideAnimation(animation) {
    this.beforeHideAnimation = animation;
  }

  setAfterHideAnimation(animation) {
    this.afterHideAnimation = animation;
  }

  setShowTimeout(duration) {
    this.showTimeout = duration;
  }

  setHideTimeout(duration) {
    this.hideTimeout = duration;
  }
}
