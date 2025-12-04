# Preparar o repositório para GitHub e ganhar visibilidade

Este arquivo explica como estruturar o repositório para atrair contribuições, estrelas e seguidores.

## 1) README atrativo
- Tenha um título claro e uma captura visual (GIF ou PNG) do app em ação.
- Adicione badges: build (EAS), license, expo, npm.
- Mostre instruções "Quick start" e links para builds (Expo/EAS).
- Destaque recursos e tela principais (autenticação, tarefas, timer, relatórios).

## 2) Screenshots / Demo
- Adicione `assets/demo.gif` mostrando o fluxo de uma sessão.
- Forneça um link para um vídeo curto (YouTube) com 30-60s demonstrando a experiência.

## 3) LICENSE
- Adicione uma licença permissiva (MIT) no root para encorajar contribuições.

## 4) Contribuição e Código de Conduta
- Crie `CONTRIBUTING.md` com como rodar o projeto localmente, padrões de código e como abrir PRs.
- Adicione `CODE_OF_CONDUCT.md` (padrões de comunidade).

## 5) Issues Templates / PR Templates
- Adicione templates para bug report / feature request / PR.

## 6) GitHub Actions e CI
- Configure workflow para:
  - Lint + TypeScript check em PR
  - Build e testes básicos
  - Publicar artefatos (opcional)

## 7) Releases e Tags
- Publique releases com changelog resumido e assets (APK, IPA se aplicável).

## 8) Divulgação
- Poste um PRs/Issue por semana com atualizações e responda rápido a comentários.
- Compartilhe o projeto em comunidades (r/reactnative, r/expo, Twitter, Dev.to).
- Crie um pequeno artigo mostrando a arquitetura e decisões técnicas.

## 9) README pronto para copy/paste
- Forneço um README pronto que inclui: descrição, quick start, screenshots, contribuição, licença e links. Copie para `README.md` (já atualizado). 

---

Se quiser, eu posso adicionar os arquivos `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE` e templates automaticamente e sugerir um workflow do GitHub Actions. Deseja que eu os crie agora?