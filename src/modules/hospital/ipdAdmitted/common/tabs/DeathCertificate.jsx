import { Box, Button, Flex, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import SelectForm from "@components/form-builders/SelectForm";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DeathCertificate({ data }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const { diseasesProfile } = useAppLocalStore();

	const diseaseOptions = diseasesProfile.map((disease) => ({
		value: disease.name,
		label: disease.name,
	}));

	const form = useForm({
		initialValues: {
			disease: "",
			causeOfDeath: "",
			diseaseDescription: "",
		},
		validate: {
			disease: (value) => {
				if (!value) {
					return t("Disease is required");
				}
				return null;
			},
		},
	});

	const handleSubmit = (values) => {
		console.log(values);
	};

	return (
		<Box bg="var(--mantine-color-white" h={mainAreaHeight - 63} p="xs">
			<Text size="lg" fw={600} mb="md">
				Death Certificate
			</Text>

			<Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
				<SelectForm
					mt="sm"
					form={form}
					name="disease"
					label="Disease"
					placeholder="Select Disease"
					dropdownValue={diseaseOptions}
				/>
				<TextAreaForm
					mt="sm"
					label="About Disease"
					name="diseaseDescription"
					form={form}
					placeholder="About Disease"
				/>
				<TextAreaForm
					mt="sm"
					label="Cause of Death"
					name="causeOfDeath"
					form={form}
					placeholder="Cause of Death"
				/>
				<Flex gap="sm" justify="flex-end" mt="md">
					<Button type="button" bg="var(--theme-secondary-color-6)" color="white">
						Cancel
					</Button>
					<Button type="submit" bg="var(--theme-primary-color-6)" color="white">
						Save
					</Button>
				</Flex>
			</Box>
		</Box>
	);
}
