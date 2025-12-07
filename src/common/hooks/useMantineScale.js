import { useState, useEffect } from "react";

export function useMantineScale() {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const getScale = () => {
            const root = getComputedStyle(document.documentElement);
            const val = parseFloat(root.getPropertyValue("--mantine-scale")) || 1;
            setScale(val);
        };

        getScale();
        window.addEventListener("resize", getScale);
        return () => window.removeEventListener("resize", getScale);
    }, []);

    return scale;
}
