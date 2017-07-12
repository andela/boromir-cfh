/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
  Gamelog = mongoose.model('Gamelog');
const avatars = require('./avatars').all();

module.exports.saveGameLog = (req, res) => {
  const gamelog = new Gamelog();
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

module.exports.getLogs = (req, res) => {
  Gamelog.find({}, (err, gamelog) => {
    if (err) {
      return res.json({ err });
    }
    return res.json(gamelog);
  });
};