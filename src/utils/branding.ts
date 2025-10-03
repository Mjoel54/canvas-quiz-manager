import chalk from "chalk";
import boxen from "boxen";

export const brandHex = "#00FFFF";

export const brandText = chalk.hex(brandHex);

export function boxedHeading(text: string) {
  return boxen(brandText(text), {
    padding: {
      top: 0,
      right: 1,
      bottom: 0,
      left: 1,
    },
    borderStyle: "round",
    borderColor: brandHex,
  });
}
