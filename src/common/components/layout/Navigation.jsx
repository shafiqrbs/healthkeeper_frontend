import { useMemo } from "react";
import { Button, Flex, Text, Tooltip, ScrollArea, Grid, Box, Menu } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { sideNavigationLinks } from "@/constants/sideNavigationLinks";
import classes from "@assets/css/Navigation.module.css";
import { getUserRole } from "@/common/utils";

export default function Navigation({ menu = "base", subMenu = "", mainAreaHeight }) {
	const userRole = getUserRole();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	const links = useMemo(() => {
		const menuLinks = sideNavigationLinks[menu] || [];
		return menuLinks.filter(
			(link) => link.allowedRoles && link.allowedRoles.some((role) => userRole.includes(role))
		);
	}, [menu, userRole]);

	const subLinks = useMemo(() => {
		const subMenuLinks = sideNavigationLinks[subMenu] || [];
		return subMenuLinks.filter(
			(link) => link.allowedRoles && link.allowedRoles.some((role) => userRole.includes(role))
		);
	}, [subMenu, userRole]);

	return (
		<Box>
			<Grid columns={12} gutter={{ base: 8 }}>
				<Grid.Col span={3}>
					<ScrollArea miw={68} h={mainAreaHeight} bg="white" type="never" className="border-radius">
						<Flex w={68} direction="column" px={4} py={13} gap={14}>
							{links.map((item, index) => (
								<Flex key={index} direction="column" align="center">
									<Tooltip
										label={t(item.label)}
										px={16}
										py={2}
										withArrow
										position="left"
										c="white"
										bg={item.color}
										transitionProps={{
											transition: "pop-bottom-left",
											duration: 500,
										}}
									>
										<Menu
											shadow="md"
											offset={10}
											width={200}
											position="right"
											trigger="hover"
											withArrow
										>
											<Menu.Target>
												<Button
													bg={item.color}
													h={46}
													w={46}
													px={8}
													radius="xl"
													variant="light"
													color="black"
													onClick={() => {
														item.subMenu ? null : navigate(item.path);
													}}
													onAuxClick={() => {
														item.subMenu ? null : window.open(item.path, "_blank");
													}}
												>
													<Flex align="center">
														<item.icon size={22} color="white" />
													</Flex>
												</Button>
											</Menu.Target>
											{item.subMenu && (
												<Menu.Dropdown
													styles={{
														dropdown: { border: "1px solid var(--theme-primary-color-1)" },
													}}
												>
													{item.subMenu.map((subItem, index) => (
														<Menu.Item
															key={index}
															onClick={() => navigate(subItem.path)}
															leftSection={<subItem.icon size={14} />}
														>
															{t(subItem.label)}
														</Menu.Item>
													))}
												</Menu.Dropdown>
											)}
										</Menu>
									</Tooltip>
									<Flex direction="column" align="center" className="mt-4">
										<Text
											size="11px"
											fw={500}
											c="var(--theme-tertiary-color-6)"
											ta="center"
											style={{
												wordBreak: "break-word",
												hyphens: "auto",
											}}
										>
											{t(item.label)}
										</Text>
									</Flex>
								</Flex>
							))}
						</Flex>
					</ScrollArea>
				</Grid.Col>
				{subLinks?.length > 0 && (
					<Grid.Col span={9}>
						<ScrollArea h={mainAreaHeight - 28} bg="white" type="never" className="border-radius">
							<Box>
								<Box pl="xxxs" py="xxxs" mb={"xxxs"} bg="var(--theme-primary-color-1)">
									{t("AdminMenu")}
								</Box>
								{subLinks.map((item, index) => (
									<Box
										key={index}
										className={`cursor-pointer ${classes["pressable-card"]}  ${
											location.pathname === item.path ? classes["active-link"] : ""
										}`}
										variant="default"
										onClick={() => navigate(item.path)}
										bg={location.pathname === item.path ? "gray.1" : "#ffffff"}
									>
										<Text
											size="xs"
											py="xxxs"
											pl="xxxs"
											fw={500}
											c={
												location.pathname === item.path
													? "var(--theme-primary-color-8)"
													: "black"
											}
										>
											{t(item.label)}
										</Text>
									</Box>
								))}
							</Box>
						</ScrollArea>
					</Grid.Col>
				)}
			</Grid>
		</Box>
	);
}
