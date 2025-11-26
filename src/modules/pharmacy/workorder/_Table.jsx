import {Group, Box, ActionIcon, Text, rem, Flex, Button, CloseButton, Badge} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconTrashX,
    IconAlertCircle,
    IconEdit,
    IconEye,
    IconChevronUp,
    IconSelector
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useOutletContext} from "react-router-dom";
import {modals} from "@mantine/modals";
import KeywordSearch from "@modules/filter/KeywordSearch";
import ViewDrawer from "./__ViewDrawer";
import {notifications} from "@mantine/notifications";
import CreateButton from "@components/buttons/CreateButton";
import DataTableFooter from "@components/tables/DataTableFooter";
import {PHARMACY_DATA_ROUTES} from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import {deleteEntityData, editEntityData, showEntityData} from "@/app/store/core/crudThunk";
import {setInsertType, setRefetchData} from "@/app/store/core/crudSlice.js";
import {ERROR_NOTIFICATION_COLOR} from "@/constants/index.js";
import {deleteNotification} from "@components/notification/deleteNotification";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import {successNotification} from "@components/notification/successNotification.jsx";
import {errorNotification} from "@components/notification/errorNotification.jsx";
import {getUserRole} from "@utils/index";
import {useState} from "react";

const PER_PAGE = 50;

export default function _Table({module}) {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {mainAreaHeight} = useOutletContext();
    const navigate = useNavigate();
    const [viewDrawer, setViewDrawer] = useState(false);
    const searchKeyword = useSelector((state) => state.crud.searchKeyword);
    const filterData = useSelector((state) => state.crud[module].filterData);
    const listData = useSelector((state) => state.crud[module].data);
    const height = mainAreaHeight - 48;
    const userRoles = getUserRole();
    const ALLOWED_PHARMACIST_ROLES = ["pharmacy_doctor","pharmacy_pharmacist","admin_administrator"];
    const canApprove = userRoles.some((role) => ALLOWED_PHARMACIST_ROLES.includes(role));
    // for infinity table data scroll, call the hook
    const {
        scrollRef,
        records,
        fetching,
        sortStatus,
        setSortStatus,
        handleScrollToBottom,
        refetchAll
    } = useInfiniteTableScroll({
        module,
        fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.PURCHASE.INDEX,
        filterParams: {
            name: filterData?.name,
            term: searchKeyword,
        },
        perPage: PER_PAGE,
        sortByKey: "name",
    });

    const handleEntityEdit = (id) => {
        navigate(`${PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.WORKORDER.UPDATE}/${id}`);
    };


    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: "Confirm", cancel: "Cancel"},
            confirmProps: {color: "var(--theme-delete-color)"},
            onCancel: () => console.info("Cancel"),
            onConfirm: () => handleDeleteSuccess(id),
        });
    };

    const handleDeleteSuccess = async (id) => {
        const res = await dispatch(
            deleteEntityData({
                url: `${PHARMACY_DATA_ROUTES.API_ROUTES.PURCHASE.DELETE}/${id}`,
                module,
                id,
            })
        );

        if (deleteEntityData.fulfilled.match(res)) {
            dispatch(setRefetchData({module, refetching: true}));
            deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
            navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.WORKORDER.INDEX);
            dispatch(setInsertType({insertType: "create", module}));
        } else {
            notifications.show({
                color: ERROR_NOTIFICATION_COLOR,
                title: t("DeleteFailed"),
                icon: <IconAlertCircle style={{width: rem(18), height: rem(18)}}/>,
            });
        }
    };

    const handleDataShow = (id) => {
        dispatch(
            editEntityData({
                url: `${PHARMACY_DATA_ROUTES.API_ROUTES.PURCHASE.VIEW}/${id}`,
                module,
            })
        );
        setViewDrawer(true);
    };

    const handleCreateFormNavigate = () => {
        navigate(`${PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.WORKORDER.CREATE}`);
    };

    const processColorMap = {Created: 'Red','Received':'green',Approved:'blue'};

    return (
        <>
            <Box p="xs" className="boxBackground borderRadiusAll border-bottom-none ">
                <Flex align="center" justify="space-between" gap={4}>
                    <KeywordSearch module={module}/>
                    <CreateButton handleModal={handleCreateFormNavigate} text="AddNew"/>
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
                            accessor: "invoice",
                            title: t("InvoiceID"),
                            textAlignment: "right",
                            sortable: true,
                        },
                        {
                            accessor: "vendor_name",
                            title: t("VendorName"),
                            sortable: true,
                        },
                        {
                            accessor: "cbName",
                            title: t("CreatedBy"),
                            sortable: true,
                        },
                        { accessor: 'process',textAlign: 'center', title: t('Process') ,
                            render: (item) => {
                                const color = processColorMap[item.process] || ''; // fallback for unknown status
                                return (
                                    <Badge size="xs" radius="sm" color={color}>
                                        {item.process}
                                    </Badge>
                                );
                            },
                            cellsClassName: tableCss.statusBackground
                        },
                        {
                            accessor: "action",
                            title: "",
                            textAlign: "right",
                            titleClassName: "title-right",
                            render: (values) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Button.Group>
                                        {values.process !== 'Received' && !values.received_by_id &&
                                            <Button
                                            onClick={() => { handleEntityEdit(values.id); }}
                                            variant="filled"
                                            c="white"
                                            fw={400}
                                            size="compact-xs"
                                            radius="es"
                                            leftSection={<IconEdit size={12} />}
                                            className="border-left-radius-none btnPrimaryBg"
                                            >
                                            {t("Edit")}
                                            </Button>
                                        }
                                        <Button
                                            onClick={() => handleDataShow(values.id)}
                                            variant="filled"
                                            c="white"
                                            bg="var(--theme-primary-color-6)"
                                            size="compact-xs"
                                            radius="es"
                                            fw={400}
                                            leftSection={<IconEye size={12} />}
                                            className="border-left-radius-none border-right-radius-none"
                                        >
                                            {t("View")}
                                        </Button>

                                        {values.process !== 'Received' && !values.received_by_id &&
                                            <ActionIcon
                                                size={'sm'}
                                                onClick={() => handleDelete(values.id)}
                                                variant="light"
                                                color="var(--theme-delete-color)"
                                                radius="es">
                                            <IconTrashX stroke={1.5} />
                                            </ActionIcon>
                                        }
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
                        sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14}/>,
                        unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14}/>,
                    }}
                />
            </Box>

            <DataTableFooter indexData={listData} module={module}/>
            <ViewDrawer viewDrawer={viewDrawer} height={mainAreaHeight} refetchAll={refetchAll} setViewDrawer={setViewDrawer} module={module}/>
        </>
    );
}
