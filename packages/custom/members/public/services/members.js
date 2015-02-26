'use strict';

angular.module('mean.members').factory('Members', ['$http',
  function($http) {
    return {
      name: 'members',
        saveMember : function(member){
            console.log(member)
            /*$http.post('/members/createOrg', member)
             .success(function() {
                // authentication OK
                    alert("orgnation saved");
             })
             .error(function(error) {
                // Error: authentication failed
                    alert("orgnation error");

             });*/
            $http({
                url: "/members/createOrg",
                data: member,
                type: "POST"
            }).then(function(data){
                alert("orgnation saved");
            }, function(data){
                alert("orgnation error");
            })
        }
    };
  }
]);