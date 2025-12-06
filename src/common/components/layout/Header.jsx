import {
	ActionIcon,
	Anchor,
	Box,
	Button,
	CloseButton,
	Divider,
	Flex,
	Grid,
	Group,
	Image,
	Kbd,
	Menu,
	Modal,
	ScrollArea,
	Stack,
	Text,
	TextInput,
	NavLink,
	ThemeIcon,
	Tooltip,
	UnstyledButton,
	rem,
	useMantineColorScheme,
} from "@mantine/core";

import SpotLightSearchModal from "@modules/modals/SpotLightSearchModal";
import LanguagePickerStyle from "@assets/css/LanguagePicker.module.css";
import flagBD from "@assets/images/flags/bd.svg";
import flagGB from "@assets/images/flags/gb.svg";
import logo_default from "@assets/images/tb_logo.png";
import shortcutDropdownData from "@hooks/shortcut-dropdown/useShortcutDropdownData";
import { useDisclosure, useFullscreen, useHotkeys, useMediaQuery } from "@mantine/hooks";
import "@mantine/spotlight/styles.css";
import {
	IconArrowRight,
	IconBackspace,
	IconChevronDown,
	IconDeviceDesktop,
	IconLogout,
	IconMoon,
	IconSearch,
	IconSun,
	IconWifi,
	IconWifiOff,
	IconWindowMaximize,
	IconWindowMinimize,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { useAuthStore } from "@/store/useAuthStore.js";

const languages = [
	{ label: "EN", value: "en", flag: flagGB },
	{ label: "BN", value: "bn", flag: flagBD },
];

const getActionPath = (action) => {
	if (
		(action.group === "Domain" && action.id === "dashboard") ||
		(action.group === "ডোমেইন" && action.id === "dashboard")
	) {
		return `b2b/${action.id}`;
	}
	if (action.group === "Production" || action.group === "প্রোডাকশন") {
		return `production/${action.id}`;
	}
	if (action.group === "Core" || action.group === "কেন্দ্র") {
		return `core/${action.id}`;
	}
	if (action.group === "Inventory" || action.group === "ইনভেন্টরি") {
		return `inventory/${action.id}`;
	}
	if (action.group === "Domain" || action.group === "ডোমেইন") {
		return `domain/${action.id}`;
	}
	if (action.group === "Accounting" || action.group === "একাউন্টিং") {
		return `accounting/${action.id}`;
	}
	if (action.group === "Procurement") {
		return `procurement/${action.id}`;
	}
	if (action.group === "Sales & Purchase") {
		return `inventory/${action.id}`;
	}
	return `/sitemap`;
};

// Logo Component
const Logo = ({ configData, navigate }) => {
	if (!configData?.path) {
		return (
			<NavLink
				component="button"
				bg="transparent"
				style={{
					color: "white",
					fontWeight: 800,
					whiteSpace: "nowrap",
				}}
				styles={{
					body: {
						overflow: "unset",
					},
				}}
				unselectable="on"
				label={configData?.domain?.company_name || configData?.domain?.name || ""}
				onClick={() => navigate("/")}
				leftSection={<Image src={logo_default} width={26} height={26} />}
			/>
		);
	}

	return (
		<Flex pl={16} align="center" h="100%">
			<Tooltip label={configData?.domain?.company_name || ""} position="right" withArrow>
				<Anchor
					target="_blank"
					underline="never"
					onClick={() => navigate("/")}
					style={{
						backgroundColor: "#C6AF9D",
						color: "white",
						fontWeight: 800,
						transition: "background 1s",
					}}
				>
					<Image mah={40} radius="md" src={logo_default} />
				</Anchor>
			</Tooltip>
		</Flex>
	);
};

// Search Button Component
const SearchButton = ({ t, onClick, matches2 }) => (
	<Button
		ml="auto"
		leftSection={
			<>
				<IconSearch size={16} c={"white"} />
				{!matches2 && (
					<Text fz={`xs`} pl={"xs"} c={"gray.8"}>
						{t("SearchMenu")}
					</Text>
				)}
			</>
		}
		fullWidth={!matches2}
		maw={matches2 ? 40 : "100%"}
		variant="transparent"
		rightSection={
			<>
				{!matches2 && (
					<>
						<Kbd h={"24"} c={"gray.8"} fz={"12"}>
							Alt{" "}
						</Kbd>{" "}
						+{" "}
						<Kbd c={"gray.8"} h={"24"} fz={"12"}>
							{" "}
							K
						</Kbd>
					</>
				)}
			</>
		}
		justify="space-between"
		style={{ border: "1px solid #49362366" }}
		color={"black"}
		bg="var(--mantine-color-white)"
		onClick={onClick}
		className="no-focus-outline"
	/>
);

// Search Input Component
const SearchInput = ({ value, onChange, onKeyDown, onClear }) => {
	const { t } = useTranslation();
	return (
		<TextInput
			w={"100%"}
			align={"center"}
			pr={"lg"}
			justify="space-between"
			data-autofocus
			leftSection={<IconSearch size={16} c={"red"} />}
			placeholder={t("SearchMenu")}
			value={value}
			rightSectionPointerEvents="all"
			rightSection={
				<div style={{ display: "flex", alignItems: "center" }}>
					{value ? (
						<>
							<CloseButton
								ml={"-50"}
								mr={"xl"}
								icon={<IconBackspace style={{ width: rem(24) }} stroke={1.5} />}
								aria-label="Clear input"
								onClick={onClear}
							/>
							<Kbd ml={"-xl"} h={"24"} c={"gray.8"} fz={"12"}>
								Alt
							</Kbd>{" "}
							+{" "}
							<Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"lg"}>
								C
							</Kbd>
						</>
					) : (
						<>
							<Kbd ml={"-lg"} h={"24"} c={"gray.8"} fz={"12"}>
								Alt{" "}
							</Kbd>{" "}
							+{" "}
							<Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"lg"}>
								X
							</Kbd>
						</>
					)}
				</div>
			}
			onChange={onChange}
			onKeyDown={onKeyDown}
			className="no-focus-outline"
		/>
	);
};

