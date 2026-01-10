import {Box, Flex, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";

import {useGetLoadingProgress} from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import {getInitialValues} from "./helpers/request";
import {useForm} from "@mantine/form";
import IndexForm from "./form/__IndexForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import {useOutletContext} from "react-router-dom";
import _Table from "./_Table";
import {MODULES} from "@/constants";

const module = MODULES.FILE_UPLOAD;

export default function Index({mode = "create"}) {
    const {t} = useTranslation();
    const form = useForm(getInitialValues(t));
    const progress = useGetLoadingProgress();
    const matches = useMediaQuery("(max-width: 64em)");
    const [opened, {open, close}] = useDisclosure(false);
    const {mainAreaHeight} = useOutletContext();
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
                                    <Navigation menu="base" subMenu={"basePharmacySubmenu"}
                                                mainAreaHeight={mainAreaHeight}/>
                                )}
                                <Box bg="var(--mantine-color-white)" p="xs" className="borderRadiusAll" w="100%">
                                    <CoreHeaderNavbar
                                        module="pharmacy"
                                        pageTitle={t("ManageFile")}
                                        roles={t("Roles")}
                                        allowZeroPercentage=""
                                        currencySymbol=""
                                    />
                                    <_Table module={module} open={open} close={close}/>

                                    <GlobalDrawer
                                        opened={opened}
                                        close={close}
                                        title={mode === "create" ? t("CreateFile") : t("UpdateFile")}
                                    >
                                        <IndexForm module={module} form={form} mode={mode} close={close}/>
                                    </GlobalDrawer>
                                </Box>
                            </Flex>
                        </Box>

                    )}
                </>
            )}
        </>
    );
}
