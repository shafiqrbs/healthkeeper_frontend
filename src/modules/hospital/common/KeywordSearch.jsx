import { ActionIcon, Flex, TextInput } from "@mantine/core";
import { IconRestore, IconSearch, IconX } from "@tabler/icons-react";
import AdvancedFilter from "../../../common/components/advance-search/AdvancedFilter";
import { useDispatch, useSelector } from "react-redux";
import { setFilterData } from "@/app/store/core/crudSlice";
import { useEffect, useState } from "react";
import { DateInput } from "@mantine/dates";

export default function KeywordSearch({
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
	const handleSearch = (searchData) => {
		const data = searchData || { keywordSearch, date };
		dispatch(setFilterData({ module, data }));
		if (onSearch) {
			onSearch(data);
		}
	};

	// =============== handle keyword change ================
	const handleKeywordChange = (value) => {
		setKeywordSearch(value);
		handleSearch({ keywordSearch: value, date });
	};

	// =============== handle date change ================
	const handleDateChange = (value) => {
		setDate(value);
		handleSearch({ keywordSearch, date: value });
	};

	// =============== handle reset functionality ================
	const handleReset = () => {
		setKeywordSearch("");
		const newDate = new Date();
		setDate(newDate);
		const resetData = { keywordSearch: "", date: newDate };
		dispatch(setFilterData({ module, data: resetData }));
		if (onReset) {
			onReset(resetData);
		}
	};

	useEffect(() => {
		setKeywordSearch(filterData.keywordSearch || "");
		setDate(filterData.date ? new Date(filterData.date) : new Date());
	}, [module, filterData]);

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

				{showAdvancedFilter && <AdvancedFilter />}

				{showReset && (
					<ActionIcon c="var(--theme-tertiary-color-8)" bg="white" onClick={handleReset}>
						<IconRestore size={16} stroke={1.5} />
					</ActionIcon>
				)}
			</Flex>
		</Flex>
	);
}
