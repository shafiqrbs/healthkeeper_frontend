import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {PHARMACY_DATA_ROUTES} from "@/constants/routes";
import {updateEntityData} from "@/app/store/core/crudThunk";
import {modals} from "@mantine/modals";
import {Text, rem} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {ERROR_NOTIFICATION_COLOR, MODULES_PHARMACY, SUCCESS_NOTIFICATION_COLOR} from "@/constants";
import {IconAlertCircle, IconCheck} from "@tabler/icons-react";
import {getDispenseFormInitialValues} from "../helpers/request";
import Form from "./__Form";

const module = MODULES_PHARMACY.DISPENSE;
export default function Update({form, data}) {
    const [records, setRecords] = useState([]);

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    const dispenseForm = useForm(getDispenseFormInitialValues(t));

    useEffect(() => {
        if (!data) return;

        const entity = data?.data ?? data;

        dispenseForm.setValues({
            remark: entity?.remark || "",
            dispense_type: entity?.dispense_type ? String(entity.dispense_type) : "",
            dispense_no: entity?.dispense_no ? String(entity.dispense_no) : "",
        });

        form.setFieldValue("warehouse_id", entity?.warehouse_id);

        const mappedRecords = Array.isArray(entity?.dispense_items)
            ? entity.dispense_items.map((dispenseItem) => ({
                stock_item_id: dispenseItem?.stock_item_id ? String(dispenseItem.stock_item_id) : "",
                name: dispenseItem?.name || "",
                quantity: dispenseItem?.quantity || "",
            }))
            : [];

        setRecords(mappedRecords);
    }, [data]);

    const handleDispenseUpdate = (values) => {
        const validation = dispenseForm.validate();
        if (validation.hasErrors) return;

        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: t("Submit"), cancel: t("Cancel")},
            confirmProps: {color: "red"},
            onCancel: () => console.info("Cancelled"),
            onConfirm: () => saveDispenseUpdate(values),
        });
    };

    async function saveDispenseUpdate(values) {
        modals.closeAll();
        try {
            const payload = {
                ...values,
                warehouse_id: form.values.warehouse_id,
                items: records.map((recordItem) => ({
                    ...recordItem,
                })),
            };

            const requestData = {
                url: `${PHARMACY_DATA_ROUTES.API_ROUTES.DISPENSE.UPDATE}/${id}`,
                data: payload,
                module,
            };

            const result = await dispatch(updateEntityData(requestData));

            if (updateEntityData.rejected.match(result)) {
                const fieldErrors = result.payload?.errors;
                if (fieldErrors) {
                    form.setErrors(
                        Object.fromEntries(Object.entries(fieldErrors).map(([key, value]) => [key, value[0]]))
                    );
                } else {
                    notifications.show({
                        color: ERROR_NOTIFICATION_COLOR,
                        title: t("ServerError"),
                        message: result.error?.message || t("UnexpectedError"),
                        icon: <IconAlertCircle style={{width: rem(18), height: rem(18)}}/>,
                    });
                }
            } else if (updateEntityData.fulfilled.match(result)) {
                notifications.show({
                    color: SUCCESS_NOTIFICATION_COLOR,
                    title: t("UpdateSuccessfully"),
                    icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                    autoClose: 800,
                    onClose: () => navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.DISPENSE.INDEX),
                });
            }
        } catch (error) {
            console.error(error);
            notifications.show({
                color: ERROR_NOTIFICATION_COLOR,
                title: t("ErrorOccurred"),
                message: error.message,
                icon: <IconAlertCircle style={{width: rem(18), height: rem(18)}}/>,
                autoClose: 800,
            });
        }
    }

    return (
        <Form
            form={form}
            dispenseForm={dispenseForm}
            items={records}
            setItems={setRecords}
            onSave={handleDispenseUpdate}
        />
    );
}
