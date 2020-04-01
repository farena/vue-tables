import VueTable from './components/VueTable.vue';

const VueTables = {
  install(Vue) {
    Vue.component('vue-table', VueTable);
  },
};

export default VueTables;
