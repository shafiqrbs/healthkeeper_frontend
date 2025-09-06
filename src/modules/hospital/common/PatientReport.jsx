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
import { useOutletContext } from "react-router-dom";
import BasicInfoCard from "./tab-items/BasicInfoCard";
import useParticularsData from "@hooks/useParticularsData";
import { IconCaretUpDownFilled, IconX } from "@tabler/icons-react";
import { useState } from "react";
import inputCss from "@assets/css/InputField.module.css";

export default function PatientReport({ tabValue, form = null, update, prescriptionData }) {
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 260;

	const [autocompleteValue, setAutocompleteValue] = useState("");
	// Handle onBlur update for form fields
	const handleFieldBlur = () => {
		// Only update if update function exists and form has data
		if (update && form && form.values) {
			update();
		}
	};

	const { particularsData } = useParticularsData({ modeName: "Prescription" });
	const tabParticulars = particularsData?.map((item) => item.particular_type);

	const handleDynamicFormChange = ({ id, name, value, parentSlug, isCheckbox = false }) => {
		const existingList = Array.isArray(form.values.dynamicFormData[parentSlug])
			? form.values.dynamicFormData[parentSlug]
			: [];

		const existingIndex = existingList.findIndex((item) => item.id === id && item.name === name);

		const updatedItem = { id, name, value };
		const updatedList =
			existingIndex > -1
				? [...existingList.slice(0, existingIndex), updatedItem, ...existingList.slice(existingIndex + 1)]
				: [...existingList, updatedItem];

		const newDynamicFormData = {
			...form.values.dynamicFormData,
			[parentSlug]: updatedList,
		};

		form.setFieldValue("dynamicFormData", newDynamicFormData);

		// For checkboxes, trigger instant update
		if (isCheckbox && update && form && form.values) {
			update();
		}
	};

	const handleAutocompleteOptionAdd = (value, sectionParticulars = null, sectionSlug = null) => {
		let selectedParticular = null;

		if (sectionParticulars) {
			selectedParticular = sectionParticulars.find((p) => p.name === value);
		}

		if (!selectedParticular) {
			selectedParticular = particularsData
				?.flatMap((section) => section.particulars || [])
				.find((p) => p.name === value);
		}

		if (selectedParticular) {
			// Add to dynamicFormData with the correct structure
			const existingList = Array.isArray(form.values.dynamicFormData[sectionSlug])
				? form.values.dynamicFormData[sectionSlug]
				: [];

			// Check if this value already exists
			const existingIndex = existingList.findIndex(
				(item) => item.id === selectedParticular.id && item.name === selectedParticular.name
			);

			if (existingIndex === -1) {
				// Add new item
				const newItem = {
					id: selectedParticular.id,
					name: selectedParticular.name,
					value: selectedParticular.name,
				};

				const updatedList = [...existingList, newItem];
				const newDynamicFormData = {
					...form.values.dynamicFormData,
					[sectionSlug]: updatedList,
				};

				form.setFieldValue("dynamicFormData", newDynamicFormData);
				return;
			}
		}
	};

	const handleAutocompleteOptionRemove = (idx, sectionSlug) => {
		const updatedList = form.values.dynamicFormData[sectionSlug].filter((_, index) => index !== idx);
		const newDynamicFormData = {
			...form.values.dynamicFormData,
			[sectionSlug]: updatedList,
		};
		form.setFieldValue("dynamicFormData", newDynamicFormData);
	};

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
							const value = form.values.dynamicFormData?.[section.slug]?.find(
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
											isCheckbox: true,
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
							form.values.dynamicFormData?.[section.slug]?.find(
								(item) => item.id === id && item.name === name
							)?.value || ""
						}
						onChange={(value) =>
							handleDynamicFormChange({
								id: id,
								name: name,
								value: value,
								parentSlug: section.slug,
							})
						}
						onBlur={handleFieldBlur}
					/>
				);

			case "Input":
				return (
					<Stack gap="xxs">
						{particulars?.map((particular, index) => {
							const value = form.values.dynamicFormData?.[section.slug]?.find(
								(item) => item.id === particular.id && item.name === particular.name
							)?.value;
							return (
								<Grid key={`${id}-${index}`}>
									<Grid.Col span={4}>{particular.name}</Grid.Col>
									<Grid.Col span={8}>
										<TextInput
											label=""
											classNames={inputCss}
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
											onBlur={handleFieldBlur}
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
							const value = form.values.dynamicFormData?.[section.slug]?.find(
								(item) => item.id === particular.id && item.name === particular.name
							)?.value;
							return (
								<Textarea
									key={`${id}-${index}`}
									label={particulars.length === 1 ? "" : particular.name?.toUpperCase()}
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
									onBlur={handleFieldBlur}
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
							form.values.dynamicFormData?.[section.slug]?.find(
								(item) => item.id === id && item.name === name
							)?.value || ""
						}
						onChange={(value) =>
							handleDynamicFormChange({
								id: id,
								name: name,
								value: value,
								parentSlug: section.slug,
							})
						}
						onBlur={handleFieldBlur}
					/>
				);

			case "RadioButton":
				return (
					<Stack gap="md">
						{particulars?.map((particular, index) => {
							const value = form.values.dynamicFormData?.[section.slug]?.find(
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
									onBlur={handleFieldBlur}
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
							value={autocompleteValue}
							onChange={setAutocompleteValue}
							onOptionSubmit={(value) => {
								handleAutocompleteOptionAdd(value, particulars, section.slug);
								setTimeout(() => {
									setAutocompleteValue("");
								}, 0);
							}}
							classNames={inputCss}
							onBlur={handleFieldBlur}
							rightSection={<IconCaretUpDownFilled size={16} />}
						/>
						<Stack gap={0} bg="white" px="sm" className="borderRadiusAll" mt="xxs">
							{form.values.dynamicFormData?.[section.slug]?.map((item, idx) => (
								<Flex
									key={idx}
									align="center"
									justify="space-between"
									px="es"
									py="xs"
									style={{
										borderBottom:
											idx !== form.values.dynamicFormData?.[section.slug]?.length - 1
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
										onClick={() => handleAutocompleteOptionRemove(idx, section.slug)}
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
						<BasicInfoCard form={form} prescriptionData={prescriptionData} onBlur={handleFieldBlur} />
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
					<BasicInfoCard form={form} prescriptionData={prescriptionData} onBlur={handleFieldBlur} />
					<ScrollArea h={height}>
						<Stack gap="xl" p="md">
							{currentSection.map((section) => (
								<Box key={section.id}>
									<Box bg="var(--theme-secondary-color-1)" mb="md" p="xxxs">
										<Text fw={600} size="lg">
											{section.name}
										</Text>
									</Box>
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
				<BasicInfoCard form={form} prescriptionData={prescriptionData} onBlur={handleFieldBlur} />
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
		</Box>
	);
}
