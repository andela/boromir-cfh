angular.module('mean.system')
  .controller('IndexController', ['$scope', '$http', 'Global', '$location', '$window', 'socket', 'game', 'AvatarService', function ($scope, $http, Global, $location, $window, socket, game, AvatarService) {
    $scope.global = Global;

    $scope.showRegion = function () {
      const myModal = $('#select-region');
      myModal.modal('show');
    };

    $scope.playAsGuest = function () {
      game.joinGame();
      $location.path('/app');
    };

    $scope.playWithStrangers = function () {
      if ($scope.region === undefined){
        alert('Please Select your Region');
        return;
      }
      localStorage.setItem('player_region', $scope.region);
      const myModal = $('#select-region');
      myModal.modal('hide');
      $window.location.href = '/play';
    };

    $scope.playWithFriends = function () {
      if ($scope.region === undefined) {
        alert('Please Select your Region');
        return;
      }
      localStorage.setItem('player_region', $scope.region);
      const myModal = $('#select-region');
      myModal.modal('hide');
      $window.location.href = '/play?custom';
    };
    $scope.showError = function () {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });
// Initial avatar id
    $scope.avata = {
        name: ''
    };
//Sign up function
    $scope.signUp = function () {
      $scope.data = { name: $scope.name, email: $scope.email, password: $scope.password, avatar: $scope.avata.name };
      $http.post('/api/auth/signup', $scope.data)
        .success(function (data) {
          if (data.message === 'successful login') {
            localStorage.setItem('JSONWT', JSON.stringify(data.token));
            $location.path('/');
            $window.location.reload();
          } else {
            alert('Wrong email or user already exist');
          }
        });
    };
// sign in function
    $scope.signIn = function () {
      $scope.data = { email: $scope.email, password: $scope.password };
      $http.post('/api/auth/signin', $scope.data)
        .success(function (data) {
          if (data.message === 'successful login') {
            localStorage.setItem('JSONWT', JSON.stringify(data.token));
            $location.path('/');
            $window.location.reload();
          } else {
            alert('invalid user');
          }
        })
    };
  }]);
