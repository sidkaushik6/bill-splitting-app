const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friends.controller");
const { check, validationResult } = require("express-validator");
const friendsValidations = require("../utils/friends.validations");

// router.post('/request/:userId', friendsController.sendFriendRequest);
// router.put('/accept/:requestId', friendsController.acceptFriendRequest);

//View Friend requests route
router.get("/requests", friendsController.viewFriendRequests);

//Send Friend request route
router.post(
  "/request/:userId",
  friendsValidations.validateFriendRequest,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  friendsController.sendFriendRequest
);

//Accept Friend request route
router.put(
  "/accept/:requestId",
  friendsValidations.validateAcceptFriendRequest,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  friendsController.acceptFriendRequest
);

//Reject Friend request route
router.put("/reject/:requestId", friendsController.rejectFriendRequest);

//View Friends route
router.get("/", friendsController.getFriends);

//Remove Friend route
router.delete("/remove/:friendId", friendsController.removeFriend);

//router.get('/:userId', friendsController.getFriends);

module.exports = router;
