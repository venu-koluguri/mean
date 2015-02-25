'use strict';

/* jshint -W098 */
angular.module('mean.members').controller('MembersController', ['$scope', 'Global', 'Members',
  function($scope, Global, Members) {
    $scope.global = Global;
    $scope.package = {
      name: 'members'
    };
  }
]);
