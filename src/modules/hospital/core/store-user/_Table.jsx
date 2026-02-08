import { Box, Flex, Select } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useOs, useHotkeys } from "@mantine/hooks";
import KeywordSearch from "@modules/filter/KeywordSearch";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { errorNotification } from "@components/notification/errorNotification";

import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { inlineUpdateEntityData } from "@/app/store/core/crudThunk";
import { setInsertType } from "@/app/store/core/crudSlice.js";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice";
import tableCss from "@assets/css/TableAdmin.module.css";
import usePagination from "@hooks/usePagination";

const PER_PAGE = 25;

export default function _Table({ module, open }) {
	const { t } = useTranslation();
	const os = useOs();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { mainAreaHeight } = useOutletContext();

	const height = mainAreaHeight - 108;
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module].filterData);

	const [submitFormData, setSubmitFormData] = useState({});
	const [loadingIds, setLoadingIds] = useState([]);

	// Fetch original records
	const {
		records: fetchedRecords,
		fetching,
		page,
		total,
		perPage,
		handlePageChange,
	} = usePagination({
		module,
		fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.STORE_USER.INDEX,
		filterParams: {
			name: filterData?.name,
			term: searchKeyword,
		},
		perPage: PER_PAGE,
		sortByKey: "name",
	});

	// Local editable record state (IMPORTANT FIX)
	const [records, setRecords] = useState([]);

	useEffect(() => {
		if (fetchedRecords?.length) {
			setRecords(fetchedRecords);
		}
	}, [fetchedRecords]);

	// Dropdown data
	const { data: warehouseDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.WAREHOUSE.PATH,
		utility: CORE_DROPDOWNS.WAREHOUSE.UTILITY,
	});

	// Initialize form state
	useEffect(() => {
		if (!records?.length) return;

		const initialData = records.reduce((acc, item) => {
			const first = item.warehouses?.[0]?.warehouse_id || null;
			acc[item.user_id] = { warehouse: first };
			return acc;
		}, {});

		setSubmitFormData(initialData);
	}, [records]);

	// Create form
	const handleCreateForm = () => {
		open();
		dispatch(setInsertType({ insertType: "create", module }));
		navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.STORE_USER.INDEX);
	};

	// Update single record locally
	const updateLocalRecord = (userId, newWarehouse) => {
		setRecords((prev) =>
			prev.map((item) =>
				item.user_id === userId ? { ...item, warehouses: [{ warehouse_id: newWarehouse }] } : item
			)
		);

		setSubmitFormData((prev) => ({
			...prev,
			[userId]: { warehouse: newWarehouse },
		}));
	};

	// Inline update select
	const handleInlineChange = async (userId, value) => {
		const newWarehouse = Number(value);

		const oldWarehouse = records.find((item) => item.user_id === userId)?.warehouses?.[0]?.warehouse_id || null;

		if (oldWarehouse === newWarehouse) return;

		// optimistic update
		updateLocalRecord(userId, newWarehouse);

		const payload = {
			url: `${MASTER_DATA_ROUTES.API_ROUTES.STORE_USER.INLINE_UPDATE}/${userId}`,
			data: { store_id: newWarehouse },
			module,
		};

		setLoadingIds((prev) => [...prev, userId]);

		try {
			await dispatch(inlineUpdateEntityData(payload)).unwrap();
		} catch (error) {
			errorNotification(error.message || t("Something went wrong"));

			// rollback on fail
			updateLocalRecord(userId, oldWarehouse);
		} finally {
			setLoadingIds((prev) => prev.filter((id) => id !== userId));
		}
	};

	// Hotkeys
	useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", handleCreateForm]]);

	// Warehouse column
	const renderWarehouses = (item) => {
		const userId = item.user_id;
		const selected = submitFormData[userId]?.warehouse || null;

		return (
			<Select
				data={warehouseDropdown}
				value={selected ? String(selected) : null}
				onChange={(value) => handleInlineChange(userId, value)}
				placeholder="Select Department"
				searchable
				clearable
				size="xs"
				maxDropdownHeight={300}
				disabled={loadingIds.includes(userId)}
			/>
		);
	};

	// Columns
	const columns = useMemo(
		() => [
			{
				accessor: "index",
				title: t("S/N"),
				render: (item) => records.indexOf(item) + 1,
			},
			{
				accessor: "name",
				title: t("Name"),
			},
			{
				accessor: "username",
				title: t("UserName"),
			},
			{
				accessor: "warehouse",
				title: t("Department"),
				width: "240px",
				render: renderWarehouses,
			},
		],
		[records, submitFormData, loadingIds, warehouseDropdown]
	);

	return (
		<>
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none">
				<Flex align="center" justify="space-between" gap={4}>
					<KeywordSearch module={module} />
				</Flex>
			</Box>

			<Box className="borderRadiusAll border-top-none">
				<DataTable
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						body: tableCss.body,
						header: tableCss.header,
						footer: tableCss.footer,
					}}
					records={records}
					columns={columns}
					fetching={fetching}
					page={page}
					totalRecords={total}
					recordsPerPage={perPage}
					onPageChange={handlePageChange}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 12}
				/>
			</Box>
		</>
	);
}
