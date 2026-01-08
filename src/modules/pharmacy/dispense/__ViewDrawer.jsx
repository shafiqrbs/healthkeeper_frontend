import { Grid, Box, Drawer, Text, Flex, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import { modals } from "@mantine/modals";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import { showEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import useAppLocalStore from "@hooks/useAppLocalStore";

export default function __ViewDrawer({ viewDrawer, setViewDrawer, height, module, refetchAll }) {
	const { userRoles } = useAppLocalStore();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const entityObject = useSelector((state) => state.crud[module].editData);
	const ALLOWED_PHARMACIST_ROLES = ["pharmacy_doctor", "admin_administrator"];
	const canApprove = userRoles.some((role) => ALLOWED_PHARMACIST_ROLES.includes(role));
	const closeDrawer = () => {
		setViewDrawer(false);
	};
	const handleDispenseApproved = (id) => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmApproved(id),
		});
	};

	const handleConfirmApproved = async (id) => {
		try {
			const value = {
				url: `${PHARMACY_DATA_ROUTES.API_ROUTES.DISPENSE.APPROVE}/${id}`,
				module,
			};

			const resultAction = await dispatch(showEntityData(value));
			if (showEntityData.fulfilled.match(resultAction)) {
				if (resultAction.payload.data.status === 200) {
					successNotification(resultAction.payload.data.message);
				}
				closeDrawer();
			}
		} catch (error) {
			errorNotification("Error updating purchase config:" + error.message);
		} finally {
			refetchAll();
		}
	};

	return (
		<Drawer.Root
			opened={viewDrawer}
			size="xl"
			position="right"
			onClose={closeDrawer}
			offset={16}
		>
			<Drawer.Overlay />
			<Drawer.Content>
				<Drawer.Header className={"drawer-sticky-header"}>
					<Drawer.Title>
						<Flex align="center" gap={8}>
							<IconArrowLeft size={16} />{" "}
							<Text mt="es" fz={16} fw={500}>
								{t("Dispense")}
							</Text>
						</Flex>
					</Drawer.Title>
					<Drawer.CloseButton />
				</Drawer.Header>
				<Box w={"100%"} mb={0}>
					<Box p={"md"}>
						<Box>
							<Grid columns={24}>
								<Grid.Col span={"4"} className="drawer-form-input-label">
									{t("Created")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject && entityObject.created && entityObject.created}
								</Grid.Col>
								<Grid.Col span={"4"} className="drawer-form-input-label">
									{t("Process")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject && entityObject.process && entityObject.process}
								</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"4"} className="drawer-form-input-label">
									{t("Invoice")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject && entityObject.invoice && entityObject.invoice}
								</Grid.Col>
								<Grid.Col span={"4"} className="drawer-form-input-label">
									{t("Warehouse")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject &&
										entityObject.warehouse_name &&
										entityObject.warehouse_name}
								</Grid.Col>
							</Grid>

							<Grid columns={24}>
								<Grid.Col span={"4"} className="drawer-form-input-label">
									{t("Created By")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject &&
										entityObject.cbName &&
										entityObject.cbName}
								</Grid.Col>
								<Grid.Col span={"4"} className="drawer-form-input-label">
									{t("Approved By")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject &&
										entityObject.approve_name &&
										entityObject.approve_name}
								</Grid.Col>
							</Grid>
							<Grid columns={24}>
								<Grid.Col span={"4"} className="drawer-form-input-label">
								</Grid.Col>
								<Grid.Col span={"1"}></Grid.Col>
								<Grid.Col span={"auto"}>

								</Grid.Col>
								<Grid.Col span={"4"} className="drawer-form-input-label">
									{t("ApprovedDate")}
								</Grid.Col>
								<Grid.Col span={"1"}>:</Grid.Col>
								<Grid.Col span={"auto"}>
									{entityObject &&
										entityObject.approved_date &&
										entityObject.approved_date}
								</Grid.Col>
							</Grid>
						</Box>
						<Box>
							<DataTable
								classNames={{
									root: tableCss.root,
									table: tableCss.table,
									body: tableCss.body,
									header: tableCss.header,
									footer: tableCss.footer,
									pagination: tableCss.pagination,
								}}
								records={entityObject?.dispense_items || []}
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
										title: t("MedicineName"),
										textAlignment: "right",
										sortable: false,
									},
									{
										accessor: "quantity",
										title: t("Quantity"),
										textAlignment: "right",
										sortable: false,
									}
								]}
								height={height - 208}
								textSelectionDisabled
							/>
						</Box>
					</Box>
				</Box>
				<Drawer.Header className={"drawer-sticky-header"}>
					<Drawer.Title>
						<Flex align="right" gap={8}>
							{entityObject.process === "Created" && (
								<Button
									onClick={(e) => {
										e.preventDefault();
										handleDispenseApproved(entityObject.id);
									}}
									variant="filled"
									c="white"
									bg="var(--theme-warn-color-6)"
									size="xs"
									radius="es"
									leftSection={<IconDeviceFloppy size={16} />}
								>
									{t("Approved")}
								</Button>
							)}
						</Flex>
					</Drawer.Title>
				</Drawer.Header>
			</Drawer.Content>
		</Drawer.Root>
	);
}
