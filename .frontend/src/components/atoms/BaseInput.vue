<script setup lang="ts">
import { nextTick } from 'vue';

interface Props {
  label?: string;
  modelValue: string | number | null;
  type?: string;
  placeholder?: string;
  hint?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
});

const emit = defineEmits(['update:modelValue', 'enter']);

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update:modelValue', input.value);

  nextTick(() => {
    const propValueStr = props.modelValue === null || props.modelValue === undefined ? '' : String(props.modelValue);
    if (input.value !== propValueStr) {
      input.value = propValueStr;
    }
  });
};
</script>

<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="id" class="base-input-label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="base-input"
      @input="handleInput"
      @keyup.enter="$emit('enter')"
    />
    <span v-if="hint" class="base-input-hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.base-input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.base-input {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.base-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.base-input::placeholder {
  color: var(--text-muted);
}

.base-input-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
