# Fluxo Operacional — Pomodoro Mobile

## Objetivo
Guia prático para usuários e administradores sobre como operar o app e interpretar os dados.

## Para Usuários (passo-a-passo)
1. Abra o app e faça login (ou registre-se).
2. Crie tarefas em `Tarefas` -> `Criar tarefa` (título + descrição opcional).
3. Vá para `Timer`, selecione o tipo de sessão: `Foco`, `Pausa Curta` ou `Pausa Longa`.
4. Selecione a tarefa associada (obrigatório) no seletor.
5. Toque em `Iniciar Pomodoro` para começar. A sessão será registrada no backend.
6. Ao término, a sessão é finalizada automaticamente; pode usar `Parar` para finalizar manualmente.

## Relatórios
- `Relatórios` (quando disponível) permite filtrar por tarefa, período (diário/semana/mês) e exportar CSV.
- Se a seção "Relatório por Tarefa" não mostrar tarefas, verifique:
  - Conexão com o backend (API_BASE correto).
  - Token de autenticação válido.
  - Se a API retorna tarefas com `id`/`_id` — o app já normaliza diferentes formatos.

## Admin / Operações
- Para depuração, usar console logs do API wrapper (requests aparecem no console do Metro bundler).
- Para builds de produção, utilize EAS (Expo Application Services).

## Backup e Recuperação
- Os dados críticos residem no backend (sessões, tarefas).
- O único dado local é `local_pomodoro` para reconciliação em background — se perdido, o backend mantém o registro final.

## Recomendações UX
- Sempre associe tarefas às sessões para permitir relatórios por tarefa.
- Use a versão de produção para testes de notificações (Expo Go limita notificações locais).
