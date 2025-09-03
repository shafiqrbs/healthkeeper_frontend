import { Box, Divider, Flex, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import Vitals from "@modules/hospital/common/tab-items/Vitals";
import { useParams } from "react-router-dom";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";

export default function BasicInfoCard({ form }) {
	const { t } = useTranslation();
	const { prescriptionId } = useParams();

	const { data: prescriptionData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${prescriptionId}`,
	});

	return (
		<Stack gap="xxxs" bg="var(--theme-primary-color-1)" p="xs" className="borderRadiusAll">
			<Flex justify="space-between">
				<Text fw={600}>{prescriptionData?.data?.name || "N/A"}</Text>
				<Text fz="sm">{prescriptionData?.data?.appointment || "N/A"}</Text>
			</Flex>
			<Flex justify="space-between">
				<Text fz="xs">
					Patient ID: <b>{prescriptionData?.data?.customer_id || "N/A"}</b>
				</Text>
				<Text fz="xs">
					{t("age")}:{" "}
					<b>
						{prescriptionData?.data?.year}Y, {prescriptionData?.data?.month || 0}M,{" "}
						{prescriptionData?.data?.day || 0}D
					</b>{" "}
					- {t("gender")}: <b>{prescriptionData?.data?.gender || "N/A"}</b>
				</Text>
			</Flex>
			<Divider />
			<Box bg="white">
				<Vitals form={form} />
			</Box>
		</Stack>
	);
}
