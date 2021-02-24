import { start } from "https://deno.land/x/denops_std@v0.3/mod.ts";
import ojichat from "https://cdn.skypack.dev/ojichat.js@0.0.6?dts";

start(async (vim) => {
  vim.register({
    async run(app: unknown, targetName: unknown): Promise<void>{
      if (typeof app !== "string") {
        throw new Error(`'app' in 'say()' of ${vim.name} must be a string`);
      }

      if (typeof targetName === "string" || targetName === undefined) {
        const message = new ojichat.Generator(targetName).getMessage();

        await vim.cmd(
          `echomsg printf('%s', message)`,
          {
            message,
          },
        );
      }
    },
  });
  await vim.execute(`
    command! -nargs=? DenopsOjichat echo denops#notify("${vim.name}", "run", ["denops", <f-args>])
  `);
});
