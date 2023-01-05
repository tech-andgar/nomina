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
        slmv2023: 1160000,
        uvt2023: 42412,
        auxTransporte: 140000,
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
          ibc: 0,
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
        totalNeto: 0,
        totalNomina: 0
      },
      colaboradores: [],
      colaboradoresTotal: {
        totalDevengado: 0,
        totalDeducido: 0,
        totalParafiscales: 0,
        totalPrestacion: 0,
        totalNeto: 0,
        totalNomina: 0
      },
    }
  },
  filters: {
    formatCurrency (val) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val)
    },
  },
  methods: {
    formatCurrency (val) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val)
    },
    calcularNomina(){
      if (this.checkNotEmptyDataColaborador()) {
        this.onSubmit()
        const element = this.$refs['resultData'];
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.$q.notify({
          type: 'negative',
          message: `Por favor llenar completar datos del colaborador`
        })
      }
    },
    onSubmit (_) {
      this.calcularValorHoraOrdinaria()
      this.calcularValorAuxTransporte()
      this.calcularValorExtrasDiurna()
      this.calcularValorExtrasNocturna()
      this.calcularValorExtrasDomingos()
      this.calcularValorExtrasNocturnaDomingos()
      this.calcularValorRecargoNocturno()
      this.calcularValorTotalExtrasValor()
      this.calcularValorSueldoBasico()
      this.calcularValorTotalDevengado()
      this.calcularValorIBC()
      this.calcularValorSaludColaborador()
      this.calcularValorPensionColaborador()
      this.calcularValorFondoSolidaridad()
      this.calcularValorUVT()
      this.calcularValorRetefuente()
      this.calcularValorTotalDeducido()
      this.calcularValorTotalNeto()
      this.calcularValorSaludEmpleador()
      this.calcularValorPensionEmpleador()
      this.calcularValorARLEmpleador()
      this.calcularValorSENAEmpleador()
      this.calcularValorICBFEmpleador()
      this.calcularValorCajaEmpleador()
      this.calcularValorTotalParafiscales()
      this.calcularValorPrima()
      this.calcularValorVacacaiones()
      this.calcularValorCesantias()
      this.calcularValorInteresCesantias()
      this.calcularValorTotalPrestacion()
      this.calcularValorTotalNomina()
      this.calcularValorTotalPrestacion()
    },
    onReset (evt) {
      evt.target.submit()
    },
    checkNotEmptyDataColaborador () {
      return (
        this.colaborador.cedula !== '' &&
        this.colaborador.nombre !== '' &&
        this.colaborador.sueldo !== 0 &&
        this.colaborador.diasTrabajados !== 0
      )
    },
    guardarEmpleado () {
      // TODO guardar objeto empleado en array
      if (this.checkNotEmptyDataColaborador()) {
        this.onSubmit()
        this.colaboradores.push(this.colaborador)
        this.colaborador = {
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
            ibc: 0,
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
          totalNeto: 0,
          totalNomina: 0
        }
        this.calcularTotalEmpleados()
      } else {
        this.$q.notify({
          type: 'negative',
          message: `Por favor llenar completar datos del colaborador`
        })
      }
    },
    calcularTotalEmpleados () {
      this.colaboradoresTotal = {
        totalDevengado: 0,
        totalDeducido: 0,
        totalParafiscales: 0,
        totalPrestacion: 0,
        totalNeto: 0,
        totalNomina: 0,
      }

      // this.colaboradores.forEach(colaborador => {
      //   this.colaboradoresTotal.totalDevengado += colaborador.devengado.totalDevengado
      //   this.colaboradoresTotal.totalDeducido += colaborador.deducido.totalDeducido
      //   this.colaboradoresTotal.totalParafiscales += colaborador.parafiscales.totalParafiscales
      //   this.colaboradoresTotal.totalPrestacion += colaborador.prestacion.totalPrestacion
      //   this.colaboradoresTotal.totalNeto += colaborador.totalNeto
      //   this.colaboradoresTotal.totalNomina += colaborador.totalNomina
      // });
      this.colaboradoresTotal.totalDevengado = this.colaboradores.reduce((acc, colaborador) => acc + colaborador.devengado.totalDevengado, 0)
      this.colaboradoresTotal.totalDeducido = this.colaboradores.reduce((acc, colaborador) => acc + colaborador.deducido.totalDeducido, 0)
      this.colaboradoresTotal.totalParafiscales = this.colaboradores.reduce((acc, colaborador) => acc + colaborador.parafiscales.totalParafiscales, 0)
      this.colaboradoresTotal.totalPrestacion = this.colaboradores.reduce((acc, colaborador) => acc + colaborador.prestacion.totalPrestacion, 0)
      this.colaboradoresTotal.totalNeto = this.colaboradores.reduce((acc, colaborador) => acc + colaborador.totalNeto, 0)
      this.colaboradoresTotal.totalNomina = this.colaboradores.reduce((acc, colaborador) => acc + colaborador.totalNomina, 0)
    },
    calcularValorHoraOrdinaria (_) {
      this.colaborador.valorHoraOrdinaria = this.colaborador.sueldo / (this.constante.horasHabiles * this.constante.diasMes)
    },
    calcularValorAuxTransporte (_) {
      this.colaborador.auxTransporte = 0
      if ((this.constante.slmv2023 * 2) > this.colaborador.sueldo) {
        this.colaborador.auxTransporte = this.constante.auxTransporte / this.constante.diasMes * this.colaborador.diasTrabajados
      }
    },
    calcularValorExtrasDiurna (_) {
      this.colaborador.devengado.valorExtras.diurna = (this.colaborador.valorHoraOrdinaria * this.colaborador.devengado.horasExtras.diurna) * this.constante.horasExtras.diurna
    },
    calcularValorExtrasNocturna (_) {
      this.colaborador.devengado.valorExtras.nocturna = (this.colaborador.valorHoraOrdinaria * this.colaborador.devengado.horasExtras.nocturna) * this.constante.horasExtras.nocturna
    },
    calcularValorExtrasDomingos (_) {
      this.colaborador.devengado.valorExtras.domingos = (this.colaborador.valorHoraOrdinaria * this.colaborador.devengado.horasExtras.domingos) * this.constante.horasExtras.domingos
    },
    calcularValorExtrasNocturnaDomingos (_) {
      this.colaborador.devengado.valorExtras.nocturnaDomingos = (this.colaborador.valorHoraOrdinaria * this.colaborador.devengado.horasExtras.nocturnaDomingos) * this.constante.horasExtras.nocturnaDomingos
    },
    calcularValorRecargoNocturno (_) {
      this.colaborador.devengado.valorExtras.recargoNocturno = (this.colaborador.valorHoraOrdinaria * this.colaborador.devengado.horasExtras.recargoNocturno) * this.constante.horasExtras.recargoNocturno
    },
    calcularValorTotalExtrasValor (_) {
      this.colaborador.devengado.totalValorExtras = this.colaborador.devengado.valorExtras.diurna + this.colaborador.devengado.valorExtras.nocturna + this.colaborador.devengado.valorExtras.domingos + this.colaborador.devengado.valorExtras.nocturnaDomingos + this.colaborador.devengado.valorExtras.recargoNocturno
    },
    calcularValorSueldoBasico (_) {
      this.colaborador.devengado.sueldoBasico = (this.colaborador.sueldo / this.constante.diasMes) * this.colaborador.diasTrabajados
    },
    calcularValorTotalDevengado (_) {
      this.colaborador.devengado.totalDevengado = this.colaborador.devengado.totalValorExtras + this.colaborador.auxTransporte + this.colaborador.devengado.sueldoBasico
    },
    calcularValorIBC (_) {
      this.colaborador.devengado.ibc = this.colaborador.devengado.totalDevengado - this.colaborador.auxTransporte
    },
    calcularValorSaludColaborador (_) {
      this.colaborador.deducido.salud = (this.colaborador.devengado.ibc * this.constante.salud.colaborador) / 100
    },
    calcularValorPensionColaborador (_) {
      this.colaborador.deducido.pension = (this.colaborador.devengado.ibc * this.constante.pension.colaborador) / 100
    },
    calcularValorFondoSolidaridad (_) {

      const totalDevengado = this.colaborador.devengado.totalDevengado
      const slmv2023 = this.constante.slmv2023
      let fondoSolidaridad = 0

      if (totalDevengado > 20 * slmv2023) {
        fondoSolidaridad = totalDevengado * 2 / 100
      } else if (totalDevengado >= 19 * slmv2023 && totalDevengado < 20 * slmv2023) {
        fondoSolidaridad = totalDevengado * 1.8 / 100
      } else if (totalDevengado >= 18 * slmv2023 && totalDevengado < 19 * slmv2023) {
        fondoSolidaridad = totalDevengado * 1.6 / 100
      } else if (totalDevengado >= 17 * slmv2023 && totalDevengado < 18 * slmv2023) {
        fondoSolidaridad = totalDevengado * 1.4 / 100
      } else if (totalDevengado >= 16 * slmv2023 && totalDevengado < 17 * slmv2023) {
        fondoSolidaridad = totalDevengado * 1.2 / 100
      } else if (totalDevengado >= 4 * slmv2023 && totalDevengado <= 16 * slmv2023) {
        fondoSolidaridad = totalDevengado * 1 / 100
      }
      this.colaborador.deducido.fondoSolidaridad = fondoSolidaridad
    },
    calcularValorUVT (_) {
      this.colaborador.deducido.uvt = ((this.colaborador.devengado.totalDevengado - this.colaborador.deducido.salud - this.colaborador.deducido.pension - this.colaborador.deducido.fondoSolidaridad) * 0.75) / this.constante.uvt2023
      this.colaborador.deducido.uvt = this.colaborador.deducido.uvt.toFixed(3)
    },
    calcularValorRetefuente (_) {
      const uvt = this.colaborador.deducido.uvt
      const uvtValor = this.constante.uvt2023
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
    calcularValorTotalDeducido (_) {
      this.colaborador.deducido.totalDeducido = this.colaborador.deducido.salud + this.colaborador.deducido.pension + this.colaborador.deducido.fondoSolidaridad + this.colaborador.deducido.retefuente
    },
    calcularValorTotalNeto (_) {
      this.colaborador.totalNeto = this.colaborador.devengado.totalDevengado - this.colaborador.deducido.totalDeducido
    },
    calcularValorSaludEmpleador (_) {
      this.colaborador.parafiscales.salud = (this.colaborador.devengado.ibc * this.constante.salud.empleador) / 100
    },
    calcularValorPensionEmpleador (_) {
      this.colaborador.parafiscales.pension = (this.colaborador.devengado.ibc * this.constante.pension.empleador) / 100
    },
    calcularValorARLEmpleador (_) {
      this.colaborador.parafiscales.arl = (this.colaborador.devengado.ibc * this.constante.parafiscal.arl) / 100
    },
    calcularValorSENAEmpleador (_) {
      this.colaborador.parafiscales.sena = (this.colaborador.devengado.ibc * this.constante.parafiscal.sena) / 100
    },
    calcularValorICBFEmpleador (_) {
      this.colaborador.parafiscales.icbf = (this.colaborador.devengado.ibc * this.constante.parafiscal.icbf) / 100
    },
    calcularValorCajaEmpleador (_) {
      this.colaborador.parafiscales.cajas = (this.colaborador.devengado.ibc * this.constante.parafiscal.cajas) / 100
    },
    calcularValorTotalParafiscales (_) {
      this.colaborador.parafiscales.totalParafiscales = this.colaborador.parafiscales.salud + this.colaborador.parafiscales.pension + this.colaborador.parafiscales.arl + this.colaborador.parafiscales.sena + this.colaborador.parafiscales.icbf + this.colaborador.parafiscales.cajas
    },
    calcularValorPrima (_) {
      this.colaborador.prestacion.prima = (this.colaborador.devengado.sueldoBasico + this.colaborador.auxTransporte) * this.constante.prestacion.prima / 100
    },
    calcularValorVacacaiones (_) {
      this.colaborador.prestacion.vacacaiones = (this.colaborador.devengado.totalDevengado * this.constante.prestacion.vacacaiones) / 100
      // this.colaborador.prestacion.vacacaiones = (this.colaborador.devengado.sueldoBasico * this.colaborador.diasTrabajados) / 720
    },
    calcularValorCesantias (_) {
      this.colaborador.prestacion.cesantias = ((this.colaborador.devengado.totalDevengado + this.colaborador.auxTransporte) * this.constante.prestacion.cesantias) / 100
    },
    calcularValorInteresCesantias (_) {
      this.colaborador.prestacion.interesCesantias = (this.colaborador.prestacion.cesantias * this.constante.prestacion.interesCesantias) / 100
    },
    calcularValorTotalPrestacion (_) {
      this.colaborador.prestacion.totalPrestacion = this.colaborador.prestacion.prima + this.colaborador.prestacion.vacacaiones + this.colaborador.prestacion.cesantias + this.colaborador.prestacion.interesCesantias
    },
    calcularValorTotalNomina (_) {
      this.colaborador.totalNomina = this.colaborador.devengado.totalDevengado + this.colaborador.parafiscales.totalParafiscales + this.colaborador.prestacion.totalPrestacion
    },
  },
  mounted () {
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
