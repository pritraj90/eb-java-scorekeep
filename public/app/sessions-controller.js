var module = angular.module('scorekeep');
module.controller('SessionsController', Sessions);
function Sessions($scope, $http, SessionService, api, UserCollection) {
  GetUserPool = $http.get( api + 'userpool');
  GetUserPool.then( function(userpool){
    // configure region and get poolData for Cognito
    var poolData = UserCollection.configureAWSClients(userpool);
    // create userPool
    userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    // get credentials
    if ( sessionStorage['JWTToken'] ) {
      AWS.config.credentials = UserCollection.getAWSCredentials(sessionStorage['JWTToken'], userpool.data);
    };
    // call Scorekeep
    $scope.sessions = SessionService.query();
  })

  $scope.name = "my session";
  $scope.username = "my name";
  $scope.createSession = function () {
    var session = new SessionService();
    session.$save(function() {
      session.name = $scope.name;
      session.owner = $scope.username;
      session.$update({ id: session.id }, function() {
        $scope.sessions.push(angular.copy(session));
      })
    }
  )};
  $scope.deleteSession = function (index) {
    var sessionId = $scope.sessions[index].id;
    $http.delete( api + 'session/' + sessionId);
    $scope.sessions.splice(index, 1);
  }
}
