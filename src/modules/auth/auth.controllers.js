import { catchError } from "../../middleware/catchError.js";
import { User } from "../../../database/models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../../utilities/appError.js";

/**
 * @api {post} /users/signup User Sign-Up
 * @apiDescription Register a new user account. The user needs to provide a firstName, lastName, username email, recoveryEmail, password, DOB, mobileNumber and a role.
 * @apiPermission {string} schema Validation for user's data.
 * @apiPermission {string} checking if new user's email already exists.
 *
 * @apiBody {String} email User's email address.
 * @apiBody {String} password User's password.
 * @apiBody {String} [firstName] User's first name.
 * @apiBody {String} [lastName] User's last name.
 * @apiBody {String} [username] User's username.
 * @apiBody {Date} [DOB] User's date of birth.
 * @apiBody {String} [mobileNumber] User's mobile number.
 * @apiBody {String} [recoveryEmail] User's recovery email address.
 * @apiBody {String} [role] User's role ['User','company HR'].
 *
 * @apiSuccess {String} message Success message indicating that the user was registered successfully.
 * @apiSuccess {Object} user The newly created user account data.
 */
const signUp = catchError(async (req, res) => {
  let user = new User(req.body);

  await user.save();
  let token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET
  );
  res.status(201).json({ message: "Success", token });
});

/**
 * @api {post} /users/signIn User Sign-In
 * @apiDescription Log in to an existing user account. The user needs to provide an email and password. A JWT token will be issued for authentication.
 * @apiPermission schema Validation for sign in input.
 *
 * @apiBody {String} email User's email address.
 * @apiBody {String} [recoveryEmail] User's recovery email address.
 * @apiBody {String} password User's password.
 *
 * @apiSuccess {String} message Success message indicating that the user was logged in successfully.
 * @apiSuccess {Object} user The user account data.
 * @apiSuccess {String} token JWT token for authentication.
 *
 * @apiError {String} message Error message indicating what went wrong.
 * @apiError {Number} statusCode HTTP status code corresponding to the error.
 */
const signIn = catchError(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.status(201).json({ message: "Success", token });
  }
  next(new AppError("Incorrect Email or Password.", 401));
});

/**
 * @api {patch} /users/updatePass Update User Password
 * @apiDescription Update the user's password. The user must provide their current password and a new password. The request must include a token for authentication.
 * @apiPermission User
 * @apiHeader {String} Authorization token for authentication.
 *
 * @apiBody {String} oldPassword Current password.
 * @apiBody {String} newPassword New password to set.
 *
 * @apiSuccess {String} message Success message indicating that the password was updated successfully.
 *
 * @apiError {String} message Error message indicating what went wrong.
 * @apiError {Number} statusCode HTTP status code corresponding to the error.
 */
const changePassword = catchError(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("User Not Found.", 404));
  if (user && bcrypt.compareSync(req.body.oldPassword, user.password)) {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { password: req.body.newPassword, passwordChangedAt: Date.now() }
    );
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.status(201).json({ message: "Success", token });
  }
  next(new AppError("Incorrect Email or Password.", 401));
});

//*authentication
const protectedRoutes = catchError(async (req, res, next) => {
  //check token ?exists or not
  let { token } = req.headers;
  if (!token) next(new AppError("Token Not Provided.", 401));
  let userPayload = null;
  //verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return next(new AppError(err, 404));
    userPayload = payload;
  });
  //check if user exists in the db
  let user = await User.findById(userPayload.userId);
  if (!user) return next(new AppError("User Not Found.", 404));

  //check if user changed password before
  if (user.passwordChangedAt) {
    //check if token is invalid
    let time = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (time > userPayload.iat)
      return next(new AppError("Invalid Token...login in again", 404));
  }

  req.user = user;
  next();
});

//*Authorization
const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    return next(new AppError("Not Authorized for this endpoint", 401));
  });
};
export { signUp, signIn, changePassword, protectedRoutes, allowedTo };
