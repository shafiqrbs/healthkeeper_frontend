import { Group, Box, ActionIcon, Text, Flex, Button, Grid, Select } from "@mantine/core";
import { useTranslation } from "react-i18next";
import inputCss from "@assets/css/TextAreaInputField.module.css";
import { IconChevronUp, IconX, IconSelector, IconEye, IconPlus, IconDeviceFloppy } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import { useOs, useHotkeys, useDebouncedState, useDisclosure } from "@mantine/hooks";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import { setInsertType } from "@/app/store/core/crudSlice.js";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { getInitialValues } from "../helpers/request";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import useMedicineData from "@hooks/useMedicineData";
import { formatDate } from "@utils/index";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";

export default function __FromTable({ module, open }) {
	const [records, setRecords] = useState([]);
	const { t } = useTranslation();
	const os = useOs();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const height = mainAreaHeight - 78;
	const [resetKey, setResetKey] = useState(0);

	const form = useForm(getInitialValues(t));
	const [openedDrawer, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
	const [requisitions, setRequisitions] = useState([]);

	// for infinity table data scroll, call the hook
	// const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
	// 	module,
	// 	fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.REQUISITION.INDEX,
	// 	filterParams: {
	// 		name: filterData?.name,
	// 		term: searchKeyword,
	// 	},
	// 	perPage: PER_PAGE,
	// 	sortByKey: "name",
	// });

	async function handleRequisitionAdd(values) {
		setRecords([...records, values]);

		form.reset();
		setMedicineTerm("");
		setResetKey(Date.now());
	}

	const handleRequisitionDelete = (id) => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleRequisitionDeleteSuccess(id),
		});
	};

	const handleRequisitionDeleteSuccess = async (id) => {
		setRecords(records.filter((_, index) => index !== id));
	};

	const handleCreateForm = () => {
		open();
		dispatch(setInsertType({ insertType: "create", module }));
		navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR.INDEX);
	};

	useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => handleCreateForm()]]);

	const handleMedicineChange = (value) => {
		console.log(medicineData);
		form.setFieldValue("medicine_id", value);
		const selectedMedicine = medicineData.find((medicine) => medicine.product_id == value);
		form.setFieldValue("medicine_name", selectedMedicine.product_name);
	};

	const handleRequisitionSave = () => {
		console.log(records);
	};

	return (
		<>
			<Box
				component="form"
				onSubmit={form.onSubmit(handleRequisitionAdd)}
				p="xs"
				h="52px"
				className="boxBackground border-bottom-none"
			>
				<Grid columns={24} gutter={{ base: 8 }}>
					<Grid.Col span={7}>
						<Select
							key={resetKey}
							searchable
							onSearchChange={setMedicineTerm}
							onChange={(value) => handleMedicineChange(value)}
							tooltip={t("NameValidationMessage")}
							placeholder={t("Medicine")}
							name="medicine_id"
							id="medicine_id"
							nextField="quantity"
							value={form.values.medicine_id}
							required={true}
							data={medicineData?.map((item) => ({
								label: item.product_name,
								value: item.product_id?.toString(),
							}))}
							onBlur={() => setMedicineTerm("")}
							nothingFoundMessage="Type to find medicine..."
							classNames={inputCss}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
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
					<Grid.Col span={4}>
						<Flex h="100%" align="center" justify="flex-end" gap={6}>
							<Button
								size="xs"
								bg="var(--theme-secondary-color-6)"
								type="submit"
								id="EntityFormSubmit"
								leftSection={<IconPlus size={16} />}
							>
								<Flex direction={`column`} gap={0}>
									<Text fz={14} fw={400}>
										{t("Add")}
									</Text>
								</Flex>
							</Button>
							<Button
								size="xs"
								bg="var(--theme-primary-color-6)"
								type="button"
								id="EntityFormSubmit"
								leftSection={<IconEye size={16} />}
								onClick={openDrawer}
							>
								<Flex direction={`column`} gap={0}>
									<Text fz={14} fw={400}>
										{t("ViewList")}
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
							accessor: "medicine_name",
							title: t("MedicineName"),
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
							render: (_, index) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Button.Group>
										<ActionIcon
											size="md"
											onClick={() => handleRequisitionDelete(index)}
											className="border-left-radius-none"
											variant="transparent"
											color="var(--theme-delete-color)"
											radius="es"
											aria-label="delete"
										>
											<IconX height={18} width={18} stroke={1.5} />
										</ActionIcon>
									</Button.Group>
								</Group>
							),
						},
					]}
					textSelectionDisabled
					loaderSize="xs"
					loaderColor="grape"
					height={height - 118}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>

				<Flex bg="white" justify="space-between" align="center" p="xs" className="borderRadiusAll">
					<TextAreaForm
						width={500}
						form={form}
						placeholder={t("Comment")}
						name="comment"
						id="comment"
						nextField="EntityFormSubmit"
						value={form.values.comment}
						required={true}
					/>
					<Button
						onClick={handleRequisitionSave}
						size="md"
						leftSection={<IconDeviceFloppy size={20} />}
						type="submit"
						bg="var(--theme-primary-color-6)"
						color="white"
					>
						{t("Save")}
					</Button>
				</Flex>
			</Box>

			<GlobalDrawer title={t("RequisitionList")} opened={openedDrawer} close={closeDrawer}>
				<Box>
					{requisitions.map((requisition) => (
						<Box key={requisition.id}>
							<Text>{requisition.medicine.name}</Text>
							<Text>{requisition.quantity}</Text>
							<Text>{formatDate(requisition.expected_date)}</Text>
							<Text>{requisition.comment}</Text>
						</Box>
					))}
				</Box>
			</GlobalDrawer>
		</>
	);
}
