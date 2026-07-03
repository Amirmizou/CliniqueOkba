/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { existsSync } from "node:fs";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);

// En local/CI, Remotion télécharge son propre navigateur normalement.
// Dans les environnements où l'egress est bloqué, on réutilise le Chromium
// pré-installé s'il existe (sinon no-op — comportement Remotion par défaut).
const PREINSTALLED_HEADLESS_SHELL =
  process.env.REMOTION_BROWSER_EXECUTABLE ||
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(PREINSTALLED_HEADLESS_SHELL)) {
  Config.setBrowserExecutable(PREINSTALLED_HEADLESS_SHELL);
}
