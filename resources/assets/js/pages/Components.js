import RecaptchaForm from '../components/forms/RecaptchaForm';
import BasicGoogleMap from '../components/maps/BasicGoogleMap';
import JsonFetcher from '../components/layout/JsonFetcher';

export default class Components {
  constructor() {
    // Recaptcha submit handler for each form
    const contactForm = new RecaptchaForm('#form-contact');
    window.submitRecaptchaFormContact = () => {
      contactForm.submitCallback();
    };

    // Map
    const map = new BasicGoogleMap();
    map.init();

    // JsonFetcher
    const jsonFetcher = new JsonFetcher(document.querySelector('.json-fetcher'));
    jsonFetcher.init();
  }
}