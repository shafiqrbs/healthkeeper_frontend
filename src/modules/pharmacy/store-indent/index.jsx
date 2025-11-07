import {Box, Flex, Progress} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";

import {useGetLoadingProgress} from "@hooks/loading-progress/useGetLoadingProgress";
import Navigation from "@components/layout/Navigation";
import {useOutletContext, useParams} from "react-router-dom";
import {MODULES_PHARMACY} from "@/constants";

import Table from "./_Table";
import CoreHeaderNavbar from "@hospital-components/CoreHeaderNavbar";
import {useTranslation} from "react-i18next";
import Update from "@modules/pharmacy/store-indent/form/Update";
import {useEffect, useState} from "react";
import {getDataWithoutStore} from "@/services/apiService";
import {PHARMACY_DATA_ROUTES} from "@/constants/routes";
import {useForm} from "@mantine/form";
import {getInitialValues} from "@modules/pharmacy/store-indent/helpers/request";

const module = MODULES_PHARMACY.REQUISITION;

export default function Index({mode}) {
    const {t} = useTranslation();
    const progress = useGetLoadingProgress();
    const matches = useMediaQuery("(max-width: 64em)");
    const {mainAreaHeight} = useOutletContext();
    const isEditMode = mode === "edit";
    const form = useForm(getInitialValues(t));
    const {id} = useParams();
    const [data, setData] = useState({});
    useEffect(() => {
        if (id) {
            fetchSingleRequisitionData();
        }
    }, [id]);
    async function fetchSingleRequisitionData() {
        const response = await getDataWithoutStore({
            url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STORE_INDENT.VIEW}/${id}`,
        });
        setData(response?.data);
    }


    return (
        <>
            {progress !== 100 ? (
                <Progress
                    color="var(--theme-reset-btn-color)"
                    size="sm"
                    striped
                    animated
                    value={progress}
                    transitionDuration={200}
                />
            ) : (
                <Box p="16px">
                    <Flex gap="8px">
                        {!matches && (
                            <Navigation menu="base" subMenu={"basePharmacySubmenu"} mainAreaHeight={mainAreaHeight}/>
                        )}
                        <Box bg="white" p="xs" className="borderRadiusAll" w="100%">
                            <CoreHeaderNavbar
                                module="pharmacy"
                                pageTitle={t("ManageIndent")}
                                roles={t("Roles")}
                                allowZeroPercentage=""
                                currencySymbol=""
                            />
                            {isEditMode ? <Update form={form} data={data}/> : <Table module={module}/>}
                        </Box>
                    </Flex>
                </Box>
            )}
        </>
    );
}
