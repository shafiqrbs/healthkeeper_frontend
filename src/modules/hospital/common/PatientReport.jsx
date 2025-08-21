import { Box, ScrollArea, Select, Checkbox, TextInput, Textarea, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import PatientReportAction from "./PatientReportAction";
import BasicInfoCard from "./tab-items/BasicInfoCard";
import useParticularsData from "@hooks/useParticularsData";

export default function PatientReport({ patientData, tabValue }) {
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 118;
	const form = useForm({
		initialValues: {
			bp: "120/80",
			sugar: "",
			weight: "",
			bloodGroup: "O+",
		},
	});

	const { particularsData } = useParticularsData();

	const [dynamicFormData, setDynamicFormData] = useState({});

	const handleDynamicFormChange = (sectionId, fieldName, value) => {
		setDynamicFormData((prev) => ({
			...prev,
			[sectionId]: {
				...prev[sectionId],
				[fieldName]: value,
			},
		}));
	};

	// render dynamic form based on data type and particulars
	const renderDynamicForm = (section) => {
		const { id, name, data_type, particulars } = section;

		if (!particulars || particulars.length === 0) {
			return <Text c="dimmed">No particulars defined for {name}</Text>;
		}

		switch (data_type) {
			case "checkbox":
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

			case "select":
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => (
							<Select
								key={`${id}-${index}`}
								label={particular.name}
								placeholder={`Select ${particular.name}`}
								data={particulars?.map((p) => ({ value: p.name, label: p.name }))}
								value={dynamicFormData[id]?.[particular.name] || ""}
								onChange={(value) => handleDynamicFormChange(id, particular.name, value)}
							/>
						))}
					</Stack>
				);

			case "textinput":
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => (
							<TextInput
								key={`${id}-${index}`}
								label={particular.name}
								placeholder={`Enter ${particular.name}`}
								value={dynamicFormData[id]?.[particular.name] || ""}
								onChange={(event) =>
									handleDynamicFormChange(id, particular.name, event.currentTarget.value)
								}
							/>
						))}
					</Stack>
				);

			case "textarea":
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

			default:
				return <Text c="red">Unsupported data type: {data_type}</Text>;
		}
	};

	// Find the current section based on tabValue
	const getCurrentSection = () => {
		if (!particularsData || !Array.isArray(particularsData)) {
			return null;
		}

		// For "All" tab, return all sections
		if (tabValue === "All") {
			return particularsData;
		}

		// For specific tabs, find matching section
		return particularsData.find(
			(section) =>
				section.name.toLowerCase() === tabValue.toLowerCase() ||
				section.slug === tabValue.toLowerCase().replace(/\s+/g, "-")
		);
	};

	const generateTabItems = () => {
		const currentSection = getCurrentSection();

		if (!currentSection) {
			return (
				<ScrollArea h={height}>
					<BasicInfoCard patientData={patientData} form={form} />
					<Box p="md">
						<Text c="dimmed">No data available for {tabValue}</Text>
					</Box>
				</ScrollArea>
			);
		}

		// Handle "All" tab - show all sections
		if (tabValue === "All") {
			return (
				<ScrollArea h={height}>
					<BasicInfoCard patientData={patientData} form={form} />
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
			);
		}

		// Handle specific tab
		return (
			<ScrollArea h={height}>
				<BasicInfoCard patientData={patientData} form={form} />
				<Box p="md">
					<Text fw={600} size="lg" mb="md">
						{currentSection.name}
					</Text>
					{renderDynamicForm(currentSection)}
				</Box>
			</ScrollArea>
		);
	};

	return (
		<Box bg="white" p="les">
			{generateTabItems()}
			<PatientReportAction form={form} />
		</Box>
	);
}
