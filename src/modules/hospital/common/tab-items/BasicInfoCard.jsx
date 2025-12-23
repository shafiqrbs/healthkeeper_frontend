import { Box, Divider, Flex, Grid, Stack, Switch, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { editEntityData } from "@/app/store/core/crudThunk";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import InputForm from "@components/form-builders/InputForm";
import { IconWeight } from "@tabler/icons-react";
import { useEffect } from "react";

export default function BasicInfoCard({ form, prescriptionData, onBlur }) {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	useEffect(() => {
		form.setFieldValue("is_vital", !!prescriptionData?.data?.is_vital);
	}, [prescriptionData]);

	async function handleVitalChange(event) {
		form.setValues({ is_vital: !!event.currentTarget.checked });
		await dispatch(
			editEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.PATIENT_VITAL}/${
					prescriptionData?.data?.prescription_id || prescriptionData?.data?.id
				}`,
				module: "prescription",
			})
		).unwrap();
	}

	return (
		<Stack gap="3xs" bg="var(--theme-primary-color-1)" p="xs" pb={"3xs"} className="borderRadiusAll">
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
							{t("Age")}:
							<>
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
			<Flex gap="lg" justify="space-between" bg={"white"}>
				<InputForm
					styles={{ root: { width: "180px" } }}
					form={form}
					name="weight"
					size={"xs"}
					placeholder={t("Weight/KG")}
					onBlur={onBlur}
					rightSection={<IconWeight size={16} />}
				/>
				<Switch
					checked={form.values.is_vital}
					onChange={handleVitalChange}
					size="lg"
					radius="xs"
					color="red"
					onLabel="Vital"
					offLabel="Vital"
				/>
			</Flex>
			{form.values.is_vital && (
				<Box bg="var(--mantine-color-white)">
					<Grid w="100%" columns={24} gutter={"2"} pl={"xs"}>
						<Grid.Col span={4}>
							<Text fz="xs">{t("B/P")}</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text fz="xs" pl={"xs"}>
								{prescriptionData?.data?.bp} {/*mm of HG*/}
							</Text>
						</Grid.Col>
						<Grid.Col span={7} fz="xs" align={"right"}>
							<Text fz="xs">{t("Pulse")}</Text>
						</Grid.Col>
						<Grid.Col span={7} fz="xs" pl={"xs"}>
							{prescriptionData?.data?.pulse}
							{/* Beat/Minute*/}
						</Grid.Col>
						<Grid.Col span={4}>
							<Text fz="xs">{t("SatWithO2")}</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text fz="xs" pl={"xs"}>
								{prescriptionData?.data?.sat_with_O2} %
							</Text>
						</Grid.Col>
						<Grid.Col span={7} fz="xs" align={"right"}>
							<Text fz="xs">{t("SatWithoutO2")}</Text>
						</Grid.Col>
						<Grid.Col span={7} fz="xs" pl={"xs"}>
							{prescriptionData?.data?.sat_without_O2} %
						</Grid.Col>
						<Grid.Col span={4}>
							<Text fz="xs">{t("Temperature")}</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text fz="xs" pl={"xs"}>
								{prescriptionData?.data?.temperature} °F
							</Text>
						</Grid.Col>
						<Grid.Col span={7} fz="xs" align={"right"}>
							<Text fz="xs">{t("Respiration")}</Text>
						</Grid.Col>
						<Grid.Col span={7} fz="xs" pl={"xs"}>
							{prescriptionData?.data?.respiration}
							{/* Breath/Minute*/}
						</Grid.Col>
					</Grid>
				</Box>
			)}
		</Stack>
	);
}
