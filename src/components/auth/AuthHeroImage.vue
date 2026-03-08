<script setup lang="ts">
// Componente de imagem hero para telas de autenticacao
interface Props {
  imageUrl?: string
  alt?: string
}

withDefaults(defineProps<Props>(), {
  imageUrl:
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  alt: 'Conferencia de negocios profissional',
})
</script>

<template>
  <div class="w-full overflow-hidden bg-slate-200 dark:bg-slate-800 aspect-[16/9] rounded-xl shadow-sm">
    <div
      class="w-full h-full bg-center bg-no-repeat bg-cover"
      :style="{ backgroundImage: `url('${imageUrl}')` }"
      role="img"
      :aria-label="alt"
    />
  </div>
</template>
