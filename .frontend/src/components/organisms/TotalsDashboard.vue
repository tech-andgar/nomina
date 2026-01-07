<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { $colaboradoresTotal } from '@src/application/state/colaboradorState';
import SummaryBadge from '../molecules/SummaryBadge.vue';

const totals = useStore($colaboradoresTotal);
</script>

<template>
  <div v-if="totals" class="totals-dashboard card">
    <h2 class="text-h6 text-primary dashboard-title">Resumen de Nómina Total</h2>
    <div class="dashboard-grid">
      <SummaryBadge label="Total Devengado" :value="totals.totalDevengado" />
      <SummaryBadge label="Total Deducido" :value="totals.totalDeducido" />
      <SummaryBadge label="Parafiscales" :value="totals.totalParafiscales" />
      <SummaryBadge label="Prestaciones" :value="totals.totalPrestaciones" />
      <SummaryBadge label="Neto a Pagar" :value="totals.totalNeto" class="highlight-neto" />
      <SummaryBadge label="COSTO TOTAL" :value="totals.totalNomina" class="highlight-total" />
    </div>
  </div>
</template>

<style scoped>
.totals-dashboard {
  padding: 1.5rem;
}

.dashboard-title {
  margin-bottom: 1.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.highlight-neto :deep(.summary-badge-value) {
  color: var(--color-success);
}

.highlight-total :deep(.summary-badge-value) {
  font-size: 1.25rem;
  font-weight: 800;
}
</style>
