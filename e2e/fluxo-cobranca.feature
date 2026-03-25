# Fluxo de Cobranca - Teste Manual

Funcionalidade: Cobranca Automatica ao Criar Evento
  Como um organizador
  Eu quero criar um evento com plano pago
  Para que uma fatura seja gerada automaticamente

---

## Cenario 1: Criar Evento com Plano Essencial

### Pre-condicao
- Estar logado como organizador
- Estar no dashboard (https://duevento.com.br/dashboard)

### Passos

1. **Clicar em "Novo Evento"**
   - Localizar botao "Novo Evento" acima de "Eventos Recentes"
   - Clicar no botao
   - Deve redirecionar para: /eventos/criar

2. **Preencher dados do evento**
   - Nome: `Evento Teste Cobranca`
   - Descricao: `Evento para testar cobranca automatica`
   - Data Inicio: `01/04/2026 09:00`
   - Data Fim: `01/04/2026 18:00`
   - Local: `Centro de Convencoes`

3. **Selecionar plano Essencial**
   - Localizar cards de planos (Essencial, Profissional, Enterprise)
   - Clicar no card "Essencial" (R$ 299,00)
   - O card deve ficar destacado/selecionado

4. **Criar evento**
   - Clicar no botao "Criar Evento" ou "Salvar"
   - Aguardar processamento

5. **Verificar resultado**
   - Deve redirecionar para pagina do evento criado
   - Deve mostrar mensagem de sucesso

### Checklist
[ ] Botao "Novo Evento" esta visivel no dashboard?
[ ] Formulario de criacao de evento carregou?
[ ] Cards de planos estao visiveis?
[ ] Plano Essencial foi selecionado?
[ ] Evento foi criado com sucesso?
[ ] Qual URL apos criar? (/eventos/[uuid])

---

## Cenario 2: Verificar Fatura Gerada

### Pre-condicao
- Ter criado um evento com plano Essencial

### Passos

1. **Acessar Minhas Faturas**
   - Navegar para: https://duevento.com.br/minhas-faturas
   - Ou clicar no menu/link "Minhas Faturas"

2. **Verificar fatura pendente**
   - Deve aparecer uma fatura com status "Pendente"
   - Valor: R$ 299,00 (plano Essencial)
   - Descricao deve mencionar o evento criado

### Checklist
[ ] Pagina de faturas carregou?
[ ] Existe fatura pendente na lista?
[ ] O valor esta correto (R$ 299,00)?
[ ] Existe botao "Pagar"?

---

## Cenario 3: Pagar Fatura com PIX

### Pre-condicao
- Ter uma fatura pendente

### Passos

1. **Clicar em Pagar**
   - Na lista de faturas, clicar no botao "Pagar"
   - Deve redirecionar para: /faturas/[uuid]/pagar

2. **Selecionar metodo PIX**
   - PIX deve estar selecionado por padrao
   - Se nao, clicar na opcao "PIX"

3. **Gerar QR Code**
   - Clicar no botao "Gerar QR Code PIX"
   - Aguardar geracao

4. **Verificar QR Code**
   - Deve aparecer imagem do QR Code
   - Deve aparecer codigo "copia e cola"
   - Deve mostrar valor e vencimento

### Checklist
[ ] Pagina de pagamento carregou?
[ ] Opcao PIX esta disponivel?
[ ] QR Code foi gerado?
[ ] Codigo copia-cola esta visivel?

---

## Resumo dos Endpoints Testados

| Acao | URL |
|------|-----|
| Dashboard | /dashboard |
| Criar Evento | /eventos/criar |
| Ver Evento | /eventos/[uuid] |
| Minhas Faturas | /minhas-faturas |
| Pagar Fatura | /faturas/[uuid]/pagar |

---

## Dados para Teste

### Evento
- Nome: Evento Teste Cobranca
- Descricao: Evento para testar cobranca automatica
- Data: 01/04/2026
- Local: Centro de Convencoes
- Plano: Essencial (R$ 299,00)
