# MDX Presentations

```bash
pnpm -w nx run presenter:dev
```

To bundle:

```bash
pnpm -w nx run presenter:bundle
```

Use `http-server` (https://www.npmjs.com/package/http-server) to test the bundle:

```bash
npx http-server out/presenter
```
