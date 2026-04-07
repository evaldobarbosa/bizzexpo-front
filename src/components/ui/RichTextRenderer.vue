<script setup lang="ts">
import { computed } from 'vue'
import DOMPurify from 'dompurify'

interface Props {
  content: string
  class?: string
}

const props = defineProps<Props>()

interface EditorBlock {
  type: string
  data: Record<string, unknown>
}

interface EditorData {
  blocks: EditorBlock[]
}

// Tipos de bloco permitidos
const ALLOWED_BLOCK_TYPES = ['paragraph', 'header', 'list', 'quote', 'delimiter']

// Configuracao do DOMPurify
const purifyConfig = {
  ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'a', 'code', 'br'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  ALLOW_DATA_ATTR: false,
}

// Sanitiza texto usando DOMPurify
function sanitizeText(text: string): string {
  if (!text) return ''
  return DOMPurify.sanitize(text, purifyConfig)
}

// Tenta parsear o conteudo como JSON do Editor.js
const parsedContent = computed(() => {
  if (!props.content) return null

  try {
    const data = JSON.parse(props.content) as EditorData
    if (data.blocks && Array.isArray(data.blocks)) {
      // Filtra apenas blocos permitidos
      const filteredBlocks = data.blocks.filter((block) =>
        ALLOWED_BLOCK_TYPES.includes(block.type)
      )
      return { ...data, blocks: filteredBlocks }
    }
    return null
  } catch {
    // Nao e JSON, retorna null para renderizar como texto simples
    return null
  }
})

// Verifica se e conteudo do Editor.js
const isEditorContent = computed(() => parsedContent.value !== null)

// Renderiza texto com formatacao inline (sanitizado)
function renderInlineFormatting(text: string): string {
  if (!text) return ''

  // Primeiro sanitiza o HTML existente
  let result = sanitizeText(text)

  // Adiciona classes aos links
  result = result.replace(
    /<a /g,
    '<a class="text-primary hover:underline" target="_blank" rel="noopener noreferrer" '
  )

  // Adiciona classes ao code
  result = result.replace(/<code>/g, '<code class="inline-code">')

  return result
}
</script>

<template>
  <div :class="['rich-text-renderer', props.class]">
    <!-- Conteudo do Editor.js -->
    <template v-if="isEditorContent && parsedContent">
      <template v-for="(block, index) in parsedContent.blocks" :key="index">
        <!-- Paragrafo -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p
          v-if="block.type === 'paragraph'"
          class="mb-4 last:mb-0"
          v-html="renderInlineFormatting(block.data.text as string)"
        />

        <!-- Header H2 -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <h2
          v-else-if="block.type === 'header' && block.data.level === 2"
          class="text-2xl font-bold mb-3"
          v-html="renderInlineFormatting(block.data.text as string)"
        />

        <!-- Header H3 -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <h3
          v-else-if="block.type === 'header' && block.data.level === 3"
          class="text-xl font-bold mb-3"
          v-html="renderInlineFormatting(block.data.text as string)"
        />

        <!-- Header H4 -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <h4
          v-else-if="block.type === 'header' && (block.data.level === 4 || !block.data.level)"
          class="text-lg font-bold mb-3"
          v-html="renderInlineFormatting(block.data.text as string)"
        />

        <!-- Lista ordenada -->
        <ol
          v-else-if="block.type === 'list' && block.data.style === 'ordered'"
          class="mb-4 last:mb-0 pl-6 list-decimal"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <li
            v-for="(item, itemIndex) in (block.data.items as string[])"
            :key="itemIndex"
            class="mb-1 last:mb-0"
            v-html="renderInlineFormatting(item)"
          />
        </ol>

        <!-- Lista nao ordenada -->
        <ul
          v-else-if="block.type === 'list'"
          class="mb-4 last:mb-0 pl-6 list-disc"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <li
            v-for="(item, itemIndex) in (block.data.items as string[])"
            :key="itemIndex"
            class="mb-1 last:mb-0"
            v-html="renderInlineFormatting(item)"
          />
        </ul>

        <!-- Citacao -->
        <blockquote
          v-else-if="block.type === 'quote'"
          class="mb-4 last:mb-0 border-l-4 border-primary pl-4 italic"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="renderInlineFormatting(block.data.text as string)" />
          <cite v-if="block.data.caption" class="block mt-2 text-sm text-gray-500 not-italic">
            — {{ block.data.caption }}
          </cite>
        </blockquote>

        <!-- Delimitador -->
        <hr v-else-if="block.type === 'delimiter'" class="my-6 border-gray-200" />

        <!-- Fallback para tipos desconhecidos -->
        <p v-else class="mb-4 last:mb-0 text-gray-600">
          {{ block.data.text || '' }}
        </p>
      </template>
    </template>

    <!-- Texto simples (fallback) -->
    <p v-else class="whitespace-pre-wrap">{{ content }}</p>
  </div>
</template>

<style scoped>
.rich-text-renderer :deep(.inline-code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, monospace;
  font-size: 0.875em;
}
</style>
