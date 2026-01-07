<script setup lang="ts">
import CurrencyText from '../atoms/CurrencyText.vue';

interface Props {
  label: string;
  value: number | null | undefined;
}

defineProps<Props>();
</script>

<template>
  <div class="summary-badge">
    <span class="summary-badge-label">{{ label }}</span>
    <CurrencyText :value="value" class="summary-badge-value" />
  </div>
</template>

<style scoped>
.summary-badge {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: var(--bg-soft);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  min-width: 160px;
}

.summary-badge-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.summary-badge-value {
  font-size: 1.125rem;
  color: var(--color-primary);
}
</style>
