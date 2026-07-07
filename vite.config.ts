import path from "path";
import checker from "vite-plugin-checker";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// ----------------------------------------------------------------------

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const PORT = Number(process.env.PORT || env.PORT) || 3039;
  const HOST = process.env.HOST || env.HOST || "0.0.0.0";

  return {
    plugins: [
      react(),
      checker({
        typescript: true,
        overlay: {
          position: "tl",
          initialIsOpen: false,
        },
      }),
    ],
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), "node_modules/$1"),
        },
        {
          find: /^src(.+)/,
          replacement: path.join(process.cwd(), "src/$1"),
        },
      ],
    },
    server: { port: PORT, host: HOST, allowedHosts: true },
    optimizeDeps: { force: true },
    preview: {
      port: PORT,
      host: HOST,
      allowedHosts: ["projecteve-web.onrender.com"],
    },
  };
});
