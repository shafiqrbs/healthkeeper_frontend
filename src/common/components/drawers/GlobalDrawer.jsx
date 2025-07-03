import { Box, Button, Drawer, Flex, Text } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";
import { useTranslation } from "react-i18next";

export default function GlobalDrawer({ opened, close, title, children }) {
	const { t } = useTranslation();

	return (
		<Drawer.Root opened={opened} onClose={close} position="right" closeOnClickOutside={false}>
			<Drawer.Overlay />
			<Drawer.Content>
				<Drawer.Header
					styles={{
						header: {
							borderBottom: `1px solid var(--theme-drawer-border-color)`,
							marginBottom: "10px",
						},
					}}
				>
					<Drawer.Title>
						<Flex align="center" gap={4}>
							<IconArrowLeft size={16} />{" "}
							<Text mt={2} fz={16} fw={500}>
								{title}
							</Text>
						</Flex>
					</Drawer.Title>
					<Drawer.CloseButton />
				</Drawer.Header>
				<Drawer.Body>{children}</Drawer.Body>
				<Box
					style={{
						borderTop: "1px solid var(--theme-drawer-border-color)",
						width: "100%",
					}}
				>
					<Box pos="absolute" right={16} bottom={16}>
						<Button
							size="xs"
							className="btnPrimaryBg"
							type="submit"
							id="EntityFormSubmit"
							leftSection={<IconDeviceFloppy size={16} />}
							miw={100}
						>
							<Text fz={14} fw={400}>
								{t("Save")}
							</Text>
						</Button>
					</Box>
				</Box>
			</Drawer.Content>
		</Drawer.Root>
	);
}
