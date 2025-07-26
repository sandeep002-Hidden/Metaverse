import prisma from "../prisma/prisma.js";
import bcrypt from "bcrypt";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utills/Cloudniry.js";

// Assuming sendEmail exists and has a type definition or can be mocked
declare function sendEmail(email: string, subject: string): Promise<{ success: boolean; otp: string }>;

class AuthService {
  validateEmail(email: string): boolean {
    const emailPattern =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordPattern.test(password);
  }

  validateUserName(username: string): boolean {
    const userNamePattern = /^[a-zA-Z0-9]{4,32}$/;
    return userNamePattern.test(username);
  }

  async registerUser(
    FirstName: string,
    LastName: string,
    Email: string,
    UserName: string,
    Password: string,
    profilePicPath?: string | null
  ): Promise<any> {
    if (!this.validateEmail(Email)) {
      throw new Error("Enter a valid EmailId");
    }
    if (!this.validatePassword(Password)) {
      throw new Error("Enter a valid password");
    }
    if (!this.validateUserName(UserName)) {
      throw new Error("Enter a valid UserName");
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ Email }, { UserName }] },
    });
    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    let profilePictureUrl: string | null = null;
    if (profilePicPath) {
      const uploadedImage = await uploadOnCloudinary(profilePicPath);
      profilePictureUrl = uploadedImage.url;
    }

    try {
      const user = await prisma.user.create({
        data: {
          FirstName,
          LastName,
          Email,
          UserName,
          Password: await bcrypt.hash(Password, 10),
          ProfilePicture: profilePictureUrl,
        },
      });
      return user;
    } catch (error) {
      if (profilePictureUrl) {
        await deleteFromCloudinary(profilePictureUrl);
      }
      throw error;
    }
  }

  async loginUser(cred: string, password: string): Promise<any> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ Email: cred }, { UserName: cred }],
      },
    });
    if (!existingUser) {
      throw new Error("No User Exists with this Email or UserName");
    }

    const isValidUserPassword = await bcrypt.compare(
      password,
      existingUser.Password
    );

    if (!isValidUserPassword) {
      throw new Error("Wrong password");
    }

    return existingUser;
  }

  async logoutUser(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { RefreshToken: "" },
    });
  }

  async forgotPasswordEmail(emailOrUserName: string): Promise<{ success: boolean }> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ Email: emailOrUserName }, { UserName: emailOrUserName }],
      },
    });
    if (!user) {
      throw new Error("User with given credential does not exist");
    }
    const currentDate = new Date(Date.now());
    if (user.Otp && user.OtpExpire && user.OtpExpire > currentDate) {
      throw new Error("email already sent, try again after some time");
    }
    const emailResponse = await sendEmail(user.Email, "Change Password");
    if (!emailResponse.success) {
      throw new Error("Error occurred while sending email");
    }
    const sentOtp = emailResponse.otp;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        Otp: parseInt(sentOtp),
        OtpExpire: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    return { success: true };
  }

  async verifyOtp(emailOrUserName: string, otp: number): Promise<{ success: boolean }> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ Email: emailOrUserName }, { UserName: emailOrUserName }],
      },
    });

    if (!user) {
      throw new Error("User with given credential does not exist");
    }
    if(user.Otp === null || user.Otp === undefined){
        throw new Error("no otp sent ,try again");
    }
    if (user.Otp != otp) {
      throw new Error("Wrong Otp");
    }
    const currentDate = new Date(Date.now());
    if (user.OtpExpire && user.OtpExpire < currentDate) {
      throw new Error("Otp Expired");
    }
    await prisma.user.update({
        where:{id:user.id},
        data:{Otp:null,OtpExpire:null}
    })
    return { success: true };
  }

  async saveNewPassword(emailOrUserName: string, password: string): Promise<{ success: boolean }> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ Email: emailOrUserName }, { UserName: emailOrUserName }],
      },
    });
    if (!user) {
      throw new Error("User with given credential does not exist");
    }
    if (!this.validatePassword(password)) {
      throw new Error("Enter a valid password");
    }
    const comp = await bcrypt.compare(password, user.Password);
    if (comp) {
      throw new Error("new password cannot be same as old Password");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { Password: hashedPassword },
    });
    return { success: true };
  }
}

export default new AuthService();