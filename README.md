# Progressive `useFetcher`

Ryan Florence (@ryanflorence) promotes a three-step process to create user experiences:

1. Make it work without JavaScript
2. Enhance the experience with JavaScript
3. Move as much logic as possible to the server

Remix provides all the tools to follow through with this process.

In this project, I want to look at the second step: enhancing the experience with JavaScript. Specifically, I want to look at how to use `useFetcher` to progressively enhance the experience.

## The different implementations

This project includes three different routes next to the homepage.

The first implementation showcases Step 1 - Make it work without JavaScript.

The second implementation showcases Step 2 - Make it work with JavaScript. This is how I usually build my web apps.

### Challange

By going all in on JavaScript, I make the experience worse if no JavaScript is enabled / or not working for whatever reason. For instance, error and success messages that were working on Step 1 are now only working if JavaScript is enabled. Can't we have the best of both worlds? A good-enough Step 1 version working if JavaScript is disabled and a very nice dynamic experience if JavaScript is working?

The third implementation aims to improve progressive enhancement and bridge the gap between Step 1 and Step 2.

## Run project locally

Run `npm i && npm run dev` to run this project locally. You will find three links to the three different implementations on the homepage.

Disable JavaScript in the browser or remove the `Scripts` component from `root.tsx` to see how the three different mock forms behave with and without JavaScript.
