import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Group, Box, ActionIcon, Text, Menu, rem, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDotsVertical, IconTrashX, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import KeywordSearch from "@modules/filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { useMediaQuery, useMounted } from "@mantine/hooks";
import {
	deleteEntityData,
	getIndexEntityData,
	editEntityData,
} from "@/app/store/core/crudThunk.js";
import { setRefetchData, setInsertType, setItemData } from "@/app/store/core/crudSlice.js";
import tableCss from "@/assets/css/Table.module.css";
import VendorViewDrawer from "./__VendorViewDrawer.jsx";
import { notifications } from "@mantine/notifications";
import { getCoreVendors } from "@/common/utils/index.js";
import { SUCCESS_NOTIFICATION_COLOR, ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import CreateButton from "@components/buttons/CreateButton.jsx";
import DataTableFooter from "@components/tables/DataTableFooter.jsx";

function _VendorTable({ open, close }) {
	const isMounted = useMounted();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const { id } = useParams();
	const height = mainAreaHeight - 98; //TabList height 104
	const scrollViewportRef = useRef(null);

	const perPage = 50;
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
	const matches = useMediaQuery("(max-width: 64em)");

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
				offset: perPage,
			},
			module: "vendor",
		};

		try {
			const result = await dispatch(getIndexEntityData(value));
			if (result.payload) {
				const newData = result.payload.data;
				const total = result.payload.total;

				// Update hasMore based on whether we've loaded all data
				setHasMore(newData.length === perPage && pageNum * perPage < total);

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
			notifications.show({
				title: t("No more records"),
				message: t("All records have been loaded."),
			});
		}
	}, [hasMore, fetching, page]);

	useEffect(() => {
		if (!id && (isMounted || refetchData === true)) {
			fetchData(1, false);
			setPage(1);
			setHasMore(true);
			// Reset scroll position when data is refreshed
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
			confirmProps: { color: "red.6" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleDeleteSuccess(id),
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

	return (
		<>
			<Box
				pl="xs"
				pr={8}
				pt="6"
				pb="4"
				className="boxBackground borderRadiusAll border-bottom-none"
			>
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
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					records={vendorListData.data}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (item) => vendorListData.data?.indexOf(item) + 1,
						},
						{ accessor: "name", title: t("Name") },
						{ accessor: "company_name", title: t("CompanyName") },
						{ accessor: "mobile", title: t("Mobile") },
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Menu
										position="bottom-end"
										offset={3}
										withArrow
										trigger="hover"
										openDelay={100}
										closeDelay={400}
									>
										<Menu.Target>
											<ActionIcon
												size="sm"
												variant="outline"
												color="red"
												radius="xl"
												aria-label="Settings"
											>
												<IconDotsVertical
													height={18}
													width={18}
													stroke={1.5}
												/>
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												onClick={() => {
													handleVendorEdit(values.id);
													open();
												}}
											>
												{t("Edit")}
											</Menu.Item>
											<Menu.Item onClick={() => handleDataShow(values.id)}>
												{t("Show")}
											</Menu.Item>
											<Menu.Item
												onClick={() => handleDelete(values.id)}
												bg="red.1"
												c="red.6"
												rightSection={
													<IconTrashX
														style={{
															width: rem(14),
															height: rem(14),
														}}
													/>
												}
											>
												{t("Delete")}
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</Group>
							),
						},
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 72}
					onScrollToBottom={loadMoreRecords}
					scrollViewportRef={scrollViewportRef}
				/>
			</Box>
			<DataTableFooter indexData={vendorListData} module="vendors" />
			{viewDrawer && (
				<VendorViewDrawer
					viewDrawer={viewDrawer}
					setViewDrawer={setViewDrawer}
					vendorObject={vendorObject}
				/>
			)}
		</>
	);
}

export default _VendorTable;
