const { ref } = Vue;
const { unformat } = window["v-money3"];
export const moneyFormatForComponent = {
  decimal: ",",
  thousands: ".",
  prefix: "$ ",
  // suffix: ' #',
  precision: 0,
  masked: true,
};
export const colaboradores = ref([]);
export const sueldoString = ref(null);
export const colaborador = ref({
  cedula: null,
  nombre: null,
  sueldo: null,
  valorHoraOrdinaria: null,
  auxTransporte: null,
  diasTrabajados: null,
  devengado: {
    horasExtras: {
      diurna: null,
      nocturna: null,
      domingos: null,
      nocturnaDomingos: null,
      recargoNocturno: null,
    },
    sueldoBasico: null,
    valorExtras: {
      diurna: null,
      nocturna: null,
      domingos: null,
      nocturnaDomingos: null,
      recargoNocturno: null,
    },
    totalValorExtras: null,
    ibc: null,
    totalDevengado: null,
  },
  deducido: {
    salud: null,
    pension: null,
    fondoSolidaridad: null,
    uvt: null,
    retefuente: null,
    totalDeducido: null,
  },
  parafiscales: {
    salud: null,
    pension: null,
    arl: null,
    sena: null,
    icbf: null,
    cajas: null,
    totalParafiscales: null,
  },
  prestacion: {
    prima: null,
    vacacaiones: null,
    cesantias: null,
    interesCesantias: null,
    totalPrestacion: null,
  },
  totalNeto: null,
  totalNomina: null,
});

export const constante = {
  horasHabiles: 8,
  diasMes: 30,
  horasExtras: {
    diurna: 1.25, //%
    nocturna: 1.75, //%
    domingos: 2, //%,
    nocturnaDomingos: 2.5, //%
    recargoNocturno: 1.35, //%
  },
  slmv2023: 1300000,
  uvt2023: 42412,
  auxTransporte: 162000,
  salud: {
    colaborador: 4,
    empleador: 8.5,
  },
  pension: {
    colaborador: 4,
    empleador: 12,
  },
  parafiscal: {
    arl: 0.522,
    sena: 2,
    icbf: 3,
    cajas: 4,
  },
  prestacion: {
    prima: 8.333333,
    vacacaiones: 4.17,
    cesantias: 8.333333,
    interesCesantias: 1,
  },
};

export let colaboradoresTotal = ref({
  totalDevengado: 0,
  totalDeducido: 0,
  totalParafiscales: 0,
  totalPrestacion: 0,
  totalNeto: 0,
  totalNomina: 0,
});

export function calcularNomina() {
  if (checkNotEmptyDataColaborador()) {
    submit();
    const element = this.$refs["resultData"];
    element.scrollIntoView({ behavior: "smooth" });
  } else {
    this.$q.notify({
      type: "negative",
      message: `Por favor llenar completar datos del colaborador`,
    });
  }
}

export function submit() {
  unformatSueldo();
  calcularValorHoraOrdinaria();
  calcularValorAuxTransporte();
  calcularValorExtrasDiurna();
  calcularValorExtrasNocturna();
  calcularValorExtrasDomingos();
  calcularValorExtrasNocturnaDomingos();
  calcularValorRecargoNocturno();
  calcularValorTotalExtrasValor();
  calcularValorSueldoBasico();
  calcularValorTotalDevengado();
  calcularValorIBC();
  calcularValorSaludColaborador();
  calcularValorPensionColaborador();
  calcularValorFondoSolidaridad();
  calcularValorUVT();
  calcularValorRetefuente();
  calcularValorTotalDeducido();
  calcularValorTotalNeto();
  calcularValorSaludEmpleador();
  calcularValorPensionEmpleador();
  calcularValorARLEmpleador();
  calcularValorSENAEmpleador();
  calcularValorICBFEmpleador();
  calcularValorCajaEmpleador();
  calcularValorTotalParafiscales();
  calcularValorPrima();
  calcularValorVacacaiones();
  calcularValorCesantias();
  calcularValorInteresCesantias();
  calcularValorTotalPrestacion();
  calcularValorTotalNomina();
  calcularValorTotalPrestacion();
}

function checkNotEmptyDataColaborador() {
  return (
    colaborador.value.cedula !== "" &&
    colaborador.value.nombre !== "" &&
    colaborador.value.sueldo !== 0 &&
    colaborador.value.diasTrabajados !== 0
  );
}

