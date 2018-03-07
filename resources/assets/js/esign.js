window.esign = window.esign || {};

esign.cacheSelectors = function () {
  esign.cache = {
    // general
    $html: $('html'),

    // navigation
    $nav: $('.main-nav__wrap')

  };
};

esign.init = function () {

  Response.create({
    prop: "width",
    prefix: "min-width- r src",
    breakpoints: [752,0],
    lazy: true
  });

  esign.gaDevelopment();
  esign.cacheSelectors();

  esign.navigation();
  esign.responsiveVideos();
  esign.formAjax();
};

esign.navigation = function () {
  $('.main-nav__trigger').click(function(e) {
    e.preventDefault();
    $(this).next('.main-nav__wrap').slideToggle('fast');
  });

  Response.crossover('width', function() {
    if(Response.band(752)) {
      esign.cache.$nav.css('display', 'block');
    } else {
      esign.cache.$nav.css('display', 'none');
    }
  });
};

esign.responsiveVideos = function () {
  $('iframe[src*="youtube.com/embed"], iframe[src*="youtube-nocookie.com/embed"], iframe[src*="player.vimeo"]').wrap('<div class="video-container"></div>');
};

// Ajax newsletter subscribe
esign.formAjax = function () {
  $('.form-ajax').submit(function(e) {
    var $form = $(this);
    $form.find('button,input[type="submit"]').attr("disabled", "disabled");

    $.post($form.attr('action'), $form.serializeArray(), function(data) {
      if(data.errors === false) {
        $form.html(data.result);
      } else {
        $form.find('.result').html(data.result);
        $form.find('button, input[type="submit"]').removeAttr('disabled');
      }
    });

    e.preventDefault();
    return false;
  });
};

// Log ga calls in development
esign.gaDevelopment = function() {
  if (typeof ga === typeof undefined) {
    window.ga = function() {
      var argumentsArray = [];
      for (var key in arguments) {
        if (arguments.hasOwnProperty(key)) {
          argumentsArray.push(arguments[key]);
        }
      }

      var msg = '[GA DEV] Call with arguments [' + argumentsArray.join(',') + ']';
      console.log('%c' + msg, 'background: #ff9800; color: #fff;');
    };
  }
};

require([
  'requirejs/require',
  'jquery/dist/jquery',
  'js/polyfills/native-console',
  'response.js/response',
  'jquery-touchswipe/jquery.touchSwipe'
], function() {
  // Initialize on docready
  $(esign.init);
});
