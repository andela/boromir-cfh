/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


/**
 * Question Schema
 */
var GamelogSchema = new Schema({
    id: {
        type: String
    },
    players: {
        type: Object,
        default: '',
    },
    winner: {
        type: Object,
        default: '',
        trim: true
    }
});

mongoose.model('Gamelog', GamelogSchema);