// Action Item Component
const ActionItem = ({ action, isSelected, onClick }) => (
	<Link
		id={`item-${action.index}`}
		className={"link"}
		to={getActionPath(action)}
		onClick={onClick}
	>
		<Group
			wrap="nowrap"
			align="center"
			justify="left"
			pt={"4"}
			pb={"4"}
			className={isSelected ? "highlightedItem" : ""}
		>
			<ThemeIcon size={18} color={"#242424"} variant="transparent">
				<IconArrowRight />
			</ThemeIcon>
			<Text size="sm" className={`${isSelected ? "highlightedItem" : ""} ${"link"}`}>
				{action.label}
			</Text>
		</Group>
	</Link>
);

// Language Picker Component
const LanguagePicker = ({ languageSelected, onLanguageChange }) => {
	return (
		<Menu radius="md" width="target" withinPortal withArrow arrowPosition="center">
			<Menu.Target>
				<UnstyledButton p={2} bg={"red"} className={LanguagePickerStyle.control}>
					<Group gap="xs">
						<Image src={languageSelected?.flag} width={18} height={18} />
						<span className={LanguagePickerStyle.label}>{languageSelected?.label}</span>
					</Group>
					<IconChevronDown size="1rem" className={LanguagePickerStyle.icon} stroke={1} />
				</UnstyledButton>
			</Menu.Target>
			<Menu.Dropdown p={4} className={LanguagePickerStyle.dropdown}>
				{languages.map((item) => (
					<Menu.Item
						p={4}
						leftSection={<Image src={item.flag} width={18} height={18} />}
						onClick={() => onLanguageChange(item)}
						key={item.label}
					>
						{item.label}
					</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
};

// Header Actions Component
const HeaderActions = ({
	isOnline,
	fullscreen,
	toggle,
	loginUser,
	onLogout,
	languageSelected,
	handleLanguageChange,
}) => {
	const { t } = useTranslation();
	const { colorScheme, setColorScheme } = useMantineColorScheme({ keepTransitions: true });
	const storageKey = "mantine-color-scheme";

	function getNextScheme(currentScheme) {
		if (currentScheme === "auto") return "light";
		if (currentScheme === "light") return "dark";
		return "auto";
	}

	function getSchemeIcon(currentScheme) {
		if (currentScheme === "auto") return <IconDeviceDesktop size={18} />;
		if (currentScheme === "light") return <IconSun size={18} />;
		return <IconMoon size={18} />;
	}

	function getSchemeLabel(currentScheme) {
		if (currentScheme === "auto") return "System";
		if (currentScheme === "light") return "Light";
		return "Dark";
	}

	function handleToggleColorScheme() {
		const nextScheme = getNextScheme(colorScheme);
		setColorScheme(nextScheme);
		try {
			localStorage.setItem(storageKey, nextScheme);
		} catch (error) {
			// =============== ignoring localStorage access error, safe to skip ===============
		}
	}

	useEffect(() => {
		try {
			const savedScheme = localStorage.getItem(storageKey);
			if (savedScheme === "auto" || savedScheme === "light" || savedScheme === "dark") {
				setColorScheme(savedScheme);
			}
		} catch (error) {
			// =============== ignoring localStorage access error, safe to skip ===============
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Flex
			gap="sm"
			justify="flex-end"
			direction="row"
			wrap="wrap"
			mih={42}
			align={"right"}
			px={"xs"}
			pr={"24"}
		>
			<LanguagePicker
				languageSelected={languageSelected}
				onLanguageChange={handleLanguageChange}
			/>
			<Tooltip label={`Theme: ${getSchemeLabel(colorScheme)}`} bg={"#635031"} withArrow>
				<ActionIcon
					className="mt-6 header-action-icon"
					onClick={handleToggleColorScheme}
					variant="subtle"
				>
					{getSchemeIcon(colorScheme)}
				</ActionIcon>
			</Tooltip>
			<Tooltip
				label={fullscreen ? t("NormalScreen") : t("Fullscreen")}
				bg={"#635031"}
				withArrow
			>
				<ActionIcon className="mt-6 header-action-icon" onClick={toggle} variant="subtle">
					{fullscreen ? (
						<IconWindowMinimize size={18} />
					) : (
						<IconWindowMaximize size={18} />
					)}
				</ActionIcon>
			</Tooltip>
			<Tooltip
				label={
					<>
						<Stack spacing={0} gap={0}>
							<Text align="center">
								{loginUser?.name} ( {loginUser?.username} )
							</Text>
							<Text align="center">{t("LogoutAltL")}</Text>
						</Stack>
					</>
				}
				bg={"#635031"}
				withArrow
				position={"left"}
				multiline
			>
				<ActionIcon onClick={onLogout} variant="subtle" className="mt-6 header-action-icon">
					<IconLogout size={18} />
				</ActionIcon>
			</Tooltip>
			<Tooltip
				label={isOnline ? t("Online") : t("Offline")}
				bg={isOnline ? "green.5" : "red.5"}
				withArrow
			>
				<ActionIcon className="mt-6 header-action-icon" variant="filled" radius="xl">
					{isOnline ? <IconWifi size={20} /> : <IconWifiOff size={20} />}
				</ActionIcon>
			</Tooltip>
		</Flex>
	);
};

export default function Header({ isOnline, configData, mainAreaHeight }) {
	const { user, userRoles } = useAppLocalStore();
	const [opened, { close }] = useDisclosure(false);
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const height = mainAreaHeight - 140;
	const { toggle, fullscreen } = useFullscreen();
	const [languageSelected, setLanguageSelected] = useState(
		languages.find((item) => item.value === i18n.language)
	);
	const [shortcutModalOpen, setShortcutModalOpen] = useState(false);
	const [value, setValue] = useState("");
	const [filteredItems, setFilteredItems] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const matches = useMediaQuery("(max-width: 1070px)");
	const matches2 = useMediaQuery("(max-width: 768px)");

	useHotkeys(
		[
			["alt+k", () => setShortcutModalOpen(true)],
			["alt+x", () => setShortcutModalOpen(false)],
			["alt+l", handleLogout],
			["alt+c", clearSearch],
		],
		[]
	);

	useEffect(() => {
		if (selectedIndex >= 0 && filteredItems.length > 0) {
			const selectedElement = document.getElementById(
				`item-${filteredItems[selectedIndex].index}`
			);
			if (selectedElement) {
				selectedElement.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
				});
			}
		}
	}, [selectedIndex, filteredItems]);

	useEffect(() => {
		const allActions = getActions().reduce((acc, group) => [...acc, ...group.actions], []);
		setFilteredItems(allActions);
	}, [shortcutModalOpen === true]);

	function getActions() {
		const actions = shortcutDropdownData(t, configData);
		let index = 0;
		return actions.map((group) => ({
			...group,
			actions: group.actions.map((action) => ({
				...action,
				index: index++,
				group: group.group,
			})),
		}));
	}

	function hasAccessToGroup(group) {
		if (userRoles.includes("role_domain")) return true;

		switch (group) {
			case "Production":
			case "প্রোডাকশন":
				return userRoles.includes("role_production");
			case "Core":
			case "কেন্দ্র":
				return userRoles.includes("role_core");
			case "Inventory":
			case "ইনভেন্টরি":
				return userRoles.includes("role_inventory");
			case "Domain":
			case "ডোমেইন":
				return userRoles.includes("role_domain");
			case "Accounting":
			case "একাউন্টিং":
				return userRoles.includes("role_accounting");
			case "Procurement":
				return userRoles.includes("role_procurement");
			case "Sales & Purchase":
				return userRoles.includes("role_sales_purchase");
			default:
				return false;
		}
	}

	function filterList(searchValue) {
		const updatedList = getActions().reduce((acc, group) => {
			if (hasAccessToGroup(group.group)) {
				const filteredActions = group.actions.filter((action) =>
					action.label.toLowerCase().includes(searchValue.toLowerCase())
				);
				return [...acc, ...filteredActions];
			}
			return acc;
		}, []);

		setFilteredItems(updatedList);
		setSelectedIndex(-1);
	}

	function clearSearch() {
		setValue("");
		const allActions = getActions().reduce((acc, group) => [...acc, ...group.actions], []);
		setFilteredItems(allActions);
		setSelectedIndex(0);
	}

	function handleKeyDown(event) {
		if (filteredItems.length === 0) return;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setSelectedIndex((prevIndex) =>
				prevIndex <= 0 ? filteredItems.length - 1 : prevIndex - 1
			);
		} else if (event.key === "Enter" && selectedIndex >= 0) {
			handleActionSelect(filteredItems[selectedIndex]);
		}
	}

	function handleActionSelect(selectedAction) {
		if (selectedAction) {
			const path = getActionPath(selectedAction);
			navigate(path);
			setValue("");
			setShortcutModalOpen(false);
		}
	}

	function handleSearchChange(event) {
		setValue(event.target.value);
		filterList(event.target.value);
	}

	function handleLanguageChange(item) {
		setLanguageSelected(item);
		i18n.changeLanguage(item.value);
	}

	const clearUser = useAuthStore((state) => state.clearUser);
	function handleLogout() {
		clearUser();
		localStorage.clear();
		navigate("/login");
	}

	return (
		<>
			<Modal.Root opened={opened} onClose={close} size="64%">
				<Modal.Overlay />
				<Modal.Content p={"xs"}>
					<Modal.Header ml={"xs"}>
						<Modal.Title>
							{configData?.domain?.company_name || configData?.domain?.name || ""}
						</Modal.Title>
						<Modal.CloseButton />
					</Modal.Header>
					<Modal.Body>
						<SpotLightSearchModal onClose={close} configData={configData} />
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
			<Box bg="var(--theme-primary-color-6)" pos="relative">
				<Grid columns={24} align="center" gutter={{ base: 2 }}>
					<Grid.Col span={6}>
						<Logo configData={configData} navigate={navigate} />
					</Grid.Col>
					<Grid.Col span={matches2 ? 6 : matches ? 10 : 12}>
						<Group align="center" gap={"md"} wrap="nowrap" mih={42}>
							<Text c={'white'}>২৫০ শয্যা বিশিষ্ট টিবি হাসপাতাল</Text>
						</Group>
					</Grid.Col>
					<Grid.Col span={matches2 ? 12 : matches ? 8 : 6}>
						<HeaderActions
							isOnline={isOnline}
							fullscreen={fullscreen}
							toggle={toggle}
							loginUser={user}
							onLogout={handleLogout}
							languageSelected={languageSelected}
							handleLanguageChange={handleLanguageChange}
						/>
					</Grid.Col>
				</Grid>
			</Box>
			{/* ============ option modal ============ */}
			<Modal
				opened={shortcutModalOpen}
				onClose={() => setShortcutModalOpen(false)}
				centered
				size="450"
				padding="md"
				radius="md"
				styles={{
					title: {
						width: "100%",
						margin: 0,
						padding: 0,
					},
				}}
				overlayProps={{
					backgroundOpacity: 0.7,
					blur: 3,
				}}
				title={
					<Box>
						<SearchInput
							value={value}
							onChange={handleSearchChange}
							onKeyDown={handleKeyDown}
							onClear={clearSearch}
						/>
					</Box>
				}
				transitionProps={{ transition: "fade", duration: 200 }}
			>
				<Divider my="sm" mt={0} />
				<ScrollArea type={"never"} scrollbars="y" h={height}>
					{filteredItems.length > 0 ? (
						<Stack spacing="xs">
							{filteredItems
								.reduce((groups, item) => {
									const existingGroup = groups.find(
										(g) => g.group === item.group
									);
									if (existingGroup) {
										existingGroup.items.push(item);
									} else {
										groups.push({
											group: item.group,
											items: [item],
										});
									}
									return groups;
								}, [])
								.map((groupData, groupIndex) => (
									<Box key={groupIndex}>
										<Text size="sm" fw="bold" c="#828282" pb={"xs"}>
											{groupData.group}
										</Text>
										<Stack
											bg="var(--mantine-color-body)"
											justify="flex-start"
											align="stretch"
											gap="2"
										>
											{groupData.items.map((action, itemIndex) => (
												<ActionItem
													key={itemIndex}
													action={action}
													isSelected={
														filteredItems.indexOf(action) ===
														selectedIndex
													}
													onClick={() => {
														setShortcutModalOpen(false);
														setValue("");
														navigate(getActionPath(action));
													}}
												/>
											))}
										</Stack>
									</Box>
								))}
						</Stack>
					) : (
						<Text align="center" mt="md" c="dimmed">
							{t("NoResultsFound")}
						</Text>
					)}
				</ScrollArea>
				<div className={"titleBackground"}>
					<Group justify="space-between" mt={"xs"}>
						<div>
							<Text fw={500} fz="sm">
								{t("Sitemap")}
							</Text>
							<Text size="xs" c="dimmed">
								{t("SitemapDetails")}
							</Text>
						</div>
						<Button className={"btnPrimaryBg"} size="xs" onClick={() => navigate("/")}>
							{t("Sitemap")}
						</Button>
					</Group>
				</div>
			</Modal>
		</>
	);
}
