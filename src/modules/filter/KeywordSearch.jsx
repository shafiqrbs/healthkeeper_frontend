import React, { useState } from "react";
import { rem, Grid, Tooltip, TextInput, ActionIcon } from "@mantine/core";
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
import { useDispatch, useSelector } from "react-redux";
import FilterModel from "./FilterModel.jsx";
import { setFilterData, setGlobalFetching, setSearchKeyword } from "@/app/store/core/crudSlice.js";

function KeywordSearch({ module }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
	const [filterModel, setFilterModel] = useState(false);

	const searchKeyword = useSelector((state) => state.crud.searchKeyword);

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
			dispatch(setGlobalFetching(true)), setSearchKeywordTooltip(false);
		} else {
			setSearchKeywordTooltip(true),
				setTimeout(() => {
					setSearchKeywordTooltip(false);
				}, 1500);
		}
	};

	const resetFilters = () => {
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

		dispatch(setSearchKeyword(value));

		if (value) {
			setSearchKeywordTooltip(false);
		} else {
			setSearchKeywordTooltip(true);
			setTimeout(() => setSearchKeywordTooltip(false), 1000);
		}
	};

	const handleSearchClick = () => {
		if (searchKeyword.length > 0) {
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
		if (searchKeyword.length > 0) {
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
			<Grid justify="space-between" align="stretch" gutter={{ base: 2 }} grow>
				<Grid.Col span="8">
					<Tooltip
						label={t("EnterSearchAnyKeyword")}
						opened={searchKeywordTooltip}
						px={16}
						py={2}
						position="top-end"
						color="red"
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
							onChange={handleOnChange}
							value={searchKeyword}
							id={"SearchKeyword"}
							rightSection={
								searchKeyword ? (
									<Tooltip label={t("Close")} withArrow bg={`red.5`}>
										<IconX
											color={`red`}
											size={16}
											opacity={0.5}
											onClick={() => dispatch(setSearchKeyword(""))}
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
							onClick={handleSearchClick}
						>
							<Tooltip
								label={t("SearchButton")}
								px={16}
								py={2}
								withArrow
								position={"bottom"}
								c={"red"}
								bg={`red.1`}
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
									c={"gray.6"}
									aria-label="Settings"
									onClick={() => setFilterModel(true)}
								>
									<Tooltip
										label={t("FilterButton")}
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
										<IconFilter style={{ width: rem(18) }} stroke={1.0} />
									</Tooltip>
								</ActionIcon>
							)}
						<ActionIcon variant="default" c={"gray.6"} size="lg" aria-label="Reset">
							<Tooltip
								label={t("ResetButton")}
								px={16}
								py={2}
								withArrow
								position={"bottom"}
								c={"red"}
								bg={`red.1`}
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
							c={"green.8"}
							size="lg"
							aria-label="Filter"
							onClick={handlePDFDownload}
						>
							<Tooltip
								label={t("DownloadPdfFile")}
								px={16}
								py={2}
								withArrow
								position={"bottom"}
								c={"red"}
								bg={`red.1`}
								transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
							>
								<IconPdf style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>
						<ActionIcon
							variant="default"
							c={"green.8"}
							size="lg"
							aria-label="Filter"
							onClick={handleExcelDownload}
						>
							<Tooltip
								label={t("DownloadExcelFile")}
								px={16}
								py={2}
								withArrow
								position={"bottom"}
								c={"red"}
								bg={`red.1`}
								transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
							>
								<IconFileTypeXls style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>
					</ActionIcon.Group>
				</Grid.Col>
			</Grid>

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
