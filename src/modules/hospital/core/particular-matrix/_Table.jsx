import { useEffect, useState } from "react";
import {
    Box,
    Text,
    Button,
    Stack,
    Select,
    Checkbox,
    Center
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconDeviceFloppy, IconGripVertical
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useHotkeys, useOs } from "@mantine/hooks";
import ViewDrawer from "./__ViewDrawer.jsx";
import { MASTER_DATA_ROUTES } from "@/constants/routes.js";
import { useForm } from "@mantine/form";
import { errorNotification } from "@components/notification/errorNotification";
import {getIndexEntityData, storeEntityData} from "@/app/store/core/crudThunk";
import {useOutletContext} from "react-router-dom";
import {setRefetchData} from "@/app/store/core/crudSlice";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import tableCss from "@assets/css/TableAdmin.module.css";

export default function _Table({ module }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const os = useOs();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 48; //TabList height 104

    const [submitFormData, setSubmitFormData] = useState({});
    const [viewDrawer, setViewDrawer] = useState(false);
    const [customerObject, setCustomerObject] = useState({});
    const [fetching, setFetching] = useState(false);
    const [records, setRecords] = useState([]);
    const [updatingRows, setUpdatingRows] = useState({});
    const [dragging, setDragging] = useState(false);


    const form = useForm({
        initialValues: {
            mode_id: "",
        }
    });

    const fetchData = async () => {
        setFetching(true);
        const value = {
            url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_MATRIX.INDEX,
            module,
        };
        try {
            const result = await dispatch(getIndexEntityData(value)).unwrap();
            setRecords(result?.data?.data || []);
            console.log(records)
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Initialize form state once per row
    useEffect(() => {
        if (!records?.length) return;
        setSubmitFormData((prev) => {
            const newData = { ...prev };
            records.forEach((item, idx) => {
                if (!newData[item.id]) {
                    newData[item.id] = {
                        is_additional_field: item?.is_additional_field ?? false,
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
                    url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_MATRIX.INLINE_UPDATE}/${rowId}`,
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
                    url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_MATRIX.ORDERING}`,
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

    useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => {}]]);

    return (
        <>
            <Box className="borderRadiusAll border-top-none">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="particular-type-table">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        body: tableCss.body,
                        header: tableCss.header,
                        footer: tableCss.footer,
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
                            textAlignment: "right",
                            render: (item) => records?.indexOf(item) + 1,
                        },
                        {
                            accessor: "mode_name",
                            title: t("ModeName"),
                            render: (values) => (
                                <>
                                    <Text
                                        fz="xs"
                                    >
                                        {values.mode_name}
                                    </Text>
                                </>
                            ),
                        },
                        {
                            accessor: "hms_particular_type_name",
                            title: t("ParticularType"),
                            render: (values) => (
                                <>
                                    <Text
                                        fz="xs"
                                    >
                                        {values.hms_particular_type_name}
                                    </Text>
                                </>
                            ),
                        },
                        {
                            accessor: "is_additional_field",
                            title: t("AdditionalField"),
                            render: (item) => (
                                <Checkbox
                                    key={item.id}
                                    size="sm"
                                    checked={submitFormData[item.id]?.is_additional_field ?? false}
                                    onChange={(val) =>
                                        handleFieldChange(
                                            item.id,
                                            "is_additional_field",
                                            val.currentTarget.checked
                                        )
                                    }
                                />
                            ),
                        },

                    ]}
                    fetching={fetching}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Box>

            <ViewDrawer
                viewDrawer={viewDrawer}
                setViewDrawer={setViewDrawer}
                entityObject={customerObject}
            />
        </>
    );
}
