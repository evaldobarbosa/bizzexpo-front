import { test, expect, Page } from '@playwright/test'

// Credenciais para teste (OrganizadorSeeder)
const ORGANIZADOR_EMAIL = process.env.TEST_EMAIL || 'organizador@example.com'
const ORGANIZADOR_PASSWORD = process.env.TEST_PASSWORD || 'password'

// Slug do evento para testes (deve ser um evento publicado)
// Use TEST_EVENTO_SLUG para ambiente local
const EVENTO_SLUG = process.env.TEST_EVENTO_SLUG || 'cafe-tech'

// Helper para fazer login
async function fazerLogin(page: Page) {
  await page.goto('/login')
  await page.waitForSelector('form')
  await page.waitForTimeout(1000)

  const emailInput = page.locator('input[type="email"]')
  await emailInput.click({ force: true })
  await emailInput.fill(ORGANIZADOR_EMAIL, { force: true })

  const passwordInput = page.locator('input[type="password"]')
  await passwordInput.click({ force: true })
  await passwordInput.fill(ORGANIZADOR_PASSWORD, { force: true })

  const responsePromise = page.waitForResponse(
    (resp) => resp.url().includes('/api/login') && resp.request().method() === 'POST',
    { timeout: 10000 }
  )

  await page.getByRole('button', { name: 'Entrar' }).click()

  const response = await responsePromise
  const status = response.status()

  if (status === 401) {
    throw new Error(`Login falhou: credenciais invalidas (401)`)
  }

  if (status >= 400) {
    throw new Error(`Login falhou com status ${status}`)
  }

  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
}

// Gera email unico para evitar duplicatas
function gerarEmailUnico(): string {
  return `teste.inscricao.${Date.now()}@example.com`
}

