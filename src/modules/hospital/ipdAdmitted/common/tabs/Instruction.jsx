import TabSubHeading from "@hospital-components/TabSubHeading";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { Badge, Box, Flex, Grid, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import TabsActionButtons from "@hospital-components/TabsActionButtons";
import SelectForm from "@components/form-builders/SelectForm";

const instructionDetails = [
	{
		id: 1,
		label: "Patient presents with persistent headache and dizziness for 3 days.",
		doctor: "Mr. Ramim",
		nurse: "Mrs. Saju",
		date: "25-06-25",
	},
	{
		id: 2,
		label: "Complaining of high fever, sore throat, and body ache since yesterday.",
		doctor: "Mr. Ramim",
		nurse: "Mrs. Saju",
		date: "26-06-25",
	},
];

const doctorOptions = [
	{ value: "doctor1", label: "Doctor 1" },
	{ value: "doctor2", label: "Doctor 2" },
	{ value: "doctor3", label: "Doctor 3" },
];

const nurseOptions = [
	{ value: "nurse1", label: "Nurse 1" },
	{ value: "nurse2", label: "Nurse 2" },
	{ value: "nurse3", label: "Nurse 3" },
];

export default function Instruction() {
	const { mainAreaHeight } = useOutletContext();

	const form = useForm({
		initialValues: {
			history: "",
			doctor: "",
			nurse: "",
		},
	});

	const handleSubmit = (values) => {
		console.log(values);
	};

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			<Grid columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%" } }}>
				<Grid.Col span={8} h="100%">
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Instruction" />
						<Box p="3xs" h={mainAreaHeight - 63 - 70}>
							<SelectForm
								label="Doctor"
								form={form}
								name="doctor"
								value={form.values.doctor}
								dropdownValue={doctorOptions}
								onChange={(value) => {
									form.setFieldValue("doctor", value);
								}}
							/>
							<SelectForm
								label="Nurse"
								form={form}
								name="nurse"
								value={form.values.nurse}
								dropdownValue={nurseOptions}
								clearable={false}
								onChange={(value) => {
									form.setFieldValue("nurse", value);
								}}
							/>
							<TextAreaForm
								mt="xs"
								label=""
								placeholder="Complaining of high fever, sore throat, and body ache since yesterday."
								rows={10}
								className="borderRadiusAll"
								form={form}
								name="history"
								showRightSection={false}
								style={{ input: { height: mainAreaHeight - 63 - 270 } }}
							/>
							<TabsActionButtons handleReset={() => {}} handleSave={handleSubmit} />
						</Box>
					</Box>
				</Grid.Col>
				<Grid.Col span={16}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Instruction Details" />
						<Box p="xs">
							{instructionDetails.map((item) => (
								<Flex key={item.id} gap="xs" mb="3xs">
									<Text>{item.id}.</Text>
									<Box>
										<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
											{item.date}
										</Badge>
										<Box mt="les">
											<Text mt="es" fz="sm">
												Doctor: {item.doctor}
											</Text>
											<Text mt="es" fz="sm">
												Nurse: {item.nurse}
											</Text>
										</Box>
										<Text mt="es" fz="sm">
											{item.label}
										</Text>
									</Box>
								</Flex>
							))}
						</Box>
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
