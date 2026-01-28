import Navigation from "@components/layout/Navigation";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress"
import { Box, Flex } from "@mantine/core";
import { useOutletContext, useSearchParams } from "react-router-dom";
import PrescriptionTable from "@modules/hospital/prescription/Table";
import IPDConfirmTable from "@modules/hospital/admission/ipdConfirm/_Table";
import { MODULES } from "@/constants";
import BaseTabs from "@components/tabs/BaseTabs";
import { useState, useEffect } from "react";

const prescriptionModule = MODULES.PRESCRIPTION;
const ipdConfirmModule = MODULES.ADMISSION;

const tabs = [ "Prescription", "IPD Confirm", "Demo" ];
const DEFAULT_TAB = "Prescription";

export default function Index() {
    const progress = useGetLoadingProgress();
    const { mainAreaHeight } = useOutletContext();
    const [ searchParams, setSearchParams ] = useSearchParams();

    const initialTabValue = searchParams.get("tab") || DEFAULT_TAB;
    const [ tabValue, setTabValue ] = useState(initialTabValue);

    useEffect(() => {
        const urlTab = searchParams.get("tab");
        if (urlTab && tabs.includes(urlTab)) {
            setTabValue(urlTab);
        } else if (!urlTab) {
            setSearchParams({ tab: DEFAULT_TAB }, { replace: true });
        }
    }, []);

    const handleTabChange = (newTabValue) => {
        setTabValue(newTabValue);
        setSearchParams({ tab: newTabValue }, { replace: true });
    };

    return (
        <>
            {progress !== 100 ? (
                <DefaultSkeleton />
            ) : (
                <Box p="md">
                    <Flex w="100%" gap="2">
                        <Navigation module="home" mainAreaHeight={mainAreaHeight} />
                        <Box w="100%">

                            <BaseTabs tabList={tabs} tabValue={tabValue} setTabValue={handleTabChange} />

                            {tabValue === "Prescription" && (
                                <PrescriptionTable module={prescriptionModule} height={mainAreaHeight - 156} />
                            )}
                            {tabValue === "IPD Confirm" && (
                                <IPDConfirmTable module={ipdConfirmModule} height={mainAreaHeight - 156} />
                            )}
                            {tabValue === "Demo" && (
                                <IPDConfirmTable module={ipdConfirmModule} height={mainAreaHeight - 156} />
                            )}
                        </Box>
                    </Flex>
                </Box>
            )}
        </>
    )
}
