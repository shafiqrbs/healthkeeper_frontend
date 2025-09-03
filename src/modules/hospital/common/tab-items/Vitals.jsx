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

export default function Vitals({ form }) {
	const { t } = useTranslation();
	return (
		<Flex gap="les" mt="xxxs" mb="xxxs" wrap="wrap">
			<Group gap="les" grow w="100%" px="les">
				<InputForm
					value={form.values.basicInfo.weight}
					label={t("weight")}
					name="weight"
					tooltip="Weight"
					form={form}
					placeholder="50"
					mt={0}
					styles={{ input: { padding: "es", fontSize: "sm" } }}
				/>
				<SelectForm
					value={form.values.basicInfo.bloodGroup}
					label={t("bloodGroup")}
					name="bloodGroup"
					form={form}
					dropdownValue={BLOOD_GROUPS}
					searchable={false}
					clearable={false}
					mt={0}
					size="sm"
					pt={0}
				/>
				<InputForm
					value={form.values.basicInfo.bp}
					label={t("bp")}
					name="bp"
					tooltip="Blood Pressure"
					form={form}
					placeholder="120/80"
					mt={0}
					styles={{ input: { padding: "es", fontSize: "sm" } }}
				/>
			</Group>
		</Flex>
	);
}
