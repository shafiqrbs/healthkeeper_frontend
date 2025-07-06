import { Box, Flex, Button, Text } from "@mantine/core";
import { IconDeviceFloppy,IconRestore } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

export default function DrawerStickyFooter({ type }) {
	const { isOnline } = useOutletContext();
	const { t } = useTranslation();

	return (
		<>
			{isOnline && (
				<Box className="drawer-sticky-footer">
					<Flex justify="space-between" align="center">
						<Button
							size="md"
							className="btnPrimaryRestBg"
							type="submit"
							id="EntityFormSubmit"
							leftSection={<IconRestore size={16} />}
						>
							<Text>{t("Reset")}</Text>
						</Button>
						<Button
							size="md"
							className="btnPrimaryBg"
							type="submit"
							id="EntityFormSubmit"
							leftSection={<IconDeviceFloppy size={16} />}
						>
							<Text>{t(type === "create" ? "CreateAndSave" : "UpdateAndSave")}</Text>
						</Button>
					</Flex>
				</Box>
			)}
		</>
	);
}
