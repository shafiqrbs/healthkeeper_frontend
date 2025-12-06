import { create } from "zustand";
import { persist } from "zustand/middleware";
import _set from "lodash.set";
import { encryptData, decryptData } from "../common/utils/crypto";

export const useAuthStore = create(
	persist(
		(set) => ({
			token: null,
			user: null,
            tokenExp: null,
			warehouse: null,
			hospitalConfig: null,
			roles: null,

			setUserData: (data) =>
				set({
					token: data.token,
					user: data.decoded,
                    tokenExp: data.decoded.exp,    // store token expiry
                    warehouse: data.user_warehouse,
					hospitalConfig: data.hospital_config,
					roles: {
						access_control_role: data.access_control_role,
						android_control_role: data.android_control_role,
					},
				}),
			// Generic updater for top-level fields
			updateState: (key, value) =>
				set((state) => ({
					[key]:
						typeof state[key] === "object" && state[key] !== null
							? { ...state[key], ...value }
							: value,
				})),

			// Nested updater helper
			updateNestedState: (path, value) => {
				const state = useAuthStore.getState();
				const newState = { ...state };
				_set(newState, path, value);
				useAuthStore.setState(newState);
			},

			clearUser: () =>
				set({
					token: null,
					user: null,
                    tokenExp: null,
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
