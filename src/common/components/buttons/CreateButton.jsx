import { Button, Flex, Text, Tooltip } from "@mantine/core";
import { IconChevronsRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import React from "react";
import { useOs } from "@mantine/hooks";

export default function CreateButton({ handleModal, text }) {
	const { t } = useTranslation();
	const os = useOs();

	return (
		<Tooltip
			multiline
			w={220}
			withArrow
			transitionProps={{ duration: 200 }}
			label={`Press ${
				os === "macos" ? "ctrl+n" : "alt+n"
			} to quickly open the form. You can also click this button to open it.`}
		>
			<Button
				size="sm"
				className="btnPrimaryBg"
				type="submit"
				id="EntityFormSubmit"
				rightSection={<IconChevronsRight size={16} />}
				onClick={handleModal}
				miw={160}
			>
				<Flex direction={`column`} gap={0}>
					<Text fz={14} fw={400}>
						{t(text)}
					</Text>
					<Flex direction={`column`} align={"center"} fz={"12"} c={"white"}>
						{os === "macos" ? "ctrl+n" : "alt+n"}
					</Flex>
				</Flex>
			</Button>
		</Tooltip>
	);
}
