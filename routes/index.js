var express = require('express');
var router = express.Router();
// import controllers
var controller = require('../src/controllers/index')

// build contract route
router.post('/build',controller.buildContract)

// enter the lottery game
router.post('/enter',controller.enterTheLotteryGame)

// get the players
router.get('/getPlayers',controller.getPlayers)

module.exports = router;
