<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'primary',
  disabled: false,
});

defineEmits(['click']);
</script>

<template>
  <button
    :class="['base-button', `base-button--${type}`]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  gap: 0.5rem;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button--primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  box-shadow: 0 4px 12px var(--color-primary-soft);
}

.base-button--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px var(--color-primary-soft);
}

.base-button--secondary {
  background: var(--bg-surface);
  color: var(--color-secondary);
  border: 1px solid var(--border-color);
}

.base-button--secondary:hover:not(:disabled) {
  background: var(--bg-hover);
}

.base-button--ghost {
  background: transparent;
  color: var(--text-secondary);
}

.base-button--ghost:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
}
</style>
