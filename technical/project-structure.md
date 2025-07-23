# Project Structure

This document outlines the directory structure of the `captcha-canvas` project.

- **`/assets`**: Contains static assets, such as sample captcha images.
- **`/docs`**: Holds the auto-generated JSDoc documentation for the project.
- **`/examples`**: Includes example scripts and images demonstrating how to use the library.
- **`/js-script`**: Contains the compiled JavaScript code, suitable for use in Node.js environments.
- **`/ts-script`**: The heart of the project, containing the original TypeScript source code.
  - [`captcha.ts`](../ts-script/captcha.ts:1): The core class for creating and manipulating the captcha canvas.
  - [`CaptchaGenerator.ts`](../ts-script/CaptchaGenerator.ts:1): A higher-level class that simplifies captcha generation.
  - [`constants.ts`](../ts-script/constants.ts:1): Defines default options and types used throughout the library.
  - [`extra.ts`](../ts-script/extra.ts:1): Provides utility functions for quick captcha creation.
  - [`index.ts`](../ts-script/index.ts:1): The main entry point of the library, exporting all public modules.
  - [`util.ts`](../ts-script/util.ts:1): Contains helper functions for generating random values and coordinates.
- **`package.json`**: The standard npm manifest file, defining project metadata, dependencies, and scripts.
- **`README.md`**: The main project README, providing a general overview and installation instructions.
- **`/technical`**: Contains all technical documentation for the project.
