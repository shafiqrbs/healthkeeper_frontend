import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {PHARMACY_DATA_ROUTES} from "@/constants/routes";
import {modals} from "@mantine/modals";
import {rem, Text} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {
    MODULES_PHARMACY,
    SUCCESS_NOTIFICATION_COLOR,
} from "@/constants";
import {IconCheck} from "@tabler/icons-react";
import {getRequisitionInitialValues} from "../helpers/request";
import Form from "./__Form";

const module = MODULES_PHARMACY.REQUISITION;

export default function Update({form, data}) {
    const [records, setRecords] = useState([]);
    const {t} = useTranslation();
    const {id} = useParams();
    const navigate = useNavigate();
    const requisitionForm = useForm(getRequisitionInitialValues(t));

    useEffect(() => {
        if (!data) return;

        const entity = data?.data ?? data;

        requisitionForm.setValues({
            notes: entity?.notes || "",
            to_warehouse_id: entity?.to_warehouse_id
                ? String(entity.to_warehouse_id)
                : "",
        });

        const mappedRecords = Array.isArray(entity?.stock_transfer_items)
            ? entity.stock_transfer_items.map((stockTransferItem) => ({
                id: stockTransferItem?.id,
                stock_item_id: stockTransferItem?.stock_item_id
                    ? String(stockTransferItem.stock_item_id)
                    : "",
                name: stockTransferItem?.name || "",
                quantity: stockTransferItem?.quantity || "",
                request_quantity: stockTransferItem?.request_quantity || "",
                stock_quantity: stockTransferItem?.stock_quantity || 0,
                purchase_item_id: stockTransferItem?.purchase_item_id || "",
                purchase_items: stockTransferItem?.purchase_items || "",
            }))
            : [];

        setRecords(mappedRecords);
    }, [data]);

    const handleRequisitionUpdate = (values) => {
        const validation = requisitionForm.validate();
        if (validation.hasErrors) return;

        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: t("Submit"), cancel: t("Cancel")},
            confirmProps: {color: "red"},
            onConfirm: () => saveRequisitionUpdate(values),
        });
    };

    async function saveRequisitionUpdate(values) {
        notifications.show({
            color: SUCCESS_NOTIFICATION_COLOR,
            title: t("UpdateSuccessfully"),
            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
            autoClose: 800,
            onClose: () => navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.STORE_INDENT.INDEX),
        });
    }

    return (
        <Form
            form={form}
            requisitionForm={requisitionForm}
            items={records}
            id={id}
            setItems={setRecords}
            onSave={handleRequisitionUpdate}
        />
    );
}
