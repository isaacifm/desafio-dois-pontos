# 📧 Desafio Dois Pontos - Gestão de Emails com CI/CD

## 📋 Visão Geral da Solução

Este projeto implementa um **sistema de autenticação por email** que valida credenciais de usuários com suporte a status de expiração. A solução inclui testes automatizados utilizando **Mocha** com geração de relatórios visuais via **Mochawesome**, além de um pipeline completo de **Integração Contínua (CI)** com **GitHub Actions**.

---

## 🎯 Funcionalidades Principais

### Sistema de Autenticação (`gestaoEmails.js`)

A função `obterlogin(email, senha)` implementa a seguinte lógica:

1. **Validação de Email Expirado**: Verifica se o email está expirado antes de validar a senha
2. **Validação de Credenciais**: Compara email e senha contra a base de dados
3. **Mensagens de Erro Específicas**: Retorna diferentes erros para diferentes cenários:
   - ❌ Email expirado
   - ❌ Senha incorreta
   - ❌ Credenciais inválidas (email não encontrado)
4. **Login Bem-sucedido**: Retorna mensagem de sucesso quando as credenciais são válidas

### Base de Dados de Usuários

O sistema contém 4 usuários pré-configurados:

| ID | Nome | Email | Status |
|----|------|-------|--------|
| 1 | João Silva | joao.silva@example.com | ✅ Ativo |
| 2 | Maria Souza | mariasouza@example.com | ✅ Ativo |
| 3 | Paulo Oliveira | paulo.oliveira@example.com | ✅ Ativo |
| 4 | Ana Santos | ana.santos@example.com | ❌ Expirado |

---

## 🧪 Testes Automatizados

O projeto utiliza **Mocha** como framework de testes com **Mochawesome** para gerar relatórios visuais.

### Casos de Teste (`gestaoEmails.test.js`)

| # | Teste | Descrição |
|---|-------|-----------|
| 1 | Login bem-sucedido | Valida autenticação com credenciais corretas |
| 2 | Email expirado | Verifica rejeição de emails com status expirado |
| 3 | Usuário não encontrado | Confirma erro quando email não existe |
| 4 | Senha incorreta | Valida erro ao inserir senha errada |

### Padrão AAA

Os testes seguem o padrão **Arrange-Act-Assert**:

```javascript
it("Teste descriptivo", () => {
    // Arrange: Preparar dados
    const email = "user@example.com";
    const senha = "123456";

    // Act: Executar a função
    const resultado = obterlogin(email, senha);

    // Assert: Validar resultado
    assert.equal(resultado, "Login realizado com sucesso!");
});
```

---

## 🚀 Execução Local

### Pré-requisitos
- Node.js 24+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar testes
npm test

# Testes com relatório
npm run test
```

### Artefatos Gerados

Após executar os testes, um relatório HTML é gerado em `mochawesome-report/`:

```
mochawesome-report/
├── mochawesome.html (Relatório visual interativo)
├── mochawesome.json (Dados estruturados dos testes)
└── assets/ (Recursos CSS e JS)
```

---

## 🔄 Pipelines de CI/CD

O projeto utiliza **GitHub Actions** com 4 workflows diferentes para cobertura completa de testes:

### 1️⃣ **01-manual-exec.yaml** - Execução Manual

**Trigger**: Disparo manual via `workflow_dispatch`

**Funcionalidades**:
- Permite escolher formato do relatório (Mochawesome ou Standard)
- Execução sob demanda para testes rápidos
- Ideal para validações antes de merge

```yaml
on:
  workflow_dispatch:
    inputs:
      test_reporter:
        description: 'Formato do relatório'
        type: choice
        options:
          - mochawesome
          - standard
```

**Fluxo**:
1. Checkout do código
2. Setup Node.js 24
3. Instalação de dependências
4. Verificação de ambiente
5. Execução dos testes
6. Upload do relatório (30 dias de retenção)
7. Notificação com resultados

---

### 2️⃣ **02-agenda-exec.yaml** - Execução Agendada

**Trigger**: Cron job diário + Dispatch manual

**Configuração**:
```yaml
on:
  schedule:
    - cron: '0 9 * * *'  # Executa diariamente às 09:00 UTC
  workflow_dispatch:
