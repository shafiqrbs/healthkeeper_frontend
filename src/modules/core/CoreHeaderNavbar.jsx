import { Group, Text, Flex, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "@assets/css/HeaderSearch.module.css";
import { IconInfoCircle } from "@tabler/icons-react";
import { NavLink, useLocation } from "react-router-dom";
import { coreHeaderLinks } from "@/constants/headerLinks";

function CoreHeaderNavbar({ pageTitle, module, pageDescription }) {
	const { t } = useTranslation();
	const location = useLocation();

	if (!module) return <Text c="red">CoreHeaderNavbar: No module name is provided</Text>;

	const links = coreHeaderLinks[module].topBarLinks;
	console.log(module);
	const items = links.map((link, index) => (
		<NavLink key={index} to={link.link} className={location.pathname === link.link ? classes.active : classes.link}>
			{t(link.label)}
		</NavLink>
	));
	return (
		<>
			<header className={classes.header}>
				<div className={classes.inner}>
					<Group ml={10}>
						<Text>{pageTitle}</Text>
						{pageDescription && (
							<Flex mt={"4"}>
								<Tooltip
									label={pageDescription}
									px={16}
									py={2}
									w={320}
									withArrow
									multiline
									position="right"
									c="white"
									bg="gray.6"
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									<IconInfoCircle size={18} color="gray" />
								</Tooltip>
							</Flex>
						)}
					</Group>
				</div>
			</header>
		</>
	);
}

export default CoreHeaderNavbar;
