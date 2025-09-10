import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Group, Box, ActionIcon, Text, rem, Menu } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice";
import { modals } from "@mantine/modals";
import KeywordSearch from "../../filter/KeywordSearch.jsx";
import tableCss from "@/assets/css/Table.module.css";
import __ViewDrawer from "./__ViewDrawer.jsx";
import { getIndexEntityData, editEntityData, deleteEntityData } from "@/app/store/core/crudThunk.js";
import { MASTER_DATA_ROUTES } from "@/constants/routes.js";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent.jsx";

export default function _Table({ module }) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 98; //TabList height 104
	const [fetching, setFetching] = useState(true);

	const searchKeyword = useSelector((state) => state.crud[module].searchKeyword);
	const userFilterData = useSelector((state) => state.crud[module].filterData);
	const fetchingReload = useSelector((state) => state.crud[module].refetching);

	const perPage = 50;
	const [page, setPage] = useState(1);
	const navigate = useNavigate();
	const [viewDrawer, setViewDrawer] = useState(false);

	const [userObject, setUserObject] = useState(null);

	const [indexData, setIndexData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			setFetching(true);
			const value = {
				url: MASTER_DATA_ROUTES.API_ROUTES.USER.INDEX,
				params: {
					term: searchKeyword,
					name: userFilterData.name,
					mobile: userFilterData.mobile,
					email: userFilterData.email,
					page: page,
					offset: perPage,
				},
				module,
			};

			try {
				const resultAction = await dispatch(getIndexEntityData(value));

				if (getIndexEntityData.rejected.match(resultAction)) {
					console.error("Error:", resultAction);
				} else if (getIndexEntityData.fulfilled.match(resultAction)) {
					setIndexData(resultAction.payload?.data);
					setFetching(false);
				}
			} catch (err) {
				console.error("Unexpected error:", err);
			}
		};

		fetchData();
	}, [dispatch, searchKeyword, userFilterData, page, fetchingReload]);

	const handleEdit = (id) => {
		dispatch(
			setInsertType({
				insertType: "update",
				module,
			})
		);
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.USER.UPDATE}/${id}`,
				module,
			})
		);
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.USER.INDEX}/${id}`);
	};

	const handleShow = (id) => {
		const foundUsers = indexData?.data.find((type) => type.id == id);
		if (foundUsers) {
			setUserObject(foundUsers);
			setViewDrawer(true);
		} else {
			showNotificationComponent(t("Something Went wrong , please try again"), "red.6", "lightgray");
		}
	};

	const handleDelete = (id) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "red.6" },
			onCancel: () => console.info("Cancel"),
			onConfirm: async () => {
				const resultAction = await dispatch(
					deleteEntityData({
						url: `${MASTER_DATA_ROUTES.API_ROUTES.USER.DELETE}/${id}`,
						module,
						id,
					})
				);
				if (deleteEntityData.fulfilled.match(resultAction)) {
					showNotificationComponent(t("DeleteSuccessfully"), "red.6", "lightgray");
					dispatch(setRefetchData({ module, refetching: true }));
				} else {
					showNotificationComponent(t("DeleteFailed"), "red.6", "lightgray");
				}
			},
		});
	};

	return (
		<>
			<Box pl="xs" pr={8} pt="6" pb="4" className="boxBackground borderRadiusAll border-bottom-none">
				<KeywordSearch module={module} />
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
							render: (item) => indexData.data.indexOf(item) + 1,
						},
						{ accessor: "name", title: t("Name") },
						{ accessor: "username", title: t("UserName") },
						{ accessor: "email", title: t("Email") },
						{ accessor: "mobile", title: t("Mobile") },
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
												<IconDotsVertical height={"18"} width={"18"} stroke={1.5} />
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												onClick={() => handleEdit(data.id)}
												target="_blank"
												component="a"
												w={200}
											>
												{t("Edit")}
											</Menu.Item>

											<Menu.Item
												onClick={() => handleShow(data.id)}
												target="_blank"
												component="a"
												w={200}
											>
												{t("Show")}
											</Menu.Item>
											<Menu.Item
												target="_blank"
												component="a"
												w={200}
												mt={2}
												bg="red.1"
												c="red.6"
												onClick={() => handleDelete(data.id)}
												rightSection={
													<IconTrashX style={{ width: rem(14), height: rem(14) }} />
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
						dispatch(setFetching(true));
					}}
					loaderSize="xs"
					loaderColor="grape"
					height={height}
					scrollAreaProps={{ type: "never" }}
				/>
			</Box>
			{viewDrawer && (
				<__ViewDrawer userObject={userObject} viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} />
			)}
		</>
	);
}
