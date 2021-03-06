// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.deploy', 'starter.controllers'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
  $stateProvider

  .state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html',
    controller: 'WelcomeCtrl'
  })
  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'WelcomeCtrl'
  })
  .state('app.single', {
    url: '/vouchers/:voucherId',
    views: {
        'menuContent': {
          templateUrl: 'templates/voucher.html',
          controller: 'voucherCtrl'
        }
    }
/*  ,
    data: {
      authorizedRoles: [USER_ROLES.admin] // bloquear permissao para usuarios comuns
    }*/
  })
    .state('app.unidades', {
    url: '/unidades',
    views: {
      'menuContent': {
      templateUrl: "templates/unidades.html",
      controller: 'unidadesLets'
      }
    }
  })
  .state('app.vouchers', {
    url: '/vouchers',
    views: {
      'menuContent': {
      templateUrl: "templates/vouchers.html",
      controller: 'vouchersCtrl'
      }
    }
  })
  
  // Thanks to Ben Noblet!
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("app.vouchers");
  });

})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
 
    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        $state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }
 
    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'welcome') {
        event.preventDefault();
        $state.go('welcome');
      }
    }
  });
})

.run(function($timeout, statesService) {
  
  var token = window.localStorage.getItem('yourTokenKey');

  if(token > ''){
    statesService.setSenderId();
    statesService.getRefresh();
    $timeout(function() {
      statesService.setData();
    },1000);
  }
});