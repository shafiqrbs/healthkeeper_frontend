import { Grid, Box, Drawer, Text, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconArrowLeft } from "@tabler/icons-react";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

function __VendorViewDrawer({ viewDrawer, setViewDrawer, vendorObject }) {
	const { mainAreaHeight } = useMainAreaHeight();
	const { t } = useTranslation();
	const height = mainAreaHeight; //TabList height 104
	const closeDrawer = () => {
		setViewDrawer(false);
	};
	let showData = {};
	if (vendorObject) {
		showData = vendorObject;
	}

	return (
		<Drawer.Root opened={viewDrawer} position="right" onClose={closeDrawer} offset={16}>
			<Drawer.Overlay />
			<Drawer.Content>
				<Drawer.Header className={"drawer-sticky-header"}>
					<Drawer.Title>
						<Flex align="center" gap={8}>
							<IconArrowLeft size={16} />{" "}
							<Text mt="es" fz={16} fw={500}>
								{t("VendorDetailsData")}
							</Text>
						</Flex>
					</Drawer.Title>
					<Drawer.CloseButton />
				</Drawer.Header>
				<Box mb={0} h={height}>
					<Box p="xl" h={height}>
						<Box>
							<Grid columns={24}>
								<Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
									{t("CompanyName")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{showData && showData.company_name && showData.company_name}
								</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
									{t("Name")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>{showData && showData.name && showData.name}</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
									{t("Mobile")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>{showData && showData.mobile && showData.mobile}</Grid.Col>
							</Grid>

							<Grid columns={24}>
								<Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
									{t("Email")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>{showData && showData.email && showData.email}</Grid.Col>
							</Grid>

							<Grid columns={24}>
								<Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
									{t("Address")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>{showData && showData.address && showData.address}</Grid.Col>
							</Grid>
						</Box>
					</Box>
				</Box>
			</Drawer.Content>
		</Drawer.Root>
	);
}

export default __VendorViewDrawer;
