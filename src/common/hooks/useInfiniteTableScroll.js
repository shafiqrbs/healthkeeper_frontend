import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMounted } from "@mantine/hooks";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { setItemData } from "@/app/store/core/crudSlice";

const useInfiniteTableScroll = ({
	module,
	fetchUrl,
	filterParams = {},
	perPage = 50,
	sortByKey = "name",
	direction = "asc",
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
		direction,
	});

	// Use data from redux store (keeps server-sorted)
	const records = Array.isArray(listData.data) ? listData.data : [];

	// ---- fetch data from API
	const fetchData = async (pageNum = 1, append = false) => {
		setFetching(true);

		const value = {
			url: fetchUrl,
			params: {
				...filterParams,
				page: pageNum,
				offset: perPage,
				sortBy: sortStatus.columnAccessor,
				order: sortStatus.direction, // "asc" or "desc"
			},
			module,
		};

		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			const newItems = result.data?.data || [];
			const totalCount = result.data?.total || 0;
			const prevItems = append ? listData.data || [] : [];
			const combined = append ? [...prevItems, ...newItems] : [...newItems];

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

	// ---- infinite scroll handler
	const handleScrollToBottom = useCallback(() => {
		if (!hasMore || fetching) return;
		const next = page + 1;
		setPage(next);
		fetchData(next, true);
	}, [fetching, hasMore, page, sortStatus, filterParams]);

	// ---- reset + refetch all
	const refetchAll = useCallback(() => {
		setPage(1);
		setHasMore(true);
		scrollRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
		fetchData(1, false);
	}, [sortStatus, filterParams]);

	// ---- trigger refetch when filters, sort, or refetching changes
	useEffect(() => {
		if (isMounted || refetching) {
			refetchAll();
		}
	}, [isMounted, JSON.stringify(filterParams), refetching, sortStatus.columnAccessor, sortStatus.direction]);

	return {
		scrollRef,
		records,
		fetching,
		sortStatus,
		setSortStatus,
		handleScrollToBottom,
        refetchAll
	};
};

export default useInfiniteTableScroll;
