import TabSubHeading from "@modules/hospital/common/TabSubHeading";
import { ActionIcon, Autocomplete, Badge, Box, Button, Flex, Grid, Group, Stack, Text } from "@mantine/core";
import { useOutletContext, useParams } from "react-router-dom";
import { IconCaretUpDownFilled, IconEye, IconX } from "@tabler/icons-react";
import { useState } from "react";
import useParticularsData from "@/common/hooks/useParticularsData";
import inputCss from "@assets/css/InputField.module.css";
import TabsActionButtons from "@/modules/hospital/common/TabsActionButtons";
import { useForm } from "@mantine/form";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch } from "react-redux";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@/common/components/notification/successNotification";
import { errorNotification } from "@/common/components/notification/errorNotification";

const complainDetails = [
	{
		id: 1,
		items: ["Complete Blood Count (CBC)", "Hemoglobin (Hb)"],
		date: "25-06-25",
	},
	{
		id: 2,
		items: ["Complete Blood Count (CBC)", "Hemoglobin (Hb)"],
		date: "25-06-25",
	},
	{
		id: 3,
		items: ["Complete Blood Count (CBC)", "Hemoglobin (Hb)"],
		date: "25-06-25",
	},
	{
		id: 4,
		items: ["Complete Blood Count (CBC)", "Hemoglobin (Hb)"],
		date: "25-06-25",
	},
];

export default function Investigation() {
	const dispatch = useDispatch();
	const { id } = useParams();
	const form = useForm({
		initialValues: {
			investigation: [],
		},
	});

	const { mainAreaHeight } = useOutletContext();
	const { particularsData } = useParticularsData({ modeName: "Admission" });

	const investigationParticulars = particularsData?.find((item) => item.particular_type.name === "Investigation");

	const [autocompleteValue, setAutocompleteValue] = useState("");

	const handleAutocompleteOptionAdd = (value) => {
		const allParticulars = investigationParticulars?.particular_type?.particulars || [];
		const sectionParticulars = allParticulars.find((p) => p.name === value);

		if (sectionParticulars) {
			// =============== get current investigation list or initialize empty array ================
			const currentList = Array.isArray(form.values.investigation) ? form.values.investigation : [];

			// =============== check if this value already exists ================
			const existingIndex = currentList.findIndex(
				(item) => item.id === sectionParticulars.id && item.name === sectionParticulars.name
			);

			if (existingIndex === -1) {
				// =============== add new item to the list ================
				const newItem = {
					id: sectionParticulars.id,
					name: sectionParticulars.name,
					value: sectionParticulars.name,
				};

				const updatedList = [...currentList, newItem];
				form.setFieldValue("investigation", updatedList);
				return;
			}
		}
	};

	const handleAutocompleteOptionRemove = (idx) => {
		// =============== get current investigation list and remove item at index ================
		const currentList = Array.isArray(form.values.investigation) ? form.values.investigation : [];
		const updatedList = currentList.filter((_, index) => index !== idx);
		form.setFieldValue("investigation", updatedList);
	};

	const handleSubmit = async () => {
		try {
			const formValue = {
				json_content: form.values?.investigation,
				module: "investigation",
			};

			console.log(formValue);

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.UPDATE}/${id}`,
				data: formValue,
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
				<Grid.Col span={9}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Investigation" />
						<Box p="xxxs" h={mainAreaHeight - 200}>
							<Autocomplete
								label=""
								placeholder={`Pick value or enter Investigation`}
								data={investigationParticulars?.particular_type?.particulars?.map((p) => ({
									value: p.name,
									label: p.name,
								}))}
								value={autocompleteValue}
								onChange={setAutocompleteValue}
								onOptionSubmit={(value) => {
									handleAutocompleteOptionAdd(value);
									setTimeout(() => {
										setAutocompleteValue("");
									}, 0);
								}}
								classNames={inputCss}
								rightSection={<IconCaretUpDownFilled size={16} />}
							/>
							<Stack gap={0} bg="white" px="sm" className="borderRadiusAll" mt="xxs">
								{form.values?.investigation?.map((item, idx) => (
									<Flex
										key={idx}
										align="center"
										justify="space-between"
										px="es"
										py="xs"
										style={{
											borderBottom:
												idx !== form.values?.investigation?.length - 1
													? "1px solid var(--theme-tertiary-color-4)"
													: "none",
										}}
									>
										<Text fz="sm">
											{idx + 1}. {item.name}
										</Text>
										<ActionIcon
											color="red"
											size="xs"
											variant="subtle"
											onClick={() => handleAutocompleteOptionRemove(idx)}
										>
											<IconX size={16} />
										</ActionIcon>
									</Flex>
								))}
							</Stack>
						</Box>
						<Box px="xs">
							<TabsActionButtons handleReset={() => {}} handleSave={handleSubmit} />
						</Box>
					</Box>
				</Grid.Col>
				<Grid.Col span={15}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Investigation Details" />
						<Box p="xs">
							{complainDetails?.map((item) => (
								<Flex key={item.id} gap="xs" mb="xxxs">
									<Text>{item.id}.</Text>
									<Box w="100%">
										<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
											{item.date}
										</Badge>
										<Box mt="es" fz="sm">
											{item.items?.map((item, index) => (
												<Flex key={index} justify="space-between" align="center" mb="les">
													{index + 1}. {item}
													<Group gap="xxxs">
														<Button
															variant="light"
															color="var(--theme-primary-color-5)"
															size="compact-xs"
														>
															Status
														</Button>
														<ActionIcon
															variant="light"
															color="var(--theme-secondary-color-5)"
															size="sm"
														>
															<IconEye size={16} stroke={1.5} />
														</ActionIcon>
														<ActionIcon
															variant="light"
															color="var(--theme-error-color)"
															size="sm"
														>
															<IconX size={16} stroke={1.5} />
														</ActionIcon>
													</Group>
												</Flex>
											))}
										</Box>
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
