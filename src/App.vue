<template>
  <div id="app">
    <h1>Vue Tables</h1>
    <vue-table
      v-if="vTable.headers"
      ref="vtable"
      :values="vTable.values"
      :headers="vTable.headers"
      :actions="vTable.actions"
      :options="vTable.options"
    />
  </div>
</template>

<script>
import VueTable from './components/VueTable.vue';

export default {
  name: 'App',
  components: {
    VueTable,
  },
  data() {
    return {
      vTable: {
        headers: [
          {
            title: 'name',
            sortable: true,
          },
          {
            title: 'username',
            sortable: true,
          },
        ],
        actions: [
          {
            buttonClass: 'btn-warning',
            tooltip: 'Show Details',
            callback: 'onShowDetails',
            icon: 'search',
          },
          {
            buttonClass: 'btn-info',
            tooltip: 'Edit User',
            callback: 'onEdit',
            icon: 'edit',
          },
          {
            buttonClass: 'btn-danger',
            tooltip: 'Delete User',
            callback: 'onDelete',
            icon: 'close',
          },
        ],
        values: {},
        options: {
          checkeable: true,
        },
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.vTable.values = {
        total: 3,
        per_page: 15,
        current_page: 1,
        last_page: 1,
        first_page_url: 'http://my.app?page=1',
        last_page_url: 'http://my.app?page=1',
        next_page_url: 'http://my.app?page=1',
        prev_page_url: null,
        path: 'http://my.app',
        from: 1,
        to: 15,
        data: [
          {
            id: 1,
            name: 'Pedro Aznar',
            username: 'paznar',
          },
          {
            id: 2,
            name: 'Charlie Alberti',
            username: 'chalberti',
          },
          {
            id: 3,
            name: 'Gustavo Cerati',
            username: 'gcerati',
          },
        ],
      };
    }, 10000);
  },
};
</script>

<style lang="scss">
</style>
