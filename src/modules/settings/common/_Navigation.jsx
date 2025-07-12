import React from "react";
import { IconDashboard, IconUsers } from "@tabler/icons-react";
import { Button, Flex, Tooltip, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function _Navigation({ module, id }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 30;
	const navigate = useNavigate();

	return (
		<ScrollArea h={height} bg="white" type="never" className="border-radius">
			<Flex direction="column" align="center" gap="md">
				<Flex direction="column" align="center" mt="xs" pt="les">
					<Tooltip
						label={t("Domain")}
						px="md"
						py="es"
						withArrow
						position="left"
						color="white"
						bg="var(--theme-success-color)"
						transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
					>
						<Button
							bg="var(--theme-success-color)"
							size="md"
							px="xs"
							variant="light"
							color="black"
							radius="xl"
							onClick={(e) => {
								navigate("/domain");
							}}
						>
							<Flex direction="column" align="center">
								<IconDashboard size={16} color="white" />
							</Flex>
						</Button>
					</Tooltip>
					<Flex direction="column" align="center" fz="sm" c="black">
						{t("Domain")}
					</Flex>
				</Flex>
				<Flex direction="column" align="center" pt="les">
					<Tooltip
						label={t("DomainMasterUser")}
						px="md"
						py="es"
						withArrow
						position="left"
						color="white"
						bg="var(--theme-warning-color)"
						transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
					>
						<Button
							bg="var(--theme-warning-color)"
							size="md"
							px="xs"
							variant="light"
							color="black"
							radius="xl"
							onClick={(e) => {
								navigate("/domain/user");
							}}
						>
							<Flex direction="column" align="center">
								<IconUsers size={16} color="white" />
							</Flex>
						</Button>
					</Tooltip>
					<Flex direction="column" align="center" fz="sm" c="black">
						{t("MasterUsers")}
					</Flex>
				</Flex>
				<Flex direction="column" align="center" pt="les">
					<Tooltip
						label={t("DomainHead")}
						px="md"
						py="es"
						withArrow
						position="left"
						color="white"
						bg="var(--theme-primary-color-8)"
						transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
					>
						<Button
							bg="var(--theme-primary-color-8)"
							size="md"
							px="xs"
							variant="light"
							color="black"
							radius="xl"
							onClick={(e) => {
								navigate("/domain/head");
							}}
						>
							<Flex direction="column" align="center">
								<IconUsers size={16} color="white" />
							</Flex>
						</Button>
					</Tooltip>
					<Flex direction="column" align="center" fz="sm" c="black">
						{t("Head")}
					</Flex>
				</Flex>

				<Flex direction="column" align="center" pt="les">
					<Tooltip
						label={t("SiteMap")}
						px="md"
						py="es"
						withArrow
						position="left"
						color="white"
						bg="var(--theme-info-color)"
						transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
					>
						<Button
							bg="var(--theme-info-color)"
							size="md"
							px="xs"
							variant="light"
							color="black"
							radius="xl"
							onClick={(e) => {
								navigate("/domain/sitemap");
							}}
						>
							<Flex direction="column" align="center">
								<IconUsers size={16} color="white" />
							</Flex>
						</Button>
					</Tooltip>
					<Flex direction="column" align="center" fz="sm" c="black">
						{t("SiteMap")}
					</Flex>
				</Flex>
			</Flex>
		</ScrollArea>
	);
}
