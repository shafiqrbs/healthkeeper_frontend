import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMounted } from "@mantine/hooks";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { setItemData } from "@/app/store/core/crudSlice";

const usePagination = ({
	module,
	fetchUrl,
	filterParams = {},
	perPage = 50,
	sortByKey = "name",
	direction = "desc",
}) => {
	const dispatch = useDispatch();
	const isMounted = useMounted();

	const listData = useSelector((state) => state.crud[module]?.data || {});
	const refetching = useSelector((state) => state.crud[module]?.refetching);

	const [page, setPage] = useState(1);
	const [fetching, setFetching] = useState(false);
	const previousTotalRef = useRef(0);

	const [sortStatus, setSortStatus] = useState({
		columnAccessor: sortByKey,
		direction,
	});

	// =============== clear records when fetching to prevent showing old data ================
	const records = fetching ? [] : Array.isArray(listData.data) ? listData.data : [];
	const currentTotal = listData.total || 0;
	// =============== use previous total during fetching to keep pagination visible ================
	const total = fetching && previousTotalRef.current > 0 ? previousTotalRef.current : currentTotal;
	// =============== update ref when we have a valid total ================
	if (currentTotal > 0) {
		previousTotalRef.current = currentTotal;
	}
	const totalPages = Math.ceil(total / perPage);

	// =============== fetch data from API ================
	const fetchData = async (pageNum = 1) => {
		setFetching(true);
		dispatch(
			setItemData({
				module,
				data: {
					data: [],
					total: 0,
				},
			})
		);

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

			dispatch(
				setItemData({
					module,
					data: {
						data: newItems,
						total: totalCount,
					},
				})
			);
		} catch (err) {
			console.error("Pagination fetch error:", err);
		} finally {
			setFetching(false);
		}
	};

	// =============== handle page change ================
	const handlePageChange = useCallback(
		(newPage) => {
			setPage(newPage);
			fetchData(newPage);
		},
		[sortStatus, filterParams]
	);

	// =============== reset + refetch all ================
	const refetchAll = useCallback(() => {
		setPage(1);
		fetchData(1);
	}, [sortStatus, filterParams]);

	useEffect(() => {
		dispatch(
			setItemData({
				module,
				data: {
					data: [],
					total: 0,
				},
			})
		);
	}, [module, fetchUrl, dispatch]);

	// =============== trigger refetch when filters, sort, or refetching changes ================
	useEffect(() => {
		if (isMounted || refetching) {
			refetchAll();
		}
	}, [
		isMounted,
		JSON.stringify(filterParams),
		refetching,
		sortStatus.columnAccessor,
		sortStatus.direction,
	]);

	return {
		records,
		fetching,
		sortStatus,
		setSortStatus,
		handlePageChange,
		refetchAll,
		page,
		total,
		totalPages,
		perPage,
	};
};

export default usePagination;
