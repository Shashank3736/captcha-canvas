---
title: Project Structure
group: Documents
category: Guides
---

# Project Structure

This document outlines the directory and file structure of the `captcha-canvas` project. Understanding the layout of the project is essential for effective development and contribution.

## Root Directory

The root directory contains configuration files, documentation, and core project folders.

-   **`/assets`**: Contains static assets, such as images and fonts, used within the project.
-   **`/docs`**: Holds the auto-generated documentation from TypeDoc.
-   **`/examples`**: Includes example scripts and output images demonstrating the usage of `captcha-canvas`.
-   **`/node_modules`**: Stores all the npm dependencies for the project. (Note: This directory is included in `.gitignore` and is not version-controlled).
-   **`/scripts`**: Contains build-related scripts, such as the `postbuild.js` script for copying assets.
-   **`/src`**: The main source code directory, containing all the TypeScript files.
-   **`/technical`**: Contains technical documentation files, including this one.
-   **`.all-contributorsrc`**: Configuration file for the all-contributors bot to recognize and credit contributors.
-   **`.eslintrc.json`**: Configuration file for ESLint, our static code analysis tool.
-   **`.gitignore`**: Specifies intentionally untracked files to be ignored by Git.
-   **`.npmignore`**: Specifies files to be ignored when publishing the package to npm.
-   **`LICENSE`**: The MIT license file for the project.
-   **`package.json`**: Lists the project dependencies and defines scripts for building, testing, and other development tasks.
-   **`package-lock.json`**: Records the exact version of every dependency, ensuring consistent installations.
-   **`README.md`**: The main README file for the project.
-   **`tsconfig.json`**: The configuration file for the TypeScript compiler.

## Source Directory (`/src`)

The `/src` directory is where all the primary logic of `captcha-canvas` resides.

-   **`captcha.ts`**: The core class file for generating the captcha image. It handles the canvas, drawing, and other related functionalities.
-   **`CaptchaGenerator.ts`**: A class that orchestrates the captcha generation process, combining various components.
-   **`constants.ts`**: Defines default options, interfaces, and constant values used throughout the project.
-   **`extra.ts`**: Contains utility functions, such as `createCaptcha` and `createCaptchaSync`, for easier captcha creation.
-   **`index.ts`**: The main entry point of the package. It exports the necessary classes and functions for public use.
-   **`util.ts`**: A collection of utility functions for tasks like generating random values and text.
