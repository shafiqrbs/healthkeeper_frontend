import {Grid, Box, Drawer, Text, Flex, Button} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconArrowLeft, IconEye,
} from "@tabler/icons-react";
import {useDispatch, useSelector} from "react-redux";
import {DataTable} from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import {getUserRole} from "@utils/index";
import {modals} from "@mantine/modals";
import {PHARMACY_DATA_ROUTES} from "@/constants/routes";
import {showEntityData} from "@/app/store/core/crudThunk";
import {successNotification} from "@components/notification/successNotification";
import {errorNotification} from "@components/notification/errorNotification";

export default function __ViewDrawer({viewDrawer, setViewDrawer, module,height,refetchAll}) {
    const {t} = useTranslation();
    const entityObject = useSelector((state) => state.crud[module].editData);
    const dispatch = useDispatch()
    const userRoles = getUserRole();
    // console.log(user.id)
    const ALLOWED_OPD_ROLES = ["nurse_incharge","admin_nurse"];
    const canApprove = userRoles.some((role) => ALLOWED_OPD_ROLES.includes(role));
    const closeDrawer = () => {
        setViewDrawer(false);
    };

    const handleIndentApproved = (id) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: "Confirm", cancel: "Cancel"},
            confirmProps: {color: "var(--theme-delete-color)"},
            onCancel: () => console.info("Cancel"),
            onConfirm: () => handleConfirmApproved(id),
        });
    }

    const handleConfirmApproved = async (id) => {
        try {
            const value = {
                url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.APPROVE}/${id}`,
                module,
            };
            const resultAction = await dispatch(showEntityData(value));
            if (showEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    successNotification(resultAction.payload.data.message);
                    refetchAll()
                }
            }
            closeDrawer();
        } catch (error) {
            errorNotification("Error updating indent config:" + error.message);
        }
    }

    return (
        <Drawer.Root opened={viewDrawer} size="xl" position="right" onClose={closeDrawer} offset={16}>
            <Drawer.Overlay/>
            <Drawer.Content>
                <Drawer.Header className={"drawer-sticky-header"}>
                    <Drawer.Title>
                        <Flex align="center" gap={8}>
                            <IconArrowLeft size={16}/>{" "}
                            <Text mt="es" fz={16} fw={500}>
                                {t("Indent")}
                            </Text>
                        </Flex>
                    </Drawer.Title>
                    <Drawer.CloseButton/>
                </Drawer.Header>
                <Box mb={0}  w={'100%'}>
                    <Box p={"md"} >
                        <Box>
                            <Grid columns={24}>
                                <Grid.Col span={"4"} className="drawer-form-input-label">
                                    {t("Invoice")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.invoice_date && entityObject.invoice_date}
                                </Grid.Col>
                                <Grid.Col span={"4"} className="drawer-form-input-label">
                                    {t("Warehouse")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.to_warehouse && entityObject.to_warehouse}
                                </Grid.Col>
                            </Grid>
                            <Grid columns={24}>
                                <Grid.Col span={"4"} className="drawer-form-input-label">
                                    {t("Process")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.process && entityObject.process}
                                </Grid.Col>
                                <Grid.Col span={"4"} className="drawer-form-input-label">
                                    {t("CreatedBy")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.created_by && entityObject.created_by}
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
                            records={entityObject?.stock_transfer_items || []}
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
                                    accessor: "request_quantity",
                                    title: t("RequestQuantity"),
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
                            height={height - 96}
                        />
                        </Box>
                    </Box>
                </Box>
                <Drawer.Header className={"drawer-sticky-header"}>
                    <Drawer.Title>
                        <Flex align="right" gap={8}>
                            {canApprove && entityObject.process !== 'Approved' && !entityObject.approved_by_id && (
                            <Button
                                onClick={() => handleIndentApproved(entityObject.uid)}
                                variant="filled"
                                c="white"
                                bg="var(--theme-primary-color-6)"
                                size="xs"
                                radius="es"
                                leftSection={<IconEye size={16}/>}
                            >
                                {t("Approve")}
                            </Button>
                            )}
                        </Flex>
                    </Drawer.Title>
                </Drawer.Header>
            </Drawer.Content>
        </Drawer.Root>
    );
}
