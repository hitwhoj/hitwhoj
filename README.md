# A complicated NodeJS Full-Stack Template

This project implemented a simple website with following functionalities:

- User register
- User login (and issue a cookie)
- Upload files to server
- Download files from server
- List the files user uploaded

Features:

- Frontend: Vue 3
- Backend: Koa
- Building: Vite + Webpack 5 + esbuild
- Linting: Eslint
- Testing: Mocha + Chai
- DataBase: MongoDB
- Storage: MinIO
- Server Side Render fully supported
- TypeScript with VSCode fully supported
- Vite Dev Server with HMR fully supported

## Code of conduct

- Use the latest features
- Keep your code **simple** and **stupid**
- Keep your develop environment **powerful** and **stupid**

For more informations, please read [docs/Develop.md](./docs/Develop.md)

## Deploy

Read [docs/Deploy.md](./docs/Deploy.md)

## File structure

- `src/` puts all the frontend codes
- `app/` puts all the backend codes

## How to use

Note that we are using `yarn` as a node package manager instead of `npm`.
You can install it via `npm i -g yarn`.

```bash
# install all dependencies
yarn install

# ======= build =======

# build the frontend for browsers
# output to `dist/client/`
yarn build:client

# build the frontend for backend SSR use
# output to `dist/server/`
yarn build:ssr

# build the backend for nodejs to run
# output to `build/main.js`
yarn build:server

# or build all threes parts within one command
yarn build

# ======== deploy =======

# after building the project, you can easily start
# the server via `yarn start` or `node build/main.js`
yarn start

# ======== develop =======

# start a frontend HMR development environment
# you must ensure you backend was built already
# - yarn build:server
yarn dev

# start a backend development environment
# build code when change
yarn build:server --watch
# or use node --inspect-brk
yarn debug

# ======== lint =======

# lint frontend code (or with auto fix)
yarn lint:client
yarn lint:client --fix
# lint backend code (or with auto fix)
yarn lint:server
yarn lint:server --fix
# or lint both above
yarn lint
yarn lint:fix

# ======== test =======

# it just works
yarn test
# check coverage
yarn coverage

```
