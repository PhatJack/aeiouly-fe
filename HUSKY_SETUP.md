# Husky Setup

This project uses Husky to run Git hooks that help maintain code quality and consistency.

## What's included

- **Prettier**: Automatically formats code according to project standards
- **ESLint**: Checks and fixes linting issues in JavaScript/TypeScript files
- **Commitlint**: Enforces conventional commit message format

## Files that are processed

- **Prettier**: `**/*.{js,jsx,ts,tsx,json,md,mdx,css,scss}`
- **ESLint**: `**/*.{js,jsx,ts,tsx}`

## How it works

1. **Pre-commit Hook**: When you run `git commit`, Husky automatically triggers the pre-commit hook
   - Runs `lint-staged` which processes only staged files
   - Prettier formats the code and ESLint fixes any linting issues
   - If there are unfixable issues, the commit will be rejected

2. **Commit-msg Hook**: After you enter your commit message, Husky validates it
   - Runs `commitlint` to check if your commit message follows conventional format
   - If the format is invalid, the commit will be rejected

## Conventional Commit Format

Your commit messages must follow this format:
```
<type>: <description>

[optional body]

[optional footer]
```

### Allowed types:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools
- **perf**: A code change that improves performance
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

### Examples:
```
feat: add user authentication
fix: resolve login button styling issue
docs: update README with installation instructions
chore: update dependencies
```

## Manual commands

- Run formatting: `pnpm run format`
- Run linting: `pnpm run lint`
- Run pre-commit checks manually: `npx lint-staged`
- Test commit message format: `echo "feat: your message" | npx commitlint`

## Setup

The setup is already done, but if you need to reinstall:

1. Install dependencies: `pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional`
2. Initialize Husky: `npx husky init`
3. The hooks are automatically configured
