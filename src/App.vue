<template>
  <div id="app">
    <div class="container">
      <h1>Vue Tables</h1>
      <vue-table
        v-if="vTable.headers"
        ref="vtable"
        :values="vTable.values"
        :headers="vTable.headers"
        :actions="vTable.actions"
        :options="vTable.options"
        @onEdit="onEdit"
        @onSave="onSave"
        @editableInput="onItemChanged"
      />
    </div>
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
            editable: 'text',
          },
          {
            title: 'username',
            sortable: true,
            editable: 'text',
          },
          {
            title: 'username',
            sortable: true,
            editable: 'text',
          },
          {
            title: 'username',
            sortable: true,
            editable: 'text',
          },
          {
            title: 'age',
            sortable: true,
            editable: 'number',
          },
          {
            title: 'validated',
            sortable: true,
            editable: 'checkbox',
          },
          {
            title: 'role.name',
            mask: 'role',
            editable: 'select',
            options: [
              { id: 'admin', label: 'admin' },
              { id: 'manager', label: 'manager' },
              { id: 'user', label: 'user' },
            ],
          },
        ],
        actions: [
          {
            buttonClass: 'btn-warning',
            tooltip: 'Show Details',
            callback: 'onShowDetails',
            icon: 'fas fa-search',
          },
          {
            buttonClass: 'btn-info',
            tooltip: 'Edit User',
            callback: 'onEdit',
            icon: 'fas fa-edit',
          },
          {
            buttonClass: 'btn-success',
            tooltip: 'Save User',
            callback: 'onSave',
            icon: 'fas fa-save',
          },
          {
            buttonClass: 'btn-danger',
            tooltip: 'Delete User',
            callback: 'onDelete',
            icon: 'fas fa-times',
          },
        ],
        values: {},
        options: {
          checkeable: true,
          searchable: false,
          inputContainerClass: 'form-group',
          inputClass: 'form-control',
          checkboxContainerClass: 'form-check',
          checkboxClass: 'form-check-input',
        },
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.vTable.values = {
        total: 300,
        per_page: 15,
        current_page: 1,
        last_page: 11,
        from: 1,
        to: 15,
        data: [
          {
            id: 1,
            name: 'Pedro Aznar',
            username: 'paznar',
            age: 18,
            validated: true,
            role: {
              name: 'admin',
            },
          },
          {
            id: 2,
            name: 'Charlie Alberti',
            username: 'chalberti',
            age: 20,
            validated: false,
            role: {
              name: 'manager',
            },
          },
          {
            id: 3,
            name: 'Gustavo Cerati',
            username: 'gcerati',
            age: 25,
            validated: false,
            role: {
              name: 'user',
            },
          },
        ],
      };
    }, 1000);
  },
  methods: {
    onEdit(item, index) {
      this.vTable.values.data[index].editable = true;
    },
    onSave(item) {
      item.editable = false;
      // axios call to backend
    },
    onItemChanged(index, attribute, value) {
      console.log({
        index,
        attribute,
        value,
      });
    },
  },
};
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css';
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css';
</style>
