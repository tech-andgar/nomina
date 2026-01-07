<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value: number | null | undefined;
}

const props = defineProps<Props>();

const formatted = computed(() => {
  if (props.value === null || props.value === undefined) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(props.value);
});
</script>

<template>
  <span class="currency-text">{{ formatted }}</span>
</template>

<style scoped>
.currency-text {
  font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
  font-weight: 600;
}
</style>
