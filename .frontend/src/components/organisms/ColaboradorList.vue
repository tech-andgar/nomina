<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { $colaboradores, editColaborador, deleteColaborador } from '@src/application/state/colaboradorState';
import CurrencyText from '../atoms/CurrencyText.vue';

const colaboradores = useStore($colaboradores);
</script>

<template>
  <div class="colaborador-list">
    <h2 class="text-h6 text-primary list-title">Resultados Detallados ({{ colaboradores.length }})</h2>
    
    <div v-if="colaboradores.length === 0" class="empty-state card">
      No hay colaboradores registrados. Complete el formulario para ver los resultados.
    </div>

    <div v-else class="list-container">
      <div v-for="(c, idx) in colaboradores" :key="idx" class="colaborador-card card animate-in">
        <div class="card-header">
          <div class="user-info">
            <div class="name-row">
              <span class="user-name">{{ c.nombre }}</span>
              <span class="badge" :class="c.tipoContrato.toLowerCase()">{{ c.tipoContrato }}</span>
              <span v-if="c.tipoContrato === 'LABORAL'" class="badge risk">Riesgo {{ c.riesgoARL }}</span>
            </div>
            <div class="sub-info">
              <span class="user-id">ID: {{ c.cedula }}</span>
              <span v-if="c.tipoContrato === 'INDEPENDIENTE' && c.actividadEconomica" class="activity">
                • {{ c.actividadEconomica.replace(/_/g, ' ') }}
              </span>
            </div>
          </div>
          <div class="header-right">
            <div class="card-actions">
              <button class="action-btn edit" @click="editColaborador(idx)" title="Editar Colaborador">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="action-btn delete" @click="deleteColaborador(idx)" title="Eliminar Colaborador">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
            <div class="net-value">
              <span class="label">Neto:</span>
              <CurrencyText :value="c.totalNeto" class="value" />
            </div>
          </div>
        </div>

        <div class="card-details">
          <!-- Devengado Section -->
          <div class="detail-section">
            <span class="section-label">Devengado</span>
            <div class="detail-row sub-detail">
              <span>Sueldo Base</span>
              <CurrencyText :value="c.sueldo" />
            </div>
            <div class="detail-row sub-detail">
              <span>Valor Hora Ord.</span>
              <CurrencyText :value="c.valorHoraOrdinaria" />
            </div>
            <div class="detail-row sub-detail">
              <span>Días Trabajados</span>
              <span class="mono">{{ c.diasTrabajados }}</span>
            </div>
            <div class="detail-row">
              <span>Básico</span>
              <CurrencyText :value="c.devengado.sueldoBasico" />
            </div>
            
            <!-- Extras Breakdown -->
            <div class="extras-group">
              <div class="detail-row sub-detail">
                <span>H.E. Diurna</span>
                <CurrencyText :value="c.devengado.valorExtras.diurna" />
              </div>
              <div class="detail-row sub-detail">
                <span>H.E. Nocturna</span>
                <CurrencyText :value="c.devengado.valorExtras.nocturna" />
              </div>
              <div class="detail-row sub-detail">
                <span>H.E. Domingos</span>
                <CurrencyText :value="c.devengado.valorExtras.domingos" />
              </div>
              <div class="detail-row sub-detail">
                <span>H.E. Noct. Dom.</span>
                <CurrencyText :value="c.devengado.valorExtras.nocturnaDomingos" />
              </div>
              <div class="detail-row sub-detail">
                <span>Recargo Noct.</span>
                <CurrencyText :value="c.devengado.valorExtras.recargoNocturno" />
              </div>
              <div class="detail-row">
                <span>Total Extras</span>
                <CurrencyText :value="c.devengado.totalValorExtras" />
              </div>
            </div>

            <div class="detail-row">
              <span>Aux. Transporte</span>
              <CurrencyText :value="c.auxTransporte" />
            </div>
            <div class="detail-row highlight dev-high">
              <span>Total Devengado</span>
              <CurrencyText :value="c.devengado.totalDevengado" />
            </div>
          </div>

          <!-- Deducido Section -->
          <div class="detail-section">
            <span class="section-label">Deducido</span>
            <div class="detail-row">
              <span>Salud Colaborador</span>
              <CurrencyText :value="c.deducido.salud" />
            </div>
            <div class="detail-row">
              <span>Pensión</span>
              <CurrencyText :value="c.deducido.pension" />
            </div>
            <div class="detail-row">
              <span>Fondo Solidaridad</span>
              <CurrencyText :value="c.deducido.fondoSolidaridad" />
            </div>
            <div class="detail-row sub-detail">
              <span>Base UVT</span>
              <span class="mono">{{ c.deducido.uvt?.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span>Retefuente</span>
              <CurrencyText :value="c.deducido.retefuente" />
            </div>
            <div class="detail-row highlight ded-high">
              <span>Total Deducido</span>
              <CurrencyText :value="c.deducido.totalDeducido" />
            </div>
          </div>

          <!-- Parafiscales Section -->
          <div class="detail-section">
            <span class="section-label">Parafiscales & SS Empleador</span>
            <div class="detail-row">
              <span>S.S. Salud</span>
              <CurrencyText :value="c.parafiscales.salud" />
            </div>
            <div class="detail-row">
              <span>S.S. Pensión</span>
              <CurrencyText :value="c.parafiscales.pension" />
            </div>
            <div class="detail-row">
              <span>ARL</span>
              <CurrencyText :value="c.parafiscales.arl" />
            </div>
            <div class="detail-row">
              <span>SENA</span>
              <CurrencyText :value="c.parafiscales.sena" />
            </div>
            <div class="detail-row">
              <span>ICBF</span>
              <CurrencyText :value="c.parafiscales.icbf" />
            </div>
            <div class="detail-row">
              <span>Cajas Compensación</span>
              <CurrencyText :value="c.parafiscales.cajas" />
            </div>
            <div class="detail-row highlight emp-high">
              <span>Costo Prestacional</span>
              <CurrencyText :value="(c.parafiscales.totalParafiscales || 0) + (c.parafiscales.salud || 0) + (c.parafiscales.pension || 0) + (c.parafiscales.arl || 0)" />
            </div>
          </div>

          <!-- Prestaciones Section -->
          <div class="detail-section">
            <span class="section-label">Prestaciones Sociales</span>
            <div class="detail-row">
              <span>Prima Servicios</span>
              <CurrencyText :value="c.prestaciones.prima" />
            </div>
            <div class="detail-row">
              <span>Vacaciones</span>
              <CurrencyText :value="c.prestaciones.vacaciones" />
            </div>
            <div class="detail-row">
              <span>Cesantías</span>
              <CurrencyText :value="c.prestaciones.cesantias" />
            </div>
            <div class="detail-row">
              <span>Intereses Cesantías</span>
              <CurrencyText :value="c.prestaciones.interesCesantias" />
            </div>
            <div class="detail-row highlight pre-high">
              <span>Total Prestaciones</span>
              <CurrencyText :value="c.prestaciones.totalPrestacion" />
            </div>
            
            <div class="totals-group pt-4">
              <div class="detail-row highlight success-text">
                <span>NETO A PAGAR</span>
                <CurrencyText :value="c.totalNeto" />
              </div>
              <div class="detail-row highlight primary-text">
                <span>COSTO TOTAL NÓMINA</span>
                <CurrencyText :value="c.totalNomina" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.colaborador-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
}

.list-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.colaborador-card {
  padding: 1.5rem;
  transition: transform 0.2s;
}

.colaborador-card:hover {
  transform: scale(1.01);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: var(--bg-soft);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn.edit:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary-soft);
  color: var(--color-primary);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: var(--color-error);
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.badge {
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.badge.laboral { background: var(--color-primary-light); color: var(--color-primary); }
.badge.independiente { background: var(--color-primary-soft); color: var(--color-secondary); }
.badge.risk { background: var(--bg-soft); color: var(--text-muted); border: 1px solid var(--border-color); }

.sub-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.activity {
  font-style: italic;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.user-id {
  font-size: 0.8125rem;
}

.net-value .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-right: 0.5rem;
}

.net-value .value {
  font-size: 1.25rem;
  color: var(--color-success);
}

.card-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.detail-row.highlight {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--border-color);
  font-weight: 700;
}

.dev-high { color: var(--color-primary); }
.ded-high { color: var(--color-error); }
.emp-high { color: var(--color-primary-dark); }
.pre-high { color: var(--color-secondary); }

.success-text { color: var(--color-success); font-size: 1rem !important; }
.primary-text { color: var(--color-primary); font-size: 1rem !important; }

.sub-detail {
  font-size: 0.75rem;
  color: var(--text-muted);
  opacity: 0.85;
}

.mono {
  font-family: var(--font-mono);
  font-weight: 600;
}

.extras-group {
  margin: 0.5rem 0;
  padding: 0.5rem 0 0.5rem 0.75rem;
  border-left: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.totals-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pt-4 {
  padding-top: 1rem;
}

@media (min-width: 1200px) {
  .list-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .card-details {
    grid-template-columns: 1fr;
  }
}
</style>