export function guardarEmpleado() {
  // TODO guardar objeto empleado en array
  if (!checkNotEmptyDataColaborador()) {
    this.$q.notify({
      type: "negative",
      message: `Por favor llenar completar datos del colaborador`,
    });
    return;
  }
  submit();
  colaboradores.value.push(colaborador.value);
  sueldoString.value = null;
  colaborador.value = {
    cedula: null,
    nombre: null,
    sueldo: null,
    valorHoraOrdinaria: null,
    auxTransporte: null,
    diasTrabajados: null,
    devengado: {
      horasExtras: {
        diurna: null,
        nocturna: null,
        domingos: null,
        nocturnaDomingos: null,
        recargoNocturno: null,
      },
      sueldoBasico: null,
      valorExtras: {
        diurna: null,
        nocturna: null,
        domingos: null,
        nocturnaDomingos: null,
        recargoNocturno: null,
      },
      totalValorExtras: null,
      ibc: null,
      totalDevengado: null,
    },
    deducido: {
      salud: null,
      pension: null,
      fondoSolidaridad: null,
      uvt: null,
      retefuente: null,
      totalDeducido: null,
    },
    parafiscales: {
      salud: null,
      pension: null,
      arl: null,
      sena: null,
      icbf: null,
      cajas: null,
      totalParafiscales: null,
    },
    prestacion: {
      prima: null,
      vacacaiones: null,
      cesantias: null,
      interesCesantias: null,
      totalPrestacion: null,
    },
    totalNeto: null,
    totalNomina: null,
  };

  calcularTotalEmpleados();
}

function calcularTotalEmpleados() {
  // colaboradores.forEach(colaborador => {
  //   colaboradoresTotalUpdated.totalDevengado += colaborador.value.devengado.totalDevengado
  //   colaboradoresTotalUpdated.totalDeducido += colaborador.value.deducido.totalDeducido
  //   colaboradoresTotalUpdated.totalParafiscales += colaborador.value.parafiscales.totalParafiscales
  //   colaboradoresTotalUpdated.totalPrestacion += colaborador.value.prestacion.totalPrestacion
  //   colaboradoresTotalUpdated.totalNeto += colaborador.value.totalNeto
  //   colaboradoresTotalUpdated.totalNomina += colaborador.value.totalNomina
  // });

  colaboradoresTotal.value.totalDevengado = colaboradores.value.reduce(
    (acc, colaborador) => acc + colaborador.devengado.totalDevengado,
    0
  );
  colaboradoresTotal.value.totalDeducido = colaboradores.value.reduce(
    (acc, colaborador) => acc + colaborador.deducido.totalDeducido,
    0
  );
  colaboradoresTotal.value.totalParafiscales = colaboradores.value.reduce(
    (acc, colaborador) => acc + colaborador.parafiscales.totalParafiscales,
    0
  );
  colaboradoresTotal.value.totalPrestacion = colaboradores.value.reduce(
    (acc, colaborador) => acc + colaborador.prestacion.totalPrestacion,
    0
  );
  colaboradoresTotal.value.totalNeto = colaboradores.value.reduce(
    (acc, colaborador) => acc + colaborador.totalNeto,
    0
  );
  colaboradoresTotal.value.totalNomina = colaboradores.value.reduce(
    (acc, colaborador) => acc + colaborador.totalNomina,
    0
  );
}

function calcularValorHoraOrdinaria() {
  colaborador.value.valorHoraOrdinaria =
    colaborador.value.sueldo / (constante.horasHabiles * constante.diasMes);
}

function unformatSueldo() {
  colaborador.value.sueldo = unformat(
    String(sueldoString.value),
    moneyFormatForComponent
  );
}

function calcularValorAuxTransporte() {
  colaborador.value.auxTransporte = 0;
  if (constante.slmv2023 * 2 > colaborador.value.sueldo) {
    colaborador.value.auxTransporte =
      (constante.auxTransporte / constante.diasMes) *
      colaborador.value.diasTrabajados;
  }
}

function calcularValorExtrasDiurna() {
  colaborador.value.devengado.valorExtras.diurna =
    colaborador.value.valorHoraOrdinaria *
    colaborador.value.devengado.horasExtras.diurna *
    constante.horasExtras.diurna;
}

