import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showEntityData } from "@/app/store/core/crudThunk.js";
import { DOMAIN_DATA_ROUTES } from "@/constants/appRoutes";

const useDomainConfig = (autoFetch = true) => {
	const dispatch = useDispatch();
	const domainConfig = useSelector((state) => state.crud.domain.data);

	const [path, setPath] = useState(DOMAIN_DATA_ROUTES.API_ROUTES.DOMAIN.INDEX);

	const fetchDomainConfig = useCallback(
		(customPath) => {
			const effectivePath = customPath || path;
			if (effectivePath) {
				dispatch(showEntityData({ url: effectivePath, module: "domain" }));
			}
		},
		[dispatch, path]
	);

	useEffect(() => {
		if (autoFetch && path) {
			fetchDomainConfig();
		}
	}, [autoFetch, fetchDomainConfig, path]);

	// Save domainConfig to localStorage whenever it changes
	useEffect(() => {
		if (domainConfig) {
			localStorage.setItem("domain-config-data", JSON.stringify(domainConfig));
		}
	}, [domainConfig]);

	return { domainConfig, fetchDomainConfig, setPath };
};

export default useDomainConfig;
