import { Box, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import KeywordSearch from "@modules/filter/KeywordSearch";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import usePaginatedTableWithStockItemMatrix from "@hooks/usePaginatedTableWithStockItemMatrix.js";

const PER_PAGE = 25;

export default function _Table({ module }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 100;

	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module]?.filterData);
	const listData = useSelector((state) => state.crud[module]?.data);

	const { page, records, total, fetching, sortStatus, setSortStatus, handlePageChange, perPage } =
		usePaginatedTableWithStockItemMatrix({
			module,
			fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.STOCK_MATRIX,
			filterParams: {
				name: filterData?.name,
				term: searchKeyword,
			},
			perPage: PER_PAGE,
			sortByKey: "name",
			direction: "asc",
		});

	// Generate warehouse columns dynamically
	const warehouseColumns = Array.isArray(listData?.warehouses)
		? listData.warehouses.map((wh) => ({
				accessor: `warehouse_${wh.name}`,
				title: wh.name,
				textAlign: "right",
				sortable: false,
				render: (item) => {
					if (!item.warehouses) return 0;
					const warehouseEntry = Object.values(item.warehouses).find((w) => w.name === wh.name);
					return warehouseEntry ? Number(warehouseEntry.quantity) || 0 : 0;
				},
				cellsStyle: () => ({ background: "#fff3cd" }),
		  }))
		: [];

	return (
		<>
			{/* Search bar */}
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none">
				<Flex align="center" justify="space-between" gap={4}>
					<KeywordSearch module={module} />
				</Flex>
			</Box>

			{/* Main DataTable */}
			<Box className="borderRadiusAll border-top-none">
				<DataTable
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						body: tableCss.body,
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					height={height}
					records={records}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							sortable: false,
							render: (_item, index) => (page - 1) * perPage + index + 1,
						},
						{
							accessor: "category_name",
							title: t("CategoryName"),
							sortable: true,
						},
						{
							accessor: "name",
							title: t("MedicineName"),
							sortable: true,
						},
						...warehouseColumns,
					]}
					fetching={fetching}
					textSelectionDisabled
					page={page}
					totalRecords={total}
					recordsPerPage={perPage}
					onPageChange={handlePageChange}
					sortStatus={sortStatus}
					onSortStatusChange={(status) =>
						setSortStatus({
							columnAccessor: status.columnAccessor,
							direction: status.direction,
						})
					}
					loaderSize="xs"
					loaderColor="grape"
					scrollAreaProps={{ type: "never" }}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
		</>
	);
}
