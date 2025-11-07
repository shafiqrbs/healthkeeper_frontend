import TabSubHeading from "@hospital-components/TabSubHeading";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { Badge, Box, Flex, Grid, MultiSelect, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import TabsActionButtons from "@hospital-components/TabsActionButtons";
import SelectForm from "@components/form-builders/SelectForm";

const otDetails = [
	{
		id: 1,
		surgery: "Open Heart",
		label: "Patient presents with persistent headache and dizziness for 3 days.",
		doctors: [
			{ name: "Mr. Ramim", designation: "Internal Medicine & Diabetology" },
			{ name: "Mr. Karim", designation: "Neurology & Stroke Management" },
		],
		date: "25-06-25",
	},
];

const doctors = ["Mr. Ramim", "Mr. Saju"];
const surgeryOptions = [
	{ value: "surgery1", label: "Surgery 1" },
	{ value: "surgery2", label: "Surgery 2" },
	{ value: "surgery3", label: "Surgery 3" },
];

export default function OT() {
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
						<TabSubHeading title="OT" />
						<Box p="3xs" h={mainAreaHeight - 63 - 70}>
							<SelectForm
								label="Name of Surgery"
								form={form}
								name="surgery"
								value={form.values.surgery}
								dropdownValue={surgeryOptions}
								onChange={(value) => {
									form.setFieldValue("surgery", value);
								}}
							/>
							<MultiSelect label="Doctors" data={doctors} form={form} name="doctors" />
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
						<TabSubHeading title="OT Details" />
						<Box p="xs">
							{otDetails.map((item) => (
								<Flex key={item.id} gap="xs" mb="3xs">
									<Text>{item.id}.</Text>
									<Box>
										<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
											{item.date}
										</Badge>
										<Text mt="es" fz="sm">
											Name of Surgery: {item.surgery}
										</Text>
										<Badge variant="light" size="md" color="var(--theme-primary-color-7)">
											Doctors
										</Badge>
										<Box mt="les">
											{item.doctors.map((doctor, index) => (
												<Flex key={index} gap="xs" mb="3xs">
													<Text>{index + 1}.</Text>
													<Box>
														<Text mt="es" fz="sm">
															{doctor.name}
														</Text>
														<Text mt="es" fz="xs">
															{doctor.designation}
														</Text>
													</Box>
												</Flex>
											))}
										</Box>
										<Text mt="lg" fz="sm">
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
