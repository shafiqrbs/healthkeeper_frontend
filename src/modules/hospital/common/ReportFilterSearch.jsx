import { ActionIcon, Flex, Select, TextInput } from "@mantine/core";
import { IconFile, IconFileTypeXls, IconRestore, IconSearch, IconX } from "@tabler/icons-react";
import AdvancedFilter from "@components/advance-search/AdvancedFilter";
import { useDispatch, useSelector } from "react-redux";
import { setFilterData } from "@/app/store/core/crudSlice";
import { useState, useCallback, useEffect } from "react";
import { DateInput } from "@mantine/dates";
import { formatDate } from "@/common/utils";
import { useDebouncedCallback } from "@mantine/hooks";
import { HOSPITAL_DATA_ROUTES, PHARMACY_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { ERROR_NOTIFICATION_COLOR, MODULES_CORE } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore.js";
import { notifications } from "@mantine/notifications";
import { errorNotification } from "@components/notification/errorNotification.jsx";

const roomModule = MODULES_CORE.OPD_ROOM;
const units = [ "Unit 1", "Unit 2", "Unit 3" ];
const invoiceModes = [
	{ id: "all", name: "All" },
	{ id: "opd", name: "OPD" },
	{ id: "emergency", name: "Emergency" },
];

export default function ReportFilterSearch({
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
	handleCSVDownload = () => { },
	handleCSVDownloadForUpload = () => { },
	showStockItems = false,
	showWarehouse = false,
	showInvoiceMode = false,
	downloadOpeningTemplate = false,
	mainAreaHeight,
}) {
	const dispatch = useDispatch();
	const [ fetching, setFetching ] = useState(false);
	const [ records, setRecords ] = useState([]);
	const [ stockItems, setStockItems ] = useState([]);
	const [ warehouseData, setWarehouseData ] = useState([]);
	const [ warehouse, setWarehouse ] = useState([]);
	const [ keywordSearch, setKeywordSearch ] = useState(form.values.keywordSearch || "");
	const [ date, setDate ] = useState(null);
	const [ startDate, setStartDate ] = useState(null);
	const [ endDate, setEndDate ] = useState(null);
	const rooms = useSelector((state) => state.crud[ roomModule ].data);
	const userWarehouse = useAuthStore(state => state.warehouse);

	// =============== debounce keyword to control api calls via form state ================
	const debouncedSetKeywordInForm = useDebouncedCallback((value) => {
		form.setFieldValue("keywordSearch", value);
	}, 500);


	const fetchStockItemData = async () => {
		setFetching(true);
		const value = {
			url: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.MEDICINE_STOCK_DROPDOWN,
			module: roomModule,
		};
		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			const itemData = result?.data?.data || [];
			setStockItems(itemData);
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		fetchStockItemData()
		setWarehouse(userWarehouse)
	}, []);



	const fetchUserData = async () => {
		setFetching(true);
		const value = {
			url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT_MASTERDATA.REPORT_USERS,
			module: roomModule,
		};
		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			const roomData = result?.data?.data || [];
			setRecords(roomData);
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

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
			const [ day, month, year ] = String(form.values.created).split("-");
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

		if (module === 'medicineIssue') {
			if (!startDate) {
				errorNotification('Start Date is required.', ERROR_NOTIFICATION_COLOR)
				return;
			}
			if (!endDate) {
				errorNotification('End Date is required.', ERROR_NOTIFICATION_COLOR)
				return;
			}

			if (!warehouseData || warehouseData.length === 0) {
				errorNotification('Warehouse is required.', ERROR_NOTIFICATION_COLOR)
				return;
			}
		}

		const data = searchData || {
			keywordSearch,
			created: date ? formatDate(date) : "",
			room_id: form.values.room_id,
			stock_item_id: form.values.stock_item_id,
			warehouse_id: form.values.warehouse_id,
			start_date: startDate ? formatDate(startDate) : "",
			end_date: endDate ? formatDate(endDate) : "",
		};
		form.setFieldValue("start_date", startDate ? formatDate(startDate) : "");
		form.setFieldValue("end_date", endDate ? formatDate(endDate) : "");
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
		//	form.setFieldValue("created", value ? formatDate(value) : "");
		setDate(value);
		//	handleSearch({ keywordSearch, created: value ? formatDate(value) : "", room_id: form.values.room_id });
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
	}, [ dispatch, module, onReset ]);

	const handleRoomChange = (value) => {
		form.setFieldValue("room_id", value);
		handleSearch({ keywordSearch, created: date, room_id: value });
	};

	const handleStockItemChange = (value) => {
		form.setFieldValue("stock_item_id", value);
		handleSearch({ keywordSearch, created: date, stock_item_id: value });
	};

	const handleWarehouseChange = (value) => {
		form.setFieldValue("warehouse_id", value);
		setWarehouseData(value);
		handleSearch({ keywordSearch, created: date, warehouse_id: value });
	};

	return (
		<Flex justify="flex-end"
			align="center"
			direction="row" className={className}>
			{showDatePicker && (
				<>
					<DateInput
						clearable
						name="start_date"
						placeholder="Select Date"
						value={startDate}
						onChange={(start_date) => setStartDate(start_date)}
						miw={200}
					/>
					<DateInput
						clearable
						name="end_date"
						placeholder="Select Date"
						value={endDate}
						onChange={(end_date) => setEndDate(end_date)}
						miw={200}
					/>
				</>
			)}

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

			{showWarehouse && (
				<Select
					placeholder="Department"
					loading={fetching}
					data={warehouse.map((item) => ({ label: item?.warehouse_name, value: item?.id?.toString() }))}
					value={form.values.warehouse_id}
					onChange={(value) => handleWarehouseChange(value)}
					w={250}
				/>
			)}

			{showStockItems && (
				<Select
					clearable
					placeholder="Items"
					loading={fetching}
					data={stockItems.map((item) => ({ label: item.name, value: item.id?.toString() }))}
					value={form.values.stock_item_id}
					onChange={(value) => handleStockItemChange(value)}
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

			{showInvoiceMode && (
				<Select
					clearable
					placeholder="InvoiceMode"
					loading={fetching}
					data={invoiceModes.map((item) => ({
						label: item.name,
						value: item.id,
					}))}
					value={form.values?.invoice_mode}
					onChange={(value) => form.setFieldValue("invoice_mode", value)}
				/>
			)}

			<Flex gap="3xs" align="center">
				<ActionIcon
					c="var(--theme-primary-color-6)"
					bg="var(--mantine-color-white)"
					onClick={() => handleSearch()}
				>
					<IconSearch size={16} stroke={1.5} />
				</ActionIcon>

				{showReset && (
					<ActionIcon c="var(--theme-tertiary-color-8)" bg="var(--mantine-color-white)" onClick={handleReset}>
						<IconRestore size={16} stroke={1.5} />
					</ActionIcon>
				)}

				{showAdvancedFilter && <AdvancedFilter mainAreaHeight={mainAreaHeight} />}

				<ActionIcon
					c="var(--theme-success-color-3)"
					bg="var(--mantine-color-white)"
					onClick={handleCSVDownload}
				>
					<IconFileTypeXls size={16} stroke={1.5} />
				</ActionIcon>

				{downloadOpeningTemplate &&

					<ActionIcon
						c="var(--theme-success-color-3)"
						bg="var(--mantine-color-white)"
						onClick={handleCSVDownloadForUpload}
					>
						<IconFile size={16} stroke={1.5} />
					</ActionIcon>
				}
			</Flex>
		</Flex>
	);
}
