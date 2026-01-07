<script setup lang="ts">
import BaseInput from '../atoms/BaseInput.vue';
import MoneyInput from '../atoms/MoneyInput.vue';

interface Props {
  label: string;
  modelValue: string | number | null;
  type?: 'text' | 'number' | 'tel' | 'money';
  placeholder?: string;
  hint?: string;
  id?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
});

defineEmits(['update:modelValue', 'enter']);
</script>

<template>
  <div class="form-field">
    <MoneyInput
      v-if="type === 'money'"
      :id="id"
      :label="label"
      :model-value="modelValue"
      :hint="hint"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <BaseInput
      v-else
      :id="id"
      :label="label"
      :type="type"
      :model-value="modelValue"
      :placeholder="placeholder"
      :hint="hint"
      @update:model-value="$emit('update:modelValue', $event)"
      @enter="$emit('enter')"
    />
  </div>
</template>

<style scoped>
.form-field {
  width: 100%;
}
</style>
