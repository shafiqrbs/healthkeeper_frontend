import { Group, Flex, Button,Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "@assets/css/FooterNavbar.module.css";
import { useNavigate } from "react-router-dom";

import { useHotkeys } from "@mantine/hooks";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useState, useEffect } from "react";

function FooterNavbar() {

	const { t } = useTranslation();
	const navigate = useNavigate();

	// LOCAL ZOOM STATE
	const [zoom, setZoom] = useState(1);

	// APPLY REAL ZOOM (correct way)
	// useEffect(() => {
	// 	const root = window.parent.document.body;
	// 	if (root) {
	// 		root.style.zoom = zoom;
	// 	}
	// }, [zoom]);

	// const increaseZoom = () => setZoom((z) => Math.min(z + 0.1, 2));
	// const decreaseZoom = () => setZoom((z) => Math.max(z - 0.1, 0.5));
	// const resetZoom = () => setZoom(1);






	return (
		<footer className={classes.footer}>
			<Box className={classes.inner} pt={'xs'}>
				২৫০ শয্যা বিশিষ্ট টিবি হাসপাতাল
			</Box>
		</footer>
	);
}

export default FooterNavbar;
