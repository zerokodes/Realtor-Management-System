const User = require("../models/User");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/customError");
const { verifyToken,verifyHQAdmin} = require("./verifyToken")

// GET all users
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
});


//GET a User
const getUser = asyncWrapper(async (req, res, next) => {
  const { id: userID } = req.params;
  const user = await User.findOne({ _id: userID });

  if (!user) {
    return next(createCustomError(`No task found with id : ${userID}`, 404));
  }

  res.status(200).json({ user });
});


// UPDATE a  User

const updateUser = asyncWrapper(async (req, res) => {
  const { id: userID } = req.params;
  const user = await User.findOneAndUpdate({ _id: userID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(createCustomError(`No task found with id : ${userID}`, 404));
  }
  res.status(200).json({ user });
});

// DELETE a user

const deleteUser = asyncWrapper(async (req, res) => {
  const { id: userID } = req.params;
  const user = await User.findOneAndDelete({ _id: userID });

  if (!user) {
    return next(createCustomError(`No task found with id : ${userID}`, 404));
  }
  res.status(200).json({ user });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};