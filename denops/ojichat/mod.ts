import { main } from "./vendor/https/deno.land/x/denops_std/mod.ts";
import ojichat from "https://cdn.skypack.dev/ojichat.js@0.0.6?dts";
import { parse } from "./vendor/https/deno.land/std/flags/mod.ts";

main(async ({ vim }) => {
  vim.register({
    async run(args: unknown): Promise<void> {
      const yankReg = await vim.v.get("register");

      const parsedArgs = parse(args as string[], { "--": true });

      const target: string = parsedArgs._.join(" ");
      const emoji: number = parsedArgs.e ?? parsedArgs.emoji;
      const yank: boolean = parsedArgs.yank;

      const message = new ojichat.Generator(target, emoji).getMessage();

      await vim.cmd(
        `echomsg printf('%s', message)`,
        {
          message,
        },
      );
      if (yank) {
        await vim.call("setreg", yankReg, message);
      }
    },
  });
  await vim.execute(`
    command! -nargs=* DenopsOjichat call denops#notify("${vim.name}", "run", [[<f-args>]])
  `);
});
