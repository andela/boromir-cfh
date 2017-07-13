angular.module('mean.system')
.controller('DashboardController', ['$scope', 'Global', '$http', ($scope, Global, $http) => {
  $scope.donationData = {};
  $scope.donations = false;
  $scope.leaderboard = false;
  $scope.gameLog = true;
  $scope.noDonations = false;
  $scope.loadData = () => {
    $http.get('/api/donations').then((response) => {
      $scope.donationData = (response.data);
    });
  };

  $scope.getLeaderboard = () => {
    $http.get('/api/leaderboard').then((response) => {
      $scope.leaderboardInfo = (response.data);
    });
  };
  $scope.getGameLogs = () => {
    $http.get('/api/game/history').then((response) => {
      $scope.gameLogInfo = (response.data);
    });
  };


  $scope.showDonations = () => {
    if ($scope.donationData.length === 0) {
      $scope.noDonations = true;
      $scope.donations = false;
      $scope.leaderboard = false;
      $scope.gameLog = false;
    } else {
      $scope.donations = true;
      $scope.leaderboard = false;
      $scope.gameLog = false;
    }
  };

  $scope.showGames = () => {
    $scope.noDonations = false;

    $scope.gameLog = true;
    $scope.donations = false;
    $scope.leaderboard = false;
  };
  $scope.showLeaderBoard = () => {
    $scope.noDonations = false;

    $scope.leaderboard = true;
    $scope.donations = false;
    $scope.gameLog = false;
  };
  $scope.loadData();

  $scope.getGameLogs();
  $scope.getLeaderboard();

}]);
