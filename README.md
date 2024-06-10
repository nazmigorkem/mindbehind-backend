### Requirements

-   Docker Engine

### Commands

-   To run it in production mode run `docker-compose up -d` command in the root directory of the project.
-   To run it in development mode run `docker-compose -f docker-compose.dev.yaml up -d` command in the root directory of the project.

### Notes

-   You can update migrations with `pnpm drizzle-kit generate`
-   All the migrations are going to run when application starts.
-   `owner` and `employee` roles will be created and cannot be deleted with supplied end-points. These are default roles for RBAC (Role Base Access Control).
-   `/src`, `package.json` and `tsconfig.json` are going to be mounted when development container spins up.
-   Postman collection can be found in the root directory. You have to adjust pre-request script of the collection to add authorization header to have `User` access after you login and get your authorization token.
-   To have `System Admin` access, you have to add `api_key` header to requests manually that matches with the field `API_KEY` value in `.env`.
-   Example `.env` file can be found in `/env` directory.

### Possible improvements:

-   Every branch can have seperate role system with couple of database table adjustments.
-   RBAC improvements with seperate branch roles.
-   Custom logger can be added.
-   Health checks can be added with Prometheus, Grafana-Loki etc.
-   Soft data deletion from database.
