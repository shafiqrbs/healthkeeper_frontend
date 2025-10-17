import { Group, Box, ActionIcon, Text, rem, Flex, Button, Grid } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconAlertCircle, IconChevronUp, IconX, IconSelector, IconDeviceFloppy } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useOs, useHotkeys, useDebouncedState } from "@mantine/hooks";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import { deleteEntityData, editEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice.js";
import { ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import { useState } from "react";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import { successNotification } from "@components/notification/successNotification";
import { SUCCESS_NOTIFICATION_COLOR } from "@/constants/index";
import { errorNotification } from "@components/notification/errorNotification";
import { useForm } from "@mantine/form";
import { getInitialValues } from "../helpers/request";
import SelectForm from "@components/form-builders/SelectForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import useMedicineData from "@hooks/useMedicineData";
import { formatDate, getLoggedInUser } from "@utils/index";

const PER_PAGE = 50;

export default function __FromTable({ module, open }) {
	const { t } = useTranslation();
	const os = useOs();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const height = mainAreaHeight - 78;

	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module].filterData);

	const user = getLoggedInUser();
	console.log(user);

	async function handleConfirmModal(values) {
		try {
			const value = {
				url: `${MASTER_DATA_ROUTES.API_ROUTES.REQUISITION.CREATE}`,
				data: {
					item: { ...values, expected_date: formatDate(values.expected_date) },
					username: user.username,
					userId: user.id,
				},
				module,
			};

			const resultAction = await dispatch(storeEntityData(value));
			if (storeEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					form.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				form.reset();
				close(); // close the drawer
				dispatch(setRefetchData({ module, refetching: true }));
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	const form = useForm(getInitialValues(t));

	// for infinity table data scroll, call the hook
	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.REQUISITION.INDEX,
		filterParams: {
			name: filterData?.name,
			term: searchKeyword,
		},
		perPage: PER_PAGE,
		sortByKey: "name",
	});

	const [viewDrawer, setViewDrawer] = useState(false);

	const handleEntityEdit = (id) => {
		dispatch(setInsertType({ insertType: "update", module }));
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.VIEW}/${id}`,
				module,
			})
		);
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR.INDEX}/${id}`);
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
				url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.DELETE}/${id}`,
				module,
				id,
			})
		);

		if (deleteEntityData.fulfilled.match(res)) {
			dispatch(setRefetchData({ module, refetching: true }));
			deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
			navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR);
			dispatch(setInsertType({ insertType: "create", module }));
		} else {
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: t("Delete Failed"),
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
			});
		}
	};

	const handleDataShow = (id) => {
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.VIEW}/${id}`,
				module,
			})
		);
		setViewDrawer(true);
	};

	const handleCreateForm = () => {
		open();
		dispatch(setInsertType({ insertType: "create", module }));
		navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR.INDEX);
	};

	useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => handleCreateForm()]]);

	return (
		<>
			<Box
				component="form"
				onSubmit={form.onSubmit(handleConfirmModal)}
				p="xs"
				h="52px"
				className="boxBackground border-bottom-none"
			>
				<Grid columns={24} gutter={{ base: 8 }}>
					<Grid.Col span={7}>
						<SelectForm
							searchable
							onSearchChange={setMedicineTerm}
							form={form}
							tooltip={t("NameValidationMessage")}
							placeholder={t("Medicine")}
							name="medicine_id"
							id="medicine_id"
							nextField="quantity"
							value={form.values.medicine_id}
							required={true}
							dropdownValue={medicineData?.map((item) => ({
								label: item.product_name,
								value: item.product_id?.toString(),
							}))}
							onBlur={() => setMedicineTerm("")}
							nothingFoundMessage="Type to find medicine..."
						/>
					</Grid.Col>
					<Grid.Col span={7}>
						<InputNumberForm
							form={form}
							tooltip={t("QuantityValidationMessage")}
							placeholder={t("Quantity")}
							name="quantity"
							id="quantity"
							nextField="EntityFormSubmit"
							value={form.values.quantity}
							required={true}
						/>
					</Grid.Col>
					<Grid.Col span={7}>
						<DatePickerForm
							form={form}
							tooltip={t("NameValidationMessage")}
							placeholder={t("ExpectedDate")}
							name="expected_date"
							id="expected_date"
							nextField="EntityFormSubmit"
							value={form.values.expected_date}
							required={true}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<Flex h="100%" align="center" justify="flex-end">
							<Button
								size="xs"
								bg="var(--theme-primary-color-6)"
								type="submit"
								id="EntityFormSubmit"
								leftSection={<IconDeviceFloppy size={16} />}
							>
								<Flex direction={`column`} gap={0}>
									<Text fz={14} fw={400}>
										{t("Submit")}
									</Text>
								</Flex>
							</Button>
						</Flex>
					</Grid.Col>
				</Grid>
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
							accessor: "name",
							title: t("Name"),
							sortable: true,
						},
						{
							accessor: "quantity",
							title: t("Quantity"),
							sortable: false,
							render: (item) => item.quantity,
						},
						{
							accessor: "expected_date",
							title: t("ExpectedDate"),
							sortable: false,
							render: (item) => formatDate(item.expected_date),
						},
						{
							accessor: "action",
							title: "",
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Button.Group>
										<ActionIcon
											size="md"
											onClick={() => handleDelete(values.id)}
											className="action-icon-menu border-left-radius-none"
											variant="transparent"
											color="var(--theme-delete-color)"
											radius="es"
											aria-label="Settings"
										>
											<IconX height={18} width={18} stroke={1.5} />
										</ActionIcon>
									</Button.Group>
								</Group>
							),
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 18}
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
		</>
	);
}
