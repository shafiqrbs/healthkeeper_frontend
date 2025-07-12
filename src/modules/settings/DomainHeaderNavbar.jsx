import React from "react";
import { Group, Menu, rem, ActionIcon, Text, Tooltip, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "@assets/css/HeaderSearch.module.css";
import { IconBuildingStore, IconInfoCircle, IconMap2 } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

function DomainHeaderNavbar({ pageTitle, pageDescription }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	const links = [
		{ link: "/domain", label: t("Domains") },
		{ link: "/domain/user", label: t("DomainMasterUser") },
		{ link: "/domain/head", label: t("DomainHead") },
	];

	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={location.pathname == link.link ? classes.active : classes.link}
			onClick={(event) => {
				event.preventDefault();
				navigate(link.link);
			}}
		>
			{link.label}
		</a>
	));

	const menuItems = [
		{
			label: "Sitemap",
			path: "/domain/sitemap",
			icon: <IconMap2 style={{ width: rem(14), height: rem(14) }} />,
		},
		{
			label: "BranchManagement",
			path: "/domain/branch-management",
			icon: <IconBuildingStore style={{ width: rem(14), height: rem(14) }} />,
		},
	];

	return (
		<>
			<header className={classes.header}>
				<div className={classes.inner}>
					<Group ml="xs">
						<Text>{pageTitle}</Text>
						{pageDescription && (
							<Flex direction="column" align="center">
								<Tooltip
									label={pageDescription}
									px="md"
									py="es"
									w={320}
									withArrow
									multiline
									position="right"
									color="white"
									bg="var(--theme-secondary-color-1)"
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									<IconInfoCircle size={16} color="var(--theme-secondary-color-1)" />
								</Tooltip>
							</Flex>
						)}
					</Group>
					<Group>
						<Group ml={50} gap="les" className={classes.links} visibleFrom="sm" mt="es">
							{items}
						</Group>
						<Menu withArrow arrowPosition="center" trigger="hover" openDelay={100} closeDelay={400} mr="xs">
							<Menu.Target>
								<ActionIcon
									mt="es"
									variant="filled"
									color="var(--theme-error-color)"
									radius="xl"
									aria-label="Settings"
								>
									<IconInfoCircle height="12" width="12" stroke={1.5} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								{menuItems.map((item, index) => (
									<Menu.Item
										key={index}
										component="button"
										onClick={() => navigate(item.path)}
										leftSection={item.icon}
									>
										{t(item.label)}
									</Menu.Item>
								))}
							</Menu.Dropdown>
						</Menu>
					</Group>
				</div>
			</header>
		</>
	);
}

export default DomainHeaderNavbar;
