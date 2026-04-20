import { open, showHUD } from "@raycast/api";

export default async function Statement() {
  await open("https://axle-iota.vercel.app/statement");
  await showHUD("Opened axle Hebrew statement generator");
}
