import TabSubHeading from "@hospital-components/TabSubHeading";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { Badge, Box, Flex, Grid, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import TabsActionButtons from "@hospital-components/TabsActionButtons";

const historyDetails = [
	{
		id: 1,
		label: "Patient presents with persistent headache and dizziness for 3 days.",
		date: "25-06-25",
	},
	{
		id: 2,
		label: "Complaining of high fever, sore throat, and body ache since yesterday.",
		date: "26-06-25",
	},
	{
		id: 3,
		label: "Severe abdominal pain in the lower right quadrant since morning.",
		date: "27-06-25",
	},
	{
		id: 4,
		label: "Severe abdominal pain in the lower right quadrant since morning.",
		date: "28-06-25",
	},
];

export default function History() {
	const { mainAreaHeight } = useOutletContext();

	const form = useForm({
		initialValues: {
			history: "",
		},
	});

	const handleSubmit = (values) => {
		console.log(values);
	};

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			<Grid columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%" } }}>
				<Grid.Col span={8} h="100%">
					<TabSubHeading title="History" bg="var(--theme-primary-color-0)" />
					<Stack
						justify="space-between"
						bg="var(--theme-primary-color-0)"
						p="xxxs"
						h={mainAreaHeight - 63 - 70}
					>
						<Box>
							<TextAreaForm
								label="Chief Complaints"
								placeholder="Complaining of high fever, sore throat, and body ache since yesterday."
								rows={10}
								className="borderRadiusAll"
								form={form}
								name="history"
								showRightSection={false}
								style={{ input: { height: "149px" }, label: { marginBottom: "4px" } }}
							/>
							<TextAreaForm
								mt="sm"
								label="Chief Complaints"
								placeholder="Write a text."
								rows={10}
								className="borderRadiusAll"
								form={form}
								name="history"
								showRightSection={false}
								style={{ input: { height: "149px" }, label: { marginBottom: "4px" } }}
							/>
						</Box>
						<TabsActionButtons handleReset={() => {}} handleSave={handleSubmit} />
					</Stack>
				</Grid.Col>
				<Grid.Col span={16}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="History Details" />
						<Box p="xs">
							{historyDetails.map((item) => (
								<Flex key={item.id} gap="xs" mb="xxxs">
									<Text>{item.id}.</Text>
									<Box>
										<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
											{item.date}
										</Badge>
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
