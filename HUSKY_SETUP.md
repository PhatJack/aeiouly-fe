# Husky Pre-commit Setup

This project uses Husky to run pre-commit hooks that help maintain code quality.

## What's included

- **Prettier**: Automatically formats code according to project standards
- **ESLint**: Checks and fixes linting issues in JavaScript/TypeScript files

## Files that are processed

- **Prettier**: `**/*.{js,jsx,ts,tsx,json,md,mdx,css,scss}`
- **ESLint**: `**/*.{js,jsx,ts,tsx}`

## How it works

1. When you run `git commit`, Husky will automatically trigger the pre-commit hook
2. The hook runs `lint-staged` which processes only staged files
3. Prettier formats the code and ESLint fixes any linting issues
4. If there are unfixable issues, the commit will be rejected

## Manual commands

- Run formatting: `pnpm run format`
- Run linting: `pnpm run lint`
- Run pre-commit checks manually: `npx lint-staged`

## Setup

The setup is already done, but if you need to reinstall:

1. Install dependencies: `pnpm add -D husky lint-staged`
2. Initialize Husky: `npx husky init`
3. The pre-commit hook is automatically configured
