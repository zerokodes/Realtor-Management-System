const express = require("express");
const router = express.Router();
const { verifyToken,verifyHQAdmin,verifyBranchAdmin, verifyBranchAdminAndHQAdmin } = require("../controllers/verifyToken")

const {
  getAllUsers,
  getAllUsersFromABranch,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");


router.route("/").get(verifyToken,verifyHQAdmin('HQAdmin'),getAllUsers)
router.route("/branchUsers").get(verifyToken,verifyBranchAdminAndHQAdmin('BranchAdmin','HQAdmin'),getAllUsersFromABranch)
router.route("/:id").get(verifyToken,verifyBranchAdminAndHQAdmin('BranchAdmin','HQAdmin'),getUser)
.patch(verifyToken,updateUser).delete(verifyToken,deleteUser);
module.exports = router;