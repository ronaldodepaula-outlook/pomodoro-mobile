# Documentação Técnica — Pomodoro Mobile

## Visão Geral
Aplicativo móvel construído com Expo (React Native) usando TypeScript e Expo Router (file-based routing). O app oferece autenticação, gerenciamento de tarefas e registro de sessões Pomodoro, comunicando-se com um backend via API REST.

## Estrutura do Projeto
- `app/` — rotas do Expo Router (screens e layouts).
- `assets/` — imagens e recursos estáticos.
- `components/` — componentes reutilizáveis.
- `constants/` — tokens de design (tema, fontes, cores).
- `src/services/` — integração com API (api wrapper, auth, tasks, pomodoro).
- `src/storage/` — wrapper de armazenamento (SecureStore + AsyncStorage).

## Principais Tecnologias
- Expo SDK (~54)
- React Native 0.81.x
- TypeScript 5.x
- `expo-router` para roteamento por arquivos
- `react-native-safe-area-context` para insets
- `@expo/vector-icons` para ícones
- `expo-background-fetch` + `expo-task-manager` para reconciliação em background

## API Wrapper
`src/services/api.ts` usa `fetch` e implementa:
- Normalização de base URL e path
- Logging de requests (console)
- Tratamento de JSON e erros HTTP
- `setAuthToken(token)` para configurar o header `Authorization`

## Serviços
- `auth.service.ts`: login, register, logout (usa SecureStore para `token`).
- `tasks.service.ts`: `listTasks`, `createTask`, `showTask`, `updateTask`, `deleteTask`.
- `pomodoro.service.ts`: `startPomodoro`, `finishPomodoro`, `historico`.

## Persistência Local
- Token: `expo-secure-store` (key `token`).
- User: `AsyncStorage` (`user`).
- Pomodoro local em andamento: `AsyncStorage` (`local_pomodoro`) com estrutura:
  ```json
  {
    "id": 123,
    "endTimestamp": 1690000000000,
    "duration": 1500,
    "tipo": "focus",
    "task_id": 42
  }
  ```

## Background
- Task `CHECK_POMODOROS_TASK` regista-se via `expo-background-fetch` para checar `local_pomodoro` e finalizar pomodoros expirados.

## Theme & UI
- `constants/theme.ts` exporta `Theme` com tokens de cor, `headerHeight` e fonts.
- Cores e estilos centralizados para facilitar branding.

## Boas práticas e observações
- Em desenvolvimento em dispositivo real, ajuste `API_BASE` em `src/services/api.ts` para o IP da sua máquina.
- `expo-notifications` foi removido/placeholder por limitações do Expo Go; para notifs locais, crie um dev build.
- Use `SafeAreaProvider` e `useSafeAreaInsets()` para lidar com notches.

## Como contribuir
- Crie branch `feature/<nome>` e abra PR com descrição concisa.
- Execute `npm run lint` antes de abrir PR.
- Mantenha alterações pequenas e foco em uma feature por PR.
