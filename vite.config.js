import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@components": "/src/common/components",
			"@hospital-components": "/src/modules/hospital/common",
			"@utils": "/src/common/utils",
			"@assets": "/src/assets",
			"@hooks": "/src/common/hooks",
			"@modules": "/src/modules",
			"@": "/src",

			"@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
		},
	},
});
