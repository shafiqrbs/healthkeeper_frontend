import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Group, Box, ActionIcon, Text, Menu, rem } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDotsVertical, IconTrashX, IconAlertCircle } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import KeywordSearch from "@modules/filter/KeywordSearch";
import { modals } from "@mantine/modals";
import {
	deleteEntityData,
	getIndexEntityData,
	editEntityData,
} from "@/app/store/core/crudThunk.js";
import tableCss from "@/assets/css/Table.module.css";
import VendorViewDrawer from "./VendorViewDrawer.jsx";
import { notifications } from "@mantine/notifications";
import { getCoreVendors } from "@/common/utils/index.js";

function VendorTable() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 98; //TabList height 104

	const perPage = 50;
	const [page, setPage] = useState(1);

	const [fetching, setFetching] = useState(true);
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const fetchingReload = useSelector((state) => state.crud.globalFetching);
	const vendorListData = useSelector((state) => state.crud.vendor.data);
	const vendorFilterData = useSelector((state) => state.crud.vendor.filterData);

	const [vendorObject, setVendorObject] = useState({});
	const navigate = useNavigate();
	const [viewDrawer, setViewDrawer] = useState(false);
	const [indexData, setIndexData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			setFetching(true);
			const value = {
				url: "core/vendor",
				params: {
					term: searchKeyword,
					name: vendorFilterData.name,
					mobile: vendorFilterData.mobile,
					company_name: vendorFilterData.company_name,
					page: page,
					offset: perPage,
				},
				module: "vendor",
			};

			try {
				// check if vendorListData is not empty to optimize the api call on re-render
				if (vendorListData.data?.length) {
					setIndexData(vendorListData);
					setFetching(false);
				} else {
					const resultAction = await dispatch(getIndexEntityData(value));

					if (getIndexEntityData.rejected.match(resultAction)) {
						console.error("Error:", resultAction);
					} else if (getIndexEntityData.fulfilled.match(resultAction)) {
						setIndexData(resultAction.payload?.data);
						setFetching(false);
					}
				}
			} catch (err) {
				console.error("Unexpected error:", err);
			}
		};

		fetchData();
	}, [dispatch, searchKeyword, vendorFilterData, page, fetchingReload]);

	const handleVendorEdit = (id, values) => {
		dispatch(
			editEntityData({
				url: `core/vendor/${id}`,
				module: "vendor",
			})
		);
		navigate(`/core/vendor/${id}`, { state: { values } });
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

	const handleDeleteSuccess = (id) => {
		const resultAction = dispatch(
			deleteEntityData({
				url: `core/vendor/${id}`,
				module: "vendor",
				id,
			})
		);
		console.log("resultAction 🚀 ~ handleDeleteSuccess ~ resultAction:", resultAction);
		if (deleteEntityData.fulfilled.match(resultAction)) {
			notifications.show({
				color: "red",
				title: t("DeleteSuccessfully"),
				icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});
		} else {
			notifications.show({
				color: "red",
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

	return (
		<>
			<Box
				pl={`xs`}
				pr={8}
				pt={"6"}
				pb={"4"}
				className="boxBackground borderRadiusAll border-bottom-none"
			>
				<KeywordSearch module="vendor" />
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
					records={indexData.data}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (item) => indexData.data?.indexOf(item) + 1,
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
													height={"18"}
													width={"18"}
													stroke={1.5}
												/>
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												onClick={() => handleVendorEdit(values.id, values)}
												target="_blank"
												component="a"
												w={"200"}
											>
												{t("Edit")}
											</Menu.Item>

											<Menu.Item
												onClick={() => handleDataShow(values.id)}
												target="_blank"
												component="a"
												w={"200"}
											>
												{t("Show")}
											</Menu.Item>
											<Menu.Item
												target="_blank"
												component="a"
												w={"200"}
												mt={"2"}
												bg={"red.1"}
												c={"red.6"}
												onClick={() => handleDelete(values.id)}
												rightSection={
													<IconTrashX
														style={{ width: rem(14), height: rem(14) }}
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
					totalRecords={indexData.total}
					recordsPerPage={perPage}
					page={page}
					onPageChange={(p) => {
						setPage(p);
						setFetching(true);
					}}
					loaderSize="xs"
					loaderColor="grape"
					height={height}
					scrollAreaProps={{ type: "never" }}
				/>
			</Box>
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

export default VendorTable;
