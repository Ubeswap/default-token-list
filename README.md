# Ubeswap Token List

Official token list of [Ubeswap](https://ubeswap.org).

## Contributing

To add a token to Ubeswap:

1. Fork the repo so that you can push edits to a version of this repo that you have write permissions to. See [docs](https://docs.github.com/en/get-started/quickstart/fork-a-repo) for more details.
2. Clone the repo. See [docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) for more details.
3. Enter the repo via `cd default-token-list`.
4. Install dependencies via `yarn install`. Note: you must be on Node.js 14.x or later to do this.
5. Add your token's logo to `assets/` (it must be a PNG less than 200px by 200px or an svg). If your token symbol is TEST, your asset must be named TEST.png.
6. Add your token to `src/<network>.token-list.json`, where `<network>` is the name of the network your token is deployed to.
7. Run `yarn build` to regenerate the main token list.
8. Submit a pull request. See [docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) for more details

### resizing

Recommend the squoosh-cli.
`yarn squoosh-cli --output-dir tmp/resized --resize '{width: 200}' --oxipng auto assets/asset_cETH.png`

In certain cases such as if the proportions are not square or if automatic resize results in a larger file size than the orginal you will need to resize with another tool or re export from your graphics app.

## License

MIT
