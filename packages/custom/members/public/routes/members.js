'use strict';

angular.module('mean.members').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('members', {
      url: '/members/example',
      templateUrl: 'members/views/index.html'
    });
  }
]);
