<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { 
  $colaborador, 
  $selectedYear, 
  $empleador,
  $calculatedColaboradorPreview,
  $editingIndex,
  addColaborador,
  updateColaborador,
  cancelEdit,
  setSelectedYear,
  setEmpleador 
} from '@src/application/state/colaboradorState';
import { createEmptyColaborador } from '@src/domain/Colaborador';
import FormField from '../molecules/FormField.vue';
import BaseButton from '../atoms/BaseButton.vue';
import CurrencyText from '../atoms/CurrencyText.vue';
import { computed } from 'vue';
import { getYearlyConstants } from '@src/infrastructure/config/constants';

const colaborador = useStore($colaborador);
const selectedYear = useStore($selectedYear);
const empleador = useStore($empleador);
const preview = useStore($calculatedColaboradorPreview);
const editingIndex = useStore($editingIndex);

const currentConstants = computed(() => getYearlyConstants(selectedYear.value, 1));

const years = [2026, 2025, 2024, 2023];

const actividadesEconomicas = [
  { value: 'COMERCIO_MAYOR_MENOR', label: 'Comercio al por mayor y menor' },
  { value: 'EXPLOTACION_MINAS', label: 'Explotación de minas y canteras' },
  { value: 'SECTOR_AGROPECUARIO', label: 'Sector Agropecuario' },
  { value: 'ALOJAMIENTO_COMIDA', label: 'Alojamiento y servicios de comida' },
  { value: 'INDUSTRIAS_MANUFACTURERAS', label: 'Industrias manufactureras' },
  { value: 'EDUCACION', label: 'Educación' },
  { value: 'CONSTRUCCION', label: 'Construcción' },
  { value: 'TRANSPORTE_ALMACENAMIENTO', label: 'Transporte y almacenamiento' },
  { value: 'INMOBILIARIAS', label: 'Actividades Inmobiliarias' },
  { value: 'ARTISTICAS', label: 'Actividades artísticas y de entretenimiento' },
  { value: 'DEMAS_ACTIVIDADES', label: 'Demás actividades' },
  { value: 'SERVICIOS_ADMINISTRATIVOS', label: 'Servicios administrativos' },
  { value: 'OTRAS_ACTIVIDADES_SERVICIOS', label: 'Otras actividades de servicios' },
  { value: 'INFORMACION_COMUNICACION', label: 'Información y comunicaciones' },
  { value: 'PROFESIONALES', label: 'Actividades profesionales, científicas y técnicas' },
  { value: 'ATENCION_SALUD', label: 'Actividades de atención de la salud humana' },
  { value: 'FINANCIERAS', label: 'Actividades financieras y de seguros' },
  { value: 'RENTISTAS_CAPITAL', label: 'Rentistas de Capital' },
];

const taxTables = [
  { value: 'actual', label: 'Actual (Ley 2277)' },
  { value: 'legacy_2019_2022', label: 'Ley 1943 (2019-2022)' },
  { value: 'legacy_2017_2018', label: 'Ley 1819 (2017-2018)' },
  { value: 'legacy_2013_2016', label: 'Ley 1607 (2013-2016)' },
  { value: 'legacy_2010_2012', label: 'Ley 1111 (2010-2012)' },
  { value: 'legacy_user_85uvt', label: 'Personalizada (Base 85 UVT)' },
];

const updateField = (path: string, value: any) => {
  const current = { ...colaborador.value };
  const keys = path.split('.');
  let obj: any = current;
  for (let i = 0; i < keys.length - 1; i++) {
    obj[keys[i]] = { ...obj[keys[i]] };
    obj = obj[keys[i]];
  }
  obj[keys[keys.length - 1]] = value;
  $colaborador.set(current);
};

const toggleTipoContrato = () => {
  const current = colaborador.value.tipoContrato;
  updateField('tipoContrato', current === 'LABORAL' ? 'INDEPENDIENTE' : 'LABORAL');
};
</script>

