import { useMemo, useState } from "react";
import { Button, Flex, Text, Tooltip, ScrollArea, Grid, Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { sideNavigationLinks } from "@/constants/sideNavigationLinks";
import classes from "@assets/css/FeaturesCards.module.css";
import { getUserRole } from "@/common/utils";

export default function Navigation({ menu = "base", subMenu = "", mainAreaHeight }) {
	const [activeTab, setActiveTab] = useState("Hospital");
	const userRole = getUserRole();
	const { t } = useTranslation();
	const navigate = useNavigate();

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
					<ScrollArea miw={68} h={mainAreaHeight-28} bg="white" type="never" className="border-radius">
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
										<Button
											bg={item.color}
											h={46}
											w={46}
											px={8}
											radius="xl"
											variant="light"
											color="black"
											onClick={() => navigate(item.path)}
										>
											<Flex align="center">
												<item.icon size={22} color="white" />
											</Flex>
										</Button>
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
						<ScrollArea h={mainAreaHeight} bg="white" type="never" className="border-radius">
							<Box mt={"xs"}>
								{subLinks.map((item, index) => (
									<Box
										key={index}
										style={{
											borderRadius: 4,
											cursor: "pointer",
										}}
										className={`${classes["pressable-card"]} border-radius`}
										mih={40}
										m={"xxxs"}
										mt="es"
										variant="default"
										onClick={() => navigate(item.path)}
										bg={activeTab === item ? "#f8eedf" : "gray.1"}
									>
										<Text size="sm" pt="xxxs" pl="xxxs" fw={500} c="black">
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
