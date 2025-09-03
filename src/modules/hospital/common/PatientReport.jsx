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
import { useState, useEffect, useCallback } from "react";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import PatientReportAction from "./PatientReportAction";
import BasicInfoCard from "./tab-items/BasicInfoCard";
import useParticularsData from "@hooks/useParticularsData";
import { IconCaretUpDownFilled, IconX } from "@tabler/icons-react";

export default function PatientReport({ tabValue, onDataChange = null, formData = null, setFormData = null }) {
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 284;

	const form = useForm({
		initialValues: {
			bp: "120/80",
			weight: "",
			bloodGroup: "O+",
		},
	});

	const { particularsData } = useParticularsData({ modeName: "Prescription" });
	const tabParticulars = particularsData?.map((item) => item.particular_type);

	// Use external state if provided, otherwise use internal state
	const [dynamicFormData, setDynamicFormData] = useState(formData?.dynamicFormData || {});
	const [investigationList, setInvestigationList] = useState(formData?.investigationList || []);

	// Build patient_examination payload in the desired API format
	const buildPatientExamination = useCallback(
		(rawData, investigations) => {
			if (!tabParticulars || tabParticulars.length === 0) return {};

			const result = {};

			tabParticulars.forEach((section) => {
				const { id: sectionId, slug, particulars = [] } = section;
				const sectionKey = slug || String(sectionId);
				const sectionRaw = rawData?.[sectionId] || {};

				// Special handling for investigation bucket if present
				if (sectionKey === "investigation") {
					if (Array.isArray(investigations) && investigations.length > 0) {
						const items = investigations.map((name) => {
							const matched = particulars.find((p) => p.name === name);
							return {
								id: matched?.id ?? null,
								name,
							};
						});
						if (items.length > 0) result[sectionKey] = items;
					}
					return;
				}

				// General handling for other sections -> array of {id, name, value}
				const items = [];
				particulars.forEach((particular) => {
					const fieldName = particular.name;
					const value = sectionRaw?.[fieldName];

					if (section.data_type === "Checkbox") {
						if (value) {
							items.push({ id: particular.id ?? null, name: fieldName, value: fieldName });
						}
						return;
					}

					if (section.data_type === "RadioButton") {
						if (value === fieldName) {
							items.push({ id: particular.id ?? null, name: fieldName, value: fieldName });
						}
						return;
					}

					// Input/Textarea/Select/Searchable/Autocomplete
					if (value !== undefined && value !== null && String(value).trim() !== "") {
						items.push({ id: particular.id ?? null, name: fieldName, value });
					}
				});

				if (items.length > 0) {
					result[sectionKey] = items;
				}
			});

			return result;
		},
		[tabParticulars]
	);

	// Update external state when internal state changes
	const updateExternalState = (newDynamicFormData, newInvestigationList) => {
		const patientExamination = buildPatientExamination(newDynamicFormData, newInvestigationList);
		const payload = {
			basicInfo: form.values,
			patient_examination: patientExamination,
		};
		if (onDataChange) {
			onDataChange(payload);
		}
		if (setFormData) {
			setFormData(payload);
		}
	};

	const handleDynamicFormChange = ({ id, name, value, parentSlug }) => {
		const existingList = Array.isArray(dynamicFormData[parentSlug]) ? dynamicFormData[parentSlug] : [];

		const existingIndex = existingList.findIndex((item) => item.id === id && item.name === name);

		const updatedItem = { id, name, value };
		const updatedList =
			existingIndex > -1
				? [...existingList.slice(0, existingIndex), updatedItem, ...existingList.slice(existingIndex + 1)]
				: [...existingList, updatedItem];

		const newDynamicFormData = {
			...dynamicFormData,
			[parentSlug]: updatedList,
		};

		console.log(newDynamicFormData);

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

	// Update external state when form values change
	useEffect(() => {
		updateExternalState(dynamicFormData, investigationList);
	}, [dynamicFormData, investigationList]);

	// render dynamic form based on data type and particulars
	const renderDynamicForm = (section) => {
		const { id, name, data_type, particulars } = section;

		if (!particulars || particulars.length === 0) {
			return <Text c="dimmed">No particulars defined for {name}</Text>;
		}

		switch (data_type) {
			case "Checkbox":
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => {
							const value = dynamicFormData?.[section.slug]?.find(
								(item) => item.id === particular.id && item.name === particular.name
							)?.value;
							return (
								<Checkbox
									key={`${id}-${index}`}
									label={particular.name}
									checked={value || false}
									onChange={(event) =>
										handleDynamicFormChange({
											id: particular.id,
											name: particular.name,
											value: event.currentTarget.checked,
											parentSlug: section.slug,
										})
									}
								/>
							);
						})}
					</Stack>
				);

			case "Select":
				return (
					<Select
						label=""
						placeholder={`Select ${name}`}
						data={particulars?.map((particular) => ({
							value: particular.name,
							label: particular.name,
						}))}
						value={
							dynamicFormData?.[section.slug]?.find((item) => item.id === id && item.name === name)
								?.value || ""
						}
						onChange={(value) =>
							handleDynamicFormChange({
								id: id,
								name: name,
								value: value,
								parentSlug: section.slug,
							})
						}
					/>
				);

			case "Input":
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => {
							const value = dynamicFormData?.[section.slug]?.find(
								(item) => item.id === particular.id && item.name === particular.name
							)?.value;
							return (
								<Grid key={`${id}-${index}`}>
									<Grid.Col span={4}>{particular.name}</Grid.Col>
									<Grid.Col span={8}>
										<TextInput
											label=""
											placeholder={`Enter ${particular.name}`}
											value={value || ""}
											onChange={(event) =>
												handleDynamicFormChange({
													id: particular.id,
													name: particular.name,
													value: event.currentTarget.value,
													parentSlug: section.slug,
												})
											}
										/>
									</Grid.Col>
								</Grid>
							);
						})}
					</Stack>
				);

			case "Textarea":
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => {
							const value = dynamicFormData?.[section.slug]?.find(
								(item) => item.id === particular.id && item.name === particular.name
							)?.value;
							return (
								<Textarea
									key={`${id}-${index}`}
									label={particular.name?.toUpperCase()}
									placeholder={`Enter ${particular.name}`}
									value={value || ""}
									onChange={(event) =>
										handleDynamicFormChange({
											id: particular.id,
											name: particular.name,
											value: event.currentTarget.value,
											parentSlug: section.slug,
										})
									}
									minRows={3}
								/>
							);
						})}
					</Stack>
				);

			case "Searchable":
				return (
					<Select
						searchable
						label={name}
						placeholder={`Select ${name}`}
						data={particulars?.map((p) => ({ value: p.name, label: p.name }))}
						value={
							dynamicFormData?.[section.slug]?.find((item) => item.id === id && item.name === name)
								?.value || ""
						}
						onChange={(value) =>
							handleDynamicFormChange({
								id: id,
								name: name,
								value: value,
								parentSlug: section.slug,
							})
						}
					/>
				);

			case "RadioButton":
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => {
							const value = dynamicFormData?.[section.slug]?.find(
								(item) => item.id === particular.id && item.name === particular.name
							)?.value;
							return (
								<Radio
									key={`${id}-${index}`}
									label={particular.name}
									checked={value === particular.name}
									onChange={(event) =>
										handleDynamicFormChange({
											id: particular.id,
											name: particular.name,
											value: event.currentTarget.checked ? particular.name : "",
											parentSlug: section.slug,
										})
									}
								/>
							);
						})}
					</Stack>
				);

			case "Autocomplete":
				return (
					<>
						<Autocomplete
							label=""
							placeholder={`Pick value or enter ${name}`}
							data={particulars?.map((p) => ({ value: p.name, label: p.name }))}
							value={
								dynamicFormData?.[section.slug]?.find((item) => item.id === id && item.name === name)
									?.value || ""
							}
							onChange={(value) => {
								handleDynamicFormChange({
									id: id,
									name: name,
									value: value,
									parentSlug: section.slug,
								});
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && e.target.value) {
									handleDynamicFormChange({
										id: id,
										name: name,
										value: e.target.value,
										parentSlug: section.slug,
									});
									handleInvestigationAdd(e.target.value);
									e.target.value = "";
								}
							}}
							rightSection={<IconCaretUpDownFilled size={16} />}
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
						<BasicInfoCard form={form} />
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
					<BasicInfoCard form={form} />
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
				<BasicInfoCard form={form} />
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
