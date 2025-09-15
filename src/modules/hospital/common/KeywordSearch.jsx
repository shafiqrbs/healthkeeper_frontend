import { ActionIcon, Flex, Select, TextInput } from "@mantine/core";
import { IconFileTypeXls, IconRestore, IconSearch, IconX } from "@tabler/icons-react";
import AdvancedFilter from "../../../common/components/advance-search/AdvancedFilter";
import { useDispatch, useSelector } from "react-redux";
import { setFilterData } from "@/app/store/core/crudSlice";
import { useState, useCallback, useEffect } from "react";
import { DateInput } from "@mantine/dates";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { MODULES_CORE } from "@/constants";

const roomModule = MODULES_CORE.OPD_ROOM;

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
	const [fetching, setFetching] = useState(false);
	const [records, setRecords] = useState([]);
	const [keywordSearch, setKeywordSearch] = useState(filterData.keywordSearch || "");
	const [date, setDate] = useState("");
	const rooms = useSelector((state) => state.crud[roomModule].data);

	const fetchData = async () => {
		setFetching(true);
		const value = {
			url: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.VISITING_ROOM,
			module: roomModule,
		};

		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			const roomData = result?.data?.data?.ipdRooms || [];

			setRecords(roomData);
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		if (rooms?.data?.ipdRooms?.length) {
			setRecords(rooms.data.ipdRooms);
		} else {
			fetchData();
		}
	}, []);

	// =============== handle search functionality ================
	const handleSearch = (searchData) => {
		const data = searchData || { keywordSearch, created: date, room_id: form.values.room_id };

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
		handleSearch({ keywordSearch, created: value, room_id: form.values.room_id });
	};

	// =============== handle reset functionality ================
	const handleReset = useCallback(() => {
		setKeywordSearch("");
		setDate("");
		const resetData = { keywordSearch: "", created: "", room_id: "" };
		dispatch(setFilterData({ module, data: resetData }));
		if (onReset) {
			onReset(resetData);
		}
	}, [dispatch, module, onReset]);

	const handleRoomChange = (value) => {
		form.setFieldValue("room_id", value);
		handleSearch({ keywordSearch, created: date, room_id: value });
	};

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
			<Select
				clearable
				placeholder="Room"
				loading={fetching}
				data={records.map((item) => ({ label: item.name, value: item.id?.toString() }))}
				value={form.values.room_id}
				onChange={(value) => handleRoomChange(value)}
				w={250}
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
