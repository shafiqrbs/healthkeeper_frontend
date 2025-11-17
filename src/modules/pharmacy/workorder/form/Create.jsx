import {useForm} from "@mantine/form";
import Form from "./__Form";
import {getWorkorderFormInitialValues} from "../helpers/request";
import {modals} from "@mantine/modals";
import {rem, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {formatDateForMySQL, getLoggedInUser} from "@utils/index";
import {PHARMACY_DATA_ROUTES} from "@/constants/routes";
import {useDispatch} from "react-redux";
import {storeEntityData} from "@/app/store/core/crudThunk";
import {notifications} from "@mantine/notifications";
import {ERROR_NOTIFICATION_COLOR, MODULES_PHARMACY, SUCCESS_NOTIFICATION_COLOR} from "@/constants";
import {IconAlertCircle, IconCheck} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "@mantine/hooks";

const module = MODULES_PHARMACY.PURCHASE;

export default function Create({form}) {
    const [records, setRecords] = useLocalStorage({
        key: "workorder-records",
        defaultValue: [],
    });

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const workOrderForm = useForm(getWorkorderFormInitialValues(t));
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleWorkOrderSave = (values) => {
        const validation = workOrderForm.validate();
        if (validation.hasErrors) return;

        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: t("Submit"), cancel: t("Cancel")},
            confirmProps: {color: "red", loading: isSaving},
            onCancel: () => console.info("Cancelled"),
            onConfirm: () => saveWorkOrderToDB(values),
        });
    };

    async function saveWorkOrderToDB(values) {
        modals.closeAll();
        setIsSaving(true);
        try {
            const payload = {
                ...values,
                items: records.map((r) => ({
                    ...r,
                    production_date: formatDateForMySQL(r.production_date),
                    expired_date: formatDateForMySQL(r.expired_date),
                })),
                created_by_id: getLoggedInUser()?.id,
            };

            const requestData = {
                url: PHARMACY_DATA_ROUTES.API_ROUTES.PURCHASE.CREATE,
                data: payload,
                module,
            };

            const result = await dispatch(storeEntityData(requestData));

            if (storeEntityData.rejected.match(result)) {
                const fieldErrors = result.payload?.errors;
                if (fieldErrors) {
                    form.setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v[0]])));
                } else {
                    notifications.show({
                        color: ERROR_NOTIFICATION_COLOR,
                        title: t("ServerError"),
                        message: result.error?.message || t("UnexpectedError"),
                    });
                }
            } else if (storeEntityData.fulfilled.match(result)) {
                form.reset();
                workOrderForm.reset();
                localStorage.removeItem("workorder-records");
                setRecords([]);
                notifications.show({
                    color: SUCCESS_NOTIFICATION_COLOR,
                    title: t("CreateSuccessfully"),
                    icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                    autoClose: 800,
                    onClose: () => navigate("/pharmacy/core/workorder"),
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
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Form
            form={form}
            workOrderForm={workOrderForm}
            items={records}
            setItems={setRecords}
            onSave={handleWorkOrderSave}
        />
    );
}
