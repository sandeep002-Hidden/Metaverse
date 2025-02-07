import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utills/Cloudniry.js";

let profilePicturePath;
function validateEmail(email) {
  const emailPattern =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  return emailPattern.test(email);
}
function validatePassword(password) {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  return passwordPattern.test(password);
}
function validateUserName(username) {
  const userNamePattern = /^[a-zA-Z0-9]{4,12}$/;
  return userNamePattern.test(username);
}
export default async function registerUser(req, res) {
  try {
    const { FirstName, LastName, Email, UserName, Password } = req.body;
    if (!FirstName || !LastName || !Email || !UserName || !Password) {
      return res
        .status(400)
        .json({ message: "All the fields are required", success: false });
    }
    const isValidEmail = validateEmail(Email);
    if (!isValidEmail) {
      return res
        .status(401)
        .json({ message: "Enter a valid EmailId", success: false });
    }
    const isValidPassword = validatePassword(Password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: "Enter a valid password", success: false });
    }
    const isValidUsername = validateUserName(UserName);
    if (!isValidUsername) {
      return res
        .status(401)
        .json({ message: "Enter a valid UserName", success: false });
    }
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ Email }, { UserName }] },
    });
    if (existingUser) {
      return res.status(400).json({
        error: "Email or username already exists",
        success: false,
      });
    }
    const profilePic = req.file?.path;
    console.log(profilePic)
    if (profilePic) {
      profilePicturePath = await uploadOnCloudinary(profilePic);
      console.log(profilePicturePath)
    }
    const user = await prisma.user.create({
      data: {
        FirstName,
        LastName,
        Email,
        UserName,
        Password: await bcrypt.hash(Password, 10),
        ProfilePicture: profilePicturePath.url,
      },
    });

    res.status(201).json({
      message: "Registration successful",
      success: true,
      user: { id:user.id},
    });
  } catch (error) {
    if (profilePicturePath) {
      await deleteFromCloudinary(profilePicturePath?.url);
    }
    res.status(500).json({
      error: "Registration failed",
      message: error.message,
      success: false,
    });
  }
}