function calcularValorExtrasNocturna() {
  colaborador.value.devengado.valorExtras.nocturna =
    colaborador.value.valorHoraOrdinaria *
    colaborador.value.devengado.horasExtras.nocturna *
    constante.horasExtras.nocturna;
}

function calcularValorExtrasDomingos() {
  colaborador.value.devengado.valorExtras.domingos =
    colaborador.value.valorHoraOrdinaria *
    colaborador.value.devengado.horasExtras.domingos *
    constante.horasExtras.domingos;
}

function calcularValorExtrasNocturnaDomingos() {
  colaborador.value.devengado.valorExtras.nocturnaDomingos =
    colaborador.value.valorHoraOrdinaria *
    colaborador.value.devengado.horasExtras.nocturnaDomingos *
    constante.horasExtras.nocturnaDomingos;
}

function calcularValorRecargoNocturno() {
  colaborador.value.devengado.valorExtras.recargoNocturno =
    colaborador.value.valorHoraOrdinaria *
    colaborador.value.devengado.horasExtras.recargoNocturno *
    constante.horasExtras.recargoNocturno;
}

function calcularValorTotalExtrasValor() {
  colaborador.value.devengado.totalValorExtras =
    colaborador.value.devengado.valorExtras.diurna +
    colaborador.value.devengado.valorExtras.nocturna +
    colaborador.value.devengado.valorExtras.domingos +
    colaborador.value.devengado.valorExtras.nocturnaDomingos +
    colaborador.value.devengado.valorExtras.recargoNocturno;
}

function calcularValorSueldoBasico() {
  colaborador.value.devengado.sueldoBasico =
    (colaborador.value.sueldo / constante.diasMes) *
    colaborador.value.diasTrabajados;
}

function calcularValorTotalDevengado() {
  colaborador.value.devengado.totalDevengado =
    colaborador.value.devengado.totalValorExtras +
    colaborador.value.auxTransporte +
    colaborador.value.devengado.sueldoBasico;
}

function calcularValorIBC() {
  colaborador.value.devengado.ibc =
    colaborador.value.devengado.totalDevengado -
    colaborador.value.auxTransporte;
}

function calcularValorSaludColaborador() {
  colaborador.value.deducido.salud =
    (colaborador.value.devengado.ibc * constante.salud.colaborador) / 100;
}

function calcularValorPensionColaborador() {
  colaborador.value.deducido.pension =
    (colaborador.value.devengado.ibc * constante.pension.colaborador) / 100;
}

function calcularValorFondoSolidaridad() {
  const totalDevengado = colaborador.value.devengado.totalDevengado;
  const slmv2023 = constante.slmv2023;
  let fondoSolidaridad = 0;

  if (totalDevengado > 20 * slmv2023) {
    fondoSolidaridad = (totalDevengado * 2) / 100;
  } else if (
    totalDevengado >= 19 * slmv2023 &&
    totalDevengado < 20 * slmv2023
  ) {
    fondoSolidaridad = (totalDevengado * 1.8) / 100;
  } else if (
    totalDevengado >= 18 * slmv2023 &&
    totalDevengado < 19 * slmv2023
  ) {
    fondoSolidaridad = (totalDevengado * 1.6) / 100;
  } else if (
    totalDevengado >= 17 * slmv2023 &&
    totalDevengado < 18 * slmv2023
  ) {
    fondoSolidaridad = (totalDevengado * 1.4) / 100;
  } else if (
    totalDevengado >= 16 * slmv2023 &&
    totalDevengado < 17 * slmv2023
  ) {
    fondoSolidaridad = (totalDevengado * 1.2) / 100;
  } else if (
    totalDevengado >= 4 * slmv2023 &&
    totalDevengado <= 16 * slmv2023
  ) {
    fondoSolidaridad = (totalDevengado * 1) / 100;
  }
  colaborador.value.deducido.fondoSolidaridad = fondoSolidaridad;
}

function calcularValorUVT() {
  colaborador.value.deducido.uvt =
    ((colaborador.value.devengado.totalDevengado -
      colaborador.value.deducido.salud -
      colaborador.value.deducido.pension -
      colaborador.value.deducido.fondoSolidaridad) *
      0.75) /
    constante.uvt2023;
  colaborador.value.deducido.uvt = colaborador.value.deducido.uvt.toFixed(3);
}

