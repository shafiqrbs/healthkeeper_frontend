import { ActionIcon, Flex, Select, TextInput } from "@mantine/core";
import { IconFileTypeXls, IconRestore, IconSearch, IconX } from "@tabler/icons-react";
import AdvancedFilter from "../../../common/components/advance-search/AdvancedFilter";
import { useDispatch, useSelector } from "react-redux";
import { setFilterData } from "@/app/store/core/crudSlice";
import { useState, useCallback, useEffect } from "react";
import { DateInput } from "@mantine/dates";
import { formatDate } from "@/common/utils";
import { useDebouncedCallback } from "@mantine/hooks";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { MODULES_CORE } from "@/constants";

const roomModule = MODULES_CORE.OPD_ROOM;
const units = ["Unit 1", "Unit 2", "Unit 3"];

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
	showOpdRoom = false,
	showUnits = false,
	className = "keyword-search-box",
	handleCSVDownload = () => {},
}) {
	const dispatch = useDispatch();
	const [fetching, setFetching] = useState(false);
	const [records, setRecords] = useState([]);
	const [keywordSearch, setKeywordSearch] = useState(form.values.keywordSearch || "");
	const [date, setDate] = useState(null);
	const rooms = useSelector((state) => state.crud[roomModule].data);

	// =============== debounce keyword to control api calls via form state ================
	const debouncedSetKeywordInForm = useDebouncedCallback((value) => {
		form.setFieldValue("keywordSearch", value);
	}, 500);

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
		if (form.values?.keywordSearch) {
			setKeywordSearch(form.values.keywordSearch);
		}
		if (form.values?.created) {
			const [day, month, year] = String(form.values.created).split("-");
			const parsed = new Date(Number(year), Number(month) - 1, Number(day));
			setDate(isNaN(parsed) ? null : parsed);
		}

		if (rooms?.data?.ipdRooms?.length) {
			setRecords(rooms.data.ipdRooms);
		} else {
			fetchData();
		}
	}, []);

	// =============== handle search functionality ================
	const handleSearch = (searchData) => {
		const data = searchData || {
			keywordSearch,
			created: date ? formatDate(date) : "",
			room_id: form.values.room_id,
		};

		if (onSearch) {
			onSearch(data);
		}
	};

	// =============== handle keyword change ================
	const handleKeywordChange = (value) => {
		setKeywordSearch(value);
		debouncedSetKeywordInForm(value);
	};

	// =============== handle date change ================
	const handleDateChange = (value) => {
		form.setFieldValue("created", value ? formatDate(value) : "");
		setDate(value);
		handleSearch({ keywordSearch, created: value ? formatDate(value) : "", room_id: form.values.room_id });
	};

	// =============== handle reset functionality ================
	const handleReset = useCallback(() => {
		form.setFieldValue("keywordSearch", "");
		debouncedSetKeywordInForm.flush?.();
		form.setFieldValue("created", null);
		form.setFieldValue("room_id", "");
		setKeywordSearch("");
		setDate(null);
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
			{showOpdRoom && (
				<Select
					clearable
					placeholder="Room"
					loading={fetching}
					data={records.map((item) => ({ label: item.name, value: item.id?.toString() }))}
					value={form.values.room_id}
					onChange={(value) => handleRoomChange(value)}
					w={250}
				/>
			)}
			{showUnits && (
				<Select
					clearable
					placeholder="Unit"
					loading={fetching}
					data={units.map((item) => ({ label: item, value: item }))}
					value={form.values.unit_id}
					onChange={(value) => form.setFieldValue("unit_id", value)}
					w={250}
				/>
			)}
			<Flex gap="3xs" align="center">
				<ActionIcon c="var(--theme-primary-color-6)" bg="white" onClick={() => handleSearch()}>
					<IconSearch size={16} stroke={1.5} />
				</ActionIcon>

				{showReset && (
					<ActionIcon c="var(--theme-tertiary-color-8)" bg="white" onClick={handleReset}>
						<IconRestore size={16} stroke={1.5} />
					</ActionIcon>
				)}

				{showAdvancedFilter && <AdvancedFilter />}

				<ActionIcon c="var(--theme-success-color-3)" bg="white" onClick={handleCSVDownload}>
					<IconFileTypeXls size={16} stroke={1.5} />
				</ActionIcon>
			</Flex>
		</Flex>
	);
}
