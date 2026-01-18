import { useEffect, useState } from "react";
import { Autocomplete, Loader } from "@mantine/core";
import useReportSuggestions from "@hooks/useReportSuggestions";
import inputCss from "@assets/css/InputField.module.css";

/**
 * @param {Object} props - Component props
 * @param {string} props.particularId - Particular ID to search for
 * @param {string} props.baseUrl - Base URL for the suggestions API endpoint
 * @param {string} props.fieldName - Field name to search for (e.g., "technique", "impression")
 * @param {Object} props.form - Form instance from useForm hook
 * @param {string} props.name - Form field name (required for form integration)
 * @param {string} props.id - Input ID
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.clearable - Whether the input can be cleared
 * @param {number} props.debounceDelay - Debounce delay in milliseconds (default: 300)
 * @param {Function} props.onChange - Optional onChange handler
 * @param {string} props.value - Controlled value
 * @param {Object} props.classNames - Custom class names
 * @param {Object} props.otherProps - Other props to pass to Autocomplete
 * @returns {JSX.Element} - ReportKeywordAutocomplete component
 */
export default function ReportKeywordAutocomplete({
	particularId,
	baseUrl,
	fieldName,
	form,
	name,
	id,
	placeholder,
	clearable = true,
	debounceDelay = 300,
	onChange,
	value,
	classNames = inputCss,
	...otherProps
}) {
	const initialValue = value !== undefined ? value : form?.values[name] || "";
	const [inputValue, setInputValue] = useState(initialValue);

	const { searchResults, isSearching, handleSearchChange, resetSearch } = useReportSuggestions({
		particularId,
		baseUrl,
		debounceDelay,
	});

	useEffect(() => {
		if (form && name) {
			const formValue = form.values[name] || "";
			if (formValue !== inputValue) {
				setInputValue(formValue);
			}
		} else if (value !== undefined && value !== inputValue) {
			setInputValue(value);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form?.values[name], value, name]);

	const getDisplayText = (item) => {
		if (typeof item === "string") {
			return item;
		}
		return item?.name;
	};

	const autocompleteData = searchResults.map((item) => getDisplayText(item));

	const handleInputChange = (newValue) => {
		setInputValue(newValue);

		if (newValue && newValue.trim()) {
			const syntheticEvent = {
				currentTarget: { value: newValue },
			};
			handleSearchChange(syntheticEvent, fieldName);
		} else {
			resetSearch();
		}

		if (form && name) {
			form.setFieldValue(name, newValue);
		}

		if (onChange) {
			onChange(newValue);
		}
	};

	const handleItemSelect = (selectedValue) => {
		setInputValue(selectedValue);

		if (form && name) {
			form.setFieldValue(name, selectedValue);
		}

		if (onChange) {
			onChange(selectedValue);
		}

		resetSearch();
	};

	return (
		<Autocomplete
			name={name}
			id={id}
			value={inputValue}
			onChange={handleInputChange}
			data={autocompleteData}
			clearable={clearable}
			placeholder={placeholder}
			classNames={classNames}
			rightSection={isSearching ? <Loader size="xs" /> : null}
			onOptionSubmit={handleItemSelect}
			{...otherProps}
		/>
	);
}