function calcularValorRetefuente() {
  const uvt = colaborador.value.deducido.uvt;
  const uvtValor = constante.uvt2023;
  let retefuente = 0;

  if (uvt >= 1140) {
    retefuente = (uvt * 0.37 + 341) * uvtValor;
  } else if (uvt >= 640) {
    retefuente = (uvt * 0.35 + 166) * uvtValor;
  } else if (uvt >= 350) {
    retefuente = (uvt * 0.33 + 70) * uvtValor;
  } else if (uvt >= 140) {
    retefuente = (uvt * 0.28 + 11) * uvtValor;
  } else if (uvt >= 85) {
    retefuente = uvt * 0.19 * uvtValor;
  }

  colaborador.value.deducido.retefuente = retefuente;
}

function calcularValorTotalDeducido() {
  colaborador.value.deducido.totalDeducido =
    colaborador.value.deducido.salud +
    colaborador.value.deducido.pension +
    colaborador.value.deducido.fondoSolidaridad +
    colaborador.value.deducido.retefuente;
}

function calcularValorTotalNeto() {
  colaborador.value.totalNeto =
    colaborador.value.devengado.totalDevengado -
    colaborador.value.deducido.totalDeducido;
}

function calcularValorSaludEmpleador() {
  colaborador.value.parafiscales.salud =
    (colaborador.value.devengado.ibc * constante.salud.empleador) / 100;
}

function calcularValorPensionEmpleador() {
  colaborador.value.parafiscales.pension =
    (colaborador.value.devengado.ibc * constante.pension.empleador) / 100;
}

function calcularValorARLEmpleador() {
  colaborador.value.parafiscales.arl =
    (colaborador.value.devengado.ibc * constante.parafiscal.arl) / 100;
}

function calcularValorSENAEmpleador() {
  colaborador.value.parafiscales.sena =
    (colaborador.value.devengado.ibc * constante.parafiscal.sena) / 100;
}

function calcularValorICBFEmpleador() {
  colaborador.value.parafiscales.icbf =
    (colaborador.value.devengado.ibc * constante.parafiscal.icbf) / 100;
}

function calcularValorCajaEmpleador() {
  colaborador.value.parafiscales.cajas =
    (colaborador.value.devengado.ibc * constante.parafiscal.cajas) / 100;
}

function calcularValorTotalParafiscales() {
  colaborador.value.parafiscales.totalParafiscales =
    colaborador.value.parafiscales.salud +
    colaborador.value.parafiscales.pension +
    colaborador.value.parafiscales.arl +
    colaborador.value.parafiscales.sena +
    colaborador.value.parafiscales.icbf +
    colaborador.value.parafiscales.cajas;
}

function calcularValorPrima() {
  colaborador.value.prestacion.prima =
    ((colaborador.value.devengado.sueldoBasico +
      colaborador.value.auxTransporte) *
      constante.prestacion.prima) /
    100;
}

function calcularValorVacacaiones() {
  colaborador.value.prestacion.vacacaiones =
    (colaborador.value.devengado.totalDevengado *
      constante.prestacion.vacacaiones) /
    100;
  // colaborador.value.prestacion.vacacaiones = (colaborador.value.devengado.sueldoBasico * colaborador.value.diasTrabajados) / 720
}

function calcularValorCesantias() {
  colaborador.value.prestacion.cesantias =
    ((colaborador.value.devengado.totalDevengado +
      colaborador.value.auxTransporte) *
      constante.prestacion.cesantias) /
    100;
}

function calcularValorInteresCesantias() {
  colaborador.value.prestacion.interesCesantias =
    (colaborador.value.prestacion.cesantias *
      constante.prestacion.interesCesantias) /
    100;
}

function calcularValorTotalPrestacion() {
  colaborador.value.prestacion.totalPrestacion =
    colaborador.value.prestacion.prima +
    colaborador.value.prestacion.vacacaiones +
    colaborador.value.prestacion.cesantias +
    colaborador.value.prestacion.interesCesantias;
}

function calcularValorTotalNomina() {
  colaborador.value.totalNomina =
    colaborador.value.devengado.totalDevengado +
    colaborador.value.parafiscales.totalParafiscales +
    colaborador.value.prestacion.totalPrestacion;
}
