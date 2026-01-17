import { useState } from "react";
import { Stack, Text, ScrollArea, Popover, ActionIcon, TextInput, List, Loader } from "@mantine/core";
import { IconBulb, IconX } from "@tabler/icons-react";
import useReportSuggestions from "@hooks/useReportSuggestions";
import inputCss from "@assets/css/InputField.module.css";

/**
 * @param {Object} props - Component props
 * @param {string} props.baseUrl - Base URL for the suggestions API endpoint
 * @param {string} props.particularId - Particular ID to search for
 * @param {string} props.fieldName - Field name to search for (e.g., "impression", "trachea")
 * @param {Object} props.form - Form instance from useForm hook
 * @param {string} props.formFieldName - Form field name to update when suggestion is selected
 * @param {string} props.placeholder - Placeholder text for search input
 * @param {string} props.popoverPosition - Position of the popover (default: "bottom-end")
 * @param {number} props.popoverWidth - Width of the popover dropdown (default: 400)
 * @param {number} props.resultsHeight - Height of the results scroll area (default: 200)
 * @param {number} props.debounceDelay - Debounce delay in milliseconds (default: 300)
 * @param {string} props.iconColor - Color of the suggestion icon (default: "#ff7800")
 * @param {Function} props.onSuggestionSelect - Optional callback when suggestion is selected
 * @returns {JSX.Element} - ReportKeywordSearchPopover component
 */
export default function ReportKeywordSearchPopover({
	particularId,
	baseUrl,
	fieldName,
	form,
	formFieldName,
	placeholder = "Search keywords...",
	popoverPosition = "bottom-end",
	popoverWidth = 400,
	resultsHeight = 200,
	debounceDelay = 300,
	iconColor = "#ff7800",
	onSuggestionSelect,
}) {
	const [popoverOpened, setPopoverOpened] = useState(false);

	const { searchTerm, searchResults, isSearching, handleSearchChange, resetSearch } = useReportSuggestions({
		particularId,
		baseUrl,
		debounceDelay,
	});

	// =============== handle suggestion selection and update form field ================
	const handleSuggestionSelect = (suggestionValue) => {
		if (form && formFieldName) {
			form.setFieldValue(formFieldName, suggestionValue);
		}
		setPopoverOpened(false);
		resetSearch();

		// =============== call optional callback if provided ================
		if (onSuggestionSelect) {
			onSuggestionSelect(suggestionValue, formFieldName);
		}
	};

	// =============== extract display text from different response formats ================
	const getDisplayText = (item) => {
		if (typeof item === "string") {
			return item;
		}
		return item?.text || item?.name || item?.value || item?.label || JSON.stringify(item);
	};

	return (
		<Popover
			opened={popoverOpened}
			onChange={setPopoverOpened}
			position={popoverPosition}
			withArrow
			shadow="md"
			trapFocus={false}
		>
			<Popover.Target>
				<ActionIcon
					size="lg"
					variant="light"
					color="orange"
					pos="absolute"
					top={10}
					aria-label="Suggestions"
					right={8}
					onClick={() => setPopoverOpened((opened) => !opened)}
				>
					<IconBulb color={iconColor} size={24} opacity={0.5} />
				</ActionIcon>
			</Popover.Target>

			<Popover.Dropdown p="xs" w={popoverWidth}>
				<Stack gap="xs">
					<TextInput
						placeholder={placeholder}
						value={searchTerm}
						onChange={(event) => handleSearchChange(event, fieldName)}
						rightSection={
							isSearching ? (
								<Loader size="xs" />
							) : searchTerm ? (
								<IconX size={16} onClick={() => resetSearch()} color="red.6" />
							) : null
						}
						classNames={inputCss}
					/>
					{searchResults.length > 0 && (
						<ScrollArea h={resultsHeight} scrollbarSize={2} scrollbars="y">
							<List spacing="xs" size="sm">
								{searchResults.map((item, index) => {
									const displayText = getDisplayText(item);
									return (
										<List.Item
											key={index}
											className="cursor-pointer hover:text-primary"
											onClick={() => handleSuggestionSelect(displayText)}
											style={{ padding: "4px 8px" }}
										>
											{displayText}
										</List.Item>
									);
								})}
							</List>
						</ScrollArea>
					)}
					{searchTerm && !isSearching && searchResults.length === 0 && (
						<Text size="sm" c="dimmed" ta="center" py="xs">
							No results found
						</Text>
					)}
				</Stack>
			</Popover.Dropdown>
		</Popover>
	);
}
