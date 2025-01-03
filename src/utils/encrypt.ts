import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";

const secret_key: string = JWT_SECRET || "";

export const GenerateSalt = async (): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return salt;
};

export const generatePassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
  return hashedPassword;
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string
): Promise<boolean> => {
  const isPasswordValid = await bcrypt.compare(enteredPassword, savedPassword);
  return isPasswordValid;
};

export const generateSignature = async (
  payload: any
): Promise<string | Error> => {
  try {
    const token = await jwt.sign(payload, secret_key, { expiresIn: "10d" });
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const validateSignature = async (token: string): Promise<any> => {
  try {
    const splitToken: string = token.split(" ")[1];
    const data = jwt.verify(splitToken, secret_key);
    return data;
  } catch (error) {
    throw error;
  }
};

export const generateRandomPassword = async (
  length: number
): Promise<string> => {
  try {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  } catch (error) {
    throw error;
  }
};

export const generateAndHashPassword = async (
  length = 12
): Promise<{ generatedPassword: string; hashedPassword: string }> => {
  const generatedPassword = await generateRandomPassword(length);
  const hashedPassword = await generatePassword(generatedPassword);

  return { generatedPassword, hashedPassword };
};
