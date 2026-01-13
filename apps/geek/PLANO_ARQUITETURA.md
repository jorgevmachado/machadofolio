# Plano de Reestruturação Arquitetural para `/apps/finance`

## 1. Mapeamento da Estrutura Atual
Levantar todos os arquivos e pastas existentes em `/apps/finance/src` e analisar seu propósito e agrupamento.

## 2. Definição de Domínios/Features
Identificar os principais domínios de negócio (ex: dashboard, contas, transações, relatórios, autenticação).

## 3. Estrutura Modularizada por Feature
Sugerir uma árvore de diretórios baseada em domínios/features, separando responsabilidades e facilitando a escalabilidade.

## 4. Pastas e Arquivos Padrão
Explicar o papel de cada pasta (ex: `components`, `hooks`, `services`, `utils`, `types`, `contexts`, `pages`/`app`), com exemplos práticos de organização.

## 5. Exemplo de Estrutura Sugerida

```
/apps/finance/
  src/
    app/                # App Router do Next.js (rotas, layouts, templates)
      dashboard/
        page.tsx
        layout.tsx
        ...
      accounts/
        page.tsx
        ...
      ...
    domains/            # Cada domínio/feature isolado
      accounts/
        components/
          AccountList.tsx
          AccountForm.tsx
        hooks/
          useAccounts.ts
        services/
          accountService.ts
        types/
          account.ts
        utils/
          accountUtils.ts
        tests/
          AccountList.test.tsx
        index.ts
      transactions/
        components/
        hooks/
        services/
        types/
        utils/
        tests/
        index.ts
      ...
    shared/             # Componentes, hooks e utils reutilizáveis
      components/
        Button.tsx
        Modal.tsx
        ...
      hooks/
        useModal.ts
        useMediaQuery.ts
        ...
      utils/
        formatCurrency.ts
        ...
      types/
        index.ts
    contexts/           # Contextos globais (ex: Auth, Theme)
      AuthContext.tsx
      ThemeContext.tsx
    styles/             # Estilos globais e variáveis
      globals.css
      theme.css
    constants/          # Constantes globais (ex: textos, configs)
      messages.ts
      routes.ts
    public/             # Assets estáticos
    tests/              # Testes globais ou de integração
    ...
  package.json
  tsconfig.json
  ...
```

## 6. Conceitos e Justificativas

- **Separação por Domínio/Feature:** Cada domínio (ex: contas, transações) possui sua própria pasta, agrupando componentes, hooks, serviços, tipos e testes relacionados, facilitando a manutenção e evolução isolada.
- **Pasta `shared` para Reutilização:** Centraliza componentes, hooks e utilitários genéricos, promovendo reutilização e evitando duplicidade.
- **Contextos e Constantes Centralizados:** Contextos globais e constantes ficam acessíveis a toda a aplicação, promovendo consistência.
- **App Router e Rotas por Domínio:** Utiliza o padrão do Next.js App Router, com rotas organizadas por domínio, facilitando a navegação e o code splitting.
- **Testes Próximos ao Código:** Testes unitários e de integração ficam próximos ao código que testam, facilitando manutenção e cobertura.
- **Estilos e Assets Centralizados:** Estilos globais e assets estáticos organizados para fácil acesso e manutenção.

## Considerações Finais

- Recomenda-se migrar gradualmente, priorizando domínios mais críticos.
- Padronizar nomes e convenções para facilitar onboarding e colaboração.
- Avaliar uso de barrel files (`index.ts`) para simplificar importações.
- Documentar a arquitetura e convenções adotadas para referência futura.

Este plano pode ser ajustado conforme necessidades específicas do projeto ou feedback da equipe.

