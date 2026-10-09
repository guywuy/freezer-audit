import { execFileSync } from "node:child_process";

import { defineConfig } from "cypress";

// Runs a cypress/support script with tsx in a child process and returns its stdout.
// Uses `node` from PATH rather than process.execPath: Cypress may run this config
// under a different Node (e.g. the GitHub Actions runner's) than the project's.
const runScript = (script: string, ...args: string[]) =>
  execFileSync(
    "node",
    ["--import", "tsx", `./cypress/support/${script}`, ...args],
    { encoding: "utf8" },
  );

export default defineConfig({
  e2e: {
    setupNodeEvents: (on, config) => {
      const isDev = config.watchForFileChanges;
      const port = process.env.PORT ?? (isDev ? "3000" : "8811");
      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
        screenshotOnRunFailure: !process.env.CI,
      };

      // To use this:
      // cy.task('log', whateverYouWantInTheTerminal)
      on("task", {
        log: (message) => {
          console.log(message);

          return null;
        },
        createUser: (username: string) => runScript("create-user.ts", username),
        deleteUser: (username: string) => {
          runScript("delete-user.ts", username);

          return null;
        },
      });

      return { ...config, ...configOverrides };
    },
  },
});