```

**Objetivo**: Monitoramento contínuo de saúde do projeto
- Testa a estabilidade do código regularmente
- Detecta problemas de dependências
- Mantém histórico de confiabilidade

---

### 3️⃣ **03-post-deploy-exec.yaml** - Execução Pós-Deploy

**Trigger**: Ao completar `01-manual-exec.yaml`

```yaml
on:
  workflow_run:
    workflows: ["Execução Manual de Testes"]
    types: [completed]
```

**Finalidade**:
- Validação pós-implantação
- Garante que o ambiente está estável após mudanças
- Execução condicionada ao sucesso do workflow anterior

---

### 4️⃣ **04-push-exec.yaml** - Execução por Push

**Trigger**: Push na branch `main` + Dispatch manual

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
```

**Objetivo**: Integração contínua no fluxo de desenvolvimento
- Testa automaticamente cada push na main
- Garante que código integrado é funcional
- Feedback imediato aos desenvolvedores

---

## 🔑 Conceitos-Chave dos Workflows

### 1. **Triggers (Eventos)**

Os workflows são acionados por diferentes eventos:

| Trigger | Uso | Exemplo |
|---------|-----|---------|
| `push` | Evento de push em branches | Push na `main` |
| `schedule` | Execução em horários específicos | Cron job diário |
| `workflow_dispatch` | Acionamento manual | Botão "Run workflow" |
| `workflow_run` | Dependência de outro workflow | Pós-deploy |

### 2. **Runners**

Todos os workflows executam em:
```yaml
runs-on: ubuntu-latest
```

- **Ubuntu Latest**: Ambiente Linux padrão do GitHub Actions
- Oferece Node.js, npm e outras ferramentas pré-instaladas

### 3. **Jobs e Steps**

**Job**: Unidade de execução paralela
**Step**: Tarefa individual dentro de um job

```yaml
jobs:
  test:  # Nome do job
    name: Testes e geração de relatório
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout do código  # Nome do step
        uses: actions/checkout@v4
```

### 4. **Actions Reutilizáveis**

#### `actions/checkout@v4`
Copia o código do repositório para o runner
```yaml
- uses: actions/checkout@v4
```

#### `actions/setup-node@v4`
Configura Node.js com cache npm
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '24'
    cache: 'npm'  # Cacheia node_modules
```

#### `actions/upload-artifact@v4`
Armazena artefatos de teste
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: mochawesome-report
    path: mochawesome-report/
    retention-days: 30
```

#### `actions/github-script@v7`
Executa código JavaScript no contexto do GitHub
```yaml
- uses: actions/github-script@v7
  with:
    script: |
      // Código JavaScript com acesso às APIs do GitHub
```

### 5. **Condições**

#### `if: always()`
Step executado independentemente do sucesso/falha anterior
```yaml
- name: Upload relatório
  if: always()  # Executa mesmo se testes falharem
  uses: actions/upload-artifact@v4
```

#### `continue-on-error: true`
Job continua mesmo se step falhar
```yaml
- name: Executar testes
  run: npm test
  continue-on-error: true  # Continua para upload mesmo se falhar
```

### 6. **Variáveis de Contexto**

O GitHub Actions fornece contexto durante execução:

| Variável | Descrição |
|----------|-----------|
| `${{ github.repository }}` | Owner/repositório (ex: user/repo) |
| `${{ github.run_id }}` | ID único da execução |
| `${{ github.event.schedule }}` | Identifica se foi trigger agendado |

### 7. **Cache de Dependências**

Otimização crucial para performance:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '24'
    cache: 'npm'  # Cacheia ~/.npm e node_modules
```

**Benefício**: Reduz tempo de instalação em ~70% nas execuções subsequentes

### 8. **Artefatos**

Preservam resultados de testes para análise posterior:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: mochawesome-report      # Nome do artefato
    path: mochawesome-report/     # Diretório a enviar
    retention-days: 30            # Retenção de 30 dias
```

---

## 📊 Fluxo de Execução Detalhado

