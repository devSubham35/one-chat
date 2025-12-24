import { nanoid } from "nanoid";

const animals = ["monkey", "frog", "fox", "wolf", "panda"];

/// generate random id based on animals array
export const generateUserId = () => {
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const uniquePart = nanoid(20);
  return `${randomAnimal}_${uniquePart}`;
};

/// Get the user id from local storage
export const getUserId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user_id") ?? "";
  }
  return "";
};

/// Set the user id to local storage
export const persistUserId = () => {
  if (typeof window !== "undefined") {

    const existing = localStorage.getItem("user_id");

    if (!existing) {
      const newId = generateUserId();
      localStorage.setItem("user_id", newId);
      return newId;
    }

    return existing;
  }

  return "";
};

/// format chatroom time duration
export const formatTimeRemaining = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};
