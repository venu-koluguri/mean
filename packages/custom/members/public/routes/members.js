'use strict';

angular.module('mean.members').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('members', {
        url: '/members/login',
        templateUrl: 'members/views/login.html'
    }).state('register', {
        url: '/members/register',
        templateUrl: 'members/views/register.html'
    });
  }
]);
