import { ActionIcon, Box, ScrollArea, Drawer, Flex } from "@mantine/core";

import { IconX } from "@tabler/icons-react";
import SettingsForm from "../settings/SettingsForm.jsx";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData.js";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice.js";
import useMainAreaHeight from "@hooks/useMainAreaHeight.js";

function CustomerGroupDrawer(props) {
	const { groupDrawer, setGroupDrawer, saveId } = props;
	const { mainAreaHeight } = useMainAreaHeight();
	const height = mainAreaHeight; //TabList height 104

	const { data: settingTypeDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.SETTING_TYPE.PATH,
		utility: CORE_DROPDOWNS.SETTING_TYPE.UTILITY,
		params: { "dropdown-type": CORE_DROPDOWNS.SETTING_TYPE.TYPE },
	});

	const closeModel = () => {
		setGroupDrawer(false);
	};

	return (
		<>
			<Drawer.Root opened={groupDrawer} position="right" onClose={closeModel} size={"30%"}>
				<Drawer.Overlay />
				<Drawer.Content>
					<ScrollArea h={height + 100} scrollbarSize={2} type="never" bg={"gray.1"}>
						<Flex mih={40} gap="md" justify="flex-end" align="center" direction="row" wrap="wrap">
							<ActionIcon mr={"sm"} radius="xl" color="red.6" size="md" onClick={closeModel}>
								<IconX style={{ width: "100%", height: "100%" }} stroke={1.5} />
							</ActionIcon>
						</Flex>

						<Box ml={2} mr={2} mb={0}>
							<SettingsForm
								setGroupDrawer={setGroupDrawer}
								settingTypeDropdown={settingTypeDropdown}
								saveId={saveId}
							/>
						</Box>
					</ScrollArea>
				</Drawer.Content>
			</Drawer.Root>
		</>
	);
}

export default CustomerGroupDrawer;
