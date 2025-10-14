import { ActionIcon, Box, Flex, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import OPDA4EN from "@components/print-formats/opd/OPDA4EN";
import OPDA4BN from "@components/print-formats/opd/OPDA4BN";
import OPDPosEN from "@components/print-formats/opd/OPDPosEN";
import OPDPosBN from "@components/print-formats/opd/OPDPosBN";
import PrescriptionFullEN from "@components/print-formats/prescription/PrescriptionFullEN";
import PrescriptionFullBN from "@components/print-formats/prescription/PrescriptionFullBN";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { IconArrowLeft } from "@tabler/icons-react";

const STATIC_ID = 59;

export default function Details() {
	const { name } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const { data: OPDData, isLoading: isOPDLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX}/${STATIC_ID}`,
	});

	return (
		<>
			<Flex align="center" gap="sm" bg="gray.1" p="xxxs" fz="sm">
				<ActionIcon color="var(--theme-primary-color-6)" onClick={() => navigate(-1)}>
					<IconArrowLeft size={16} />
				</ActionIcon>
				{name}
			</Flex>
			<ScrollArea h={mainAreaHeight - 100}>
				<Box p="sm">
					{name === "OPDA4EN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<OPDA4EN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "OPDA4BN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<OPDA4BN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "OPDPosEN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<OPDPosEN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "OPDPosBN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<OPDPosBN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "PrescriptionFullEN" && <PrescriptionFullEN preview />}
					{name === "PrescriptionFullBN" && <PrescriptionFullBN preview />}
				</Box>
			</ScrollArea>
		</>
	);
}

function LoadingWrapper({ isLoading, children }) {
	return (
		<Box pos="relative">
			<LoadingOverlay visible={isLoading} />
			{children}
		</Box>
	);
}
