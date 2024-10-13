import {
  colaborador,
  sueldoString,
  colaboradores,
  colaboradoresTotal,
  constante,
  moneyFormatForComponent,
  calcularNomina,
  guardarEmpleado,
  submit,
} from "./store/colaborador.js";
const { createApp } = Vue;
Quasar.lang.set(Quasar.lang.es);

// // lifecycle hooks
// onMounted(() => {
//   console.log(`The initial count is ${count.value}.`);
// });

function formatCurrency(val) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(val);
}

const app = createApp({
  setup() {
    return {
      colaborador,
      sueldoString,
      colaboradores,
      calcularNomina,
      guardarEmpleado,
      colaboradoresTotal,
      submit,
      constante,
      moneyFormatForComponent,
      formatCurrency,
    };
  },
});
app.component("money3", window["v-money3"].Money3Component);
app.use(Quasar, {
  config: {
    brand: {
      secondary: "#0C6455",
      positive: "#0C6423",
    },
  },
});
app.mount("#q-app");
