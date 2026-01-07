<script setup lang="ts">
import { Money3Component } from 'v-money3';

interface Props {
  label?: string;
  modelValue: number | string | null;
  hint?: string;
  id?: string;
}

defineProps<Props>();
defineEmits(['update:modelValue']);

const moneyConfig = {
  masked: false,
  prefix: '$ ',
  suffix: '',
  thousands: '.',
  decimal: ',',
  precision: 0,
  disableNegative: true,
  disabled: false,
  min: null,
  max: null,
  allowBlank: true,
  minimumFractionDigits: 0,
};
</script>

<template>
  <div class="money-input-wrapper">
    <label v-if="label" :for="id" class="money-input-label">{{ label }}</label>
    <div class="money-input-container">
      <Money3Component
        :id="id"
        class="money-input"
        type="tel"
        :model-value="modelValue ?? 0"
        v-bind="moneyConfig"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
    <span v-if="hint" class="money-input-hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.money-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.money-input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.money-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

:deep(.money-input) {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
}

:deep(.money-input:focus) {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.money-input-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
