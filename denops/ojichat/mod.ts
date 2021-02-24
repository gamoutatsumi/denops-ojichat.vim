import { start } from "https://deno.land/x/denops_std@v0.3/mod.ts";
import ojichat from "https://cdn.skypack.dev/ojichat.js@latest?dts";

start(async (vim) => {
  vim.register({
    async run(app: unknown, name: unknown): Promise<void>{
      if (typeof app !== "string") {
        throw new Error(`'app' in 'say()' of ${vim.name} must be a string`);
      }

      const message = new ojichat.Generator(name).getMessage();

      console.log("message", message);

      await vim.cmd(
        `echomsg printf('%s', message)`,
        {
          message,
        },
      );
    },
  });
  await vim.execute(`
    command! -nargs=? DenopsOjichat echo denops#notify("${vim.name}", "run", ["denops", <f-args>])
  `);
  console.log("denops-ojichat.vim (std) has loaded");
});
