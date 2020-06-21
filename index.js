
Quasar.lang.set(Quasar.lang.es)
new Vue({
  el: '#q-app',
  data: function () {
    return {
      userInput: true,
      resultData: true,
      age: '',
      email: '',
      password: '',
      accept: '',
      constante: {
        horasHabiles: 8,
        diasMes: 30,
        horasExtras: {
          diurna: 1.25,            //%
          nocturna: 1.75,          //%
          domingos: 2,             //%,
          nocturnaDomingos: 2.5,   //%
          recargoNocturno: 1.35,   //%
        },
        slmv2020: 877803,
        uvt2020: 35607,
        auxTransporte: 102854,
        salud: {
          colaborador: 4,
          empleador: 8.5,
        },
        pension: {
          colaborador: 4,
          empleador: 12,
        },
        parafiscal: {
          arl: 6.96,
          sena: 2,
          icbf: 3,
          cajas: 4,
        },
        prestacion: {
          prima: 8.333333,
          vacacaiones: 4.17,
          cesantias: 8.333333,
          interesCesantias: 1,
        }
      },
      colaborador: {
        cedula: '',
        nombre: '',
        sueldo: 0,
        valorHoraOrdinaria: 0,
        auxTransporte: 0,
        diasTrabajados: 0,
        devengado: {
          horasExtras: {
            diurna: 0,
            nocturna: 0,
            domingos: 0,
            nocturnaDomingos: 0,
            recargoNocturno: 0,
          },
          sueldoBasico: 0,
          valorExtras: {
            diurna: 0,
            nocturna: 0,
            domingos: 0,
            nocturnaDomingos: 0,
            recargoNocturno: 0,
          },
          totalValorExtras: 0,
          totalDevengado: 0,
        },
        deducido: {
          salud: 0,
          pension: 0,
          fondoSolidaridad: 0,
          uvt: 0,
          retefuente: 0,
          totalDeducido: 0,
        },
        parafiscales: {
          salud: 0,
          pension: 0,
          arl: 0,
          sena: 0,
          icbf: 0,
          cajas: 0,
          totalParafiscales: 0
        },
        prestacion: {
          prima: 0,
          vacacaiones: 0,
          cesantias: 0,
          interesCesantias: 0,
          totalPrestacion: 0
        },
        totalNeto: 0
      },
      colaboradores: []
    }
  },
  methods: {
    onSubmit (evt) {
      console.log('@submit - do something here', evt)

      evt.target.submit()
    },
    onReset (evt) {
      console.log('@submit - do something here', evt)

      evt.target.submit()
    },
    calcularValorHoraOrdinaria (val) {
      this.colaborador.valorHoraOrdinaria = this.colaborador.sueldo / (this.constante.horasHabiles * this.constante.diasMes)
    },
    calcularValorAuxTransporte (val) {
      if (this.constante.slmv2020 < this.colaborador.sueldo * 2) {
        this.colaborador.auxTransporte = this.constante.auxTransporte / this.constante.diasMes * this.colaborador.diasTrabajados
      }
    },
    calcularValorExtrasDiurna (val) {
      this.colaborador.devengado.valorExtras.diurna = this.colaborador.valorHoraOrdinaria * this.colaborador.devengado.horasExtras.diurna * this.constante.horasExtras.diurna / 100
    },
    calcularValorExtrasNocturna (val) {
      this.colaborador.devengado.valorExtras.nocturna = this.colaborador.valorHoraOrdinaria * this.colaborador.devengado.horasExtras.nocturna * this.constante.horasExtras.nocturna / 100
    },
    calcularValorExtrasDomingos (val) {
      this.colaborador.devengado.valorExtras.domingos = this.colaborador.valorHoraOrdinaria * this.colaborador.devengado.horasExtras.domingos * this.constante.horasExtras.domingos / 100
    },
    calcularValorExtrasNocturnaDomingos (val) {
      this.colaborador.devengado.valorExtras.nocturnaDomingos = this.colaborador.valorHoraOrdinaria * this.colaborador.devengado.horasExtras.nocturnaDomingos * this.constante.horasExtras.nocturnaDomingos / 100
    },
    calcularValorRecargoNocturno (val) {
      this.colaborador.devengado.valorExtras.recargoNocturno = this.colaborador.valorHoraOrdinaria * this.colaborador.devengado.horasExtras.recargoNocturno * this.constante.horasExtras.recargoNocturno / 100
    },
    calcularValorTotalExtrasValor (val) {
      this.colaborador.devengado.totalValorExtras = this.colaborador.devengado.valorExtras.nocturna + this.colaborador.devengado.valorExtras.domingos + this.colaborador.devengado.valorExtras.nocturnaDomingos + this.colaborador.devengado.valorExtras.recargoNocturno
    },
    calcularValorTotalDevengado (val) {
      this.colaborador.devengado.totalDevengado = this.colaborador.devengado.totalValorExtras + this.colaborador.devengado.auxTransporte + this.colaborador.devengado.sueldoBasico
    },
    calcularValorSaludColaborador (val) {
      this.colaborador.deducido.salud = (this.colaborador.devengado.sueldoBasico * this.constante.salud.colaborador) / 100
    },
    calcularValorPensionColaborador (val) {
      this.colaborador.deducido.pension = (this.colaborador.devengado.sueldoBasico * this.constante.pension.colaborador) / 100
    },
    calcularValorFondoSolidaridad (val) {

      const totalDevengado = this.colaborador.devengado.totalDevengado
      const slmv2020 = this.constante.slmv2020
      let fondoSolidaridad = 0

      if (totalDevengado > 20 * slmv2020) {
        fondoSolidaridad = totalDevengado * 2 / 100
      } else if (totalDevengado >= 19 * slmv2020 && totalDevengado < 20 * slmv2020) {
        fondoSolidaridad = totalDevengado * 1.8 / 100
      } else if (totalDevengado >= 18 * slmv2020 && totalDevengado < 19 * slmv2020) {
        fondoSolidaridad = totalDevengado * 1.6 / 100
      } else if (totalDevengado >= 17 * slmv2020 && totalDevengado < 18 * slmv2020) {
        fondoSolidaridad = totalDevengado * 1.4 / 100
      } else if (totalDevengado >= 16 * slmv2020 && totalDevengado < 17 * slmv2020) {
        fondoSolidaridad = totalDevengado * 1.2 / 100
      } else if (totalDevengado >= 4 * slmv2020 && totalDevengado <= 16 * slmv2020) {
        fondoSolidaridad = totalDevengado * 1 / 100
      }
      this.colaborador.deducido.fondoSolidaridad = fondoSolidaridad
    },
    calcularValorUVT (val) {
      this.colaborador.deducido.uvt = ((this.colaborador.devengado.totalDevengado - this.colaborador.deducido.salud - this.colaborador.deducido.pension - this.colaborador.deducido.fondoSolidaridad) * 0.75) / this.constante.uvt2020
    },
    calcularValorRetefuente (val) {
      const uvt = this.colaborador.deducido.uvt
      const uvtValor = this.constante.uvt2020
      let retefuente = 0

      if (uvt >= 1140) {
        retefuente = (uvt * 0.37 + 341) * uvtValor
      } else if (uvt >= 640) {
        retefuente = (uvt * 0.35 + 166) * uvtValor
      } else if (uvt >= 350) {
        retefuente = (uvt * 0.33 + 70) * uvtValor
      } else if (uvt >= 140) {
        retefuente = (uvt * 0.28 + 11) * uvtValor
      } else if (uvt >= 85) {
        retefuente = (uvt * 0.19) * uvtValor
      }

      this.colaborador.deducido.retefuente = retefuente
    },
    calcularValorTotalDeducido (val) {
      this.colaborador.deducido.totalDeducido = this.colaborador.deducido.salud + this.colaborador.deducido.pension + this.colaborador.deducido.fondoSolidaridad + this.colaborador.deducido.retefuente
    },
    calcularValorTotalNeto (val) {
      this.colaborador.totalNeto = this.colaborador.devengado.totalDevengado - this.colaborador.deducido.totalDeducido
    },
    calcularValorSaludEmpleador (val) {
      this.colaborador.parafiscales.salud = (this.colaborador.devengado.sueldoBasico * this.constante.salud.empleador) / 100
    },
    calcularValorPensionEmpleador (val) {
      this.colaborador.parafiscales.pension = (this.colaborador.devengado.sueldoBasico * this.constante.pension.empleador) / 100
    },
    calcularValorARLEmpleador (val) {
      this.colaborador.parafiscales.arl = (this.colaborador.devengado.sueldoBasico * this.constante.parafiscal.arl) / 100
    },
    calcularValorSENAEmpleador (val) {
      this.colaborador.parafiscales.sena = (this.colaborador.devengado.sueldoBasico * this.constante.parafiscal.sena) / 100
    },
    calcularValorICBFEmpleador (val) {
      this.colaborador.parafiscales.icbf = (this.colaborador.devengado.sueldoBasico * this.constante.parafiscal.icbf) / 100
    },
    calcularValorCajaEmpleador (val) {
      this.colaborador.parafiscales.cajas = (this.colaborador.devengado.sueldoBasico * this.constante.parafiscal.cajas) / 100
    },
    calcularValorTotalParafiscales (val) {
      this.colaborador.parafiscales.totalParafiscales = this.colaborador.parafiscales.salud + this.colaborador.parafiscales.pension + this.colaborador.parafiscales.arl + this.colaborador.parafiscales.sena + this.colaborador.parafiscales.icbf + this.colaborador.parafiscales.cajas
    },
    calcularValorPrima (val) {
      this.colaborador.prestacion.prima = (this.colaborador.devengado.sueldoBasico + this.colaborador.auxTransporte) * this.constante.prestacion.prima
    },
    calcularValorVacacaiones (val) {
      this.colaborador.prestacion.vacacaiones = (this.colaborador.devengado.totalDevengado * this.constante.prestacion.vacacaiones)
    },
    calcularValorCesantias (val) {
      this.colaborador.prestacion.cesantias = ((this.colaborador.devengado.sueldoBasico + this.colaborador.auxTransporte) * this.constante.prestacion.cesantias) / 100
    },
    calcularValorInteresCesantias (val) {
      this.colaborador.prestacion.cesantias = (this.colaborador.prestacion.cesantias * this.constante.prestacion.cesantias) / 100
    },
    calcularValorTotalPrestacion (val) {
      this.colaborador.prestacion.totalPrestacion = this.colaborador.prestacion.vacacaiones + this.colaborador.prestacion.cesantias + this.colaborador.prestacion.cesantias
    },
    calcularValorTotalNomina (val) {
      this.colaborador.totalNeto = this.colaborador.devengado.totalDevengado + this.colaborador.parafiscales.totalParafiscales + this.colaborador.prestacion.calcularValorTotalPrestacion
    },
  },
  mounted() {
    const addMaximumScaleToMetaViewport = () => {
      const el = document.querySelector('meta[name=viewport]');

      if (el !== null) {
        let content = el.getAttribute('content');
        let re = /maximum\-scale=[0-9\.]+/g;

        if (re.test(content)) {
            content = content.replace(re, 'maximum-scale=1.0');
        } else {
            content = [content, 'maximum-scale=1.0'].join(', ')
        }

        el.setAttribute('content', content);
      }
    };

    const disableIosTextFieldZoom = addMaximumScaleToMetaViewport;

    // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885#9039885
    const checkIsIOS = () =>
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (checkIsIOS()) {
      disableIosTextFieldZoom();
    }
  },
})
