import { start } from "https://deno.land/x/denops_std@v0.3/mod.ts";
import ojichat from "https://cdn.skypack.dev/ojichat.js@0.0.6?dts";
import { parse } from "https://deno.land/std@0.88.0/flags/mod.ts";

function isStringArray(obj: unknown): obj is Array<string> {
  return Array.isArray(obj) && obj.every((value) => typeof value === "string");
}

start(async (vim) => {
  vim.register({
    async run(...args: unknown[]): Promise<void> {
      const yankReg = await vim.v.get("register");

      if (!isStringArray(args)) {
        throw Error();
      }

      const parsedArgs = parse(args, { "--": true });

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
    command! -nargs=* DenopsOjichat echo denops#notify("${vim.name}", "run", [<f-args>])
  `);
});
