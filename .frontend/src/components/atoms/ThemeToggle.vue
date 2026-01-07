<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { $theme, toggleTheme } from '@src/application/state/colaboradorState';

const theme = useStore($theme);
</script>

<template>
  <button 
    class="theme-toggle" 
    @click="toggleTheme" 
    :aria-label="`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`"
    :title="`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`"
  >
    <div class="icon-container" :class="{ 'is-dark': theme === 'dark' }">
      <!-- Sun Icon -->
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="icon sun" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      
      <!-- Moon Icon -->
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="icon moon" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </div>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: var(--bg-soft);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  color: var(--text-primary);
}

.theme-toggle:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary-soft);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.icon-container {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  position: absolute;
  width: 20px;
  height: 20px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.sun {
  opacity: 1;
  transform: rotate(0) scale(1);
}

.moon {
  opacity: 0;
  transform: rotate(90deg) scale(0);
}

.is-dark .sun {
  opacity: 0;
  transform: rotate(-90deg) scale(0);
}

.is-dark .moon {
  opacity: 1;
  transform: rotate(0) scale(1);
}

[data-theme='dark'] .theme-toggle {
  background: var(--bg-soft);
}

[data-theme='dark'] .theme-toggle:hover {
  background: var(--color-primary-light);
}
</style>
