'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp.config', [])

  // version of this seed app is compatible with angularFire 0.6
  // see tags for other versions: https://github.com/firebase/angularFire-seed/tags
  .constant('version', '0.6.6.7')

  // where to redirect users if they need to authenticate (see routeSecurity.js)
  .constant('loginRedirectPath', '/login')

  // your Firebase data URL goes here, no trailing slash
  .constant('FBURL', 'https://song-a-day.firebaseio.com')

  // double check that the app has been configured before running it and blowing up space and time
  .run(['FBURL', '$timeout', function(FBURL, $timeout) {}])
