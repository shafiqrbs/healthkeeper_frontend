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
    IconDeviceFloppy
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useHotkeys, useOs } from "@mantine/hooks";
import tableCss from "@assets/css/Table.module.css";
import ViewDrawer from "./__ViewDrawer.jsx";
import { MASTER_DATA_ROUTES } from "@/constants/routes.js";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { useForm } from "@mantine/form";
import {DATA_TYPES, SUCCESS_NOTIFICATION_COLOR} from "@/constants";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import {getIndexEntityData, storeEntityData} from "@/app/store/core/crudThunk";
import {useOutletContext} from "react-router-dom";

export default function _Table({ module }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const os = useOs();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 48; //TabList height 104

    const [records, setRecords] = useState([]);
    const [submitFormData, setSubmitFormData] = useState({});
    const [viewDrawer, setViewDrawer] = useState(false);
    const [customerObject, setCustomerObject] = useState({});
    const [fetching, setFetching] = useState(false);

    const { data: getParticularOperationModes } = useGlobalDropdownData({
        path: HOSPITAL_DROPDOWNS.PARTICULAR_OPERATION_MODE.PATH,
        params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_OPERATION_MODE.TYPE },
        utility: HOSPITAL_DROPDOWNS.PARTICULAR_OPERATION_MODE.UTILITY,
    });

    const form = useForm({
        initialValues: {
            mode_id: "",
        }
    });

    const fetchData = async () => {
        setFetching(true);
        const value = {
            url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_TYPE.INDEX,
            module,
        };
        try {
            const result = await dispatch(getIndexEntityData(value)).unwrap();
            setRecords(result?.data?.data || []);
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        if (!records?.length) return;

        const initialFormData = records.reduce((acc, item) => {
            const modes = Array.from(
                new Set((item.particular_matrix || []).map(p => p.particular_mode_id))
            );

            acc[item.id] = {
                data_type: item.data_type || "",
                operation_modes: modes,
            };

            return acc;
        }, {});

        setSubmitFormData(initialFormData);
    }, [records]);

    const handleDataTypeChange = (rowId, field, value) => {
        setSubmitFormData(prev => ({
            ...prev,
            [rowId]: {
                ...prev[rowId],
                [field]: value,
            },
        }));
    };

    const handleRowSubmit = async (rowId) => {
        const formData = submitFormData[rowId];
        if (!formData) return;

        formData.particular_type_id = rowId;

        const value = {
            url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_TYPE.CREATE,
            data: formData,
            module,
        };

        try {
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
                successNotification(t("InsertSuccessfully"),SUCCESS_NOTIFICATION_COLOR);
            }
        } catch (error) {
            errorNotification(error.message);
        }
    };

    useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => {}]]);

    return (
        <>
            <Box className="borderRadiusAll border-top-none">
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
                            accessor: "index",
                            title: t("S/N"),
                            textAlignment: "right",
                            render: (item) => records?.indexOf(item) + 1,
                        },
                        {
                            accessor: "name",
                            title: t("Name"),
                            render: (values) => (
                                <>
                                    <Text
                                        className="activate-link"
                                        fz="sm"
                                        onClick={() => setCustomerObject(values)}
                                    >
                                        {values.name}
                                    </Text>
                                </>
                            ),
                        },
                        {
                            accessor: "data_type",
                            title: t("DataType"),
                            width: "220px",
                            render: (item) => (
                                <Select
                                    placeholder="SelectDataType"
                                    data={DATA_TYPES}
                                    value={submitFormData[item.id]?.data_type || ""}
                                    onChange={(val) => handleDataTypeChange(item.id, "data_type", val)}
                                />
                            ),
                        },
                        {
                            accessor: "operation_modes",
                            title: t("OperationModes"),
                            width: "220px",
                            render: (item) => (
                                <Stack>
                                    {getParticularOperationModes.map((mode) => (
                                        <Checkbox
                                            key={mode.id}
                                            label={mode.label}
                                            size="sm"
                                            checked={
                                                submitFormData[item.id]?.operation_modes?.includes(Number(mode.value)) || false
                                            }
                                            onChange={(e) => {
                                                const checked = e.currentTarget.checked;
                                                setSubmitFormData((prev) => {
                                                    const prevModes = prev[item.id]?.operation_modes || [];
                                                    return {
                                                        ...prev,
                                                        [item.id]: {
                                                            ...prev[item.id],
                                                            operation_modes: checked
                                                                ? [...prevModes, Number(mode.value)]
                                                                : prevModes.filter((m) => m !== Number(mode.value)),
                                                        },
                                                    };
                                                });
                                            }}
                                        />
                                    ))}
                                </Stack>
                            ),
                        },
                        {
                            accessor: "action",
                            title: "",
                            render: (item) => (
                                <Center>
                                    <Button
                                        onClick={() => handleRowSubmit(item.id)}
                                        variant="filled"
                                        size="xs"
                                        className="btnPrimaryBg"
                                        leftSection={<IconDeviceFloppy size={16} />}
                                    >
                                        {t("Save")}
                                    </Button>
                                </Center>
                            ),
                        },
                    ]}
                    fetching={fetching}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                />
            </Box>

            <ViewDrawer
                viewDrawer={viewDrawer}
                setViewDrawer={setViewDrawer}
                entityObject={customerObject}
            />
        </>
    );
}
