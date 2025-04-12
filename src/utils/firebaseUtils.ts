// src/utils/firebaseUtils.ts
import { getAuth, signOut } from "firebase/auth";

export const logoutUser = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error);
  }
};