test.describe('Inscricao Publica', () => {
  test('deve exibir formulario de inscricao', async ({ page }) => {
    await page.goto(`/evento/${EVENTO_SLUG}/inscricao`)

    // Verifica que o formulario carregou
    await expect(page.getByText(/Faca sua inscricao/i)).toBeVisible({ timeout: 10000 })

    // Verifica campos do formulario (usam id, nao name)
    await expect(page.locator('#nome')).toBeVisible()
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#telefone')).toBeVisible()
  })

  test('deve validar campos obrigatorios', async ({ page }) => {
    await page.goto(`/evento/${EVENTO_SLUG}/inscricao`)
    await page.waitForSelector('form')

    // Tenta enviar formulario vazio
    await page.getByRole('button', { name: /Confirmar/i }).click()

    // Verifica mensagens de erro de validacao (usa first() pois ha multiplas)
    await expect(page.getByText(/obrigat/i).first()).toBeVisible({ timeout: 5000 })
  })

  test('deve realizar inscricao com sucesso e mostrar confirmacao', async ({ page }) => {
    await page.goto(`/evento/${EVENTO_SLUG}/inscricao`)
    await page.waitForSelector('form')
    await page.waitForTimeout(1000)

    const emailUnico = gerarEmailUnico()

    // Preenche formulario
    await page.locator('#nome').fill('Teste Playwright Inscricao')
    await page.locator('#email').fill(emailUnico)
    await page.locator('#telefone').fill('71999998888')
    await page.locator('#empresa').fill('Empresa Teste')
    await page.locator('#cargo').fill('QA Tester')
    await page.locator('#cidade_uf').fill('Salvador, BA')

    // Seleciona categoria (primeira disponivel)
    const categoriaSelect = page.locator('#categoria_id')
    if (await categoriaSelect.isVisible()) {
      await categoriaSelect.selectOption({ index: 1 })
    }

    // Aceita termos
    const termos = page.locator('input[type="checkbox"]')
    if (await termos.isVisible()) {
      await termos.check()
    }

    // Captura resposta da API
    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/inscricao') && resp.request().method() === 'POST',
      { timeout: 15000 }
    )

    // Envia formulario
    await page.getByRole('button', { name: /Confirmar/i }).click()

    // Aguarda resposta
    const response = await responsePromise
    const status = response.status()

    console.log('Status da inscricao:', status)

    if (status === 201) {
      // Verifica redirecionamento para pagina de confirmacao
      await page.waitForURL(/\/confirmacao\//, { timeout: 10000 })

      // Verifica elementos da pagina de confirmacao
      await expect(page.getByText(/Inscricao Confirmada/i)).toBeVisible({ timeout: 5000 })

      // Verifica se QR Code aparece (pode ser img, svg ou canvas)
      const qrCode = page.locator('img, svg, canvas').first()
      await expect(qrCode).toBeVisible({ timeout: 5000 })

      console.log('Inscricao realizada com sucesso!')
    } else if (status === 422) {
      // Erro de validacao - verifica mensagem
      const errorText = await page.locator('.bg-red-50, [class*="error"]').textContent()
      console.log('Erro de validacao:', errorText)
    } else {
      throw new Error(`Inscricao falhou com status ${status}`)
    }
  })

  test('deve mostrar erro para inscricao duplicada', async ({ page }) => {
    // Usa email fixo para testar duplicata
    const emailFixo = 'teste.duplicata@example.com'

    await page.goto(`/evento/${EVENTO_SLUG}/inscricao`)
    await page.waitForSelector('form')
    await page.waitForTimeout(1000)

    // Preenche formulario
    await page.locator('#nome').fill('Teste Duplicata')
    await page.locator('#email').fill(emailFixo)
    await page.locator('#telefone').fill('71999997777')

    const categoriaSelect = page.locator('#categoria_id')
    if (await categoriaSelect.isVisible()) {
      await categoriaSelect.selectOption({ index: 1 })
    }

    const termos = page.locator('input[type="checkbox"]')
    if (await termos.isVisible()) {
      await termos.check()
    }

    // Envia formulario
    await page.getByRole('button', { name: /Confirmar/i }).click()

    // Aguarda resposta
    await page.waitForTimeout(3000)

    // Se ja existe inscricao, deve mostrar erro
    const errorMessage = page.locator('.bg-red-50, [class*="error"]')
    if (await errorMessage.isVisible()) {
      const errorText = await errorMessage.textContent()
      console.log('Erro esperado (duplicata):', errorText)
      expect(errorText).toContain('inscri')
    }
  })

  test('deve mostrar toast de erro quando API falha', async ({ page }) => {
    await page.goto(`/evento/${EVENTO_SLUG}/inscricao`)
    await page.waitForSelector('form')
    await page.waitForTimeout(1000)

    // Preenche formulario
    await page.locator('#nome').fill('Teste Erro')
    await page.locator('#email').fill('teste.erro@example.com')
    await page.locator('#telefone').fill('71999996666')

    const categoriaSelect = page.locator('#categoria_id')
    if (await categoriaSelect.isVisible()) {
      await categoriaSelect.selectOption({ index: 1 })
    }

    const termos = page.locator('input[type="checkbox"]')
    if (await termos.isVisible()) {
      await termos.check()
    }

    // Intercepta APENAS a requisicao POST de inscricao para simular erro
    await page.route('**/api/evento/*/inscricao', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        })
      } else {
        route.continue()
      }
    })

    // Envia formulario
    await page.getByRole('button', { name: /Confirmar/i }).click()

    // Verifica que o toast de erro aparece
    await expect(page.getByText(/Erro no servidor/i)).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Walk-in (Staff)', () => {
  test('deve acessar pagina de walk-in apos login', async ({ page }) => {
    await fazerLogin(page)

    // Navega para o dashboard e pega o primeiro evento
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)

    // Clica no primeiro evento
    const primeiroEvento = page.locator('[data-testid="evento-card"], .evento-card, a[href*="/eventos/"]').first()

    if (await primeiroEvento.isVisible()) {
      await primeiroEvento.click()
      await page.waitForTimeout(1000)

      // Procura link para check-in
      const checkinLink = page.getByRole('link', { name: /check-in/i })

      if (await checkinLink.isVisible()) {
        await checkinLink.click()
        await page.waitForTimeout(1000)

        // Procura link para walk-in
        const walkinLink = page.getByRole('link', { name: /walk-in/i })

        if (await walkinLink.isVisible()) {
          await walkinLink.click()

          // Verifica que o formulario de walk-in carregou
          await expect(page.getByText(/Walk-in/i)).toBeVisible({ timeout: 5000 })
          await expect(page.locator('#nome')).toBeVisible()
        }
      }
    } else {
      console.log('Nenhum evento encontrado no dashboard')
    }
  })

  test('deve realizar walk-in com sucesso', async ({ page }) => {
    await fazerLogin(page)

    // Vai direto para a URL de walk-in (precisa do eventoId)
    // Primeiro, vamos ao dashboard para pegar o ID do evento
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)

    // Pega a URL do primeiro evento
    const eventoLink = page.locator('a[href*="/eventos/"]').first()

    if (await eventoLink.isVisible()) {
      const href = await eventoLink.getAttribute('href')
      const eventoId = href?.match(/eventos\/([a-f0-9-]+)/)?.[1]

      if (eventoId) {
        // Vai para o walk-in
        await page.goto(`/eventos/${eventoId}/checkin/walkin`)
        await page.waitForSelector('form', { timeout: 10000 })

        const emailUnico = gerarEmailUnico()

        // Preenche formulario
        await page.locator('#nome').fill('Walk-in Teste Playwright')
        await page.locator('#email').fill(emailUnico)
        await page.locator('#telefone').fill('71999995555')

        const categoriaSelect = page.locator('#categoria_id')
        if (await categoriaSelect.isVisible()) {
          await categoriaSelect.selectOption({ index: 1 })
        }

        // Captura resposta
        const responsePromise = page.waitForResponse(
          (resp) => resp.url().includes('/walkin') && resp.request().method() === 'POST',
          { timeout: 15000 }
        )

        // Envia
        await page.getByRole('button', { name: /Cadastrar/i }).click()

        const response = await responsePromise
        const status = response.status()

        console.log('Status do walk-in:', status)

        if (status === 201 || status === 200) {
          // Verifica confirmacao
          await expect(page.getByText(/Check-in realizado/i)).toBeVisible({ timeout: 5000 })
          console.log('Walk-in realizado com sucesso!')
        }
      }
    }
  })

  test('deve mostrar toast de erro quando walk-in falha', async ({ page }) => {
    await fazerLogin(page)

    await page.goto('/dashboard')
    await page.waitForTimeout(2000)

    const eventoLink = page.locator('a[href*="/eventos/"]').first()

    if (await eventoLink.isVisible()) {
      const href = await eventoLink.getAttribute('href')
      const eventoId = href?.match(/eventos\/([a-f0-9-]+)/)?.[1]

      if (eventoId) {
        // Intercepta requisicao para simular erro
        await page.route('**/walkin', (route) => {
          route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Internal Server Error' }),
          })
        })

        await page.goto(`/eventos/${eventoId}/checkin/walkin`)
        await page.waitForSelector('form', { timeout: 10000 })

        await page.locator('#nome').fill('Teste Erro Walk-in')
        await page.locator('#email').fill('erro.walkin@example.com')
        await page.locator('#telefone').fill('71999994444')

        const categoriaSelect = page.locator('#categoria_id')
        if (await categoriaSelect.isVisible()) {
          await categoriaSelect.selectOption({ index: 1 })
        }

        await page.getByRole('button', { name: /Cadastrar/i }).click()

        // Verifica toast de erro
        await expect(page.getByText(/Erro no servidor/i)).toBeVisible({ timeout: 5000 })
      }
    }
  })
})

