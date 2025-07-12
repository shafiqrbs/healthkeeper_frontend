import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Flex, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconBed } from "@tabler/icons-react";

export default function DoctorsRoomDrawer({ opened, close }) {
	const { t } = useTranslation();

	return (
		<GlobalDrawer opened={opened} close={close} title="Doctors Room" size="30%">
			<Box mt="sm">
				<Box bg="var(--theme-primary-color-0)" py="xxxs" px="xs" style={{ borderRadius: "4px" }}>
					<Text fz="sm" fw={600}>
						{t("collectionOverview")}
					</Text>
				</Box>
				<Box>
					<Flex>
						<Text>{t("totalPatient")}</Text>
						<Box>
							<IconBed />
						</Box>
					</Flex>
				</Box>
			</Box>
		</GlobalDrawer>
	);
}
