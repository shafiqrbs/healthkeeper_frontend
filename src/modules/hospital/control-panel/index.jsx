import Navigation from "@components/layout/Navigation";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress"
import { Box, Flex } from "@mantine/core";
import { useOutletContext, useSearchParams } from "react-router-dom";
import DashboardTable from "@modules/home/operator/AdminBoard";
import AdmissionDashboard from "@modules/home/operator/AdmissionBoard";
import PrescriptionTable from "@modules/hospital/prescription/Table";
import PrescriptionBoardTable from "@modules/hospital/prescription-board/Table";
import IPDConfirmTable from "@modules/hospital/admission/ipdConfirm/_Table";
import BedRoomTable from "@modules/hospital/admission/bedCabin/_Table";
import WaiverTable from "@modules/hospital/patient-waiver/_Table";
import RefundTable from "@modules/hospital/refund-confirm/Table";
import ReadmissionTable from "@modules/hospital/patient-archive/Table";
import DoctorOpdTable from "@modules/hospital/doctor/opd/Table";
import { MODULES } from "@/constants";
import { useState, useEffect } from "react";
import DashboardTab from "@components/tabs/DashboardTabs";

const prescriptionModule = MODULES.PRESCRIPTION;
const ipdConfirmModule = MODULES.ADMISSION;

const tabs = [ "Dashboard", "Admission", "Prescription", "Pres.Board", "IPD Confirm", "Bed/Cabin", "Refund", "Waiver", "Re-admission", "Medicine" ];
const DEFAULT_TAB = "Dashboard";

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
                            <DashboardTab tabList={tabs} tabValue={tabValue} setTabValue={handleTabChange} />
                            {tabValue === "Dashboard" && (
                                <DashboardTable module={prescriptionModule} height={mainAreaHeight - 210} />
                            )}
                            {tabValue === "Admission" && (
                                <AdmissionDashboard module={prescriptionModule} height={mainAreaHeight - 210} />
                            )}
                            {tabValue === "Prescription" && (
                                <PrescriptionTable module={prescriptionModule} height={mainAreaHeight - 210} />
                            )}
                            {tabValue === "Pres.Board" && (
                                <PrescriptionBoardTable module={prescriptionModule} height={mainAreaHeight - 210} />
                            )}
                            {tabValue === "IPD Confirm" && (
                                <IPDConfirmTable module={ipdConfirmModule} height={mainAreaHeight - 156} />
                            )}
                            {tabValue === "Waiver" && (
                                <WaiverTable module={prescriptionModule} height={mainAreaHeight - 210} />
                            )}
                            {tabValue === "Refund" && (
                                <RefundTable module={prescriptionModule} height={mainAreaHeight - 210} />
                            )}
                            {tabValue === "Bed/Cabin" && (
                                <BedRoomTable module={prescriptionModule} height={mainAreaHeight - 210} />
                            )}
                            {tabValue === "Re-admission" && (
                                <ReadmissionTable module={ipdConfirmModule} height={mainAreaHeight - 210} />
                            )}
                            {tabValue === "Medicine" && (
                                <DoctorOpdTable module={ipdConfirmModule} height={mainAreaHeight - 188} />
                            )}
                        </Box>
                    </Flex>
                </Box>
            )}
        </>
    )
}
