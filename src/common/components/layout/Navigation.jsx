import React, { useMemo } from "react";
import { Button, Flex, Text, Tooltip, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { sideNavigationLinks } from "@/constants/sideNavigationLinks";

export default function Navigation({ module = "base", mainAreaHeight }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const links = useMemo(() => sideNavigationLinks[module], [module]);

	return (
		<ScrollArea miw={68} h={mainAreaHeight} bg="white" type="never" className="border-radius">
			<Flex direction="column" px={4} py={13} gap={14}>
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
								c="var(--theme-secondary-color-6)"
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
	);
}
