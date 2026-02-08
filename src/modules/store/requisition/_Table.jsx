import { Group, Box, ActionIcon, Text, rem, Flex, Button, Badge } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconTrashX,
	IconAlertCircle,
	IconEdit,
	IconEye,
	IconChevronUp,
	IconSelector,
	IconPrinter,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import KeywordSearch from "@modules/filter/KeywordSearch";
import ViewDrawer from "./__ViewDrawer";
import { notifications } from "@mantine/notifications";
import CreateButton from "@components/buttons/CreateButton";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import { deleteEntityData, editEntityData } from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice.js";
import { ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import { useRef, useState } from "react";
import { getDataWithoutStore } from "@/services/apiService";
import { useReactToPrint } from "react-to-print";
import Indent from "@hospital-components/print-formats/indent/Indent";
import usePagination from "@hooks/usePagination";

const PER_PAGE = 25;

export default function _Table({ module }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const [viewDrawer, setViewDrawer] = useState(false);
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module].filterData);
	const height = mainAreaHeight - 48;
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const invoicePrintRef = useRef(null);

	const { records, fetching, sortStatus, setSortStatus, total, perPage, page, handlePageChange, refetchAll } =
		usePagination({
			module,
			fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.INDEX,
			filterParams: {
				name: filterData?.name,
				term: searchKeyword,
			},
			perPage: PER_PAGE,
			sortByKey: "name",
		});

	const handleEntityEdit = (id) => {
		navigate(`${PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.REQUISITION.UPDATE}/${id}`);
	};

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
				url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.DELETE}/${id}`,
				module,
				id,
			})
		);

		if (deleteEntityData.fulfilled.match(res)) {
			dispatch(setRefetchData({ module, refetching: true }));
			deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
			navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.REQUISITION.INDEX);
			dispatch(setInsertType({ insertType: "create", module }));
		} else {
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: t("DeleteFailed"),
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
			});
		}
	};

	const handleDataShow = (id) => {
		dispatch(
			editEntityData({
				url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.VIEW}/${id}`,
				module,
			})
		);
		setViewDrawer(true);
	};

	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });
	const handleDataPrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.VIEW}/${id}`,
		});
		setInvoicePrintData(res.data);
		requestAnimationFrame(invoicePrint);
	};

	const handleCreateFormNavigate = () => {
		navigate(`${PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.REQUISITION.CREATE}`);
	};
	const processColorMap = { Created: "Red", Received: "green", Approved: "blue" };

	return (
		<>
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none ">
				<Flex align="center" justify="space-between" gap={4}>
					<KeywordSearch module={module} />
					<CreateButton handleModal={handleCreateFormNavigate} text="AddNew" />
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
							accessor: "created",
							title: t("CreatedDate"),
							textAlignment: "right",
							sortable: true,
						},
						{
							accessor: "invoice_date",
							title: t("InvoiceDate"),
							textAlignment: "right",
							sortable: true,
						},
						{
							accessor: "invoice",
							title: t("IndentNo"),
							textAlignment: "right",
							sortable: true,
						},
						{
							accessor: "to_warehouse",
							title: t("Department"),
							sortable: true,
						},
						{
							accessor: "created_by",
							title: t("Created"),
							sortable: true,
						},
						{
							accessor: "approved_by",
							title: t("Approved"),
							sortable: true,
						},
						{
							accessor: "process",
							title: t("Process"),
							sortable: false,
						},
						{
							accessor: "process",
							textAlign: "center",
							title: t("Process"),
							render: (item) => {
								const color = processColorMap[item.process] || ""; // fallback for unknown status
								return (
									<Badge size="xs" radius="sm" color={color}>
										{item.process}
									</Badge>
								);
							},
							cellsClassName: tableCss.statusBackground,
						},
						{
							title: "",
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Button.Group>
										{values.process !== "Approved" && !values.approved_by_id && (
											<Button
												onClick={() => handleEntityEdit(values.uid)}
												variant="filled"
												c="white"
												size="compact-xs"
												radius="es"
												leftSection={<IconEdit size={16} />}
												className="border-right-radius-none btnPrimaryBg"
											>
												{t("Edit")}
											</Button>
										)}
										<Button
											onClick={() => handleDataShow(values.uid)}
											variant="filled"
											c="white"
											size="compact-xs"
											bg="var(--theme-primary-color-6)"
											radius="es"
											leftSection={<IconEye size={16} />}
											className="border-left-radius-none border-right-radius-none"
										>
											{t("View")}
										</Button>
										{(values.process === "Approved" || values.process === "Received") &&
											values.approved_by_id && (
												<Button
													onClick={() => handleDataPrint(values.uid)}
													variant="filled"
													c="white"
													size="compact-xs"
													radius="es"
													leftSection={<IconPrinter size={16} />}
													className="border-right-radius-none"
												>
													{t("Print")}
												</Button>
											)}

										{values.process !== "Approved" && !values.approved_by_id && (
											<ActionIcon
												size={"ms"}
												onClick={() => handleDelete(values.uid)}
												variant="transparent"
												color="var(--theme-delete-color)"
												radius="es"
												aria-label="Settings"
											>
												<IconTrashX height={18} width={18} stroke={1.5} />
											</ActionIcon>
										)}
									</Button.Group>
								</Group>
							),
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 72}
					page={page}
					totalRecords={total}
					recordsPerPage={perPage}
					onPageChange={handlePageChange}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
			<Indent data={invoicePrintData} ref={invoicePrintRef} />
			<ViewDrawer
				viewDrawer={viewDrawer}
				height={height}
				setViewDrawer={setViewDrawer}
				module={module}
				refetchAll={refetchAll}
			/>
		</>
	);
}