```
┌─────────────────────────────────────────────────────┐
│  GitHub Actions Workflow Execution                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Checkout                                        │
│     └─ git clone do repositório                    │
│                                                     │
│  2. Setup Node.js                                  │
│     ├─ Instalar Node.js 24                        │
│     ├─ Validar instalação                          │
│     └─ Preparar cache npm                          │
│                                                     │
│  3. Install Dependencies                            │
│     ├─ npm ci --verbose                            │
│     └─ Carregar cache (se disponível)              │
│                                                     │
│  4. Verify Installation                             │
│     ├─ node --version                              │
│     ├─ npm --version                               │
│     └─ mocha --version                             │
│                                                     │
│  5. Run Tests                                       │
│     ├─ npm test                                    │
│     ├─ Mocha executa test/*.test.js                │
│     ├─ Gera mochawesome.json                       │
│     └─ continue-on-error: true                     │
│                                                     │
│  6. Upload Artifacts (if: always())                │
│     ├─ Upload mochawesome-report/                  │
│     └─ Retenção de 30 dias                         │
│                                                     │
│  7. Generate Comment (if: always())                │
│     ├─ Ler mochawesome.json                        │
│     ├─ Extrair stats (passes, failures)            │
│     └─ Comentar no run com resumo                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Configuração do Relatório Mochawesome

### Script npm (package.json)

```json
"test": "npx mocha test/*.test.js --reporter mochawesome --reporter-options reportDir=./mochawesome-report,reportFilename=mochawesome.json,quiet=true"
```

**Parâmetros**:

| Parâmetro | Valor | Explicação |
|-----------|-------|-----------|
| `--reporter` | `mochawesome` | Usa formatador Mochawesome |
| `reportDir` | `./mochawesome-report` | Diretório de saída |
| `reportFilename` | `mochawesome.json` | Nome do arquivo JSON |
| `quiet` | `true` | Suprime logs verbosos |

### Estrutura do Relatório JSON

```json
{
  "stats": {
    "passes": 4,
    "failures": 0,
    "pending": 0,
    "skipped": 0,
    "duration": 125
  },
  "tests": [
    {
      "title": "Deve realizar login com sucesso",
      "state": "passed",
      "duration": 2
    }
  ]
}
```

---

## 📈 Monitoramento e Debugging

### Visualizar Logs

1. **GitHub Actions UI**: Actions → Workflow → Run
2. **Logs em Tempo Real**: Acompanhar execução passo-a-passo
3. **Artefatos**: Actions → Artifacts → Download

### Troubleshooting Comum

| Problema | Solução |
|----------|---------|
| Node.js não encontrado | Verificar versão no `setup-node@v4` |
| npm install falha | Limpar cache: `npm cache clean --force` |
| Testes falhando em CI | Executar localmente: `npm test` |
| Relatório não gerado | Verificar permissões no diretório |

---

## 🔒 Segurança e Boas Práticas

✅ **Implementadas**:
- Checkout v4 (segurança atualizada)
- Node.js versão fixa (24)
- npm ci ao invés de npm install (reproducibilidade)
- continue-on-error controlado (não falha silenciosamente)

⚠️ **Considerações**:
- Senhas em produção: Usar GitHub Secrets
- Credenciais: Nunca commitar secrets
- Logs: Mascarar dados sensíveis

---

## 🚀 Próximas Melhorias Sugeridas

1. **Análise de Cobertura**: Adicionar `nyc` para cobertura de código
2. **Linting**: Integrar ESLint no pipeline
3. **Dependências**: Adicionar Dependabot para atualizações automáticas
4. **Notificações**: Integrar com Slack/Discord
5. **Staging**: Criar workflow para deploy em staging
6. **Branches**: Adicionar testes em branches de feature (PR)

---

## 📚 Referências Úteis

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Mocha Testing Framework](https://mochajs.org/)
- [Mochawesome Reporter](https://github.com/adamgruber/mochawesome)
- [Node.js v24 LTS](https://nodejs.org/)

---

## 👤 Estrutura do Projeto

```
desafio-dois-pontos/
├── .github/
│   └── workflows/
│       ├── 01-manual-exec.yaml       (Execução manual)
│       ├── 02-agenda-exec.yaml       (Execução agendada)
│       ├── 03-post-deploy-exec.yaml  (Pós-deploy)
│       └── 04-push-exec.yaml         (Por push)
├── src/
│   └── gestaoEmails.js               (Lógica de autenticação)
├── test/
│   └── gestaoEmails.test.js          (Testes unitários)
├── mochawesome-report/               (Gerado na execução)
├── package.json                      (Dependências e scripts)
└── README.md                         (Este arquivo)
```

---

**Versão**: 1.0.0 | **Última Atualização**: 2024

