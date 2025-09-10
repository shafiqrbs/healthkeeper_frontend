import TabSubHeading from "@modules/hospital/common/TabSubHeading";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { Badge, Box, Flex, Grid, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useOutletContext, useParams } from "react-router-dom";
import TabsActionButtons from "@modules/hospital/common/TabsActionButtons";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@/common/components/notification/successNotification";
import { errorNotification } from "@/common/components/notification/errorNotification";
import { useDispatch } from "react-redux";

const adviceDetails = [
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

export default function Advice() {
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const { id } = useParams();
	const form = useForm({
		initialValues: {
			advice: "",
		},
	});

	const handleSubmit = async () => {
		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.UPDATE}/${id}`,
				data: {
					json_content: form.values?.advice,
					module: "advice",
				},
				module: "admission",
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (resultAction.payload.success) {
				console.log(resultAction.payload.data);
				successNotification(resultAction.payload.message);
			} else {
				errorNotification(resultAction.payload.message);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			<Grid columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%" } }}>
				<Grid.Col span={8} h="100%">
					<TabSubHeading title="Advice" bg="var(--theme-primary-color-0)" />
					<Box bg="var(--theme-primary-color-0)" p="xxxs" h={mainAreaHeight - 63 - 70}>
						<TextAreaForm
							label=""
							placeholder="Complaining of high fever, sore throat, and body ache since yesterday."
							rows={10}
							className="borderRadiusAll"
							form={form}
							name="advice"
							showRightSection={false}
							style={{ input: { height: mainAreaHeight - 63 - 140 }, label: { marginBottom: "4px" } }}
						/>
						<TabsActionButtons handleReset={() => {}} handleSave={handleSubmit} />
					</Box>
				</Grid.Col>
				<Grid.Col span={16}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Advice Details" />
						<Box p="xs">
							{adviceDetails.map((item) => (
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
