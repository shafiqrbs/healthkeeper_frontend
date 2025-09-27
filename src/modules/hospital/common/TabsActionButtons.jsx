import { Button, Group } from "@mantine/core";

export default function TabsActionButtons({ handleReset }) {
	return (
		<Group mt="sm" gap="xs" grow>
			<Button radius={0} size="sm" onClick={handleReset} bg="var(--theme-tertiary-color-6)">
				Reset
			</Button>
			<Button type="submit" radius={0} size="sm" bg="var(--theme-tab-save-color)">
				Save
			</Button>
		</Group>
	);
}
