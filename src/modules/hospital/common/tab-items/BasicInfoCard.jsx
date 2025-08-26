import { Box, Divider, Flex, Group, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import InputForm from "@components/form-builders/InputForm";
import SelectForm from "@components/form-builders/SelectForm";
import Vitals from "@modules/hospital/common/tab-items/Vitals";
import { useState } from "react";
import { useForm } from "@mantine/form";

export default function BasicInfoCard({ patientData, form }) {
	const { t } = useTranslation();

	const [vitals, setVitals] = useState({
		bp: "120/80",
		sugar: "",
		weight: "",
		bloodGroup: "O+",
	});
	return (
		<Stack gap="xxxs" bg="var(--theme-primary-color-1)" p="xs" className="borderRadiusAll">
			<Flex justify="space-between">
				<Text fw={600}>{patientData.name || "N/A"}</Text>
				<Text fz="sm">{patientData.appointment || "N/A"}</Text>
			</Flex>
			<Flex justify="space-between">
				<Text fz="xs">
					Patient ID: <b>{patientData.id || "N/A"}</b>
				</Text>
				<Text fz="xs">
					{t("age")}: <b>{patientData.age}</b> - {t("gender")}: <b>{patientData.gender || "Male"}</b>
				</Text>
			</Flex>
			<Divider></Divider>
			<Box bg={"white"}>
				<Vitals vitals={vitals} form={form} />
			</Box>
		</Stack>
	);
}
