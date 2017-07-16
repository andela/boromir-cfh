angular.module('mean.system')
  .controller('GameController', ['$scope', 'game', '$timeout', '$location', 'MakeAWishFactsService', '$http', '$dialog', function ($scope, game, $timeout, $location, MakeAWishFactsService, $http, $dialog) {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    $scope.invitedUsers = [];
    let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();


    $scope.onKeyPress = function (message) {
      game.sendTyping(message);
    };
    $scope.sendChat = function (message) {
      game.sendChat(message);
      $scope.msg = '';
    };


    $scope.pickCard = function (card) {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            // delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };
    

    $scope.startGame = function () {
      // when user tries to start game without meeting minimum requirement
      if (game.players.length < game.playerMinLimit) {
        const myModal = $('#playerRequirement');
        myModal.find('.modal-title')
          .text('Player requirement');
        myModal.find('.modal-body')
          .text('Sorry! You require a minimum of three(3) players to play this game');
        myModal.modal('show');
      } else {
        game.startGame();
      }
    };

    $scope.getUsers = function () {
      localStorage.setItem('email', game.players[game.playerIndex].email);
      // Display all users from mongoDB into modal
      $scope.searchTerm = '';
      $scope.sentSuccessfully = 0;
      $scope.selectedUsers = [];
      const myModal = $('#invite-players');
      myModal.modal('show');
      $scope.allUsers = [];
      $http({
        method: 'GET',
        url: 'api/users/search'
      }).then((response) => {
        response.data.map((eachUser) => {
          // Excludes current user from the list of users that can recieve invites
          if (eachUser.email !== localStorage.email && eachUser.name) {
            $scope.allUsers.push(eachUser);
          }
        });
      });
      $scope.filteredUsers = $scope.allUsers;
    };

    $scope.countPlayers = function () {
      $scope.selectedUsers = $scope.allUsers.filter((user) => {
        if (user.selected) {
          return user;
        }
      });
    };

    $scope.invitePlayers = function () {
      const mailSentBy = $scope.game.players[0].username;

      // Close invitation modal and show mail sent information
      const myModal = $('#invite-players');
      myModal.modal('hide');

      // iterate through object and send emails to selected users
      $scope.selectedUsers.map((user) => {
        const userDetails = {
          name: user.name,
          email: user.email,
          urlLink: document.URL,
          from: mailSentBy,
        };
        $http({
          method: 'POST',
          url: '/api/user/invite/:userDetails',
          data: userDetails
        }).then((response) => {
          if (response.data.sent) {
            $scope.invitedUsers.push(user.email);
            // show modal when invitations sent out successfully
            const inviteSuccessful = $('#playerRequirement');
            inviteSuccessful.find('.modal-body')
              .text("Invites sent to users' email");
            inviteSuccessful.modal('show');
          }
        }, (error) => {
          // show modal when invitations is unsuccessfully(Failed)
          const inviteSuccessful = $('#playerRequirement');
          inviteSuccessful.find('.modal-body')
            .text(`Invites could not be sent at the moment, 
          check your internet connection and try again
          Error code: ${error.status}`);
          inviteSuccessful.modal('show');
        });
      });
    };

    $scope.searchUsers = function () {
      const regexSearchTerm = RegExp($scope.searchTerm, 'gi');
      $scope.filteredUsers = $scope.allUsers.filter((user) => {
        if (user.name) {
          if (user.name.search(regexSearchTerm) !== -1) {
            return user;
          }
        }
      });
    };

    $scope.pointerCursorStyle = function () {
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return { cursor: 'pointer' };
      }
      return {};
    };

    $scope.sendPickedCards = function () {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = function (card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      }
      return false;
    };

    $scope.cardIsSecondSelected = function (card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      }
      return false;
    };

    $scope.firstAnswer = function ($index) {
      if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.secondAnswer = function ($index) {
      if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.showFirst = function (card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
    };

    $scope.showSecond = function (card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
    };

    $scope.isCzar = function () {
      return game.czar === game.playerIndex;
    };

    $scope.isPlayer = function ($index) {
      return $index === game.playerIndex;
    };

    $scope.isCustomGame = function () {
      return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
    };

    $scope.isPremium = function ($index) {
      return game.players[$index].premium;
    };

    $scope.currentCzar = function ($index) {
      return $index === game.czar;
    };

    $scope.winningColor = function ($index) {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      }
      return '#f9f9f9';
    };

    $scope.pickWinning = function (winningSet) {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = function () {
      return game.winningCard !== -1;
    };

    $scope.abandonGame = function () {
      game.leaveGame();
      $location.path('/');
    };

    $scope.shuffleCards = () => {
      const card = $(`#${event.target.id}`);
      card.addClass('animated flipOutY');
      setTimeout(() => {
        $scope.startNextRound();
        card.removeClass('animated flipOutY');
        $('#start-modal').modal('hide');
      }, 500);
    };

    $scope.startNextRound = () => {
      if ($scope.isCzar()) {
        game.startNextRound();
      }
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', () => {
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', function() {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
      if ($scope.isCzar() && game.state === 'czar pick card' && game.table.length === 0) {
        const myModal = $('#start-modal');
        myModal.modal('show');
      }
      if (game.state === 'game dissolved') {
        $('#start-modal').modal('hide');
      }
      if ($scope.isCzar() === false && game.state === 'czar pick card'
        && game.state !== 'game dissolved'
        && game.state !== 'awaiting players' && game.table.length === 0) {
        $scope.czarHasDrawn = 'Wait! Czar is drawing Card';
      }
      if (game.state !== 'czar pick card'
        && game.state !== 'awaiting players'
        && game.state !== 'game dissolve') {
        $scope.czarHasDrawn = '';
      }
    });

    $scope.$watch('game.gameID', () => {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({ game: game.gameID });
          if (!$scope.modalShown) {
            setTimeout(() => {
              const link = document.URL;
              const txt = 'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);
              $('#oh-el').css({ 'text-align': 'center', 'font-size': '22px', background: 'white', color: 'black' }).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
      }
    });

    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      console.log('joining custom game');
      game.joinGame('joinGame', $location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame', null, true);
    } else {
      game.joinGame();
    }
  }]);
