import { Group, Box, Text, Flex, Button, Badge } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconEdit,
	IconEye,
	IconChevronUp,
	IconSelector,
	IconDeviceFloppy,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import KeywordSearch from "@modules/filter/KeywordSearch";
import ViewDrawer from "./__ViewDrawer";
import DataTableFooter from "@components/tables/DataTableFooter";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import { editEntityData, showEntityData } from "@/app/store/core/crudThunk";
import { useState } from "react";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import { errorNotification } from "@components/notification/errorNotification.jsx";
import { successNotification } from "@components/notification/successNotification.jsx";

const PER_PAGE = 50;

export default function _Table({ module }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const [viewDrawer, setViewDrawer] = useState(false);
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module].filterData);
	const listData = useSelector((state) => state.crud[module].data);
	const height = mainAreaHeight - 48;
	// for infinity table data scroll, call the hook
	const {
		scrollRef,
		records,
		fetching,
		sortStatus,
		setSortStatus,
		handleScrollToBottom,
		refetchAll,
	} = useInfiniteTableScroll({
		module,
		fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.INDEX_CENTRAL,
		filterParams: {
			name: filterData?.name,
			term: searchKeyword,
		},
		perPage: PER_PAGE,
		sortByKey: "name",
	});

	const handleEntityEdit = (id) => {
		navigate(`${PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.STORE_INDENT.UPDATE}/${id}`);
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

	const handleIndentReceived = (id) => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmReceived(id),
		});
	};

	const handleConfirmReceived = async (id) => {
		try {
			const value = {
				url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.RECEIVE}/${id}`,
				module,
			};
			const resultAction = await dispatch(showEntityData(value));
			if (showEntityData.fulfilled.match(resultAction)) {
				if (resultAction.payload.data.status === 200) {
					successNotification(resultAction.payload.data.message);
					refetchAll();
				}
			}
		} catch (error) {
			errorNotification("Error updating indent config:" + error.message);
		}
	};
	const processColorMap = { Created: "Red", Received: "green", Approved: "blue" };

	return (
		<>
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none ">
				<Flex align="center" justify="space-between" gap={4}>
					<KeywordSearch module={module} />
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
							title: t("Warehouse"),
							sortable: true,
						},
						{
							accessor: "created_by",
							title: t("IndentBy"),
							sortable: true,
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
										{values.process !== "Received" &&
											!values.received_by_id && (
												<Button
													onClick={() => handleEntityEdit(values.uid)}
													variant="filled"
													c="white"
													size="compact-xs"
													radius="es"
													leftSection={<IconEdit size={16} />}
													className="border-left-radius-none btnPrimaryBg"
												>
													{t("Edit")}
												</Button>
											)}
										<Button
											onClick={() => handleDataShow(values.uid)}
											variant="filled"
											c="white"
											bg="var(--theme-primary-color-6)"
											size="compact-xs"
											radius="es"
											leftSection={<IconEye size={16} />}
											className="border-left-radius-none border-right-radius-none "
										>
											{t("View")}
										</Button>
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
					onScrollToBottom={handleScrollToBottom}
					scrollViewportRef={scrollRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>

			<DataTableFooter indexData={listData} module={module} />
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
