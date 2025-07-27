import { Group, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "@assets/css/FooterNavbar.module.css";
import { useNavigate } from "react-router-dom";
import useConfigData from "@hooks/config-data/useConfigData";
import { useHotkeys } from "@mantine/hooks";
import { HOSPITAL_DATA_ROUTES } from "@/constants/appRoutes";

function FooterNavbar() {
	const { configData } = useConfigData();
	const { t } = useTranslation();
	const navigate = useNavigate();

	useHotkeys([
		["alt+/", () => navigate("/")],
		["alt+t", () => navigate("/sitemap")],
		["alt+s", () => navigate(`/settings/hospital-config/${configData?.domain?.id}`)],
		["alt+c", () => navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.CUSTOMER.INDEX)],
	]);

	const links = [
		{ link: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.CUSTOMER.INDEX, label: `${t("Customer")} (alt+c)` },
		{ link: "/sitemap", label: `${t("Sitemap")} (alt+t)` },
		{ link: `/inventory/config`, label: `${t("Configuration")} (alt+g)` },
		{ link: `/settings/hospital-config/${configData?.domain?.id}`, label: `${t("Settings")} (alt+s)` },
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

	const leftLinks = [{ link: "/", label: `${t("Home")} (alt+/)` }];

	const leftItems = leftLinks.map((link) => (
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

	return (
		<>
			<footer className={classes.footer}>
				<div className={classes.inner}>
					<Group gap={5} className={classes.links} visibleFrom="sm">
						<Flex gap="md" mih={42} justify="flex-start" align="center" direction="row" wrap="wrap">
							{leftItems}
						</Flex>
					</Group>
					<Group>
						<Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
							<Flex gap="md" mih={42} justify="flex-start" align="center" direction="row" wrap="wrap">
								{items}
							</Flex>
						</Group>
					</Group>
				</div>
			</footer>
		</>
	);
}
export default FooterNavbar;
