import { ActionIcon, Flex, TextInput } from "@mantine/core";
import { IconFileTypeXls, IconRestore, IconSearch, IconX } from "@tabler/icons-react";
import AdvancedFilter from "../../../common/components/advance-search/AdvancedFilter";
import { useDispatch, useSelector } from "react-redux";
import { setFilterData } from "@/app/store/core/crudSlice";
import { useState, useCallback } from "react";
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
	const filterData = useSelector((state) => state.crud[module]?.filterData || { keywordSearch: "", created: "" });
	const dispatch = useDispatch();

	const [keywordSearch, setKeywordSearch] = useState(filterData.keywordSearch || "");
	const [date, setDate] = useState("");

	// =============== handle search functionality ================
	const handleSearch = (searchData) => {
		const data = searchData || { keywordSearch, created: date };

		form.setFieldValue("keywordSearch", data.keywordSearch);
		form.setFieldValue("created", data.created);
		dispatch(setFilterData({ module, data }));
		if (onSearch) {
			onSearch(data);
		}
	};

	// =============== handle keyword change ================
	const handleKeywordChange = (value) => {
		setKeywordSearch(value);
	};

	// =============== handle date change ================
	const handleDateChange = (value) => {
		setDate(value);
		handleSearch({ keywordSearch, created: value });
	};

	// =============== handle reset functionality ================
	const handleReset = useCallback(() => {
		setKeywordSearch("");
		setDate("");
		const resetData = { keywordSearch: "", created: "" };
		dispatch(setFilterData({ module, data: resetData }));
		if (onReset) {
			onReset(resetData);
		}
	}, [dispatch, module, onReset]);

	return (
		<Flex className={className}>
			{showDatePicker && (
				<DateInput
					clearable
					name="created"
					placeholder="Select Date"
					value={date}
					onChange={handleDateChange}
					miw={200}
				/>
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
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						handleSearch();
					}
				}}
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
