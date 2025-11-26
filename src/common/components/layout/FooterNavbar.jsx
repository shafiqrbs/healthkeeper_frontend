import { Group, Flex, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "@assets/css/FooterNavbar.module.css";
import { useNavigate } from "react-router-dom";
import useConfigData from "@hooks/config-data/useConfigData";
import { useHotkeys } from "@mantine/hooks";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useState, useEffect } from "react";

function FooterNavbar() {
	const { configData } = useConfigData();
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

	// HOTKEYS
	useHotkeys([
		["alt+/", () => navigate("/")],
		["alt+t", () => navigate("/sitemap")],
		["alt+g", () => navigate(`/settings/hospital-config/${configData?.domain?.id}`)],
		["alt+c", () => navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.CUSTOMER.INDEX)],

		// ZOOM SHORTCUTS
		// ["ctrl+=", increaseZoom],
		// ["ctrl++", increaseZoom],
		// ["ctrl+-", decreaseZoom],
		// ["ctrl+0", resetZoom],
	]);

	// NAV LINKS
	const links = [
		{ link: "/sitemap", label: `${t("Sitemap")} (alt+t)` },
		{ link: `/configuration`, label: `${t("Configuration")} (alt+g)` },
		{ link: `/settings/hospital-config/${configData?.domain?.id}`, label: `${t("Settings")} (alt+g)` },
	];

	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			onClick={(event) => {
				event.preventDefault();
				navigate(link.link);
			}}
		>
			{link.label}
		</a>
	));

	const leftItems = [
		<a
			key="home"
			href="/"
			className={classes.link}
			onClick={(e) => {
				e.preventDefault();
				navigate("/");
			}}
		>
			{`${t("Home")} (alt+/)`}
		</a>,
	];

	return (
		<footer className={classes.footer}>
			<div className={classes.inner}>
				{/* LEFT SIDE */}
				<Group gap={5} className={classes.links} visibleFrom="sm">
					<Flex gap="md">{leftItems}</Flex>
				</Group>

				{/* RIGHT SIDE */}
				<Group>
					<Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
						<Flex gap="md">{items}</Flex>
					</Group>

					{/* ZOOM BUTTONS */}
					{/* <Group>
						<Button
							size="xs"
							variant="light"
							onClick={() => (window.parent.document.body.style.zoom = 0.5)}
						>
							-
						</Button>
						<Button size="xs" variant="light" onClick={(window.parent.document.body.style.zoom = 1)}>
							{Math.round(zoom * 100)}%
						</Button>
						<Button size="xs" variant="light" onClick={(window.parent.document.body.style.zoom = 1.5)}>
							+
						</Button>
					</Group> */}
				</Group>
			</div>
		</footer>
	);
}

export default FooterNavbar;
