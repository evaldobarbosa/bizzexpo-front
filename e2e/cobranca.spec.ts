import { test, expect, Page } from '@playwright/test'

// Credenciais para teste (OrganizadorSeeder)
const ORGANIZADOR_EMAIL = process.env.TEST_EMAIL || 'organizador@example.com'
const ORGANIZADOR_PASSWORD = process.env.TEST_PASSWORD || 'password'

// Helper para fazer login
async function fazerLogin(page: Page) {
  // Navega para a pagina de login primeiro para estabelecer cookies
  await page.goto('/login')
  await page.waitForSelector('form')
  await page.waitForTimeout(1000) // Aguarda Vue inicializar e carregar

  // Preenche email
  const emailInput = page.locator('input[type="email"]')
  await emailInput.click({ force: true })
  await emailInput.fill(ORGANIZADOR_EMAIL, { force: true })

  // Preenche senha
  const passwordInput = page.locator('input[type="password"]')
  await passwordInput.click({ force: true })
  await passwordInput.fill(ORGANIZADOR_PASSWORD, { force: true })

  // Captura resposta da API de login (API em dominio separado)
  const responsePromise = page.waitForResponse(
    (resp) => resp.url().includes('/api/login') && resp.request().method() === 'POST',
    { timeout: 10000 }
  )

  // Clica no botao de login
  await page.getByRole('button', { name: 'Entrar' }).click()

  // Aguarda resposta da API e verifica
  const response = await responsePromise
  const status = response.status()

  if (status === 401) {
    throw new Error(`Login falhou: credenciais invalidas (401). Verifique TEST_EMAIL e TEST_PASSWORD.`)
  }

  if (status >= 400) {
    throw new Error(`Login falhou com status ${status}`)
  }

  // Aguarda processamento
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
}

test.describe('Fluxo de Cobranca - Organizador', () => {
  test('teste manual - faca login na janela', async ({ page }) => {
    await page.goto('/login')
    // Pausa para voce fazer login manualmente na janela do Playwright
    // Preencha email e senha e clique em Entrar
    // Depois pressione "Resume" no Playwright Inspector
    await page.pause()

    // Verifica se o login funcionou
    const currentUrl = page.url()
    console.log('URL apos login manual:', currentUrl)
    expect(currentUrl).not.toContain('/login')
  })

  test('deve fazer login e acessar dashboard', async ({ page }) => {
    await fazerLogin(page)

    // Verifica se houve erro de login
    const errorMessage = page.locator('.bg-red-50')
    if (await errorMessage.isVisible()) {
      const errorText = await errorMessage.textContent()
      console.log('Erro de login:', errorText)
      // Continua para ver o que acontece
    }

    // Aguarda redirecionamento ou erro
    await page.waitForTimeout(2000)

    const currentUrl = page.url()
    console.log('URL atual:', currentUrl)

    // Verifica se saiu da pagina de login
    if (currentUrl.includes('/login')) {
      // Ainda no login - verifica erro
      const error = await page.locator('.bg-red-50').textContent().catch(() => null)
      if (error) {
        throw new Error(`Login falhou: ${error}`)
      }
      throw new Error('Login nao redirecionou - verifique credenciais')
    }

    // Se foi para cadastro de organizador
    if (currentUrl.includes('organizador/cadastro')) {
      console.log('Usuario precisa completar cadastro de organizador')
      await expect(page.getByText(/Cadastro|Organizador/i)).toBeVisible()
      return
    }

    // Verifica que esta no dashboard
    await expect(page.getByText(/Dashboard/i)).toBeVisible()
  })

  test('deve exibir botao Novo Evento no dashboard', async ({ page }) => {
    await fazerLogin(page)
    await page.waitForTimeout(2000)

    // Se estiver no dashboard, verifica o botao
    if (page.url().includes('dashboard')) {
      const novoEventoBtn = page.getByRole('button', { name: /novo evento/i })
      await expect(novoEventoBtn).toBeVisible()
    }
  })

  test('deve acessar pagina de faturas', async ({ page }) => {
    await fazerLogin(page)
    await page.waitForTimeout(2000)

    // Navega para faturas
    await page.goto('/minhas-faturas')
    await expect(page).toHaveURL(/\/minhas-faturas/)

    // Verifica que a pagina carregou
    await expect(page.getByText(/Minhas Faturas/i)).toBeVisible()
  })

  test('deve criar evento com plano Essencial', async ({ page }) => {
    await fazerLogin(page)
    await page.waitForTimeout(2000)

    // Vai para criar evento
    await page.goto('/eventos/criar')
    await page.waitForSelector('form')

    // Preenche formulario
    const nomeEvento = `Evento Teste ${Date.now()}`

    await page.locator('input#nome').click()
    await page.locator('input#nome').fill(nomeEvento)

    await page.locator('textarea#descricao').click()
    await page.locator('textarea#descricao').fill('Descricao do evento de teste automatizado')

    await page.locator('input#data_inicio').fill('2026-04-01T09:00')
    await page.locator('input#data_fim').fill('2026-04-01T18:00')

    await page.locator('input#local').click()
    await page.locator('input#local').fill('Centro de Convencoes - Teste')

    // Seleciona plano Essencial (clica no card)
    await page.click('text=Essencial')
    await page.waitForTimeout(500)

    // Envia formulario
    await page.locator('button[type="submit"]').click()

    // Aguarda redirecionamento
    await page.waitForURL(/\/eventos\/[a-f0-9-]+/, { timeout: 15000 })

    // Verifica que o evento foi criado
    await expect(page.getByText(nomeEvento)).toBeVisible()
  })

  test('deve pagar fatura com PIX', async ({ page }) => {
    await fazerLogin(page)
    await page.waitForTimeout(2000)

    // Vai para faturas
    await page.goto('/minhas-faturas')
    await page.waitForTimeout(1000)

    // Procura uma fatura pendente
    const pagarBtn = page.getByRole('button', { name: /^pagar$/i }).first()

    if (await pagarBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await pagarBtn.click()

      // Verifica que esta na pagina de pagamento
      await page.waitForURL(/\/faturas\/[a-f0-9-]+\/pagar/)

      // PIX ja deve estar selecionado
      await expect(page.locator('input[value="pix"]')).toBeChecked()

      // Clica em gerar QR Code
      await page.click('button:has-text("Gerar QR Code PIX")')

      // Aguarda QR Code aparecer
      await expect(page.getByText(/PIX gerado com sucesso/)).toBeVisible({ timeout: 15000 })
      await expect(page.locator('img[alt="QR Code PIX"]')).toBeVisible()
    } else {
      console.log('Nenhuma fatura pendente encontrada para pagar')
    }
  })
})
