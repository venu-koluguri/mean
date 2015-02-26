'use strict';

/* jshint -W098 */
angular.module('mean.members').controller('MembersController', ['$scope', 'Global', 'Members',
    function($scope, Global, Members) {
        var memberCtrl = this;
        $scope.global = Global;
        $scope.package = {
            name: 'members'
        };
        this.register = function(valid) {
            console.log('in member register 22222');
            memberCtrl.submitted = true;
            if(!valid){
                return;
            }else{
                console.log(memberCtrl.member)
                Members.saveMember(memberCtrl.member);
            }
        };
    }
]);
angular.module('mean.members').controller('MLoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
        // This object will be filled by the form
        $scope.user = {};
        $scope.global = Global;
        $scope.global.registerForm = false;
        $scope.input = {
            type: 'password',
            placeholder: 'Password',
            confirmPlaceholder: 'Repeat Password',
            iconClass: '',
            tooltipText: 'Show password'
        };

        $scope.togglePasswordVisible = function() {
            $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
            $scope.input.placeholder = $scope.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
            $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
            $scope.input.tooltipText = $scope.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
        };

        // Register the login() function
        $scope.login = function() {
            $http.post('/members/login', {
                email: $scope.user.email,
                password: $scope.user.password
            })
                .success(function(response) {
                    // authentication OK
                    console.log('authenticated');
                    $scope.loginError = 0;
                    $rootScope.user = response.user;
                    $rootScope.$emit('loggedin');
                    if (response.redirect) {
                        if (window.location.href === response.redirect) {
                            //This is so an admin user will get full admin page
                            window.location.reload();
                        } else {
                            window.location = response.redirect;
                        }
                    } else {
                        $location.url('/');
                    }
                })
                .error(function() {
                    $scope.loginerror = 'Authentication failed.';
                });
        };
    }
]);
