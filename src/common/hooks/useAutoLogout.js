import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {useNavigate} from "react-router-dom";

export default function useAutoLogout() {
    const navigate = useNavigate()
    const { tokenExp, clearUser } = useAuthStore();

    useEffect(() => {
        if (!tokenExp) return;

        const now = Math.floor(Date.now() / 1000);

        if (tokenExp < now) {
            // Token already expired
            clearUser();
            localStorage.clear();
            navigate("/login")
            return;
        }

        // Calculate remaining time
        const msRemaining = (tokenExp - now) * 1000;

        const timer = setTimeout(() => {
            clearUser();
            localStorage.clear();
            navigate("/login")

        }, msRemaining);

        return () => clearTimeout(timer);
    }, [tokenExp, clearUser]);
}
