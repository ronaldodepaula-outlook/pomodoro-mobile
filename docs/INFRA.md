# Infraestrutura — Pomodoro Mobile

## Resumo
O aplicativo consome uma API REST (pode ser um serviço em Node.js/Laravel/Django etc.). Este documento descreve a infraestrutura sugerida e variáveis de ambiente.

## Componentes
- Mobile app (Expo) — frontend.
- Backend API — endpoints REST para autenticação, tarefas, pomodoros e relatórios.
- Banco de dados — PostgreSQL / MySQL.
- Armazenamento de arquivos — (opcional) S3 para anexos.
- Autenticação — JWT bearer tokens.

## Variáveis de Ambiente (backend)
- `DATABASE_URL` — URL de conexão com o banco
- `JWT_SECRET` — segredo para assinar tokens
- `PORT` — porta do servidor
- `CORS_ORIGINS` — origens permitidas (inclua o domínio do frontend, se aplicável)

## Variáveis de Ambiente (mobile)
- `REACT_APP_API_URL` — endpoint base da API (ex.: `http://192.168.1.9:8000/api`)

## Serviços Recomendados
- Hospedagem backend: DigitalOcean, Heroku, Render, Railway, AWS Elastic Beanstalk.
- Banco: Managed Postgres (Supabase, Heroku Postgres).
- CI/CD: GitHub Actions para testes e deploy.
- Builds mobile: EAS (Expo Application Services) para builds OTA e produção.

## Observações sobre notificações
- Para notificações push usar Expo Push (via servidor) ou configurar FCM/APNs com credenciais apropriadas; no Expo Go há limitações.

## TLS/HTTPS
- Sempre expor API via HTTPS (Let's Encrypt ou provedor de hospedagem).

## Deploy rápido (exemplo com Heroku)
1. Push do backend para Heroku (config vars via dashboard).
2. Ajuste `REACT_APP_API_URL` no app para o domínio `https://api.seudominio.com/api`.
3. Crie builds com EAS ou publique via Play Store / App Store.
