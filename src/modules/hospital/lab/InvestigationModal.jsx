import {
    Box,
    Checkbox,
    Grid,
    ScrollArea,
    TextInput,
} from "@mantine/core";
import { useOutletContext, useParams } from "react-router-dom";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";
import useParticularsData from "@hooks/useParticularsData";
import TabsActionButtons from "@hospital-components/TabsActionButtons";
import { useForm } from "@mantine/form";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES_CORE } from "@/constants";
import { useDispatch } from "react-redux";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { useTranslation } from "react-i18next";

export default function InvestigationModal() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { t } = useTranslation();
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const form = useForm({
        initialValues: {
            investigation: [],
        },
    });

    const { mainAreaHeight } = useOutletContext();
    const { particularsData } = useParticularsData({ modeName: "Admission" });

    const investigationParticulars = particularsData?.find((item) => item.particular_type.name === "Investigation");

    const [ searchQuery, setSearchQuery ] = useState("");

    const filteredInvestigations =
        investigationParticulars?.particular_type?.particulars
            ?.filter((particular) => particular.name?.toLowerCase().includes(searchQuery.toLowerCase()))
            ?.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" })) || [];

    const handleCheckboxChange = (particular, checked) => {
        const currentList = Array.isArray(form.values.investigation) ? form.values.investigation : [];

        if (checked) {
            const newItem = {
                id: particular.id,
                name: particular.name,
                value: particular.name,
            };

            const existingIndex = currentList.findIndex(
                (item) => item.id === particular.id && item.name === particular.name
            );

            if (existingIndex === -1) {
                const updatedList = [ ...currentList, newItem ];
                form.setFieldValue("investigation", updatedList);
            }
        } else {
            const updatedList = currentList.filter(
                (item) => !(item.id === particular.id && item.name === particular.name)
            );
            form.setFieldValue("investigation", updatedList);
        }
    };

    const isInvestigationSelected = (particular) => {
        const currentList = Array.isArray(form.values.investigation) ? form.values.investigation : [];
        return currentList.some((item) => item.id === particular.id && item.name === particular.name);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formValue = {
                json_content: form.values?.investigation,
                ipd_module: "investigation",
            };

            const value = {
                url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PROCESS}/${id}`,
                data: formValue,
                module: MODULES_CORE.INVESTIGATION,
            };

            const resultAction = await dispatch(storeEntityData(value)).unwrap();

            if (resultAction.status === 200) {
                successNotification(t("InvestigationAddedSuccessfully"));
                form.reset();
            } else {
                errorNotification(t("InvestigationAddedFailed"));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box w="100%" h={mainAreaHeight - 63}>
            <Grid w="100%" columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%", width: "100%" } }}>
                <Grid.Col span={24}>
                    <Box bg="var(--mantine-color-white)" className="borderRadiusAll" h="100%">
                        <Box p="3xs">
                            <TextInput
                                placeholder="Search investigations..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                                leftSection={<IconSearch size={16} />}
                                mb="sm"
                                rightSection={
                                    searchQuery ? (
                                        <IconX
                                            className="cursor-pointer"
                                            size={16}
                                            onClick={() => setSearchQuery("")}
                                        />
                                    ) : null
                                }
                            />
                            <ScrollArea h={mainAreaHeight - 170}>
                                <Box
                                    style={{
                                        columnCount: 3,
                                        columnGap: "md",
                                    }}
                                >
                                    {filteredInvestigations.map((particular) => (
                                        <Checkbox
                                            key={particular.id}
                                            label={particular.name}
                                            checked={isInvestigationSelected(particular)}
                                            onChange={(event) =>
                                                handleCheckboxChange(particular, event.currentTarget.checked)
                                            }
                                            size="sm"
                                            mb="sm"
                                        />
                                    ))}
                                </Box>
                            </ScrollArea>
                        </Box>
                        <Box px="xs">
                            <TabsActionButtons
                                isSubmitting={isSubmitting}
                                handleReset={() => { }}
                                handleSave={handleSubmit}
                            />
                        </Box>
                    </Box>
                </Grid.Col>
            </Grid>
        </Box>
    );
}
