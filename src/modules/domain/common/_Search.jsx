import { useState } from "react";
import { rem, Grid, Tooltip, TextInput, ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconRestore, IconSearch, IconX, IconPdf, IconFileTypeXls } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";

export default function Search({ module }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);

	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const categoryFilterData = useSelector((state) => state.crud.categoryFilterData);
	const userFilterData = useSelector((state) => state.crud.userFilterData);

	const productFilterData = useSelector((state) => state.crud.productFilterData);

	// =============== handle search input change ================
	const handleSearchInputChange = (e) => {
		dispatch(setSearchKeyword(e.currentTarget.value));
		e.target.value !== ""
			? setSearchKeywordTooltip(false)
			: (setSearchKeywordTooltip(true),
			  setTimeout(() => {
					setSearchKeywordTooltip(false);
			  }, 1000));
	};

	// =============== handle clear search keyword ================
	const handleClearSearchKeyword = () => {
		dispatch(setSearchKeyword(""));
	};

	// =============== handle search button click ================
	const handleSearchButtonClick = () => {
		searchKeyword.length > 0
			? setSearchKeywordTooltip(false)
			: (setSearchKeywordTooltip(true),
			  setTimeout(() => {
					setSearchKeywordTooltip(false);
			  }, 1500));
	};

	// =============== handle reset button click ================
	const handleResetButtonClick = () => {
		dispatch(setSearchKeyword(""));
		if (module === "product") {
			// dispatch(
			// 	setProductFilterData({
			// 		...productFilterData,
			// 		name: "",
			// 		alternative_name: "",
			// 		sales_price: "",
			// 		sku: "",
			// 	})
			// );
		} else if (module === "category") {
			// dispatch(
			// 	setCategoryFilterData({
			// 		...categoryFilterData,
			// 		name: "",
			// 		parent_name: "",
			// 	})
			// );
		} else if (module === "user") {
			// dispatch(
			// 	setUserFilterData({
			// 		...userFilterData,
			// 		keyword: "",
			// 	})
			// );
		}
	};

	// =============== handle pdf download click ================
	const handlePdfDownloadClick = () => {
		searchKeyword.length > 0
			? setSearchKeywordTooltip(false)
			: (setSearchKeywordTooltip(true),
			  setTimeout(() => {
					setSearchKeywordTooltip(false);
			  }, 1500));
	};

	// =============== handle excel download click ================
	const handleExcelDownloadClick = () => {
		if (module === "stock") {
			setDownloadStockXls(true);
		}
	};

	useHotkeys(
		[
			[
				"alt+F",
				() => {
					document.getElementById("SearchKeyword").focus();
				},
			],
		],
		[]
	);

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && searchKeyword.length > 0) {
			dispatch(setFetching(true)), setSearchKeywordTooltip(false);
		} else {
			setSearchKeywordTooltip(true);
			setTimeout(() => {
				setSearchKeywordTooltip(false);
			}, 1500);
		}
	};

	return (
		<>
			<Grid justify="space-between" align="stretch" gutter={{ base: 2 }} grow>
				<Grid.Col span="8">
					<Tooltip
						label={t("EnterSearchAnyKeyword")}
						opened={searchKeywordTooltip}
						px={16}
						py={2}
						position="top-end"
						color="var(--theme-primary-color-6)"
						withArrow
						offset={2}
						zIndex={100}
						transitionProps={{ transition: "pop-bottom-left", duration: 1000 }}
					>
						<TextInput
							leftSection={<IconSearch size={16} opacity={0.5} />}
							size="sm"
							placeholder={t("EnterSearchAnyKeyword")}
							onKeyDown={handleKeyDown}
							onChange={handleSearchInputChange}
							value={searchKeyword}
							id={"SearchKeyword"}
							rightSection={
								searchKeyword ? (
									<Tooltip label={t("Close")} withArrow bg={`red.5`}>
										<IconX
											color={`red`}
											size={16}
											opacity={0.5}
											onClick={handleClearSearchKeyword}
										/>
									</Tooltip>
								) : (
									<Tooltip
										label={t("FieldIsRequired")}
										withArrow
										position={"bottom"}
										c={"red"}
										bg={`red.1`}
									>
										<IconInfoCircle size={16} opacity={0.5} />
									</Tooltip>
								)
							}
						/>
					</Tooltip>
				</Grid.Col>
				<Grid.Col span="auto">
					<ActionIcon.Group mt={"1"} justify="center">
						<ActionIcon
							variant="default"
							c={"red.4"}
							size="lg"
							aria-label="Filter"
							onClick={handleSearchButtonClick}
						>
							<Tooltip
								label={t("SearchButton")}
								px={16}
								py={2}
								withArrow
								position={"bottom"}
								c={"red"}
								bg={`red.1`}
								transitionProps={{
									transition: "pop-bottom-left",
									duration: 500,
								}}
							>
								<IconSearch style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>
						<ActionIcon variant="default" c={"gray.6"} size="lg" aria-label="Settings">
							<Tooltip
								label={t("ResetButton")}
								px={16}
								py={2}
								withArrow
								position={"bottom"}
								c={"red"}
								bg={`red.1`}
								transitionProps={{
									transition: "pop-bottom-left",
									duration: 500,
								}}
							>
								<IconRestore style={{ width: rem(18) }} stroke={1.5} onClick={handleResetButtonClick} />
							</Tooltip>
						</ActionIcon>
						<ActionIcon
							variant="default"
							c={"green.8"}
							size="lg"
							aria-label="Filter"
							onClick={handlePdfDownloadClick}
						>
							<Tooltip
								label={t("DownloadPdfFile")}
								px={16}
								py={2}
								withArrow
								position={"bottom"}
								c={"red"}
								bg={`red.1`}
								transitionProps={{
									transition: "pop-bottom-left",
									duration: 500,
								}}
							>
								<IconPdf style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>

						<ActionIcon
							variant="default"
							c={"green.8"}
							size="lg"
							aria-label="Filter"
							onClick={handleExcelDownloadClick}
						>
							<Tooltip
								label={t("DownloadExcelFile")}
								px={16}
								py={2}
								withArrow
								position={"bottom"}
								c={"red"}
								bg={`red.1`}
								transitionProps={{
									transition: "pop-bottom-left",
									duration: 500,
								}}
							>
								<IconFileTypeXls style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>
					</ActionIcon.Group>
				</Grid.Col>
			</Grid>
		</>
	);
}
