import { Group, Box, ActionIcon, Text, Flex, Button, Grid, Select, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import inputCss from "@assets/css/TextAreaInputField.module.css";
import {
	IconChevronUp,
	IconX,
	IconSelector,
	IconEye,
	IconPlus,
	IconDeviceFloppy,
	IconHistory,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import { useDebouncedState } from "@mantine/hooks";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import { useState } from "react";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import useMedicineData from "@hooks/useMedicineStockData";
import { formatDate } from "@utils/index";
import TextAreaForm from "@components/form-builders/TextAreaForm";
// removed unused fetch helper
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";
import SelectForm from "@components/form-builders/SelectForm";

export default function __Form({ form, workOrderForm, records, setRecords, onSave }) {
	const { t } = useTranslation();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const height = mainAreaHeight - 78;
	const [resetKey, setResetKey] = useState(0);
	//	const { id } = useParams();

	const { data: vendorDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.VENDOR.PATH,
		utility: CORE_DROPDOWNS.VENDOR.UTILITY,
	});

	async function handleWorkorderAdd(values) {
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

	const handleMedicineChange = (value) => {
		const selectedMedicine = medicineData.find((medicine) => medicine.stock_id === value);
		form.setFieldValue("stock_id", value);
		form.setFieldValue("medicine_name", selectedMedicine.product_name);
		form.setFieldValue("generic", selectedMedicine.generic);
	};

	const handleResetRequisition = () => {
		setRecords([]);
		setMedicineTerm("");
		setResetKey(Date.now());
		form.reset();
		workOrderForm.reset();
	};

	const handleViewList = () => {
		navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.WORKORDER.INDEX);
	};

	return (
		<>
			<Box
				component="form"
				onSubmit={form.onSubmit(handleWorkorderAdd)}
				p="xs"
				h="52px"
				className="boxBackground border-bottom-none"
			>
				<Grid columns={24} gutter={{ base: 8 }}>
					<Grid.Col span={5}>
						<DatePickerForm
							form={form}
							tooltip={t("NameValidationMessage")}
							placeholder={t("ExpiryStartDate")}
							name="production_date"
							id="production_date"
							nextField="expired_date"
							value={form.values.production_date}
						/>
					</Grid.Col>
					<Grid.Col span={5}>
						<DatePickerForm
							form={form}
							tooltip={t("NameValidationMessage")}
							placeholder={t("ExpiryEndDate")}
							name="expired_date"
							id="expired_date"
							nextField="EntityFormSubmit"
							value={form.values.expired_date}
						/>
					</Grid.Col>
					<Grid.Col span={5}>
						<Select
							key={resetKey}
							searchable
							onSearchChange={setMedicineTerm}
							onChange={(value) => handleMedicineChange(value)}
							tooltip={t("NameValidationMessage")}
							placeholder={t("Medicine")}
							name="stock_id"
							id="stock_id"
							nextField="quantity"
							value={form.values.stock_id}
							required={true}
							data={medicineData?.map((item) => ({
								label: item.product_name,
								value: item.stock_id?.toString(),
							}))}
							onBlur={() => setMedicineTerm("")}
							nothingFoundMessage="Type to find medicine..."
							classNames={inputCss}
						/>
					</Grid.Col>
					<Grid.Col span={5}>
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
								onClick={handleViewList}
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
							accessor: "production_date",
							title: t("ExpiryStartDate"),
							sortable: false,
							render: (item) => formatDate(item.production_date),
						},
						{
							accessor: "expired_date",
							title: t("ExpiryEndDate"),
							sortable: false,
							render: (item) => formatDate(item.expired_date),
						},
						{
							accessor: "medicine_name",
							title: t("MedicineName"),
							sortable: true,
						},
						{
							accessor: "generic",
							title: t("GenericName"),
							sortable: false,
							render: (item) => item.generic || "N/A",
						},
						{
							accessor: "quantity",
							title: t("Quantity"),
							sortable: false,
							render: (item) => item.quantity,
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
					height={height - 180}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>

				<Flex
					component="form"
					onSubmit={workOrderForm.onSubmit(onSave)}
					bg="white"
					justify="space-between"
					align="center"
					className="borderRadiusAll"
				>
					<Box w="50%" bg="var(--theme-primary-color-0)" fz="sm" c="white">
						<Grid align="center" columns={20} mt="xxxs">
							<Grid.Col span={6}>
								<Text c="black" fz="sm">
									{t("ParticularType")} <RequiredAsterisk />
								</Text>
							</Grid.Col>
						</Grid>
						<Text bg="var(--theme-secondary-color-6)" fz="sm" c="white" px="sm" py="les">
							{t("Comment")}
						</Text>
						<Box p="sm">
							<TextAreaForm
								form={workOrderForm}
								label=""
								value={workOrderForm.values.comment}
								name="comment"
								placeholder="Write a comment..."
								showRightSection={false}
								style={{ input: { height: "60px" } }}
								tooltip={t("EnterComment")}
							/>
						</Box>
					</Box>
					<Stack gap="xs" px="sm">
						<SelectForm
							form={workOrderForm}
							tooltip={t("ChooseVendor")}
							placeholder={t("ChooseVendor")}
							name="vendor_id"
							id="vendor_id"
							nextField="EntityFormSubmit"
							required={true}
							value={workOrderForm.values.vendor_id}
							dropdownValue={vendorDropdown}
						/>
						{/*<DatePickerForm
							form={workOrderForm}
							tooltip={t("NameValidationMessage")}
							placeholder={t("ExpectedDate")}
							name="expected_date"
							id="expected_date"
							nextField="EntityFormSubmit"
							value={workOrderForm.values.expected_date}
							required={true}
						/>*/}
						<Flex gap="les">
							<Button
								onClick={handleResetRequisition}
								size="md"
								leftSection={<IconHistory size={20} />}
								type="button"
								bg="var(--theme-reset-btn-color)"
								color="white"
								w="200px"
							>
								{t("Reset")}
							</Button>
							<Button
								onClick={onSave}
								size="md"
								leftSection={<IconDeviceFloppy size={20} />}
								type="submit"
								bg="var(--theme-primary-color-6)"
								color="white"
								w="200px"
							>
								{t("Save")}
							</Button>
						</Flex>
					</Stack>
				</Flex>
			</Box>

			{/*<GlobalDrawer title={t("RequisitionList")} opened={openedDrawer} close={closeDrawer}>
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
			</GlobalDrawer>*/}
		</>
	);
}
