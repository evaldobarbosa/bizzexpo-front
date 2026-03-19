// Tipos base
export interface User {
  id: string
  name: string
  email: string
  roles: string[]
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Organizador {
  id: string
  telefone: string
  empresa: string
  cnpj: string
  cargo?: string
  created_at: string
  updated_at: string
}

export interface Expositor {
  id: string
  nome_empresa: string
  cnpj?: string
  nome_contato: string
  email_contato: string
  telefone: string
  site?: string
  redes_sociais?: Record<string, string>
  logo?: string
  descricao?: string
}

export interface Participante extends User {
  telefone: string
  empresa?: string
  cargo?: string
  cidade_uf?: string
}

export interface Evento {
  id: string
  organizador_id: string
  nome: string
  slug: string
  descricao: string
  data_inicio: string
  data_fim: string
  local: string
  logo?: string
  banner?: string
  status: 'rascunho' | 'pago' | 'publicado' | 'encerrado'
  created_at: string
  updated_at: string
  expositores_count?: number
}

export interface Categoria {
  id: string
  evento_id: string
  nome: string
  descricao?: string
}

export interface Estande {
  id: string
  expositor_id: string
  nome: string
  localizacao?: string
  qrcode: string
}

export interface Inscricao {
  id: string
  evento_id: string
  participante_id: string
  categoria_id: string
  qrcode: string
  checkin_at?: string
  created_at: string
}

export interface Lead {
  id: string
  estande_id: string
  participante_id: string
  nivel_interesse: 'orcamento' | 'profissional' | 'entusiasta' | 'conhecendo'
  created_at: string
}

export interface Staff {
  id: string
  evento_id: string
  user_id: string
  user?: User
  created_at: string
}

export interface DashboardMetrics {
  total_eventos: number
  eventos_ativos: number
  total_expositores: number
  total_participantes: number
  total_leads: number
  total_checkins: number
  taxa_conversao: number
  eventos_recentes: Evento[]
}

export interface RankingExpositor {
  expositor: {
    id: string
    nome_empresa: string
  }
  total_leads: number
}

export interface HorarioPico {
  hora: string
  total_checkins: number
}

// Formulário de inscrição
export interface InscricaoForm {
  nome: string
  email: string
  telefone: string
  empresa?: string
  cargo?: string
  cidade_uf?: string
  categoria_id: string
  aceite_termos: boolean
}

// Evento público com dados completos
export interface EventoPublico {
  id: string
  nome: string
  slug: string
  descricao: string
  data_inicio: string
  data_fim: string
  local: string
  logo?: string
  banner?: string
  status: string
  categorias: Array<{
    id: string
    nome: string
    descricao?: string
  }>
  expositores: Array<{
    id: string
    nome_empresa: string
    logo?: string
    descricao?: string
  }>
  total_inscricoes: number
}

// Expositor público com estandes
export interface ExpositorPublico {
  id: string
  nome_empresa: string
  logo?: string
  descricao?: string
  site?: string
  redes_sociais?: Record<string, string>
  estandes: Array<{
    id: string
    nome: string
    localizacao?: string
  }>
}

// Inscrição com participante
export interface InscricaoCompleta {
  id: string
  qrcode: string
  participante: {
    id: string
    nome: string
    email: string
    telefone?: string
    empresa?: string
    cargo?: string
  }
  categoria: {
    id: string
    nome: string
  }
  evento?: {
    id: string
    nome: string
    slug: string
  }
  checkin_at?: string
  cancelado_em?: string
  created_at: string
}

// Dashboard do expositor
export interface DashboardExpositor {
  expositor: {
    id: string
    nome_empresa: string
    logo?: string
  }
  evento: {
    id: string
    nome: string
    data_inicio: string
    data_fim: string
  }
  metricas: {
    total_leads: number
    leads_hoje: number
    leads_por_interesse: Array<{
      nivel: string
      label: string
      total: number
      prioridade: number
    }>
  }
}

// Lead completo
export interface LeadCompleto {
  id: string
  participante: {
    id: string
    nome: string
    email: string
    telefone?: string
    empresa?: string
    cargo?: string
    cidade_uf?: string
  }
  estande: {
    id: string
    nome: string
    localizacao?: string
  }
  nivel_interesse: string
  nivel_interesse_label: string
  prioridade: number
  created_at: string
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}
