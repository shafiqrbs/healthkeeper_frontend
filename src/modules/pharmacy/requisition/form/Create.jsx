import {useForm} from "@mantine/form";
import Form from "./__Form";
import {getRequisitionInitialValues} from "../helpers/request";
import {modals} from "@mantine/modals";
import {rem, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {getLoggedInUser} from "@utils/index";
import {PHARMACY_DATA_ROUTES} from "@/constants/routes";
import {useDispatch} from "react-redux";
import {storeEntityData} from "@/app/store/core/crudThunk";
import {notifications} from "@mantine/notifications";
import {ERROR_NOTIFICATION_COLOR, MODULES_PHARMACY, SUCCESS_NOTIFICATION_COLOR} from "@/constants";
import {IconAlertCircle, IconCheck} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "@mantine/hooks";

const module = MODULES_PHARMACY.REQUISITION;

export default function Create({form}) {
    const [records, setRecords] = useLocalStorage({
        key: "requisition-records",
        defaultValue: [],
    });

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const requisitionForm = useForm(getRequisitionInitialValues(t));
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleRequisitionSave = (values) => {
        const validation = requisitionForm.validate();
        if (validation.hasErrors) return;

        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: t("Submit"), cancel: t("Cancel")},
            confirmProps: {color: "red", loading: isSaving},
            onCancel: () => console.info("Cancelled"),
            onConfirm: () => saveRequisitionToDB(values),
        });
    };

    async function saveRequisitionToDB(values) {
        modals.closeAll();
        setIsSaving(true);
        try {
            const payload = {
                ...values,
                items: records.map((r) => ({
                    ...r,
                })),
                created_by_id: getLoggedInUser()?.id,
            };

            const requestData = {
                url: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.CREATE,
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
                requisitionForm.reset();
                localStorage.removeItem("requisition-records");
                setRecords([]);
                notifications.show({
                    color: SUCCESS_NOTIFICATION_COLOR,
                    title: t("CreateSuccessfully"),
                    icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                    autoClose: 800,
                    onClose: () => navigate("/pharmacy/requisition"),
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
            requisitionForm={requisitionForm}
            items={records}
            setItems={setRecords}
            onSave={handleRequisitionSave}
        />
    );
}
