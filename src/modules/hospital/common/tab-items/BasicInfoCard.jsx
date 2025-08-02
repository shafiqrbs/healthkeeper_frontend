import { Flex, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function BasicInfoCard({ patientData }) {
	const { t } = useTranslation();
	return (
		<Stack gap="xxxs" bg="var(--theme-primary-color-1)" p="xs" className="borderRadiusAll">
			<Flex justify="space-between">
				<Text fw={600}>{patientData.name}</Text>
				<Text fz="sm">{patientData.date}</Text>
			</Flex>
			<Flex justify="space-between">
				<Text fz="xs">
					Patient ID: <b>{patientData.patientId || "N/A"}</b>
				</Text>
				<Text fz="xs">
					{t("age")}: <b>{patientData.age}</b> - {t("gender")}: <b>{patientData.gender || "Male"}</b>
				</Text>
			</Flex>
		</Stack>
	);
}
