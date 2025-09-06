import { ActionIcon, Flex, TextInput } from "@mantine/core";
import { IconFileTypeXls, IconRestore, IconSearch, IconX } from "@tabler/icons-react";
import AdvancedFilter from "../../../common/components/advance-search/AdvancedFilter";
import { useDispatch, useSelector } from "react-redux";
import { setFilterData } from "@/app/store/core/crudSlice";
import { useEffect, useState, useCallback } from "react";
import { DateInput } from "@mantine/dates";

export default function KeywordSearch({
	form,
	module,
	onSearch,
	onReset,
	placeholder = "Keyword Search",
	tooltip = "Search by patient name, mobile, email, etc.",
	showDatePicker = true,
	showAdvancedFilter = true,
	showReset = true,
	className = "keyword-search-box",
}) {
	const filterData = useSelector(
		(state) => state.crud[module]?.filterData || { keywordSearch: "", date: new Date() }
	);
	const dispatch = useDispatch();

	const [keywordSearch, setKeywordSearch] = useState(filterData.keywordSearch || "");
	const [date, setDate] = useState(filterData.date ? new Date(filterData.date) : new Date());

	// =============== handle search functionality ================
	const handleSearch = useCallback(
		(searchData) => {
			const data = searchData || { keywordSearch, date };
			form.setFieldValue("keywordSearch", data.keywordSearch);
			form.setFieldValue("date", data.created);
			dispatch(setFilterData({ module, data }));
			if (onSearch) {
				onSearch(data);
			}
		},
		[dispatch, module, onSearch, keywordSearch, date]
	);

	// =============== handle keyword change ================
	const handleKeywordChange = (value) => {
		setKeywordSearch(value);
	};

	// =============== handle date change ================
	const handleDateChange = useCallback(
		(value) => {
			setDate(value);
			handleSearch({ keywordSearch, created: value });
		},
		[handleSearch, keywordSearch]
	);

	// =============== handle reset functionality ================
	const handleReset = useCallback(() => {
		setKeywordSearch("");
		const newDate = new Date();
		setDate(newDate);
		const resetData = { keywordSearch: "", created: newDate };
		dispatch(setFilterData({ module, data: resetData }));
		if (onReset) {
			onReset(resetData);
		}
	}, [dispatch, module, onReset]);

	// Initialize state from Redux store only when module changes
	useEffect(() => {
		const storedKeywordSearch = filterData.keywordSearch || "";
		const storedDate = filterData.date ? new Date(filterData.date) : new Date();

		// Only update state if values are different to prevent unnecessary re-renders
		if (storedKeywordSearch !== keywordSearch) {
			setKeywordSearch(storedKeywordSearch);
		}
		if (storedDate.getTime() !== date.getTime()) {
			setDate(storedDate);
		}
	}, [module]); // Only depend on module, not filterData

	return (
		<Flex className={className}>
			{showDatePicker && (
				<DateInput name="date" placeholder="Select Date" value={date} onChange={handleDateChange} miw={200} />
			)}
			<TextInput
				placeholder={placeholder}
				tooltip={tooltip}
				name="keywordSearch"
				value={keywordSearch}
				rightSection={
					keywordSearch ? (
						<IconX size={16} stroke={1.5} color="var(--theme-error-color)" onClick={handleReset} />
					) : (
						<IconSearch size={16} stroke={1.5} />
					)
				}
				styles={{ root: { width: "100%" } }}
				onChange={(event) => handleKeywordChange(event.target.value)}
			/>
			<Flex gap="xxxs" align="center">
				<ActionIcon c="var(--theme-primary-color-6)" bg="white" onClick={() => handleSearch()}>
					<IconSearch size={16} stroke={1.5} />
				</ActionIcon>

				{showReset && (
					<ActionIcon c="var(--theme-tertiary-color-8)" bg="white" onClick={handleReset}>
						<IconRestore size={16} stroke={1.5} />
					</ActionIcon>
				)}

				{showAdvancedFilter && <AdvancedFilter />}

				<ActionIcon c="var(--theme-success-color-3)" bg="white" onClick={handleReset}>
					<IconFileTypeXls size={16} stroke={1.5} />
				</ActionIcon>
			</Flex>
		</Flex>
	);
}
