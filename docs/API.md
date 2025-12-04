# API — Pomodoro Mobile

Este documento descreve os endpoints que o aplicativo consome. Baseado na coleção Postman incluída (`Pomodoro API — Complete Collection.postman_collection.json`).

Base URL: `{{base_url}}/api` (configurar `REACT_APP_API_URL` no app)

## Autenticação
- `POST /auth/login` — body: `{ email, password }` → retorna `{ token, user }`
- `POST /auth/register` — body: `{ name, email, password }`
- `POST /auth/logout` — header `Authorization: Bearer <token>`

## Tarefas
- `GET /tasks` — lista tarefas do usuário autenticado. Query params suportados: `page`, `per_page`, `search`.
- `POST /tasks` — cria uma tarefa: `{ title, description? }`
- `GET /tasks/:id` — detalhes da tarefa
- `PUT /tasks/:id` — atualiza tarefa
- `DELETE /tasks/:id` — remove tarefa

## Pomodoros
- `POST /pomodoros/start` — inicia um pomodoro. Body: `{ tipo: 'focus'|'short_break'|'long_break', task_id?: number, device?: string }` → retorna `id` do pomodoro
- `POST /pomodoros/:id/finish` — finaliza um pomodoro. Body: `{ duracao_segundos, concluido: boolean }`
- `GET /pomodoros/historico` — histórico de pomodoros do usuário

## Relatórios
- `GET /relatorios/diario` — relatório diário
- `GET /relatorios/semanal` — relatório semanal
- `GET /relatorios/mensal` — relatório mensal
- `GET /relatorios/por_tarefa?task_id=...` — relatório filtrado por tarefa

## Cabeçalhos
- `Content-Type: application/json`
- `Authorization: Bearer <token>` para endpoints protegidos

## Observações
- O app faz normalização quando a API retorna formatos diferentes (ex.: `id` vs `_id`).
- Caso a API use paginação, o app espera `data` e/ou um array direto; o wrapper lida com ambos.
