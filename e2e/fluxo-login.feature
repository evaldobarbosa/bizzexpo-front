# Fluxo de Login - Teste Manual

Funcionalidade: Login do Organizador
  Como um organizador
  Eu quero fazer login no sistema
  Para acessar o dashboard e gerenciar meus eventos

Cenario: Login com credenciais validas
  Dado que estou na pagina de login
    | URL: https://duevento.com.br/login |

  Quando eu preencho o campo "E-mail" com "evaldo.barbosa@gmail.com"
  E eu preencho o campo "Senha" com "senha123"
  E eu clico no botao "Entrar"

  Entao devo ser redirecionado para o dashboard
    | URL esperada: https://duevento.com.br/dashboard |
  E devo ver o texto "Dashboard" na pagina

---

## Passos Detalhados para Teste Manual:

### 1. Abrir o navegador
- Abra o Chrome ou Brave
- Acesse: https://duevento.com.br/login

### 2. Verificar que a pagina carregou
- Deve aparecer o formulario com:
  - Campo "E-mail" (placeholder: "seu@email.com")
  - Campo "Senha" (placeholder: "********")
  - Botao "Entrar"

### 3. Preencher credenciais
- No campo E-mail, digite: evaldo.barbosa@gmail.com
- No campo Senha, digite: senha123

### 4. Submeter formulario
- Clique no botao "Entrar"

### 5. Verificar resultado
- SUCESSO: Redirecionado para /dashboard
- ERRO: Mensagem de erro aparece (qual mensagem?)

---

## Checklist de Verificacao:

[ ] A pagina de login carregou corretamente?
[ ] O campo de email aceitou o valor?
[ ] O campo de senha aceitou o valor?
[ ] O botao "Entrar" foi clicado?
[ ] Qual foi o resultado?
    [ ] Redirecionou para dashboard
    [ ] Mostrou erro (qual?)
    [ ] Ficou na mesma pagina sem mensagem
    [ ] Outro comportamento

---

## Credenciais de Teste:

Email: evaldo.barbosa@gmail.com
Senha: senha123
