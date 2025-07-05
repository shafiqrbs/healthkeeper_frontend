import React, { useEffect, useState, useRef, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Group, Box, ActionIcon, Text, Menu, rem, Flex, Paper } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconTrashX, IconDotsVertical, IconRestore } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { setRefetchData, setInsertType } from "@/app/store/core/crudSlice.js";
import { getIndexEntityData } from "@/app/store/core/crudThunk.js";
import KeywordSearch from "@/modules/filter/KeywordSearch";
import { modals } from "@mantine/modals";
import tableCss from "@assets/css/Table.module.css";
import getConfigData from "@hooks/config-data/useConfigData";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent.jsx";
import CreateButton from "@components/buttons/CreateButton";
import { notifications } from "@mantine/notifications";
import DataTableFooter from "@components/tables/DataTableFooter";

function DomainTable({ open }) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 98; //TabList height 104
	const scrollViewportRef = useRef(null);

	const perPage = 50;
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [fetching, setFetching] = useState(false);

	const { configData, fetchData } = getConfigData();
	const [superadmin, setSuperadmin] = useState(
		configData?.domain?.modules?.includes(["superadmin"]) || false
	);

	const searchKeyword = useSelector((state) => state.crud.searchKeyword);

	const navigate = useNavigate();
	const [reloadList, setReloadList] = useState(true);

	const [indexData, setIndexData] = useState([]);

	const fetchDomainData = async (pageNum = 1, append = false) => {
		if (!hasMore && pageNum > 1) return;

		setFetching(true);
		const value = {
			url: "domain/global",
			params: {
				term: searchKeyword,
				page: pageNum,
				offset: perPage,
			},
			module: "domain",
		};

		try {
			const resultAction = await dispatch(getIndexEntityData(value));

			if (getIndexEntityData.rejected.match(resultAction)) {
				console.error("Error:", resultAction);
			} else if (getIndexEntityData.fulfilled.match(resultAction)) {
				const newData = resultAction.payload.data;
				const total = resultAction.payload.total;

				// Update hasMore based on whether we've loaded all data
				setHasMore(newData.length === perPage && pageNum * perPage < total);

				// If appending, combine with existing data
				if (append && pageNum > 1) {
					setIndexData((prevData) => ({
						...prevData,
						data: [...prevData.data, ...newData],
						total: total,
					}));
				} else {
					setIndexData(resultAction.payload);
				}
			}
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
			setReloadList(false);
		}
	};

	const loadMoreRecords = useCallback(() => {
		if (hasMore && !fetching) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchDomainData(nextPage, true);
		} else if (!hasMore) {
			notifications.show({
				title: t("No more records"),
				message: t("All records have been loaded."),
			});
		}
	}, [hasMore, fetching, page]);

	useEffect(() => {
		fetchDomainData(1, false);
		setPage(1);
		setHasMore(true);
		// Reset scroll position when data is refreshed
		scrollViewportRef.current?.scrollTo(0, 0);
	}, [dispatch, searchKeyword]);

	const handleConfirmDomainReset = async (id) => {
		try {
			const resultAction = await dispatch(
				showEntityData({
					url: `domain/restore/reset/${id}`,
					module: "domain",
				})
			);
			if (showEntityData.fulfilled.match(resultAction)) {
				if (resultAction.payload.data.status === 200) {
					// Show success notification
					showNotificationComponent(
						t("ResetSuccessfully"),
						"teal",
						"lightgray",
						null,
						false,
						1000,
						true
					);
					fetchData();
				}
			}
		} catch (error) {
			console.error("Error updating entity:", error);
			// Error notification
			showNotificationComponent(
				t("ResetFailed"),
				"red",
				"lightgray",
				null,
				false,
				1000,
				true
			);
		} finally {
			setSuperadmin(true);
			setReloadList(true);
			dispatch(setRefetchData({ module: "domain", refetching: true }));
		}
	};

	const handleConfirmDomainDelete = async (id) => {
		try {
			const resultAction = await dispatch(
				showEntityData({
					url: `domain/restore/delete/${id}`,
					module: "domain",
				})
			);
			if (showEntityData.fulfilled.match(resultAction)) {
				if (resultAction.payload.data.status === 200) {
					// Show success notification
					showNotificationComponent(
						t("DeleteSuccessfully"),
						"teal",
						"lightgray",
						null,
						false,
						1000,
						true
					);
					fetchData();
				}
			}
		} catch (error) {
			console.error("Error updating entity:", error);
			// Error notification
			showNotificationComponent(
				t("DeleteFailed"),
				"red",
				"lightgray",
				null,
				false,
				1000,
				true
			);
		} finally {
			setSuperadmin(true);
			setReloadList(true);
			dispatch(setRefetchData({ module: "domain", refetching: true }));
		}
	};
	const user = JSON.parse(localStorage.getItem("user") || "{}");

	const handleCreateDomain = () => {
		open();
		dispatch(setInsertType({ insertType: "create", module: "domain" }));
		navigate("/domain", { replace: true });
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
					<KeywordSearch module="domain" />
					<CreateButton handleModal={handleCreateDomain} text="CreateDomain" />
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
					records={indexData?.data?.data || []}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (item) => indexData?.data?.data?.indexOf(item) + 1,
						},
						{ accessor: "company_name", title: t("CompanyName") },
						{
							accessor: "name",
							title: t("ClientName"),
						},
						{ accessor: "mobile", title: t("Mobile") },
						{
							accessor: "email",
							title: t("Email"),
						},
						{ accessor: "unique_code", title: t("LicenseNo") },
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							render: (data) => (
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
													height={"18"}
													width={"18"}
													stroke={1.5}
												/>
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												onClick={() => {
													open();
													dispatch(
														setInsertType({
															module: "domain",
															insertType: "edit",
														})
													);
													dispatch(
														setRefetchData({
															module: "domain",
															refetching: true,
														})
													);
													navigate(`/domain/edit/${data.id}`);
												}}
											>
												{t("Edit")}
											</Menu.Item>

											<Menu.Item
												onClick={() => {}}
												target="_blank"
												component="a"
												w={"200"}
											>
												{t("Show")}
											</Menu.Item>
											<Menu.Item
												onClick={() => {
													navigate(`/domain/config/${data.id}`);
												}}
												target="_blank"
												component="a"
												w={"200"}
											>
												{t("Configuration")}
											</Menu.Item>
											{superadmin && (
												<Menu.Item
													target="_blank"
													component="a"
													w={"200"}
													mt={"2"}
													bg={"red.1"}
													c={"red.6"}
													onClick={() => {
														modals.openConfirmModal({
															title: (
																<Text size="md">
																	{" "}
																	{t("ReserThisDomain")}
																</Text>
															),
															children: (
																<Text size="sm">
																	{" "}
																	{t("FormConfirmationMessage")}
																</Text>
															),
															labels: {
																confirm: "Confirm",
																cancel: "Cancel",
															},
															onCancel: () => console.log("Cancel"),
															onConfirm: () => {
																handleConfirmDomainReset(data.id);
															},
														});
													}}
													rightSection={
														<IconRestore
															style={{
																width: rem(14),
																height: rem(14),
															}}
														/>
													}
												>
													{t("Reset")}
												</Menu.Item>
											)}

											{superadmin && user.domain_id != data.id && (
												<Menu.Item
													target="_blank"
													component="a"
													w={"200"}
													mt={"2"}
													bg={"red.1"}
													c={"red.6"}
													onClick={() => {
														modals.openConfirmModal({
															title: (
																<Text size="md">
																	{" "}
																	{t("DeleteThisDomain")}
																</Text>
															),
															children: (
																<Text size="sm">
																	{" "}
																	{t("FormConfirmationMessage")}
																</Text>
															),
															labels: {
																confirm: "Confirm",
																cancel: "Cancel",
															},
															onCancel: () => console.log("Cancel"),
															onConfirm: () => {
																handleConfirmDomainDelete(data.id);
															},
														});
													}}
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
											)}
										</Menu.Dropdown>
									</Menu>
								</Group>
							),
						},
					]}
					fetching={fetching || reloadList}
					totalRecords={indexData.total}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 72}
					onScrollToBottom={loadMoreRecords}
					scrollViewportRef={scrollViewportRef}
				/>
			</Box>
			<DataTableFooter indexData={indexData} module="domains" />
		</>
	);
}

export default DomainTable;
