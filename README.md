# Install dependencies
npm install
npm install twilio

```
Then you can begin development:

```sh

# npm
npm run dev
```

This will launch a [nodemon](https://nodemon.io/) process for automatic server restarts when your code changes.

### Testing

Testing is powered by [Jest](https://facebook.github.io/jest/). This project also uses [supertest](https://github.com/visionmedia/supertest) for demonstrating a simple routing smoke test suite.

Start the test runner in watch mode with:

```sh

# npm
npm test
```

You can also generate coverage with:

```sh

# npm
npm test -- --coverage
```

### Deployment

Deployment is specific to hosting platform/provider but generally:

```sh

# npm
npm run build
```

will compile your `src` into `/dist`, and 

```sh

# npm
npm start
```

will run `build` (via the `prestart` hook) and start the compiled application from the `/dist` folder.

The last command is generally what most hosting providers use to start your application when deployed, so it should take care of everything.

You can find small guides for Heroku, App Engine and AWS in [the deployment](DEPLOYMENT.md) document.
