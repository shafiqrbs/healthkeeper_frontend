import { Grid, Box, Drawer, Text, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSelector } from "react-redux";

export default function __ViewDrawer({ viewDrawer, setViewDrawer, module }) {
	const { t } = useTranslation();
	const height = 500; //TabList height 104
	const entityObject = useSelector((state) => state.crud[module].editData);
	const closeDrawer = () => {
		setViewDrawer(false);
	};

	return (
		<Drawer.Root opened={viewDrawer} position="right" onClose={closeDrawer} offset={16}>
			<Drawer.Overlay />
			<Drawer.Content>
				<Drawer.Header className={"drawer-sticky-header"}>
					<Drawer.Title>
						<Flex align="center" gap={8}>
							<IconArrowLeft size={16} />{" "}
							<Text mt="es" fz={16} fw={500}>
								{t("Particular")}
							</Text>
						</Flex>
					</Drawer.Title>
					<Drawer.CloseButton />
				</Drawer.Header>
				<Box mb={0} h={height}>
					<Box p={"md"} className="borderRadiusAll" h={height}>
						<Box>
							<Grid columns={24}>
								<Grid.Col span={"8"} className="drawer-form-input-label">
									{t("Name")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject && entityObject.name && entityObject.name}
								</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"8"} className="drawer-form-input-label">
									{t("Designation")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject && entityObject.company_name && entityObject.company_name}
								</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"8"} className="drawer-form-input-label">
									{t("Mobile")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject && entityObject.mobile && entityObject.mobile}
								</Grid.Col>
							</Grid>

							<Grid columns={24}>
								<Grid.Col span={"8"} className="drawer-form-input-label">
									{t("Email")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject && entityObject.email && entityObject.email}
								</Grid.Col>
							</Grid>
						</Box>
					</Box>
				</Box>
			</Drawer.Content>
		</Drawer.Root>
	);
}
