import { Box, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import KeywordSearch from "@modules/filter/KeywordSearch";
import DataTableFooter from "@components/tables/DataTableFooter";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import UseInfiniteTableScrollWithExtraData from "@hooks/useInfiniteTableScrollWithStockItemMatrix.js";

const PER_PAGE = 50;

export default function _Table({ module }) {
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 48;

    const searchKeyword = useSelector((state) => state.crud.searchKeyword);
    const filterData = useSelector((state) => state.crud[module].filterData);
    const listData = useSelector((state) => state.crud[module].data);

    // Infinite scroll logic
    const {
        scrollRef,
        records,
        fetching,
        sortStatus,
        setSortStatus,
        handleScrollToBottom,
    } = UseInfiniteTableScrollWithExtraData(
        {
            module,
            fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.STOCK_MATRIX,
            filterParams: {
                name: filterData?.name,
                term: searchKeyword,
            },
            perPage: PER_PAGE,
            sortByKey: "name",
        }
    );

    // 🧩 Generate warehouse columns dynamically (match by name)
    const warehouseColumns = Array.isArray(listData?.warehouses)
        ? listData.warehouses.map((wh) => ({
            accessor: `warehouse_${wh.name}`, // use name as accessor
            title: wh.name,
            textAlign: "right",
            sortable: true,
            render: (item) => {
                if (!item.warehouses) return 0;

                // Match by name
                const warehouseEntry = Object.values(item.warehouses).find(
                    (w) => w.name === wh.name
                );

                return warehouseEntry ? Number(warehouseEntry.quantity) || 0 : 0;
            },
            cellsStyle: () => ({ background: "#fff3cd" }),
        }))
        : [];


    return (
        <>
            {/* 🔍 Search bar */}
            <Box p="xs" className="boxBackground borderRadiusAll border-bottom-none">
                <Flex align="center" justify="space-between" gap={4}>
                    <KeywordSearch module={module} />
                </Flex>
            </Box>

            {/* 🧾 Main DataTable */}
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
                    records={records}
                    columns={[
                        {
                            accessor: "index",
                            title: t("S/N"),
                            textAlignment: "right",
                            sortable: false,
                            render: (_item, index) => index + 1,
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
                    textSelectionDisabled
                    fetching={fetching}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height - 100}
                    onScrollToBottom={handleScrollToBottom}
                    scrollViewportRef={scrollRef}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    sortIcons={{
                        sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
                        unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
                    }}
                />
            </Box>

            {/* 📊 Footer Summary */}
            <DataTableFooter indexData={listData} module={module} />
        </>
    );
}
