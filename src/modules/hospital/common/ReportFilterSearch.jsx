import { ActionIcon, Flex, Select } from "@mantine/core";
import { IconFile, IconFileTypeXls, IconRestore, IconSearch } from "@tabler/icons-react";
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
import { errorNotification } from "@components/notification/errorNotification.jsx";

const roomModule = MODULES_CORE.OPD_ROOM;
const reportModule = MODULES_CORE.REPORT;
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
	showDatePicker = true,
	showAdvancedFilter = true,
	showReset = true,
	showOpdRoom = false,
	showUnits = false,
	className = "keyword-search-box",
	handleCSVDownload = () => { },
	handleCSVDownloadForUpload = () => { },
	showStockItems = false,
	showPurchaseWiseCenterWarehouseStockItems = false,
	showWarehouse = false,
	showInvoiceMode = false,
	downloadOpeningTemplate = false,
}) {
	const dispatch = useDispatch();
	const [ fetching, setFetching ] = useState(false);
	const [ records, setRecords ] = useState([]);
	const [ stockItems, setStockItems ] = useState([]);
	const [ purchaseWiseCenterWarehousestockItems, setPurchaseWiseCenterWarehouseStockItems ] = useState([]);
	const [ warehouseData, setWarehouseData ] = useState([]);
	const [ warehouse, setWarehouse ] = useState([]);
	const [ keywordSearch, setKeywordSearch ] = useState(form.values.keywordSearch || "");
	const [ date, setDate ] = useState(null);
	const [ startDate, setStartDate ] = useState(null);
	const [ endDate, setEndDate ] = useState(null);
	const rooms = useSelector((state) => state.crud[ roomModule ].data);
	const reports = useSelector((state) => state.crud[ reportModule ].data);
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
	const fetchPurchaseWiseCenterWarehouseStockItemData = async () => {
		setFetching(true);
		const value = {
			url: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.MEDICINE_PURCHASE_CENTER_STOCK_DROPDOWN,
			module: reportModule,
		};
		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			const itemData = result?.data?.data || [];
			setPurchaseWiseCenterWarehouseStockItems(itemData);
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		fetchStockItemData()
		fetchPurchaseWiseCenterWarehouseStockItemData()
		setWarehouse(userWarehouse)
	}, []);

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
					searchable
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
					searchable
					placeholder="Items"
					loading={fetching}
					data={stockItems.map((item) => ({ label: item.name, value: item.id?.toString() }))}
					value={form.values.stock_item_id}
					onChange={(value) => handleStockItemChange(value)}
					w={250}
				/>
			)}

			{showPurchaseWiseCenterWarehouseStockItems && (
				<Select
					clearable
					searchable
					placeholder="Items"
					loading={fetching}
					data={purchaseWiseCenterWarehousestockItems.map((item) => ({ label: item.name, value: item.id?.toString() }))}
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

				{showAdvancedFilter && <AdvancedFilter />}

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
