import SelectForm from "@components/form-builders/SelectForm";
import InputForm from "@components/form-builders/InputForm";
import { Flex, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";

const BLOOD_GROUPS = [
	{ label: "A+", value: "A+" },
	{ label: "A-", value: "A-" },
	{ label: "B+", value: "B+" },
	{ label: "B-", value: "B-" },
	{ label: "O+", value: "O+" },
	{ label: "O-", value: "O-" },
	{ label: "AB+", value: "AB+" },
	{ label: "AB-", value: "AB-" },
];

export default function Vitals({ form, onBlur }) {
	const { t } = useTranslation();
	return (
		<Flex gap="les" mb="3xs" wrap="wrap">
			<Group gap="les" grow w="100%" px="les">
				<InputForm
					form={form}
					label={t("weight")}
					name="basic_info.weight"
					tooltip="Weight KG"
					placeholder="50 KG"
					mt={0}
					styles={{ input: { padding: "es", fontSize: "sm" } }}
					onBlur={onBlur}
				/>
				<SelectForm
					form={form}
					label={t("bloodGroup")}
					name="basic_info.bloodGroup"
					dropdownValue={BLOOD_GROUPS}
					value={form.values.basic_info?.bloodGroup}
					searchable={false}
					clearable={false}
					mt={0}
					size="sm"
					pt={0}
					placeholder="A+"
					onBlur={onBlur}
				/>
				<InputForm
					label={t("bp")}
					name="basic_info.bp"
					tooltip="Blood Pressure"
					form={form}
					placeholder="120/80"
					mt={0}
					styles={{ input: { padding: "es", fontSize: "sm" } }}
					onBlur={onBlur}
				/>
			</Group>
		</Flex>
	);
}
