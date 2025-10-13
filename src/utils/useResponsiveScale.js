import { useEffect } from "react";

export function useResponsiveScale() {
    useEffect(() => {
        const updateScale = () => {
            const width = window.innerWidth;
            let scale = 1;

            if (width <= 1280) scale = 0.75; // smaller screens
            else if (width >= 1280 && width < 1600) scale = 0.9; // normal
            else if (width >= 1600 && width < 1920) scale = 1; // large monitor
            else if (width >= 1920) scale = 1.2; // very large monitor

            document.documentElement.style.setProperty("--mantine-scale", scale);
        };

        updateScale(); // run on mount
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);
}
