// src/store/useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { encryptData, decryptData } from "../utils/crypto";

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            warehouse: null,
            hospitalConfig: null,
            roles: null,

            setUserData: (data) =>
                set({
                    user: data,
                    warehouse: data.user_warehouse,
                    hospitalConfig: data.hospital_config,
                    roles: {
                        access_control_role: data.access_control_role,
                        android_control_role: data.android_control_role,
                    },
                }),

            clearUser: () =>
                set({
                    user: null,
                    warehouse: null,
                    hospitalConfig: null,
                    roles: null,
                }),
        }),
        {
            name: "auth-storage",
            storage: {
                getItem: (name) => {
                    const item = localStorage.getItem(name);
                    return item ? decryptData(item) : null;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, encryptData(value));
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);