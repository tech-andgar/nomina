/**
 * Tipo de Empleador para efectos de obligaciones tributarias y parafiscales.
 * Base Legal: Artículo 114-1 del Estatuto Tributario.
 * 
 * - PERSONA_JURIDICA: Sociedades y entidades asimiladas contribuyentes de renta.
 * - PERSONA_NATURAL: Personas naturales empleadoras.
 */
export type TipoEmpleador = 'PERSONA_JURIDICA' | 'PERSONA_NATURAL';

export interface InfoEmpleador {
    /**
     * Determina el régimen de exoneración de aportes (Art 114-1 ET).
     */
    tipo: TipoEmpleador;

    /**
     * Número de trabajadores vinculados laboralmente.
     * Requisito crítico para Personas Naturales:
     * - Si tienen menos de 2 trabajadores: NO aplica exoneración. (Art 1.2.1.5.4.9 DUR 1625/2016)
     * - Si tienen 2 o más: SÍ aplica exoneración (sujeta a tope salarial).
     */
    numeroTrabajadores: number;
}
