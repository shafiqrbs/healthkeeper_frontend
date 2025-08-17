import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMounted } from "@mantine/hooks";
import { sortBy } from "lodash";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { setItemData } from "@/app/store/core/crudSlice";

const useInfiniteTableScroll = ({
                                    module,
                                    fetchUrl,
                                    filterParams = {},
                                    perPage = 50,
                                    sortByKey = "name",
                                }) => {
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const isMounted = useMounted();

    const listData = useSelector((state) => state.crud[module]?.data || {});
    const refetching = useSelector((state) => state.crud[module]?.refetching);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [fetching, setFetching] = useState(false);

    const [sortStatus, setSortStatus] = useState({
        columnAccessor: sortByKey,
        direction: "asc",
    });

    const [records, setRecords] = useState([]);

    // fetch the data & combine with previous
    const fetchData = async (pageNum = 1, append = false) => {
        setFetching(true);
        const value = {
            url: fetchUrl,
            params: {
                ...filterParams,
                page: pageNum,
                offset: perPage,
            },
            module,
        };

        try {
            const result = await dispatch(getIndexEntityData(value)).unwrap();
            const newItems = result.data?.data || [];
            const totalCount = result.data?.total || 0;
            const prevItems = append ? listData.data || [] : [];
            const combined = [...prevItems, ...newItems];

            dispatch(
                setItemData({
                    module,
                    data: {
                        ...listData,
                        data: combined,
                        total: totalCount,
                    },
                })
            );

            setHasMore(combined.length < totalCount);
        } catch (err) {
            console.error("Infinite scroll fetch error:", err);
        } finally {
            setFetching(false);
        }
    };

    // scroll to bottom & fetch the data again
    const handleScrollToBottom = useCallback(() => {
        if (!hasMore || fetching) return;
        const next = page + 1;
        setPage(next);
        fetchData(next, true);
    }, [fetching, hasMore, page]);

    // re-fetch ta data at initial stage
    const refetchAll = () => {
        setPage(1);
        setHasMore(true);
        scrollRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
        fetchData(1, false);
    };

    useEffect(() => {
        if (isMounted || refetching) {
            refetchAll();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, JSON.stringify(filterParams), refetching]);

    // handle the sort order
    useEffect(() => {
        const sorted = sortBy(listData.data || [], sortStatus.columnAccessor);
        setRecords(sortStatus.direction === "desc" ? sorted.reverse() : sorted);
    }, [listData.data, sortStatus]);

    // return the values for generate data-table
    return {
        scrollRef,
        records,
        fetching,
        sortStatus,
        setSortStatus,
        handleScrollToBottom,
    };
};

export default useInfiniteTableScroll;
