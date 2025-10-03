import chalk from "chalk";
import boxen from "boxen";

export const brandHex = "#00FFFF";

export const brandText = chalk.hex(brandHex);

export function brandBoxen(text: string) {
  return boxen(text, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: brandHex,
  });
}
