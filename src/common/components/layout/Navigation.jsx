import React, { useMemo } from "react";
import { Button, Flex, Text, Tooltip, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { sideNavigationLinks } from "@/constants/sideNavigationLinks";

export default function Navigation({ module = "base" }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 20;
	const navigate = useNavigate();
	const links = useMemo(() => sideNavigationLinks[module], [module]);
	return (
		<>
			<ScrollArea h={height - 8} bg="white" type="never" className="border-radius">
				<Flex direction="column" px={4} py={13} gap={10}>
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
									size="md"
									px={13}
									variant="light"
									color="black"
									radius="xl"
									onClick={() => navigate(item.path)}
								>
									<Flex align="center">
										<item.icon size={14} color="white" />
									</Flex>
								</Button>
							</Tooltip>
							<Flex direction="column" align="center" c="black" mt={4}>
								<Text
									size="12px"
									c="black"
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
		</>
	);
}
