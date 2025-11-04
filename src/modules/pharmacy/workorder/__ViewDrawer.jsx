import {Grid, Box, Drawer, Text, Flex} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconArrowLeft,
} from "@tabler/icons-react";
import {useSelector} from "react-redux";
import {DataTable} from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";

export default function __ViewDrawer({viewDrawer, setViewDrawer, module}) {
    const {t} = useTranslation();
    const height = 500; //TabList height 104
    const entityObject = useSelector((state) => state.crud[module].editData);
    const closeDrawer = () => {
        setViewDrawer(false);
    };

    return (
        <Drawer.Root opened={viewDrawer} position="right" onClose={closeDrawer} offset={16}>
            <Drawer.Overlay/>
            <Drawer.Content>
                <Drawer.Header className={"drawer-sticky-header"}>
                    <Drawer.Title>
                        <Flex align="center" gap={8}>
                            <IconArrowLeft size={16}/>{" "}
                            <Text mt="es" fz={16} fw={500}>
                                {t("Wordorder")}
                            </Text>
                        </Flex>
                    </Drawer.Title>
                    <Drawer.CloseButton/>
                </Drawer.Header>
                <Box mb={0} h={height}>
                    <Box p={"md"} className="borderRadiusAll" h={height}>
                        <Box>
                            <Grid columns={24}>
                                <Grid.Col span={"8"} className="drawer-form-input-label">
                                    {t("Invoice")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.invoice && entityObject.invoice}
                                </Grid.Col>
                            </Grid>
                            <Grid columns={24}>
                                <Grid.Col span={"8"} className="drawer-form-input-label">
                                    {t("Vendor")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.vendor_name && entityObject.vendor_name}
                                </Grid.Col>
                            </Grid>
                            <Grid columns={24}>
                                <Grid.Col span={"8"} className="drawer-form-input-label">
                                    {t("Process")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.process && entityObject.process}
                                </Grid.Col>
                            </Grid>
                            <Grid columns={24}>
                                <Grid.Col span={"8"} className="drawer-form-input-label">
                                    {t("Grn")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.grn && entityObject.grn}
                                </Grid.Col>
                            </Grid>

                            <Grid columns={24}>
                                <Grid.Col span={"8"} className="drawer-form-input-label">
                                    {t("CreatedBy")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.cb_username && entityObject.cb_username}
                                </Grid.Col>
                            </Grid>

                            <Grid columns={24}>
                                <Grid.Col span={"8"} className="drawer-form-input-label">
                                    {t("ApprovedBy")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.ab_username && entityObject.ab_username}
                                </Grid.Col>
                            </Grid>

                            <Grid columns={24}>
                                <Grid.Col span={"8"} className="drawer-form-input-label">
                                    {t("ReceivedBy")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.re_username && entityObject.re_username}
                                </Grid.Col>
                            </Grid>

                            <Grid columns={24}>
                                <Grid.Col span={"8"} className="drawer-form-input-label">
                                    {t("ReceivedDate")}
                                </Grid.Col>
                                <Grid.Col span={"1"}>:</Grid.Col>
                                <Grid.Col span={"auto"}>
                                    {entityObject && entityObject.received_date && entityObject.received_date}
                                </Grid.Col>
                            </Grid>

                            <Grid columns={24}>
                                <DataTable
                                    classNames={{
                                        root: tableCss.root,
                                        table: tableCss.table,
                                        body: tableCss.body,
                                        header: tableCss.header,
                                        footer: tableCss.footer,
                                        pagination: tableCss.pagination,
                                    }}
                                    records={entityObject?.purchase_items || []}
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
                                        },
                                        {
                                            accessor: "production_date",
                                            title: t("ExpiryStartDate"),
                                            sortable: false,
                                        },
                                        {
                                            accessor: "expired_date",
                                            title: t("ExpiryEndDate"),
                                            sortable: false,
                                        },
                                    ]}
                                    textSelectionDisabled
                                />
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Drawer.Content>
        </Drawer.Root>
    );
}
