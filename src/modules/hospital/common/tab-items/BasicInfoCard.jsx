import { Box, Divider, Flex, Grid, Stack, Text, ThemeIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import Vitals from "@hospital-components/tab-items/Vitals";
import { IconSofa } from "@tabler/icons-react";
export default function BasicInfoCard({ form, prescriptionData, onBlur }) {
	const { t } = useTranslation();
	console.log(prescriptionData);
	return (
		<Stack gap="xxxs" bg="var(--theme-primary-color-1)" p="xs" pb={"xxxs"} className="borderRadiusAll">
			<Stack gap={0} ta="left">
				<Grid w="100%" columns={24}>
					<Grid.Col span={8} fz="xs">
						{prescriptionData?.data?.invoice || "N/A"}
					</Grid.Col>
					<Grid.Col span={8} fz="xs" align={"right"}>
						{prescriptionData?.data?.patient_id || "N/A"}
					</Grid.Col>
					<Grid.Col span={8} fz="xs">
						{t("HID")} {prescriptionData?.data?.health_id || ""}
					</Grid.Col>
				</Grid>
				<Grid w="100%" columns={24}>
					<Grid.Col span={12}>
						<Text fw={600}>{prescriptionData?.data?.name}</Text>
					</Grid.Col>
					<Grid.Col span={4} fz="xs" align={"right"}>
						{prescriptionData?.data?.gender}
					</Grid.Col>
					<Grid.Col span={8}>
						<Text fz="xs">
							{t("Age")}:<>
							{(prescriptionData?.data?.day || 0) > 0 && `${prescriptionData.data.day}d `}
							{(prescriptionData?.data?.month || 0) > 0 && `${prescriptionData.data.month}m `}
							{(prescriptionData?.data?.year || 0) > 0 && `${prescriptionData.data.year}y`}
						</>
						</Text>
					</Grid.Col>
				</Grid>
				<Grid w="100%" columns={24}>
					<Grid.Col span={12}>
						<Text fz="xs">
							{t("Created")} {prescriptionData?.data?.created}
						</Text>
					</Grid.Col>
					<Grid.Col span={4} fz="xs" align={"right"}>
						{prescriptionData?.data?.payment_mode_name}
					</Grid.Col>
					<Grid.Col span={6} fz="xs">
						{prescriptionData?.data?.room_name}
					</Grid.Col>
				</Grid>
			</Stack>
			<Divider />
			<Box bg="white">
				<Grid w="100%" columns={24} gutter={'2'} pl={'xs'}>
					<Grid.Col span={4}>
						<Text fz="xs">
							{t("B/P")}
						</Text>
					</Grid.Col>
					<Grid.Col span={6}>
						<Text fz="xs" pl={'xs'}>
							{prescriptionData?.data?.bp} {/*mm of HG*/}
						</Text>
					</Grid.Col>
					<Grid.Col span={7} fz="xs" align={"right"}>
						<Text fz="xs">
							{t("Pulse")}
						</Text>
					</Grid.Col>
					<Grid.Col span={7} fz="xs" pl={'xs'}>
						{prescriptionData?.data?.pulse}{/* Beat/Minute*/}
					</Grid.Col>
					<Grid.Col span={4}>
						<Text fz="xs">
							{t("SatWithO2")}
						</Text>
					</Grid.Col>
					<Grid.Col span={6}>
						<Text fz="xs" pl={'xs'}>
							{prescriptionData?.data?.sat_with_O2} %
						</Text>
					</Grid.Col>
					<Grid.Col span={7} fz="xs" align={"right"}>
						<Text fz="xs">
							{t("SatWithoutO2")}
						</Text>
					</Grid.Col>
					<Grid.Col span={7} fz="xs" pl={'xs'}>
						{prescriptionData?.data?.sat_without_O2} %
					</Grid.Col>
					<Grid.Col span={4}>
						<Text fz="xs">
							{t("Temperature")}
						</Text>
					</Grid.Col>
					<Grid.Col span={6}>
						<Text fz="xs" pl={'xs'}>
							{prescriptionData?.data?.temperature} °F
						</Text>
					</Grid.Col>
					<Grid.Col span={7} fz="xs" align={"right"}>
						<Text fz="xs">
							{t("Respiration")}
						</Text>
					</Grid.Col>
					<Grid.Col span={7} fz="xs" pl={'xs'}>
						{prescriptionData?.data?.respiration}{/* Breath/Minute*/}
					</Grid.Col>
				</Grid>
				{/*<Vitals form={form} onBlur={onBlur} />*/}
			</Box>
		</Stack>
	);
}
