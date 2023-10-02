const express = require("express");
const router = express.Router();
const { verifyToken,verifyHQAdmin } = require("../controllers/verifyToken")

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");


router.route("/").get(verifyToken,verifyHQAdmin('HQAdmin'),getAllUsers)
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;