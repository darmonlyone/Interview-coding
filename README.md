# Encrypt and Decrypt with nestJS

## Project setup

Before starting the project, you need to generate and configure the RSA keys used for encryption.
Go to https://cryptotools.net/rsagen and generate a new RSA key pair

Put both files into the `keys/` folder at the root of the project

```cpp
keys/
  ├── private.pem
  └── public.pem
```

Run the following command to install all project dependencies

```bash
$ yarn install
```

## Compile and run the project

```bash
$ yarn run start
```

Once the server starts successfully, it will be available at http://localhost:3000/

You can also view the Swagger API documentation at http://localhost:3000/doc/

## Run tests

```bash
# unit tests
$ yarn run test
```
