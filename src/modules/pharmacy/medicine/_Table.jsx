import { Group, Box, Text, rem, Flex, Button, Checkbox, CloseButton } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconAlertCircle, IconEdit, IconChevronUp, IconSelector, IconEye, IconTrashX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import KeywordSearch from "@modules/filter/KeywordSearch";
import ViewDrawer from "./__ViewDrawer";
import { notifications } from "@mantine/notifications";
import { useOs, useHotkeys } from "@mantine/hooks";
import CreateButton from "@components/buttons/CreateButton";
import DataTableFooter from "@components/tables/DataTableFooter";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import { deleteEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice.js";
import { ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import { useEffect, useState } from "react";
import { errorNotification } from "@components/notification/errorNotification";
import usePagination from "@hooks/usePagination";

const PER_PAGE = 50;

export default function _Table({ module, open }) {
	const { t } = useTranslation();
	const os = useOs();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const height = mainAreaHeight - 84;
	const [submitFormData, setSubmitFormData] = useState({});
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module].filterData);
	const listData = useSelector((state) => state.crud[module].data);
	const [updatingRows, setUpdatingRows] = useState({});

	// for infinity table data scroll, call the hook
	const { scrollRef, records, fetching, sortStatus, setSortStatus, page, total, perPage, handlePageChange } =
		usePagination({
			module,
			fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.MEDICINE.INDEX,
			filterParams: {
				name: filterData?.name,
				term: searchKeyword,
			},
			perPage: PER_PAGE,
			sortByKey: "name",
		});

	const [viewDrawer, setViewDrawer] = useState(false);

	const handleDelete = (id) => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleDeleteSuccess(id),
		});
	};

	const handleDeleteSuccess = async (id) => {
		const res = await dispatch(
			deleteEntityData({
				url: `${PHARMACY_DATA_ROUTES.API_ROUTES.MEDICINE.DELETE}/${id}`,
				module,
				id,
			})
		);

		if (deleteEntityData.fulfilled.match(res)) {
			dispatch(setRefetchData({ module, refetching: true }));
			deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
			navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.MEDICINE.INDEX);
			dispatch(setInsertType({ insertType: "create", module }));
		} else {
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: t("Delete Failed"),
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
			});
		}
	};

	const handleCreateForm = () => {
		open();
		dispatch(setInsertType({ insertType: "create", module }));
		navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.MEDICINE.INDEX);
	};

	const handleEntityEdit = (id) => {
		dispatch(setInsertType({ insertType: "update", module }));
		navigate(`${PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.MEDICINE.INDEX}/${id}`);
	};

	useEffect(() => {
		if (!records?.length) return;
		const initialFormData = records.reduce((acc, item) => {
			acc[item.id] = {
				company: item.company || "",
				product_name: item.product_name || "",
				generic: item.generic || "",
			};
			return acc;
		}, {});

		setSubmitFormData(initialFormData);
	}, [records]);

	const handleFieldChange = async (rowId, field, value) => {
		setSubmitFormData((prev) => ({
			...prev,
			[rowId]: { ...prev[rowId], [field]: value },
		}));
		setUpdatingRows((prev) => ({ ...prev, [rowId]: true }));

		try {
			await dispatch(
				storeEntityData({
					url: `${PHARMACY_DATA_ROUTES.API_ROUTES.MEDICINE.INLINE_UPDATE}/${rowId}`,
					data: { [field]: value },
					module,
				})
			);
		} catch (error) {
			errorNotification(error.message);
		} finally {
			setUpdatingRows((prev) => ({ ...prev, [rowId]: false }));
		}
	};

	useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => handleCreateForm()]]);

	return (
		<>
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none ">
				<Flex align="center" justify="space-between" gap={4}>
					<KeywordSearch module={module} />
					<CreateButton handleModal={handleCreateForm} text="AddNew" />
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
							sortable: false,
							render: (_item, index) => index + 1,
						},
						{
							accessor: "company",
							title: t("Company"),
							sortable: true,
							/*render: (item) => (
                                <TextInput
                                    size="xs"
                                    className={inlineInputCss.inputText}
                                    placeholder={t("CompanyName")}
                                    value={submitFormData[item.id]?.company || ""}
                                    onChange={(event) =>
                                        handleDataTypeChange(item.id, "company", event.currentTarget.value)
                                    }
                                    onBlur={() => handleRowSubmit(item.id)}
                                />
                            ),*/
						},
						{
							accessor: "product_name",
							title: t("MedicineName"),
							sortable: true,
							/*render: (item) => (
                                <TextInput
                                    size="xs"
                                    className={inlineInputCss.inputText}
                                    placeholder={t("product_name")}
                                    value={submitFormData[item.id]?.product_name || ""}
                                    onChange={(event) =>
                                        handleDataTypeChange(item.id, "product_name", event.currentTarget.value)
                                    }
                                    onBlur={() => handleRowSubmit(item.id)}
                                />
                            ),*/
						},
						{
							accessor: "generic",
							title: t("Generic"),
							sortable: true,
						},
						{
							accessor: "doses_details",
							title: t("Doses"),
							sortable: true,
						},
						{
							accessor: "by_meal",
							title: t("Bymeal"),
							sortable: true,
						},
						{
							accessor: "status",
							title: t("Status"),
							render: (item) => (
								<Checkbox
									key={item.id}
									size="sm"
									checked={submitFormData[item.id]?.status ?? false}
									onChange={(val) => handleFieldChange(item.id, "status", val.currentTarget.checked)}
								/>
							),
						},

						{
							title: "",
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Button.Group>
										<Button
											onClick={() => {
												handleEntityEdit(values.id);
												open();
											}}
											variant="filled"
											c="white"
											fw={400}
											size="compact-xs"
											leftSection={<IconEdit size={12} />}
											className="border-left-radius-none btnPrimaryBg"
										>
											{t("Edit")}
										</Button>
										{/*<Button
											variant="filled"
											c="white"
											bg="var(--theme-primary-color-6)"
											size="compact-xs"
											fw={400}
											leftSection={<IconEye size={12} />}
											className="border-left-radius-none"
										>
											{t("View")}
										</Button>

										<CloseButton
											icon={<IconTrashX size={18} stroke={1.2} />}
											radius="es"
											onClick={() => handleDelete(values.id)}
											size={"sm"}
											c={"red"}
										/>*/}
									</Button.Group>
								</Group>
							),
						},
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 12}
					page={page}
					totalRecords={total}
					recordsPerPage={perPage}
					onPageChange={handlePageChange}
					scrollViewportRef={scrollRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
			<ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} module={module} />
		</>
	);
}
