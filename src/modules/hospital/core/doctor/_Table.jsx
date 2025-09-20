import {
    Group,
    Box,
    ActionIcon,
    Text,
    rem,
    Flex,
    Button,
    TextInput,
    Select,
    Checkbox,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconTrashX,
    IconAlertCircle,
    IconEdit,
    IconEye,
    IconChevronUp,
    IconSelector,
    IconGripVertical,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import KeywordSearch from "@modules/filter/KeywordSearch";
import ViewDrawer from "./__ViewDrawer";
import { notifications } from "@mantine/notifications";
import { useOs, useHotkeys } from "@mantine/hooks";
import DataTableFooter from "@components/tables/DataTableFooter";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import {
    deleteEntityData,
    editEntityData,
    storeEntityData,
} from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice.js";
import { ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import { useEffect, useState } from "react";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import inlineInputCss from "@assets/css/InlineInputField.module.css";
import { errorNotification } from "@components/notification/errorNotification";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";

// ✅ drag and drop
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const PER_PAGE = 50;

export default function _Table({ module, open }) {
    const { t } = useTranslation();
    const os = useOs();
    const dispatch = useDispatch();
    const { mainAreaHeight } = useOutletContext();
    const navigate = useNavigate();
    const height = mainAreaHeight - 78;

    const [submitFormData, setSubmitFormData] = useState({});
    const [updatingRows, setUpdatingRows] = useState({});
    const [dragging, setDragging] = useState(false);

    const searchKeyword = useSelector((state) => state.crud.searchKeyword);
    const filterData = useSelector((state) => state.crud[module].filterData);
    const listData = useSelector((state) => state.crud[module].data);

    // infinite table scroll
    const {
        scrollRef,
        records,
        fetching,
        sortStatus,
        setSortStatus,
        handleScrollToBottom,
    } = useInfiniteTableScroll({
        module,
        fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.DOCTOR.INDEX,
        filterParams: {
            name: filterData?.name,
            particular_type: "doctor",
            user_group: "doctor",
            term: searchKeyword,
        },
        perPage: PER_PAGE,
        sortByKey: "name",
    });

    const [viewDrawer, setViewDrawer] = useState(false);

    const { data: getParticularUnits } = useGlobalDropdownData({
        path: HOSPITAL_DROPDOWNS.PARTICULAR_UNIT_MODE.PATH,
        params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_UNIT_MODE.TYPE },
        utility: HOSPITAL_DROPDOWNS.PARTICULAR_UNIT_MODE.UTILITY,
    });

    const { data: getOpdRooms } = useGlobalDropdownData({
        path: HOSPITAL_DROPDOWNS.PARTICULAR_OPD_ROOM.PATH,
        params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_OPD_ROOM.TYPE },
        utility: HOSPITAL_DROPDOWNS.PARTICULAR_OPD_ROOM.UTILITY,
    });

    const handleEntityEdit = (id) => {
        dispatch(setInsertType({ insertType: "update", module }));
        dispatch(
            editEntityData({
                url: `${MASTER_DATA_ROUTES.API_ROUTES.DOCTOR.VIEW}/${id}`,
                module,
            })
        );
        navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.INDEX}/${id}`);
    };

    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "var(--theme-delete-color)" },
            onConfirm: () => handleDeleteSuccess(id),
        });
    };

    const handleDeleteSuccess = async (id) => {
        const res = await dispatch(
            deleteEntityData({
                url: `${MASTER_DATA_ROUTES.API_ROUTES.DOCTOR.DELETE}/${id}`,
                module,
                id,
            })
        );

        if (deleteEntityData.fulfilled.match(res)) {
            dispatch(setRefetchData({ module, refetching: true }));
            deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
            navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR);
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
                url: `${MASTER_DATA_ROUTES.API_ROUTES.DOCTOR.VIEW}/${id}`,
                module,
            })
        );
        setViewDrawer(true);
    };

    const handleCreateForm = () => {
        open();
        dispatch(setInsertType({ insertType: "create", module }));
        navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.INDEX);
    };

    // Initialize form state once per row
    useEffect(() => {
        if (!records?.length) return;

        setSubmitFormData((prev) => {
            const newData = { ...prev };
            records.forEach((item, idx) => {
                if (!newData[item.id]) {
                    newData[item.id] = {
                        name: item.name ?? "",
                        unit_id: item.unit_id?.toString() ?? "",
                        opd_room_id: item.opd_room_id?.toString() ?? "",
                        opd_referred: item?.opd_referred ?? false,
                        ordering: item.ordering ?? idx + 1,
                    };
                }
            });
            return newData;
        });
    }, [records]);

    const handleFieldChange = async (rowId, field, value) => {
        setSubmitFormData((prev) => ({
            ...prev,
            [rowId]: { ...prev[rowId], [field]: value },
        }));

        setUpdatingRows((prev) => ({ ...prev, [rowId]: true }));

        try {
            await dispatch(
                storeEntityData({
                    url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INLINE_UPDATE}/${rowId}`,
                    data: { [field]: value },
                    module,
                })
            );
        } catch (error) {
            errorNotification(error.message);
        } finally {
            setUpdatingRows((prev) => ({ ...prev, [rowId]: false }));
        }
    };

    // 🔹 Drag and drop reorder
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const newRecords = reorder(records, result.source.index, result.destination.index);

        // update local form data ordering
        setSubmitFormData((prev) => {
            const newData = { ...prev };
            newRecords.forEach((item, idx) => {
                newData[item.id] = { ...newData[item.id], ordering: idx + 1 };
            });
            return newData;
        });

        setDragging(true);

        try {
            await dispatch(
                storeEntityData({
                    url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.ORDERING}`,
                    data: {
                        order: newRecords.map((item, idx) => ({
                            id: item.id,
                            ordering: idx + 1,
                        }))
                    },
                    module,
                })
            );

            // ✅ Trigger refetch
            dispatch(setRefetchData({ module, refetching: true }));
        } catch (error) {
            errorNotification(error.message);
        } finally {
            setDragging(false);
        }

    };

    useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => handleCreateForm()]]);

    return (
        <>
            <Box p="xs" className="boxBackground borderRadiusAll border-bottom-none">
                <Flex align="center" justify="space-between" gap={4}>
                    <KeywordSearch module={module} />
                </Flex>
            </Box>

            <Box className="borderRadiusAll border-top-none">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="doctor-table">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
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
                                            accessor: "drag",
                                            title: "",
                                            width: 40,
                                            render: (item, index) => (
                                                <Draggable
                                                    key={item.id}
                                                    draggableId={item.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                cursor: "grab",
                                                                ...provided.draggableProps.style,
                                                            }}
                                                        >
                                                            <IconGripVertical size={16} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ),
                                        },
                                        {
                                            accessor: "index",
                                            title: t("S/N"),
                                            render: (_item, index) => index + 1,
                                        },
                                        {
                                            accessor: "name",
                                            title: t("Name"),
                                            render: (item) => (
                                                <TextInput
                                                    size="xs"
                                                    className={inlineInputCss.inputText}
                                                    placeholder={t("Name")}
                                                    value={submitFormData[item.id]?.name ?? ""}
                                                    onChange={(e) =>
                                                        setSubmitFormData((prev) => ({
                                                            ...prev,
                                                            [item.id]: {
                                                                ...prev[item.id],
                                                                name: e.currentTarget.value,
                                                            },
                                                        }))
                                                    }
                                                    onBlur={() =>
                                                        handleFieldChange(
                                                            item.id,
                                                            "name",
                                                            submitFormData[item.id]?.name ?? ""
                                                        )
                                                    }
                                                    rightSection={updatingRows[item.id]}
                                                />
                                            ),
                                        },
                                        {
                                            accessor: "unit_id",
                                            title: t("UnitName"),
                                            render: (item) => (
                                                <Select
                                                    placeholder={t("SelectUnitName")}
                                                    data={getParticularUnits}
                                                    value={submitFormData[item.id]?.unit_id ?? ""}
                                                    onChange={(val) =>
                                                        handleFieldChange(item.id, "unit_id", val)
                                                    }
                                                    rightSection={updatingRows[item.id]}
                                                />
                                            ),
                                        },
                                        {
                                            accessor: "opd_room_id",
                                            title: t("OPDRoom"),
                                            render: (item) => (
                                                <Select
                                                    placeholder={t("SelectOpdRoom")}
                                                    data={getOpdRooms}
                                                    value={submitFormData[item.id]?.opd_room_id ?? ""}
                                                    onChange={(val) =>
                                                        handleFieldChange(item.id, "opd_room_id", val)
                                                    }
                                                    rightSection={updatingRows[item.id]}
                                                />
                                            ),
                                        },

                                        {
                                            accessor: "action",
                                            title: "",
                                            render: (values) => (
                                                <Group gap={4} justify="right" wrap="nowrap">
                                                    <Button.Group>
                                                        <Button
                                                            onClick={() => {
                                                                handleEntityEdit(values.id);
                                                                open();
                                                            }}
                                                            variant="filled"
                                                            c="white"
                                                            size="xs"
                                                            radius="es"
                                                            leftSection={<IconEdit size={16} />}
                                                            className="border-right-radius-none btnPrimaryBg"
                                                        >
                                                            {t("Edit")}
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDataShow(values.id)}
                                                            variant="filled"
                                                            c="white"
                                                            bg="var(--theme-primary-color-6)"
                                                            size="xs"
                                                            radius="es"
                                                            leftSection={<IconEye size={16} />}
                                                            className="border-left-radius-none"
                                                        >
                                                            {t("View")}
                                                        </Button>
                                                        <ActionIcon
                                                            onClick={() => handleDelete(values.id)}
                                                            className="action-icon-menu border-left-radius-none"
                                                            variant="light"
                                                            color="var(--theme-delete-color)"
                                                            radius="es"
                                                            aria-label="Settings"
                                                        >
                                                            <IconTrashX height={18} width={18} stroke={1.5} />
                                                        </ActionIcon>
                                                    </Button.Group>
                                                </Group>
                                            ),
                                        },
                                    ]}
                                    fetching={fetching}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={height - 72}
                                    onScrollToBottom={handleScrollToBottom}
                                    scrollViewportRef={scrollRef}
                                    sortStatus={sortStatus}
                                    onSortStatusChange={setSortStatus}
                                    sortIcons={{
                                        sorted: (
                                            <IconChevronUp
                                                color="var(--theme-tertiary-color-7)"
                                                size={14}
                                            />
                                        ),
                                        unsorted: (
                                            <IconSelector
                                                color="var(--theme-tertiary-color-7)"
                                                size={14}
                                            />
                                        ),
                                    }}
                                />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Box>

            <DataTableFooter indexData={listData} module={module} />
            <ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} module={module} />
        </>
    );
}

