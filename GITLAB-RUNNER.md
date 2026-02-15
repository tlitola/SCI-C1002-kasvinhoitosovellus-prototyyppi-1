### Starting Gitlab runners

1. Fill in `.env.sample` and rename it to `.env`
2. Register the runner with

```shell
docker compose run register-gitlab-runner
```

3. Start the runner with

```shell
docker compose up gitlab-runner -d
```