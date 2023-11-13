const User = require("../models/User");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/customError");

// GET all users
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
});

//GET all users from a branch
const getAllUsersFromABranch = asyncWrapper(async (req, res, next) => {
  const branch = req.query.branchPlacement;
  const usersBranchPlacement = req.user.branchPlacement;
  const HQ = "HQ";

  if (!branch) {
   return next(createCustomError('Branch parameter is required.', 400));
  }
  if(!branch.includes(usersBranchPlacement) && !HQ.includes(usersBranchPlacement)){
    return next(createCustomError('Yon are not Authorized to see users in this branch .', 403));
  }
  
  const users = await User.find({ branchPlacement: branch });

  if (users.length === 0) {
    return next(createCustomError(`No User found in this branch : ${branch}`, 404));
  }
  res.status(200).json({ users });
});


//GET a User
const getUser = asyncWrapper(async (req, res, next) => {
  const { id: userID } = req.params;
  const user = await User.findOne({ _id: userID });
  const HQ = "HQ";
  const usersBranchPlacement = req.user.branchPlacement;

  if(!user.branchPlacement.includes(usersBranchPlacement) && !HQ.includes(usersBranchPlacement)){
    return next(createCustomError('Yon are not Authorized to see users in this branch .', 403));
  }

  if (!user) {
    return next(createCustomError(`No user found with id : ${userID}`, 404));
  }

  res.status(200).json({ user });
});


// UPDATE a  User

const updateUser = asyncWrapper(async (req, res, next) => {
  const { id: userID } = req.params;
  let searchUser = await User.findOne({ _id: userID });
  const HQ = "HQ";
  const usersBranchPlacement = req.user.branchPlacement;
  if (!searchUser) {
    return next(createCustomError(`No user found with id : ${userID}`, 404));
  }
  if (searchUser.id !== req.user.id && !HQ.includes(usersBranchPlacement) && req.user.role !== "BranchAdmin") {
    return next(createCustomError('Yon are not Authorized to update this users details .', 403));
  }
  if (req.user.role === "BranchAdmin"){
      if (searchUser.branchPlacement !== req.user.branchPlacement){
        return next(createCustomError('Yon are not Authorized to update this users details .', 403));
      }
  }
  searchUser = await User.findOneAndUpdate({ _id: userID }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ searchUser });
});

// DELETE a user

const deleteUser = asyncWrapper(async (req, res, next) => {
  const { id: userID } = req.params;
  let searchUser = await User.findOne({ _id: userID });
  const HQ = "HQ";
  const usersBranchPlacement = req.user.branchPlacement;
  if (!searchUser) {
    return next(createCustomError(`No user found with id : ${userID}`, 404));
  }
  if (searchUser.id !== req.user.id && !HQ.includes(usersBranchPlacement) && req.user.role !== "BranchAdmin") {
    return next(createCustomError('Yon are not Authorized to delete this user .', 403));
  }
  if (req.user.role === "BranchAdmin"){
      if (searchUser.branchPlacement !== req.user.branchPlacement){
        return next(createCustomError('Yon are not Authorized to delete this user .', 403));
      }
  }
  searchUser = await User.findOneAndDelete({ _id: userID });

  res.status(200).json({ searchUser });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllUsersFromABranch,
};