<template>
  <div class="colaborador-form card">
    <div class="form-header">
      <h2 class="text-h6 text-primary">Configuración General</h2>
      <div class="config-row">
        <div class="year-selector">
          <label for="year-sel">Año fiscal:</label>
          <select 
            id="year-sel"
            :value="selectedYear" 
            @change="setSelectedYear(Number(($event.target as HTMLSelectElement).value))"
            class="year-select"
          >
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <div class="employer-selector">
          <label for="emp-type">Tipo Empleador:</label>
          <select 
            id="emp-type"
            :value="empleador.tipo" 
            @change="setEmpleador({ ...empleador, tipo: ($event.target as HTMLSelectElement).value as any })"
            class="year-select"
          >
            <option value="PERSONA_JURIDICA">P. Jurídica</option>
            <option value="PERSONA_NATURAL">P. Natural</option>
          </select>
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="section-header">
        <h3 class="section-title">
          {{ editingIndex !== null ? 'Editando Colaborador' : 'Datos del Colaborador' }}
        </h3>
        <div class="contract-toggle">
          <span :class="{ active: colaborador.tipoContrato === 'LABORAL' }">Laboral</span>
          <div class="toggle-track" @click="toggleTipoContrato">
            <div class="toggle-thumb" :class="{ moved: colaborador.tipoContrato === 'INDEPENDIENTE' }"></div>
          </div>
          <span :class="{ active: colaborador.tipoContrato === 'INDEPENDIENTE' }">Independiente</span>
        </div>
      </div>
      
      <div class="grid-2">
        <FormField 
          label="Nombre" 
          :model-value="colaborador.nombre" 
          @update:model-value="updateField('nombre', $event)"
          placeholder="Juan Pérez" 
        />
        <FormField 
          label="Identificación" 
          :model-value="colaborador.cedula" 
          @update:model-value="updateField('cedula', $event)"
          placeholder="123456" 
        />
      </div>
      
      <div class="grid-2">
        <FormField
          label="Sueldo/Honorarios base"
          :model-value="colaborador.sueldo"
          @update:model-value="updateField('sueldo', $event)"
          type="money"
          :hint="`SMLV ${selectedYear}: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(currentConstants.slmv)}`"
        />
        <div class="field-container">
          <label for="riesgo-arl">Riesgo ARL:</label>
          <select 
            id="riesgo-arl"
            :value="colaborador.riesgoARL" 
            @change="updateField('riesgoARL', Number(($event.target as HTMLSelectElement).value))"
            class="year-select full-width"
          >
            <option v-for="n in 5" :key="n" :value="n">Clase {{ n }}</option>
          </select>
        </div>
      </div>

      <div class="grid-2">
        <FormField
          label="Días trabajados"
          :model-value="colaborador.diasTrabajados"
          @update:model-value="updateField('diasTrabajados', $event)"
          type="number"
          placeholder="30"
        />
      </div>
    </div>

    <!-- Contractor Specific Section -->
    <div v-if="colaborador.tipoContrato === 'INDEPENDIENTE'" class="form-section contractor-section animate-in">
      <h3 class="section-title">Ajustes de Independiente (Presunción de Costos)</h3>
      <div class="grid-2">
        <div class="field-container">
          <label for="actividad">Actividad Económica:</label>
          <select 
            id="actividad"
            :value="colaborador.actividadEconomica" 
            @change="updateField('actividadEconomica', ($event.target as HTMLSelectElement).value)"
            class="year-select full-width"
          >
            <option value="" disabled>Seleccione actividad...</option>
            <option v-for="act in actividadesEconomicas" :key="act.value" :value="act.value">
              {{ act.label }}
            </option>
          </select>
        </div>
        <FormField
          label="% Costos (Opcional)"
          :model-value="colaborador.porcentajeCostos"
          @update:model-value="updateField('porcentajeCostos', $event)"
          type="number"
          placeholder="Según actividad"
          hint="Sobreescribe el valor legal si se define"
        />
      </div>
    </div>

    <details class="form-section">
      <summary class="section-title cursor-pointer select-none list-none">
        <div class="flex items-center gap-2">
           <span>Ajustes Avanzados (Horas Extras)</span>
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </summary>
      <div class="grid-2 pt-4">
        <FormField label="E. Diurna" :model-value="colaborador.devengado.horasExtras.diurna" @update:model-value="updateField('devengado.horasExtras.diurna', $event)" type="number" />
        <FormField label="E. Nocturna" :model-value="colaborador.devengado.horasExtras.nocturna" @update:model-value="updateField('devengado.horasExtras.nocturna', $event)" type="number" />
        <FormField label="Dom. Diurna" :model-value="colaborador.devengado.horasExtras.domingos" @update:model-value="updateField('devengado.horasExtras.domingos', $event)" type="number" />
        <FormField label="Dom. Noct." :model-value="colaborador.devengado.horasExtras.nocturnaDomingos" @update:model-value="updateField('devengado.horasExtras.nocturnaDomingos', $event)" type="number" />
        <FormField label="Recargo Noct." :model-value="colaborador.devengado.horasExtras.recargoNocturno" @update:model-value="updateField('devengado.horasExtras.recargoNocturno', $event)" type="number" />
      </div>
    </details>

    <div class="form-section border-top">
      <h3 class="section-title">Deducciones (Ley 2277)</h3>
      <div class="deductions-grid">
        <div class="deduction-item">
          <input 
            type="checkbox" 
            :checked="colaborador.deduccionesOpcionales.dependientes" 
            @change="updateField('deduccionesOpcionales.dependientes', ($event.target as HTMLInputElement).checked)"
            id="dep" 
          />
          <label for="dep">Dependientes (10%)</label>
        </div>
        <FormField label="Med. Prepagada" :model-value="colaborador.deduccionesOpcionales.medicinaPrepagadaMensual" @update:model-value="updateField('deduccionesOpcionales.medicinaPrepagadaMensual', $event)" type="money" id="med-pre" />
        <FormField label="Interés Vivienda" :model-value="colaborador.deduccionesOpcionales.viviendaMensual" @update:model-value="updateField('deduccionesOpcionales.viviendaMensual', $event)" type="money" id="iv-vivienda" />
        <div class="field-container">
          <label for="tipo-tabla">Tabla de Retención:</label>
          <select 
            id="tipo-tabla"
            :value="colaborador.deduccionesOpcionales.tipoTabla" 
            @change="updateField('deduccionesOpcionales.tipoTabla', ($event.target as HTMLSelectElement).value)"
            class="year-select full-width"
          >
            <option v-for="table in taxTables" :key="table.value" :value="table.value">
              {{ table.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Real-time Preview -->
    <div v-if="preview" class="preview-panel card">
      <div class="preview-row">
        <span>Devengado:</span>
        <CurrencyText :value="preview.devengado.totalDevengado" />
      </div>
      <div class="preview-row">
        <span>Deducido:</span>
        <CurrencyText :value="preview.deducido.totalDeducido" />
      </div>
      <div class="preview-row total">
        <span>Neto Estimado:</span>
        <CurrencyText :value="preview.totalNeto" />
      </div>
    </div>

    <div class="form-actions">
      <BaseButton type="secondary" @click="editingIndex !== null ? cancelEdit() : $colaborador.set(createEmptyColaborador())">
        {{ editingIndex !== null ? 'Cancelar' : 'Resetear' }}
      </BaseButton>
      <BaseButton type="primary" @click="editingIndex !== null ? updateColaborador() : addColaborador()">
        {{ editingIndex !== null ? 'Actualizar Colaborador' : 'Guardar Colaborador' }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.colaborador-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

.config-row {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.year-selector, .employer-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.year-select {
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-soft);
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.contract-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.contract-toggle .active {
  color: var(--color-primary);
}

.toggle-track {
  width: 44px;
  height: 22px;
  background: var(--bg-soft);
  border-radius: 20px;
  padding: 2px;
  cursor: pointer;
  border: 1px solid var(--border-color);
}

.toggle-thumb {
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-thumb.moved {
  transform: translateX(22px);
  background: var(--color-secondary);
}

.border-top {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.deductions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.contractor-section {
  background: var(--bg-soft);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.field-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-container label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.full-width {
  width: 100%;
}

.deduction-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.deduction-item input {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: var(--color-primary);
}

.preview-panel {
  background: var(--color-primary-light);
  border: 1px dashed var(--color-primary);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
}

.preview-row.total {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-primary-soft);
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  opacity: 0.9;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

details > summary {
  list-style: none;
  cursor: pointer;
}
details > summary::-webkit-details-marker {
  display: none;
}

.chevron {
  transition: transform 0.2s;
}

details[open] .chevron {
  transform: rotate(180deg);
}

.pt-4 {
  padding-top: 1rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 0.5rem;
}

@media (max-width: 640px) {
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
