import { Box, Divider, Flex, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import Vitals from "@modules/hospital/common/tab-items/Vitals";

export default function BasicInfoCard({ form, prescriptionData }) {
	const { t } = useTranslation();

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
