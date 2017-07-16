/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
  Gamelog = mongoose.model('Gamelog');
const avatars = require('./avatars').all();

module.exports.saveGameLog = (req, res) => {
  const gamelog = new Gamelog();
  gamelog.gameId = req.body.gameId;
  gamelog.players = req.body.players;
  gamelog.winner = req.body.winner;
  gamelog.save((err) => {
    if (err) {
      return res.json({ message: 'error occured' });
    } else {
      return res.json({ message: 'saved' });
    }
  });
};

module.exports.getLeaderBoard = (req, res) => {
  Gamelog.find({}, (err, leaderBoard) => {
    if (err) {
      return res.json({ err });
    }
    if (leaderBoard === 0) {
      return res.json({ message: 'no data' });
    }
    let index = 1;
    let leader = [];
    leaderBoard.forEach((array) => {
      leader.push({ id: index, winner: array.winner.winnerUsername });
      index += 1;
    });

    let value = 1;
    let leaderFrequency = [];
    leader.forEach((array) => {
      let frequency = 0;
      for (let i = 0; i < leader.length; i++) {
        if (leader[i].winner === array.winner) {
          frequency += 1;
        }
      }
      leaderFrequency.push({ id: value, winner: array.winner, frequency });
      value += 1;
    });

    

    const removeDuplicates = (array, prop) => {
      const newArray = [];
      const newObject = {};

      for (const i in array) {
        newObject[array[i][prop]] = array[i];
      }

      for (const i in newObject) {
        newArray.push(newObject[i]);
      }
      return newArray;
    };
    const newArray = removeDuplicates(leaderFrequency, 'winner');
    console.log(newArray);

    return res.json(newArray);
  });
};


module.exports.gameHistory = (req, res) => {
  Gamelog.find({}, (err, gameHistory) => {
    if (err) {
      return res.json({ err });
    }
    if (gameHistory === 0) {
      return res.json({ message: 'no data' });
    }
    let index = 1;
    let history = [];
    gameHistory.forEach((array) => {
      history.push({ id: index, winner: array.winner.winnerUsername, players: array.players });
      index += 1;
    });

    return res.json(history);
  });
};
