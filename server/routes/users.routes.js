const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/search', usersController.searchUsers);

module.exports = router;