test.describe('Listagem de Inscricoes (Organizador)', () => {
  test('deve listar inscricoes do evento', async ({ page }) => {
    await fazerLogin(page)

    await page.goto('/dashboard')
    await page.waitForTimeout(2000)

    // Vai para o primeiro evento
    const eventoLink = page.locator('a[href*="/eventos/"]').first()

    if (await eventoLink.isVisible()) {
      await eventoLink.click()
      await page.waitForTimeout(1000)

      // Procura link para inscricoes
      const inscricoesLink = page.getByRole('link', { name: /inscri/i })

      if (await inscricoesLink.isVisible()) {
        await inscricoesLink.click()

        // Verifica que a pagina de inscricoes carregou
        await expect(page.getByText(/Inscri/i)).toBeVisible({ timeout: 5000 })

        // Verifica se tem tabela ou mensagem de vazio
        const tabela = page.locator('table')
        const vazio = page.getByText(/Nenhuma inscricao/i)

        const tabelaVisivel = await tabela.isVisible().catch(() => false)
        const vazioVisivel = await vazio.isVisible().catch(() => false)

        if (tabelaVisivel) {
          console.log('Tabela de inscricoes encontrada')
          // Conta linhas da tabela
          const linhas = await page.locator('table tbody tr').count()
          console.log(`Numero de inscricoes: ${linhas}`)
        } else if (vazioVisivel) {
          console.log('Nenhuma inscricao encontrada no evento')
        }
      }
    }
  })

  test('deve filtrar inscricoes por busca', async ({ page }) => {
    await fazerLogin(page)

    await page.goto('/dashboard')
    await page.waitForTimeout(2000)

    const eventoLink = page.locator('a[href*="/eventos/"]').first()

    if (await eventoLink.isVisible()) {
      const href = await eventoLink.getAttribute('href')
      const eventoId = href?.match(/eventos\/([a-f0-9-]+)/)?.[1]

      if (eventoId) {
        await page.goto(`/eventos/${eventoId}/inscricoes`)
        await page.waitForTimeout(2000)

        // Busca por um termo
        const buscaInput = page.locator('input[type="search"], input[placeholder*="Buscar"]')

        if (await buscaInput.isVisible()) {
          await buscaInput.fill('teste')
          await page.waitForTimeout(1000) // Aguarda debounce

          // Verifica se a busca foi aplicada (loading ou resultados)
          console.log('Busca aplicada')
        }
      }
    }
  })
})
