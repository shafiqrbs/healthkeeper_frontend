import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Group, Box, ActionIcon, Text, rem, Flex, Button, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconTrashX,
	IconAlertCircle,
	IconCheck,
	IconEdit,
	IconEye,
	IconChevronUp,
	IconSelector,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import KeywordSearch from "@modules/filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { useHotkeys, useMounted } from "@mantine/hooks";
import { deleteEntityData, getIndexEntityData, editEntityData } from "@/app/store/core/crudThunk.js";
import { setRefetchData, setInsertType, setItemData } from "@/app/store/core/crudSlice.js";
import tableCss from "@assets/css/Table.module.css";
import ViewDrawer from "./__ViewDrawer.jsx";
import { notifications } from "@mantine/notifications";
import { getCoreVendors } from "@/common/utils/index.js";
import { SUCCESS_NOTIFICATION_COLOR, ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import CreateButton from "@components/buttons/CreateButton.jsx";
import DataTableFooter from "@components/tables/DataTableFooter.jsx";
import { sortBy } from "lodash";
import { useOs } from "@mantine/hooks";

const PER_PAGE = 50;

export default function _Table({ open, close }) {
	const isMounted = useMounted();
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams();
	const height = mainAreaHeight - 78; //TabList height 104
	const scrollViewportRef = useRef(null);
	const os = useOs();
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const [fetching, setFetching] = useState(false);
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const refetchData = useSelector((state) => state.crud.vendor.refetching);
	const vendorListData = useSelector((state) => state.crud.vendor.data);
	const vendorFilterData = useSelector((state) => state.crud.vendor.filterData);

	const [vendorObject, setVendorObject] = useState({});
	const navigate = useNavigate();
	const [viewDrawer, setViewDrawer] = useState(false);

	const [sortStatus, setSortStatus] = useState({
		columnAccessor: "name",
		direction: "asc",
	});

	const [records, setRecords] = useState(sortBy(vendorListData.data, "name"));

	useEffect(() => {
		const data = sortBy(vendorListData.data, sortStatus.columnAccessor);
		setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
	}, [sortStatus, vendorListData.data]);

	const fetchData = async (pageNum = 1, append = false) => {
		if (!hasMore && pageNum > 1) return;

		setFetching(true);
		const value = {
			url: "core/vendor",
			params: {
				term: searchKeyword,
				name: vendorFilterData.name,
				mobile: vendorFilterData.mobile,
				company_name: vendorFilterData.company_name,
				page: pageNum,
				offset: PER_PAGE,
			},
			module: "vendor",
		};

		try {
			const result = await dispatch(getIndexEntityData(value));
			if (result.payload) {
				const newData = result.payload.data;
				const total = result.payload.total;

				// Update hasMore based on whether we've loaded all data
				setHasMore(newData.length === PER_PAGE && pageNum * PER_PAGE < total);

				// If appending, combine with existing data
				if (append && pageNum > 1) {
					dispatch(
						setItemData({
							module: "vendor",
							data: {
								...vendorListData,
								data: [...vendorListData.data, ...newData],
								total: total,
							},
						})
					);
				}
			}
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	const loadMoreRecords = useCallback(() => {
		if (hasMore && !fetching) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchData(nextPage, true);
		} else if (!hasMore) {
			console.info("No more records");
		}
	}, [hasMore, fetching, page]);

	// =============== combined logic for data fetching and scroll reset ================
	useEffect(() => {
		if ((!id && (isMounted || refetchData)) || (id && !refetchData)) {
			fetchData(1, false);
			setPage(1);
			setHasMore(true);
			// reset scroll position when data is refreshed
			scrollViewportRef.current?.scrollTo(0, 0);
		}
	}, [dispatch, searchKeyword, vendorFilterData, refetchData, isMounted, id]);

	const handleVendorEdit = (id) => {
		dispatch(setInsertType({ insertType: "update", module: "vendor" }));
		dispatch(
			editEntityData({
				url: `core/vendor/${id}`,
				module: "vendor",
			})
		);
		navigate(`/core/vendor/${id}`);
	};

	const handleDelete = (id) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: {
				confirm: "Confirm",
				cancel: "Cancel",
			},
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleDeleteSuccess(id),
		});
	};

	const handleStatusChange = (id) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: {
				confirm: "Active",
				cancel: "Inactive",
			},
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => console.log(id),
		});
	};

	const handleDeleteSuccess = async (id) => {
		const resultAction = await dispatch(
			deleteEntityData({
				url: `core/vendor/${id}`,
				module: "vendor",
				id,
			})
		);
		if (deleteEntityData.fulfilled.match(resultAction)) {
			dispatch(setRefetchData({ module: "vendor", refetching: true }));
			notifications.show({
				color: SUCCESS_NOTIFICATION_COLOR,
				title: t("DeleteSuccessfully"),
				icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});
			navigate("/core/vendor");
			dispatch(setInsertType({ insertType: "create", module: "vendor" }));
		} else {
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: t("Delete Failed"),
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
			});
		}
	};

	const handleDataShow = (id) => {
		const coreVendors = getCoreVendors();
		const foundVendors = coreVendors.find((type) => type.id == id);
		if (foundVendors) {
			setVendorObject(foundVendors);
			setViewDrawer(true);
		} else {
			notifications.show({
				color: "red",
				title: t("Something Went wrong , please try again"),
				icon: (
					<IconAlertCircle
						style={{
							width: rem(18),
							height: rem(18),
						}}
					/>
				),
				loading: false,
				autoClose: 900,
				style: { backgroundColor: "lightgray" },
			});
		}
	};

	const handleCreateVendor = () => {
		open();
		dispatch(setInsertType({ insertType: "create", module: "vendor" }));
		navigate("/core/vendor");
	};

	useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => handleCreateVendor()]]);

	return (
		<>
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none ">
				<Flex align="center" justify="space-between" gap={4}>
					<KeywordSearch module="vendor" />
					<CreateButton handleModal={handleCreateVendor} text="CreateVendor" />
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
						pagination: tableCss.pagination,
					}}
					records={records}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							sortable: true,
							render: (item) => vendorListData.data?.indexOf(item) + 1,
						},
						{
							accessor: "name",
							title: t("Name"),
							sortable: true,
							render: (values) => (
								<Text className="activate-link" fz="sm" onClick={() => handleDataShow(values.id)}>
									{values.name}
								</Text>
							),
						},
						{ accessor: "company_name", title: t("CompanyName"), sortable: true },
						{ accessor: "mobile", title: t("Mobile"), sortable: true },
						{
							accessor: "status",
							title: t("Status"),
							render: (values) => (
								<Button
									onClick={() => handleStatusChange(values.id)}
									variant="filled"
									c="white"
									size="compact-xs"
									bg={values.status === 1 ? "var(--theme-success-color)" : "var(--theme-error-color)"}
								>
									{values.status === 1 ? "Active" : "Inactive"}
								</Button>
							),
						},
						{
							accessor: "action",
							title: t(""),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<>
									<Group gap={4} justify="right" wrap="nowrap">
										<Button.Group>
											<Button
												onClick={() => {
													handleVendorEdit(values.id);
													open();
												}}
												variant="filled"
												c="white"
												size="xs"
												radius="es"
												leftSection={<IconEdit size={16} />}
												className="border-right-radius-none btnPrimaryBg"
											>
												{t("Edit")}
											</Button>
											<Button
												onClick={() => handleDataShow(values.id)}
												variant="filled"
												c="white"
												bg="var(--theme-primary-color-6)"
												size="xs"
												radius="es"
												leftSection={<IconEye size={16} />}
												className="border-left-radius-none"
											>
												{t("View")}
											</Button>
											<ActionIcon
												onClick={() => handleDelete(values.id)}
												className="action-icon-menu border-left-radius-none"
												variant="light"
												color="var(--theme-delete-color)"
												radius="es"
												ps="les"
												aria-label="Settings"
											>
												<IconTrashX height={18} width={18} stroke={1.5} />
											</ActionIcon>
										</Button.Group>
									</Group>
								</>
							),
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 72}
					onScrollToBottom={loadMoreRecords}
					scrollViewportRef={scrollViewportRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
			<DataTableFooter indexData={vendorListData} module="vendors" />
			<ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} entityObject={vendorObject} />
		</>
	);
}
