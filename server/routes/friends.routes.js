const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends.controller');

router.post('/request/:userId', friendsController.sendFriendRequest);
router.put('/accept/:requestId', friendsController.acceptFriendRequest);
router.put('/reject/:requestId', friendsController.rejectFriendRequest);
router.get('/:userId', friendsController.getFriends);

module.exports = router;