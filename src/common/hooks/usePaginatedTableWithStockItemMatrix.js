import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { setItemData } from "@/app/store/core/crudSlice";

const usePaginatedTableWithStockItemMatrix = ({
                                                  module,
                                                  fetchUrl,
                                                  filterParams = {},
                                                  perPage = 25,
                                                  sortByKey = "name",
                                                  direction = "asc",
                                              }) => {
    const dispatch = useDispatch();
    const listData = useSelector((state) => state.crud[module]?.data || {});
    const refetching = useSelector((state) => state.crud[module]?.refetching);

    const [page, setPage] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [sortStatus, setSortStatus] = useState({
        columnAccessor: sortByKey,
        direction,
    });

    const total = listData.total || 0;
    const records = Array.isArray(listData.data) ? listData.data : [];

    // Fetch data from API
    const fetchData = async (pageNum = 1) => {
        setFetching(true);
        const value = {
            url: fetchUrl,
            params: {
                ...filterParams,
                page: pageNum,
                recordsPerPage: perPage,
                sortField: sortStatus.columnAccessor,
                sortOrder: sortStatus.direction,
            },
            module,
        };

        try {
            const result = await dispatch(getIndexEntityData(value)).unwrap();
            const items = result?.data?.data || [];
            const totalCount = result?.data?.total || 0;

            dispatch(
                setItemData({
                    module,
                    data: {
                        ...listData,
                        data: items,
                        total: totalCount,
                        warehouses: result?.data?.warehouses || [],
                    },
                })
            );
        } finally {
            setFetching(false);
        }
    };

    // Reload on filter/refetch
    useEffect(() => {
        fetchData(1);
        setPage(1);
    }, [JSON.stringify(filterParams), refetching]);

    // Reload on sort change
    useEffect(() => {
        fetchData(1);
        setPage(1);
    }, [sortStatus.columnAccessor, sortStatus.direction]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchData(newPage);
    };

    return {
        page,
        perPage,
        total,
        records,
        fetching,
        sortStatus,
        setSortStatus,
        handlePageChange,
    };
};

export default usePaginatedTableWithStockItemMatrix;
