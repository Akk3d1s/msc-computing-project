# msc-computing-project

## Running Cypress

- Make sure the backend and frontend is running.
- Go to /e2e and then run  `npm run cypress:open` to start the testing suite.

## Running Cypress in Docker together with the frontend and backend
- Navigate to backend
  - Run `npm run start`
- Navigate to a frontend, for example oss
  - Run `npm run start:production`
  - This will compile the application to production and configure the correct urls to run for the Cypress tests in Docker. Additionally, it will start up a server.
- Navigate to e2e.
  - Run `docker-compose down && docker-compose up`
  - This tests should now be executed for the desired frontend (in this case oss).
