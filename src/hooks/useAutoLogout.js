import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { jwtDecode } from "jwt-decode";

export default function useAutoLogout() {
    const { tokenExp, clearUser } = useAuthStore();

    useEffect(() => {
        if (!tokenExp) return;

        const now = Math.floor(Date.now() / 1000);

        if (tokenExp < now) {
            // Token already expired
            clearUser();
            localStorage.clear();
            window.location.href = "/login";
            return;
        }

        // Calculate remaining time
        const msRemaining = (tokenExp - now) * 1000;

        const timer = setTimeout(() => {
            clearUser();
            localStorage.clear();
            window.location.href = "/login";
        }, msRemaining);

        return () => clearTimeout(timer);
    }, [tokenExp, clearUser]);
}
