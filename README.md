# NovaSMS backend

NestJS API and scheduler worker for NovaSMS.

## VPS development environment

The development stack is isolated from production:

- API: `http://127.0.0.1:4010`
- MongoDB: `mongodb://127.0.0.1:27018/novasms_dev`
- database volume: `novasms-backend-dev_mongo_data`
- source code: bind-mounted with Nodemon hot reload

Production containers, ports and MongoDB volumes are not reused.

Start the API, scheduler worker and development database:

```bash
docker compose -f compose.dev.yml up -d --build
```

Check status and health:

```bash
docker compose -f compose.dev.yml ps
curl http://127.0.0.1:4010/health
```

Follow the API or worker logs:

```bash
docker compose -f compose.dev.yml logs -f api
docker compose -f compose.dev.yml logs -f worker
```

Stop the stack without deleting development data:

```bash
docker compose -f compose.dev.yml down
```

Delete the development database only when a clean reset is intended:

```bash
docker compose -f compose.dev.yml down -v
```

Because the API port is bound to loopback, access it from a workstation through
an SSH tunnel rather than exposing a development server publicly:

```bash
ssh -L 4010:127.0.0.1:4010 ubuntu@YOUR_VPS
```

## Local Node.js workflow

When Node.js 20+ and MongoDB are installed locally, copy `.env.example` to
`.env`, then use:

```bash
npm ci
npm run start:dev
npm run start:dev:worker
```

## Verification

```bash
npm run build
npm test -- --runInBand
```
