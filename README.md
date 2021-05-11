### Micado test

Run the following from the root directory to start the api service on port `3001`

```
npm i
npm run start
```

The app requires a working postgres db.
create an env file in the root directory with the following variables which are relative to your database

```
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

You can then run a migration to create the data table and seed it using

```
npm run migration
npm run seed
```

Change to the client diectory and run the following to start the client-side app on port `3000`

```
npm i
npm run start
```

You should now be able to see the interface
