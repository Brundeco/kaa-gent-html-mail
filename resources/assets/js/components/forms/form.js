/**
 * Created by Bart Decorte
 * Date: 16/06/2020
 * Time: 17:08
 */
const EventEmitter = require('events');

let recaptchaOnLoadCallbackExposed = false;
const forms = [];

class Form extends EventEmitter {
  constructor(form, options = {}) {
    super();
    const {
      async = false,
      buttonSelector = '[type="submit"]',
      buttonLoadingClass = 'button--loading',
      recaptcha = false,
      resultSelector = '.result',
      generalErrorMessage = 'Something went wrong. Please try again later.',
      replaceFormOnSuccess = true,
      recaptchaClass = 'g-recaptcha',
      recaptchaName = 'g-recaptcha-response',
      recaptchaCallbackName,
    } = options;
    this.async = async;
    this.recaptcha = recaptcha;
    this.buttonSelector = buttonSelector;
    this.buttonLoadingClass = buttonLoadingClass;
    this.resultSelector = resultSelector;
    this.generalErrorMessage = generalErrorMessage;
    this.replaceFormOnSuccess = replaceFormOnSuccess;
    this.recaptchaClass = recaptchaClass;
    this.recaptchaName = recaptchaName;
    this.recaptchaCallbackName = recaptchaCallbackName;
    this.active = false;
    this.recaptchaWidgetId = undefined;

    if (form instanceof HTMLElement) {
      this.form = form;
    } else {
      this.form = document.querySelector(form);
    }

    if (this.recaptcha) {
      this.exposeRecaptchaCallback();
    }

    this.bindListeners();
    Form.registerForm(this);
    if (this.recaptcha) {
      Form.exposeRecaptchaOnLoadCallback();
    }
  }

  static get recaptchaOnLoadCallbackExposed() {
    return recaptchaOnLoadCallbackExposed;
  }

  static set recaptchaOnLoadCallbackExposed(value) {
    recaptchaOnLoadCallbackExposed = value;
  }

  static registerForm(form) {
    forms.push(form);
  }

  renderRecaptcha() {
    // explicit recaptcha rendering (to support multiple instances)
    const recaptcha = this.recaptchaContainer();
    const attributes = {
      sitekey: recaptcha.dataset.sitekey,
      size: recaptcha.dataset.size,
      callback: recaptcha.dataset.callback,
    };

    this.recaptchaWidgetId = window.grecaptcha.render(recaptcha, attributes);
  }

  static exposeRecaptchaOnLoadCallback() {
    if (!Form.recaptchaOnLoadCallbackExposed) {
      window.onloadReCaptchaCallback = () => {
        Form.recaptchaOnLoadCallback();
      };
    }
  }

  static recaptchaOnLoadCallback() {
    forms.forEach(form => {
      form.renderRecaptcha();
    });
  }

  bindListeners() {
    this.form.addEventListener('submit', ev => this.lFormSubmit(ev));
  }

  async lFormSubmit(ev) {
    this.setState(true);

    if (this.recaptcha || this.async) {
      ev.preventDefault();
    }

    if (this.recaptcha) {
      const input = this.recaptchaInput();
      if (input && input.value !== '') {
        // Use window.grecaptcha as recaptcha is async loaded
        window.grecaptcha.reset(this.recaptchaWidgetId);
      }
      window.grecaptcha.execute(this.recaptchaWidgetId);
      return this;
    }

    if (this.async) {
      await this.executeAsync();
    }

    return this;
  }

  async recaptchaCallback() {
    if (this.async) {
      await this.executeAsync();
      return this;
    }

    this.form.submit();
    return this;
  }

  async executeAsync() {
    const response = await this.sendAsync();
    const json = await response.json();

    this.setState(false);

    if (response.ok) {
      this.handleSuccess(json);
    } else {
      this.handleFailure(response.status, json);
    }
  }

  action() {
    const action = this.form.getAttribute('action');
    return action || window.location;
  }

  method() {
    const method = this.form.getAttribute('method');
    return method || 'GET';
  }

  resultContainer() {
    return this.form.querySelector(this.resultSelector);
  }

  recaptchaContainer() {
    return this.form.querySelector(`.${this.recaptchaClass}`);
  }

  recaptchaInput() {
    return this.form.querySelector(`[name="${this.recaptchaName}"]`);
  }

  handleFailure(status, data) {
    if (status === 422) {
      // Validation error
      this.showValidationErrors(data);
    } else {
      // Something else went wrong
      this.showGeneralError();
    }
  }

  handleSuccess(data) {
    const { result } = data;
    this.showSuccessMessage(result);
  }

  showValidationErrors(response) {
    const { result } = response;
    this.resultContainer().innerHTML = result;
  }

  showGeneralError() {
    this.resultContainer().innerHTML = `
      <div class="note note--error">
        <p>${this.generalErrorMessage}</p>
      </div>`;
  }

  showSuccessMessage(successMarkup) {
    if (this.replaceFormOnSuccess) {
      this.form.outerHTML = successMarkup;
    } else {
      this.resultContainer().innerHTML = successMarkup;
    }
  }

  data() {
    const formData = new FormData(this.form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  setState(activeState) {
    this.active = activeState;
    this.setSubmitButtonsActive(activeState);
  }

  async sendAsync() {
    return fetch(this.action(), {
      method: this.method(),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(this.data()),
    });
  }

  setSubmitButtonsActive(activeState) {
    const buttons = this.form.querySelectorAll(this.buttonSelector);
    buttons.forEach(button => {
      this.setButtonLoadingClass(button, activeState);
      this.setButtonDisabled(button, activeState);
    });
    return this;
  }

  setButtonLoadingClass(button, activeState) {
    const buttonHasLoadingClass = button.classList.contains(this.buttonLoadingClass);
    if (activeState && !buttonHasLoadingClass) {
      button.classList.add(this.buttonLoadingClass);
    } else if (!activeState && buttonHasLoadingClass) {
      button.classList.remove(this.buttonLoadingClass);
    }
    return this;
  }

  setButtonDisabled(button, activeState) {
    const buttonIsDisabled = button.hasAttribute('disabled');
    if (activeState && !buttonIsDisabled) {
      button.setAttribute('disabled', '');
    } else if (!activeState && buttonIsDisabled) {
      button.removeAttribute('disabled');
    }
    return this;
  }

  exposeRecaptchaCallback() {
    window[this.recaptchaCallbackName] = () => {
      this.recaptchaCallback();
    };
  }
}

const formInit = (form, options = {}) => {
  return new Form(form, options);
};

export { formInit as default, formInit as form, Form };
