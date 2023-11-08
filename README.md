# NCHU NLPLAB Online Coding Website - frontend

You can write and execute Java, Python code online.

## How to deploy

Please make sure you have whole project include frontend and [backend](https://github.com/allen3325/coding_online_api).\
and make sure you have project structure like below:
```
.
├── coding_online_api
├── coding_online_web
└── docker-compose.yml

2 directories which is coding_online_api and coding_online_web, 1 file
```

### `docker compose`

you can get from frontend or backend repo, and copy that file to the right directory \
and cd to directory and type this command \
```
docker compose up
```