# Eleventy packages

This monorepository groups several plugins and `kickin` CLI in order to make their development easier. Documentation for every package is in their own folders. Please, refer to them if you search for plugin's behavior.

It consists of:

1. [eleventy-plugin-compress](./packages/eleventy-plugin-compress)
2. [eleventy-plugin-pwa-icons](./packages/eleventy-plugin-pwa-icons)
3. [eleventy-plugin-scripts](./packages/eleventy-plugin-scripts)
4. [eleventy-plugin-styles](./packages/eleventy-plugin-styles)
5. [eleventy-plugin-workbox](./packages/eleventy-plugin-workbox)
6. [eleventy-shortcode-image](./packages/eleventy-shortcode-image)
7. [kickin](./packages/kickin)

## Prerequisites

This project relies on [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) feature that is available since npm `v7`. For Node version there aren't any restrictions.

1. `node` - at least last LTS release (preferable).
2. `npm` - `^7.0.0` (needed for workspaces).

## Development

### Building

For building packages use command below:

```
npm run build
```

### Publishing

For publishing packages to `npm` use;

```
npx lerna publish
```

> This command will call [`lerna version`](https://github.com/lerna/lerna/tree/main/commands/version) under the hood. Please, refer to its documentation for more information.

### Commits

> Before committing changes be sure that they are described in `CHANGELOG.md` and `README.md` files under package that have been changed!

This project uses [Conventional Changelog Specification](https://github.com/conventional-changelog/) for structuring commit messages.

Commit message should have this structure:

```
type(scope?): subject
body?
footer?
```

> `?` means that section is optional.

- `type` can only be one of this words:

```
| `build` - changes that affect the build system or external dependencies.
| `chore` - unimportant small changes.
| `ci` - changes to our CI configuration files and scripts.
| `docs` - documentation only changes.
| `feat` - a new feature.
| `fix` - a bug fix.
| `perf` - a code change that improves performance.
| `refactor` - a code change that neither fixes a bug nor adds a feature.
| `revert` - a code change that returns back some functionality.
| `style` - changes that do not affect the meaning of the code.
| `test` - adding missing tests or correcting existing tests.
```

- `scope` is a name of the package that was changed.
- `subject` is a short description of the commit.
- `body` is a detailed description (reasons of the changes, what is done, how and so on.)
- `footer` can be used for marking issue ids on GitHub.

> You can refer to [Angular guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) for extended information.

## Word from author

Have fun! ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
  <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
