import React, { useState } from "react";
import { rem, Tooltip, TextInput, ActionIcon, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconFilter,
	IconInfoCircle,
	IconRestore,
	IconSearch,
	IconX,
	IconPdf,
	IconFileTypeXls,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import FilterModel from "./FilterModel.jsx";
import { setFilterData, setGlobalFetching, setSearchKeyword } from "@/app/store/core/crudSlice.js";
import useDebounce from "@hooks/useDebounce.js";

function KeywordSearch({ module }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
	const [filterModel, setFilterModel] = useState(false);
	const [inputValue, setInputValue] = useState("");

	const debouncedSetSearchKeyword = useDebounce((value) => {
		dispatch(setSearchKeyword(value));
	}, 250);

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
		if (event.key === "Enter" && inputValue.length > 0) {
			dispatch(setGlobalFetching(true)), setSearchKeywordTooltip(false);
		} else {
			setSearchKeywordTooltip(true),
				setTimeout(() => {
					setSearchKeywordTooltip(false);
				}, 1500);
		}
	};

	const resetFilters = () => {
		setInputValue("");
		dispatch(setSearchKeyword(""));
		dispatch(setGlobalFetching(true));

		const moduleConfig = {
			vendor: { name: "", mobile: "", company_name: "" },
			user: { name: "", mobile: "", email: "" },
			customer: { name: "", mobile: "" },
			warehouse: { name: "", email: "", location: "", mobile: "" },
			fileUpload: { file_type: "", original_name: "", created: "" },
			category: { name: "" },
			categoryGroup: { name: "" },
			purchase: { vendor_id: "", start_date: "", end_date: "", searchKeyword: "" },
			product: { name: "" },
			requisition: { vendor_id: "", start_date: "", end_date: "", searchKeyword: "" },
			batch: { name: "" },
			settings: { name: "", code: "", description: "" },
			recipeItems: { name: "" },
		};

		dispatch(
			setFilterData({
				module,
				data: moduleConfig[module],
			})
		);
	};

	const handleOnChange = (event) => {
		const { value } = event.currentTarget;

		setInputValue(value);
		debouncedSetSearchKeyword(value);

		if (value) {
			setSearchKeywordTooltip(false);
		} else {
			setSearchKeywordTooltip(true);
			setTimeout(() => setSearchKeywordTooltip(false), 1000);
		}
	};

	const handleSearchClick = () => {
		if (inputValue.length > 0) {
			dispatch(setGlobalFetching(true));
			setSearchKeywordTooltip(false);
		} else {
			setSearchKeywordTooltip(true);
			setTimeout(() => {
				setSearchKeywordTooltip(false);
			}, 1500);
		}
	};

	const handlePDFDownload = () => {
		if (inputValue.length > 0) {
			dispatch(setGlobalFetching(true));
			setSearchKeywordTooltip(false);
		} else {
			setSearchKeywordTooltip(true);
			setTimeout(() => setSearchKeywordTooltip(false), 1500);
		}
	};

	const handleExcelDownload = () => {
		if (module === "stock") {
			setDownloadStockXls(true);
		}
	};

	return (
		<>
			<Flex justify="space-between" gap={2} w="100%">
				<Tooltip
					label={t("EnterSearchAnyKeyword")}
					opened={searchKeywordTooltip}
					px={16}
					py={2}
					position="top-end"
					color="var(--theme-error-color)"
					withArrow
					offset={2}
					zIndex={100}
					transitionProps={{ transition: "pop-bottom-left", duration: 1000 }}
				>
					<TextInput
						styles={{ root: { width: "100%" } }}
						leftSection={<IconSearch size={16} opacity={0.5} />}
						size="sm"
						placeholder={t("EnterSearchAnyKeyword")}
						onKeyDown={handleKeyDown}
						onChange={handleOnChange}
						value={inputValue}
						id={"SearchKeyword"}
						rightSection={
							inputValue ? (
								<Tooltip label={t("Close")} withArrow bg="var(--theme-error-color)">
									<IconX
										color="var(--theme-error-color)"
										size={16}
										opacity={0.5}
										onClick={() => {
											setInputValue("");
											dispatch(setSearchKeyword(""));
										}}
									/>
								</Tooltip>
							) : (
								<Tooltip
									label={t("FieldIsRequired")}
									withArrow
									position={"bottom"}
									c="var(--theme-error-color)"
									bg="var(--theme-error-color-hover)"
								>
									<IconInfoCircle size={16} opacity={0.5} />
								</Tooltip>
							)
						}
					/>
				</Tooltip>
				<ActionIcon.Group mt={"1"} justify="center">
					<ActionIcon
						variant="default"
						c="var(--theme-error-color)"
						size="lg"
						aria-label="Filter"
						onClick={handleSearchClick}
					>
						<Tooltip
							label={t("SearchButton")}
							px={16}
							py={2}
							withArrow
							position={"bottom"}
							c="var(--theme-error-color)"
							bg="var(--theme-error-color-hover)"
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<IconSearch style={{ width: rem(18) }} stroke={1.5} />
						</Tooltip>
					</ActionIcon>
					{module !== "category" &&
						module !== "category-group" &&
						module !== "particular" && (
							<ActionIcon
								variant="default"
								size="lg"
								c="var(--theme-tooltip-color)"
								aria-label="Settings"
								onClick={() => setFilterModel(true)}
							>
								<Tooltip
									label={t("FilterButton")}
									px={16}
									py={2}
									withArrow
									position={"bottom"}
									c="var(--theme-error-color)"
									bg="var(--theme-error-color-hover)"
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									<IconFilter style={{ width: rem(18) }} stroke={1.0} />
								</Tooltip>
							</ActionIcon>
						)}
					<ActionIcon
						variant="default"
						c="var(--theme-tooltip-color)"
						size="lg"
						aria-label="Reset"
					>
						<Tooltip
							label={t("ResetButton")}
							px={16}
							py={2}
							withArrow
							position="bottom"
							c="var(--theme-error-color)"
							bg="var(--theme-error-color-hover)"
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<IconRestore
								style={{ width: rem(18) }}
								stroke={1.5}
								onClick={resetFilters}
							/>
						</Tooltip>
					</ActionIcon>
					<ActionIcon
						variant="default"
						c="var(--theme-success-color)"
						size="lg"
						aria-label="Filter"
						onClick={handlePDFDownload}
					>
						<Tooltip
							label={t("DownloadPdfFile")}
							px={16}
							py={2}
							withArrow
							position="bottom"
							c="var(--theme-error-color)"
							bg="var(--theme-error-color-hover)"
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<IconPdf style={{ width: rem(18) }} stroke={1.5} />
						</Tooltip>
					</ActionIcon>
					<ActionIcon
						variant="default"
						c="var(--theme-success-color)"
						size="lg"
						aria-label="Filter"
						onClick={handleExcelDownload}
					>
						<Tooltip
							label={t("DownloadExcelFile")}
							px={16}
							py={2}
							withArrow
							position="bottom"
							c="var(--theme-error-color)"
							bg="var(--theme-error-color-hover)"
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<IconFileTypeXls style={{ width: rem(18) }} stroke={1.5} />
						</Tooltip>
					</ActionIcon>
				</ActionIcon.Group>
			</Flex>

			{filterModel && (
				<FilterModel
					filterModel={filterModel}
					setFilterModel={setFilterModel}
					module={module}
				/>
			)}
		</>
	);
}

export default KeywordSearch;
