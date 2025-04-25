"use client";
import { User } from "@/types/User";
import { DEFAULT_USERS } from "@/utils/default-users";
import { create } from "zustand";

// Create ztore props
interface UserStore {
  user: User | null;
  users: User[];
  userLoading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setInitialState: () => void;
}

// Create a store to consume that
export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  users: [],
  userLoading: true,
  login: (email: string, password: string) => {
    // get() just gets the current state of the store
    const foundUser = get().users.find(
      (u: User) => u.email === email && u.password === password
    );

    if (foundUser) {
      set({ user: foundUser });
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem("currentUser");
    // Update thw state using previous state value
    /**Remember by default ({name: "Chakit"}) returns {name: "Chakit"} as we know!
     * The below statement is same set((state) => {
     * return {
     *        ...state,
     *        user: null
     *        }
     * });
     */

    set((state) => ({ ...state, user: null }));

    // Direct state update
    /**
     * Similariily here is is same as
     * set((state) => {
     * return {
     *      user: null
     * }})
     */
    set({ user: null });
  },
  setInitialState: () => {
    console.log("userLoading in setInitialState", get().userLoading);
    // Get the stored users in local storage
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
      set((state) => ({ ...state, users: DEFAULT_USERS }));
    } else {
      console.log("storedUsers", storedUsers);
      set((state) => ({ ...state, users: JSON.parse(storedUsers) }));
    }

    // Get the current users
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      console.log("storedUser", storedUser);
      set((state) => ({ ...state, user: JSON.parse(storedUser) }));
    }

    // Set the loading to false
    set((state) => ({ ...state, userLoading: false }));

    console.log("end of setInitialState");
  },
}));
