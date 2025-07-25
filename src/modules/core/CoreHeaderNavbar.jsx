import { Group, Menu, rem, ActionIcon, Text, Flex, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "@assets/css/HeaderSearch.module.css";
import { IconInfoCircle } from "@tabler/icons-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { coreHeaderLinks } from "@/constants/headerLinks";

function CoreHeaderNavbar({ pageTitle, module, pageDescription }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	if (!module) return <Text c="red">CoreHeaderNavbar: No module name is provided</Text>;

	const links = coreHeaderLinks[module].topBarLinks;
	const items = links.map((link, index) => (
		<NavLink key={index} to={link.link} className={location.pathname == link.link ? classes.active : classes.link}>
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
					<Group>
						<Group ml={50} gap={5} className={classes.links} visibleFrom="sm" mt={"2"}>
							{items}
						</Group>
						{coreHeaderLinks[module]?.dropDownLinks?.length > 0 && (
							<Menu
								withArrow
								arrowPosition="center"
								trigger="hover"
								openDelay={100}
								closeDelay={400}
								mr={"8"}
							>
								<Menu.Target>
									<ActionIcon
										mt={"4"}
										variant="filled"
										color="red.5"
										radius="xl"
										aria-label="Settings"
									>
										<IconInfoCircle height={12} width={12} stroke={1.5} />
									</ActionIcon>
								</Menu.Target>
								<Menu.Dropdown>
									{coreHeaderLinks[module]?.dropDownLinks?.map((link, index) => (
										<Menu.Item
											key={index}
											component="button"
											onClick={() => navigate(link.link)}
											leftSection={<link.icon style={{ width: rem(14), height: rem(14) }} />}
										>
											{t(link.label)}
										</Menu.Item>
									))}
								</Menu.Dropdown>
							</Menu>
						)}
					</Group>
				</div>
			</header>
		</>
	);
}

export default CoreHeaderNavbar;
