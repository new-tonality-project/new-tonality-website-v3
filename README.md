# New Tonality Website

Main website for hosting the work on New Tonality project.

## Getting started

To get started with this template, first install the npm dependencies:

```bash
npm install
```

Next, create a `.env.local` file in the root of your project and set the `NEXT_PUBLIC_SITE_URL` variable to your site's public URL:

```
NEXT_PUBLIC_SITE_URL=https://example.com
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## InstantDB schema

Schema lives in `src/instant.schema.ts`. Scripts target the Instant app ID in `NEXT_PUBLIC_INSTANT_APP_ID` from `.env.development` or `.env.production`.

Log in once, then push or pull schema:

```bash
bun run instant:login

bun run instant:push-schema-dev
bun run instant:pull-schema-dev

bun run instant:push-schema-prod
bun run instant:pull-schema-prod
```

Push schema to production before deploying frontend changes that depend on new entities or attributes. An additive schema push is safe while the old frontend is still live; deploying new code before the schema exists is not.

## Spotlight

This website is base on the [Tailwind Plus](https://tailwindcss.com/plus) site template Spotlight that is built using [Tailwind CSS](https://tailwindcss.com) and [Next.js](https://nextjs.org).

## License

This site template is a commercial product and is licensed under the [Tailwind Plus license](https://tailwindcss.com/plus/license).
