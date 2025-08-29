import { Grid, Box, Drawer, Text, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconArrowLeft } from "@tabler/icons-react";
import {useSelector} from "react-redux";
import {useOutletContext} from "react-router-dom";

export default function __ViewDrawer({ viewDrawer, setViewDrawer,module }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight; //TabList height 104
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
								{t("ManageBed")}
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
									{t("PaymentMode")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>{entityObject && entityObject?.particular_details && entityObject?.particular_details?.payment_mode?.name}</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"8"} className="drawer-form-input-label">
									{t("PatientMode")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>{entityObject && entityObject?.particular_details && entityObject?.particular_details?.patient_mode?.name}</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"8"} className="drawer-form-input-label">
									{t("GenderMode")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>{entityObject && entityObject?.particular_details && entityObject?.particular_details?.gender_mode?.name}</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"8"} className="drawer-form-input-label">
									{t("RoomNo")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>{entityObject && entityObject?.particular_details && entityObject?.particular_details?.room_no?.name}</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"8"} className="drawer-form-input-label">
									{t("Name")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>{entityObject && entityObject.name && entityObject.name}</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"8"} className="drawer-form-input-label">
									{t("DisplayName")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>{entityObject && entityObject.display_name && entityObject.display_name}</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"8"} className="drawer-form-input-label">
									{t("Price")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject && entityObject?.particular_details && entityObject?.price}
								</Grid.Col>
							</Grid>

						</Box>
					</Box>
				</Box>
			</Drawer.Content>
		</Drawer.Root>
	);
}
