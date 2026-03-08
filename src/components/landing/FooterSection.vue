<script setup lang="ts">
import BrandLogo from '@/components/ui/BrandLogo.vue'
</script>

<template>
  <footer class="bg-slate-900 text-slate-400 py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
        <div class="col-span-2 md:col-span-1">
          <div class="mb-6">
            <BrandLogo size="md" variant="light" />
          </div>
          <p class="text-sm leading-relaxed mb-6">
            Lider em tecnologia para eventos e feiras na America Latina. Inteligencia para o seu negocio.
          </p>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Produto</h4>
          <ul class="space-y-4 text-sm">
            <li><a class="hover:text-white transition-colors" href="#">Funcionalidades</a></li>
            <li><a class="hover:text-white transition-colors" href="#">Check-in Online</a></li>
            <li><a class="hover:text-white transition-colors" href="#">Totens Autoatendimento</a></li>
            <li><a class="hover:text-white transition-colors" href="#">Leads App</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Empresa</h4>
          <ul class="space-y-4 text-sm">
            <li><a class="hover:text-white transition-colors" href="#">Sobre Nos</a></li>
            <li><a class="hover:text-white transition-colors" href="#">Blog</a></li>
            <li><a class="hover:text-white transition-colors" href="#">Carreiras</a></li>
            <li><a class="hover:text-white transition-colors" href="#">Contato</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Suporte</h4>
          <ul class="space-y-4 text-sm">
            <li><a class="hover:text-white transition-colors" href="#">Centro de Ajuda</a></li>
            <li><a class="hover:text-white transition-colors" href="#">API Docs</a></li>
            <li><a class="hover:text-white transition-colors" href="#">Status</a></li>
            <li><a class="hover:text-white transition-colors" href="#">Privacidade</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>2024 BizzExpo Tecnologia Ltda. Todos os direitos reservados.</p>
        <div class="flex gap-6">
          <a class="hover:text-white" href="#">Termos de Uso</a>
          <a class="hover:text-white" href="#">Politica de Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>
