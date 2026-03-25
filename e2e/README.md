# Testes E2E - BizzExpo

## Credenciais de Teste

| Ambiente | Email | Senha |
|----------|-------|-------|
| Producao (duevento.com.br) | evaldo.barbosa@gmail.com | **verificar senha correta** |

**IMPORTANTE**: A senha precisa ser verificada. A API retorna 401 com `senha123`.

## Executando os Testes

```bash
# Com credenciais via variavel de ambiente
TEST_EMAIL=evaldo.barbosa@gmail.com TEST_PASSWORD=suasenha pnpm e2e

# Rodar todos os testes
pnpm e2e

# Rodar com interface visual
pnpm e2e:ui

# Rodar com browser visivel
pnpm e2e:headed

# Rodar em modo debug
pnpm e2e:debug
```

## Variaveis de Ambiente

Os testes usam variaveis de ambiente para credenciais:

```bash
export TEST_EMAIL=evaldo.barbosa@gmail.com
export TEST_PASSWORD=sua_senha_aqui
export BASE_URL=https://duevento.com.br
```

## Estrutura dos Testes

- `cobranca.spec.ts` - Fluxo de cobranca do organizador (login, dashboard, criar evento, pagar fatura)

## Notas

- O usuario de teste deve ter perfil de organizador para acessar o dashboard
- Para testar pagamento PIX, e necessario ter uma fatura pendente
- Se o login falhar com 401, verificar as credenciais
