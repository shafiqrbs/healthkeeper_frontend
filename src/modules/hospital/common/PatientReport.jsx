import {
	Box,
	ScrollArea,
	Select,
	Checkbox,
	TextInput,
	Textarea,
	Stack,
	Text,
	Autocomplete,
	Radio,
	Grid,
	Flex,
	ActionIcon,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import PatientReportAction from "./PatientReportAction";
import BasicInfoCard from "./tab-items/BasicInfoCard";
import useParticularsData from "@hooks/useParticularsData";
import { IconX } from "@tabler/icons-react";

export default function PatientReport({
	patientData,
	tabValue,
	onDataChange = null,
	formData = null,
	setFormData = null,
}) {
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 284;

	const form = useForm({
		initialValues: {
			bp: "120/80",
			sugar: "",
			weight: "",
			bloodGroup: "O+",
		},
	});

	const { particularsData } = useParticularsData({ modeName: "Prescription" });
	const tabParticulars = particularsData?.map((item) => item.particular_type);

	// Use external state if provided, otherwise use internal state
	const [dynamicFormData, setDynamicFormData] = useState(formData?.dynamicFormData || {});
	const [investigationList, setInvestigationList] = useState(formData?.investigationList || []);

	// Update external state when internal state changes
	const updateExternalState = (newDynamicFormData, newInvestigationList) => {
		if (onDataChange) {
			onDataChange({
				basicInfo: form.values,
				dynamicFormData: newDynamicFormData,
				investigationList: newInvestigationList,
			});
		}
		if (setFormData) {
			setFormData({
				basicInfo: form.values,
				dynamicFormData: newDynamicFormData,
				investigationList: newInvestigationList,
			});
		}
	};

	const handleDynamicFormChange = (sectionId, fieldName, value) => {
		const newDynamicFormData = {
			...dynamicFormData,
			[sectionId]: {
				...dynamicFormData[sectionId],
				[fieldName]: value,
			},
		};
		setDynamicFormData(newDynamicFormData);
		updateExternalState(newDynamicFormData, investigationList);
	};

	const handleInvestigationRemove = (index) => {
		const newInvestigationList = investigationList.filter((_, idx) => idx !== index);
		setInvestigationList(newInvestigationList);
		updateExternalState(dynamicFormData, newInvestigationList);
	};

	const handleInvestigationAdd = (value) => {
		if (value && !investigationList.includes(value)) {
			const newInvestigationList = [...investigationList, value];
			setInvestigationList(newInvestigationList);
			updateExternalState(dynamicFormData, newInvestigationList);
		}
	};

	// Transform dynamic form data to use meaningful names instead of IDs
	const transformDynamicFormData = (rawData) => {
		const transformed = {};

		if (!tabParticulars || tabParticulars.length === 0) {
			return rawData;
		}

		Object.keys(rawData).forEach((sectionId) => {
			const section = tabParticulars.find((s) => s.id.toString() === sectionId);
			if (section) {
				transformed[section.name?.toLowerCase()?.replace(/\s+/g, "_")] = rawData[sectionId];
			} else {
				console.log(`Section with ID ${sectionId} not found in tabParticulars`);
			}
		});

		return transformed;
	};

	// Update external state when form values change
	useEffect(() => {
		const transformedData = transformDynamicFormData(dynamicFormData);
		updateExternalState(transformedData, investigationList);
	}, [form.values, dynamicFormData, investigationList]);

	// render dynamic form based on data type and particulars
	const renderDynamicForm = (section) => {
		const { id, name, data_type, particulars } = section;

		if (!particulars || particulars.length === 0) {
			return <Text c="dimmed">No particulars defined for {name}</Text>;
		}

		switch (data_type) {
			case "Checkbox": // it will add to the final result as object
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => (
							<Checkbox
								key={`${id}-${index}`}
								label={particular.name}
								checked={dynamicFormData[id]?.[particular.name] || false}
								onChange={(event) =>
									handleDynamicFormChange(id, particular.name, event.currentTarget.checked)
								}
							/>
						))}
					</Stack>
				);

			case "Select": // it will add to the final result as array
				return (
					<Select
						label=""
						placeholder={`Select ${name}`}
						data={particulars?.map((particular) => ({
							value: particular.name,
							label: particular.name,
						}))}
						value={dynamicFormData[id]?.[name] || ""}
						onChange={(value) => handleDynamicFormChange(id, name, value)}
					/>
				);

			case "Input": // it will add to the final result as object
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => (
							<Grid key={`${id}-${index}`}>
								<Grid.Col span={4}>{particular.name}</Grid.Col>
								<Grid.Col span={8}>
									<TextInput
										label=""
										placeholder={`Enter ${particular.name}`}
										value={dynamicFormData[id]?.[particular.name] || ""}
										onChange={(event) =>
											handleDynamicFormChange(id, particular.name, event.currentTarget.value)
										}
									/>
								</Grid.Col>
							</Grid>
						))}
					</Stack>
				);

			case "Textarea": // it will add to the final result as object
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => (
							<Textarea
								key={`${id}-${index}`}
								label={particular.name}
								placeholder={`Enter ${particular.name}`}
								value={dynamicFormData[id]?.[particular.name] || ""}
								onChange={(event) =>
									handleDynamicFormChange(id, particular.name, event.currentTarget.value)
								}
								minRows={3}
							/>
						))}
					</Stack>
				);

			case "Searchable": // it will add to the final result as array
				return (
					<Select
						searchable
						label={name}
						placeholder={`Select ${name}`}
						data={particulars?.map((p) => ({ value: p.name, label: p.name }))}
						value={dynamicFormData[id]?.[name] || ""}
						onChange={(value) => handleDynamicFormChange(id, name, value)}
					/>
				);

			case "RadioButton": // it will add to the final result as object
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => (
							<Radio
								key={`${id}-${index}`}
								label={particular.name}
								checked={dynamicFormData[id]?.[particular.name] === particular.name}
								onChange={(event) =>
									handleDynamicFormChange(
										id,
										particular.name,
										event.currentTarget.checked ? particular.name : ""
									)
								}
							/>
						))}
					</Stack>
				);

			case "Autocomplete": // it will add to the final result as array
				return (
					<>
						<Autocomplete
							label=""
							placeholder={`Pick value or enter ${name}`}
							data={particulars?.map((p) => ({ value: p.name, label: p.name }))}
							value={dynamicFormData[id]?.[name] || ""}
							onChange={(value) => {
								handleDynamicFormChange(id, name, value);
								if (value) {
									handleInvestigationAdd(value);
									// Clear the input after adding
									handleDynamicFormChange(id, name, "");
								}
							}}
						/>
						<Stack gap={0} bg="white" px="sm" className="borderRadiusAll">
							{investigationList.map((item, idx) => (
								<Flex
									key={idx}
									align="center"
									justify="space-between"
									px="es"
									py="xs"
									style={{
										borderBottom:
											idx !== investigationList.length - 1
												? "1px solid var(--theme-tertiary-color-4)"
												: "none",
									}}
								>
									<Text fz="sm">
										{idx + 1}. {item}
									</Text>
									<ActionIcon
										color="red"
										size="xs"
										variant="subtle"
										onClick={() => handleInvestigationRemove(idx)}
									>
										<IconX size={16} />
									</ActionIcon>
								</Flex>
							))}
						</Stack>
					</>
				);

			default:
				return <Text c="red">Unsupported data type: {data_type}</Text>;
		}
	};

	// Find the current section based on tabValue
	const getCurrentSection = () => {
		if (!tabParticulars || !Array.isArray(tabParticulars)) {
			return null;
		}

		// For "All" tab, return all sections
		if (tabValue === "All") {
			return tabParticulars;
		}

		// For specific tabs, find matching section
		return tabParticulars.find((section) => section.name.toLowerCase() === tabValue.toLowerCase());
	};

	const generateTabItems = () => {
		const currentSection = getCurrentSection();

		if (!currentSection) {
			return (
				<Box bg="white" p="les">
					<ScrollArea h={height}>
						<BasicInfoCard patientData={patientData} form={form} />
						<Box p="md">
							<Text c="dimmed">No data available for {tabValue}</Text>
						</Box>
					</ScrollArea>
				</Box>
			);
		}

		// Handle "All" tab - show all sections
		if (tabValue === "All") {
			return (
				<Box>
					<BasicInfoCard patientData={patientData} form={form} />
					<ScrollArea h={height}>
						<Stack gap="xl" p="md">
							{currentSection.map((section) => (
								<Box key={section.id}>
									<Text fw={600} size="lg" mb="md">
										{section.name}
									</Text>
									{renderDynamicForm(section)}
								</Box>
							))}
						</Stack>
					</ScrollArea>
				</Box>
			);
		}

		// Handle specific tab
		return (
			<Box>
				<BasicInfoCard patientData={patientData} form={form} />
				<ScrollArea h={height}>
					<Box p="md">
						<Text fw={600} size="lg" mb="md">
							{currentSection?.name}
						</Text>
						{renderDynamicForm(currentSection)}
					</Box>
				</ScrollArea>
			</Box>
		);
	};

	return (
		<Box bg="white" p="les">
			{generateTabItems()}
			<PatientReportAction form={form} />
		</Box>
	);
}
