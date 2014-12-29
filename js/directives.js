'use strict';

/* Directives */


angular.module('myApp.directives', ['simpleLogin'])

  .directive('appVersion', ['version', function(version) {
    return function(scope, elm) {
      elm.text(version);
    };
  }])

  /**
   * A directive that shows elements only when user is logged in.
   */
  .directive('ngShowAuth', ['simpleLogin', '$timeout', function (simpleLogin, $timeout) {
    var isLoggedIn;
    simpleLogin.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it

        function update() {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', !isLoggedIn);
          }, 0);
        }

        update();
        simpleLogin.watch(update, scope);
      }
    };
  }])

  .directive('errSrc', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          if (attrs.src != attrs.errSrc) {
            attrs.$set('src', attrs.errSrc);
          }
        });
      }
    }
  })


  /**
   * A directive that shows elements only when user is logged out.
   */
  .directive('ngHideAuth', ['simpleLogin', '$timeout', function (simpleLogin, $timeout) {
    var isLoggedIn;
    simpleLogin.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        function update() {
          el.addClass('ng-cloak'); // hide until we process it

          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', isLoggedIn !== false);
          }, 0);
        }

        update();
        simpleLogin.watch(update, scope);
      }
    };
  }]).directive('enterSubmit', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {

        elem.bind('keydown', function(event) {
          var code = event.keyCode || event.which;

          if (code === 13) {
            if (!event.shiftKey) {
              event.preventDefault();
              scope.$apply(attrs.enterSubmit);
            }
          }
        });
      }
    }
  }).directive('focusMe', function($timeout, $parse) {
    return {
      //scope: true,   // optionally create a child scope
      link: function(scope, element, attrs) {
        var model = $parse(attrs.focusMe);
        scope.$watch(model, function(value) {
          if(value === true) {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
        // to address @blesh's comment, set attribute value to 'false'
        // on blur event:
        element.bind('blur', function() {
          scope.$apply(model.assign(scope, false));
        });
      }
    };
  }).directive("whenScrolled", function ($window) {
    return{
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var raw = elem[0];
        var checkBounds = function (evt) {
          var rectObject = raw.getBoundingClientRect();
          if ($window.innerHeight >rectObject.bottom+120) {
            if (!scope.loading){
              scope.loading = true;
              scope.$apply(attrs.whenScrolled);
            }
          }
        };
        angular.element($window).bind('scroll load', checkBounds);
      }
    };
  });


  if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function(searchString, position) {
        position = position || 0;
        return this.lastIndexOf(searchString, position) === position;
      }
    });
  }

  Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
  }
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
      if(this[i] && this[i].parentElement) {
        this[i].parentElement.removeChild(this[i]);
      }
    }
  }
