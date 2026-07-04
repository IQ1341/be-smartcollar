import AppError from "../../core/exceptions/AppError.js";

import {
  findUserById,
  createUser,
  updateUser,
} from "./auth.repository.js";

export const syncUser = async (firebaseUser, body) => {
  const now = Date.now();

  const existingUser = await findUserById(firebaseUser.uid);

  if (!existingUser) {
    const user = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: body.name,
      phone: body.phone,
      farmName: body.farmName,
      address: body.address,
      photoUrl: body.photoUrl || "",
      role: "farmer",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    return await createUser(firebaseUser.uid, user);
  }

  return await updateUser(firebaseUser.uid, {
    name: body.name,
    phone: body.phone,
    farmName: body.farmName,
    address: body.address,
    photoUrl: body.photoUrl || "",
    updatedAt: now,
  });
};

export const getProfile = async (uid) => {
  const user = await findUserById(uid);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};