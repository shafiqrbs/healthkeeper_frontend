import { Button, Drawer, Flex, Group, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import React from "react";
import { IconArrowLeft, IconDeviceFloppy, IconX } from "@tabler/icons-react";

export default function CompactDrawer({ title, opened, close, save, size, position, keepMounted, bg, children }) {
	const { t } = useTranslation();

	return (
		<Drawer.Root
			opened={opened}
			onClose={close}
			closeOnClickOutside={false}
			position={position}
			keepMounted={keepMounted}
			size={size}
			offset={44}
			radius={4}
		>
			<Drawer.Overlay />
			<Drawer.Content bg={bg} h={300} style={{ alignItems: "center" }}>
				<Drawer.Header className="drawer-sticky-header">
					<Drawer.Title>
						<Flex align="center" gap="xxxs">
							<IconArrowLeft size={16} />
							<Text mt="es" fz="lg" fw={500}>
								{title}
							</Text>
						</Flex>
					</Drawer.Title>
					<Drawer.CloseButton />
				</Drawer.Header>
				<Drawer.Body mt="lg" pb="xs" h={210}>
					<Stack justify="space-between" h="100%">
						{children}
						<Group justify="flex-end" gap="xs">
							<Button
								leftSection={<IconX size={16} />}
								bg="var(--theme-tertiary-color-6)"
								onClick={close}
								size="xs"
							>
								{t("Cancel")}
							</Button>
							<Button
								leftSection={<IconDeviceFloppy size={16} />}
								bg="var(--theme-primary-color-6)"
								onClick={save}
								size="xs"
							>
								{t("Save")}
							</Button>
						</Group>
					</Stack>
				</Drawer.Body>
			</Drawer.Content>
		</Drawer.Root>
	);
}
