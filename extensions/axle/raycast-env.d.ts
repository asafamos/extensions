/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `scan` command */
  export type Scan = ExtensionPreferences & {}
  /** Preferences accessible in the `statement` command */
  export type Statement = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `scan` command */
  export type Scan = {
  /** https://example.com */
  "url": string
}
  /** Arguments passed to the `statement` command */
  export type Statement = {}
}

