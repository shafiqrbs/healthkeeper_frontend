import {Group, Box, ActionIcon, Text, rem, Flex, Button} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconTrashX,
    IconAlertCircle,
    IconEdit,
    IconEye,
    IconChevronUp,
    IconSelector,
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
import {deleteEntityData, editEntityData} from "@/app/store/core/crudThunk";
import {setInsertType, setRefetchData} from "@/app/store/core/crudSlice.js";
import {ERROR_NOTIFICATION_COLOR} from "@/constants/index.js";
import {deleteNotification} from "@components/notification/deleteNotification";
import {useState} from "react";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import {getLoggedInUser, getUserRole} from "@utils/index";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import {CORE_DROPDOWNS} from "@/app/store/core/utilitySlice";

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
    const user = getLoggedInUser();
    const userRoles = getUserRole();
   // console.log(user.id)
    const ALLOWED_OPD_ROLES = ["nurse_incharge"];
    const canApprove = userRoles.some((role) => ALLOWED_OPD_ROLES.includes(role));
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
        fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.INDEX,
        filterParams: {
            name: filterData?.name,
            term: searchKeyword,
          //  ...(userRoles.some((role) => ALLOWED_OPD_ROLES.includes(role)) && { user_id: user.id }),
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
            labels: {confirm: "Confirm", cancel: "Cancel"},
            confirmProps: {color: "var(--theme-delete-color)"},
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
            dispatch(setRefetchData({module, refetching: true}));
            deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
            navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.REQUISITION.INDEX);
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
                url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.VIEW}/${id}`,
                module,
            })
        );
        setViewDrawer(true);
    };

    const handleCreateFormNavigate = () => {
        navigate(`${PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.REQUISITION.CREATE}`);
    };

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
                            accessor: "process",
                            title: t("Process"),
                            sortable: false,
                        },
                        {
                            accessor: "action",
                            title: "",
                            textAlign: "right",
                            titleClassName: "title-right",
                            render: (values) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Button.Group>

                                        {values.process !== 'Approved' && !values.approved_by_id &&
                                            <Button
                                                onClick={() => handleEntityEdit(values.uid)}
                                                variant="filled"
                                                c="white"
                                                size="compact-xs"
                                                radius="es"
                                                leftSection={<IconEdit size={16}/>}
                                                className="border-right-radius-none btnPrimaryBg"
                                            >
                                                {t("Edit")}
                                            </Button>
                                        }
                                        <Button
                                            onClick={() => handleDataShow(values.uid)}
                                            variant="filled"
                                            c="white"
                                            size="compact-xs"
                                            bg="var(--theme-primary-color-6)"
                                            radius="es"
                                            leftSection={<IconEye size={16}/>}
                                            className="border-left-radius-none border-right-radius-none"
                                        >
                                            {t("View")}
                                        </Button>
                                        {values.process !== 'Approved' && !values.approved_by_id &&
                                            <ActionIcon
                                                size={'sm'}
                                                onClick={() => handleDelete(values.uid)}
                                                className="action-icon-menu border-left-radius-none"
                                                variant="light"
                                                color="var(--theme-delete-color)"
                                                radius="es"
                                                ps="les"
                                                aria-label="Settings"
                                            >
                                                <IconTrashX height={18} width={18} stroke={1.5}/>
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
            <ViewDrawer viewDrawer={viewDrawer} height={height} setViewDrawer={setViewDrawer} module={module} refetchAll={refetchAll}/>
        </>
    );
}
