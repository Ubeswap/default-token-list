# Ubeswap Token List

Official token list of [Ubeswap](https://ubeswap.org).

## Contributing

To add a token to Ubeswap:

1. Install dependencies via `yarn install`. Note: you must be on Node.js 14.x or later to do this.
2. Add your token's logo to `assets/` (it must be a PNG less than 200px by 200px or an svg)
3. Add your token to `src/<network>.token-list.json`, where `<network>` is the name of the network your token is deployed to.
4. Run `yarn build` to regenerate the main token list.
5. Submit a pull request.

### resizing

Recommend the squoosh-cli.
`yarn squoosh-cli --output-dir tmp/resized --resize '{width: 200}' --oxipng auto assets/asset_cETH.png`

In certain cases such as if the proportions are not square or if automatic resize results in a larger file size than the orginal you will need to resize with another tool or re export from your graphics app.

## License

MIT
