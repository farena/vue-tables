# VueTables

VueTables is a table enhancing VueJs Component with server side pagination, filtering, and
 sorting.  

## Installing VueTables
```
yarn add farena/vue-tables

    or with npm

npm install farena/vue-tables
```

```
src/main.js or src/index.js

import Vue from 'vue';
import App from './App.vue';
import VueTables from 'vue-tables';
import 'vue-tables/dist/vue-tables.css';

Vue.use(VueTables);
```

## Basic Usage
```
Inside any component in the project

<template>    
    <vue-table
      v-if="vTable.headers"
      :values="vTable.values"
      :headers="vTable.headers"
      :actions="vTable.actions"
      :options="vTable.options"
      ref="vtable"
    />
</template>

<script>
export default {
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
            /// Go to ACTIONS SECTION for explanation
        ],
        values: {
          total: 3,
          per_page: 15,
          current_page: 1,
          last_page: 1,
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
        },
        options: {
          /// Go to OPTIONS SECTION for explanation
        },
      },
    };
  },
}
</script>
```

## Headers Options
```
headers: [
    {
      title: 'username', // Name of the key in values.data
      title: 'role.name', // we can concatenate JSON attributes.
      
      mask: 'sign in user', // Title for this column at render
      sortable: true, // Boolean
      sort_value: 'u_name', // (Optional) Name of the column to sort in backend. If it doesnt exist, we send the title string to sort. 
      width: 50, // (Optional)(%) Percentage width of the full table
      editable: 'TYPE' // (Optional) The column is editable, can be any of these types => ['text','number','select','checkbox']
      options: [ { id:1, label: 'option 1' } ], // If is an Editable type 'Select' have to send the options.
      truncate: 100 // type Number. Maximum length for a string.
      callback: function (item) { /.../ } // send a function to execute on the value. return whatever you want.
      dateFormat: 'DD-MM-YYYY' // send a valid MOMENT date format.
      dateFromFormat: 'YYYY-MM-DD' // send a valid MOMENT date format, if your origin format is not the default for moment 'YYYY-MM-DDTHH:mm:ssZ'
    }
],
```

## Actions Options

Action Button you will see in every row

```
actions: [
    {
       buttonClass: 'btn-danger', // use any class you want
       callback: 'onPressDelete', // action you have to subscribe in the vue-table element
       tooltip: 'delete', // tooltip on hover
       icon: 'fas fa-times', // You can use any icon package, just install it before
    },
],
```

In this action example we defined a callback named 'onPressDelete', we have to subscribe to it.

```
<template>    
    <vue-table
      v-if="vTable.headers"
      :values="vTable.values"
      :headers="vTable.headers"
      :actions="vTable.actions"
      :options="vTable.options"
      ref="vtable"
      @onPressDelete="onDeleted" // Subscribing to onPressDelete
    />
</template>

<script>
export default {
  methods: {
    onDeleted(item) {
      console.log(item);
      // the item object contains all the object inside values.data for that row.
    }
  },
}
</script>
```

## Available Options
```
options: {
  tableClass: 'customTableClass', // Table Class. Default: 'table table-bordered table-hover' 
  theadClass: 'customTHeadClass', // Table Head class. Default: null
  tbodyClass: 'customTBodyClass', // Table Body class. Default: null 
  checkeable: false, // Boolean / Activate the checkboxes option
  inputContainerClass: 'form-group', // class for editable colums type 'text','number','select' input container
  inputClass: 'form-control', // class for editable colums type 'text','number','select' input
  checkboxContainerClass: 'form-check', // class for editable colums type 'checkbox' input container
  checkboxClass: 'form-check-input', // class for editable colums type 'checkbox' input
},
```

## Values (with pagination and filters from backend)

This object is received from Backend, it has been taken from laravel pagination
 
More info here: (https://laravel.com/docs/5.8/pagination)

```
<template>    
    <vue-table
      v-if="vTable.headers"
      :values="vTable.values"
      :headers="vTable.headers"
      :actions="vTable.actions"
      :options="vTable.options"
      ref="vtable"
      @changed="getUsers" // subscribe to pagination and filters
    />
</template>

<script>
export default {
  data() {
    return {
      vTable: {
        headers: [
          ///
        ],
        actions: [
          ///
        ],
        values: {}, // we initialize values as an empty Object
        options: {
          /// 
        },
      },
    };
  },
  mounted() {
    // call the init method, and it calls getUsers 
    // (with the corresponding params)
    this.$refs.vTable.init(); 
  },
  methods: {
    // when this functions is called from the @changed event, 
    // vue-table will send the params
    getUsers(params = {}) {
      // axios call to backend.
      // using the created String Prototype function "paginableUrl"
      // we send the params 
      axios.get('/api/users'.paginableUrl(params)) 
        .then(res => {
            this.vTable.values = res;

            // res contains the entire pagination object
            // {
            //   total: 3,
            //   per_page: 15,
            //   current_page: 1,
            //   last_page: 1,
            //   first_page_url: 'http://my.app?page=1',
            //   last_page_url: 'http://my.app?page=1',
            //   next_page_url: 'http://my.app?page=1',
            //   prev_page_url: null,
            //   path: 'http://my.app',
            //   from: 1,
            //   to: 15,
            //   data: [
            //     ///
            //   ],
            // }

        })
        .catch(err => console.log(err));
    },
  },
}
</script>
```

## Reload table
```
<template>    
    <vue-table
      v-if="vTable.headers"
      :values="vTable.values"
      :headers="vTable.headers"
      :actions="vTable.actions"
      :options="vTable.options"
      ref="vtable"
      @changed="getUsers"
    />
</template>

<script>
export default {
  data() {
    return {
      vTable: {
        headers: [
          ///
        ],
        actions: [
          ///
        ],
        values: {},
        options: {
          /// 
        },
      },
    };
  },
  mounted() {
    this.$refs.vTable.init();
  },
  methods: {
    resetTable() {
      // It will reset the table to the first page without filters
      this.$refs.vTable.init();
    },
  },
}
</script>
```

## Checkboxes option
To make batch actions you could use this option
```
options: {
  checkeable: true,
}
```

If you turn it on, you have to subscribe to the @checkAll and @itemChecked callbacks.

```
<template>    
    <vue-table
      v-if="vTable.headers"
      :values="valuesWithCheck" // this item is modified before enter in vue-tables
      :headers="vTable.headers"
      :actions="vTable.actions"
      :options="vTable.options"
      ref="vtable"
      @changed="getUsers"
      @checkAll="onCheckAll"
      @itemChecked="onItemChecked"
    />
</template>

<script>
export default {
  data() {
    return {
      valuesWithCheck: {},
    },
  },
  watch: {
    'vTable.values': {
      handler(val){
          let items = val;
          items.data.map(x => {
              // we add the "checked" key to every item.
              x.checked = false;
              return x;
          });
          this.valuesWithCheck = items;
      },
      deep:true
    },
  },
  methods: {
     onCheckAll(value) {
        console.log(value);
        // value = true / false;

        this.valuesWithCheck.data.map(x => {
            x.checked = value;
        });
     },
     onItemChecked(index, val) {
        this.valuesWithCheck.data[index].checked = val;
     },
     batchAction() {
        // we get all the checked ids
        let checkedIds = this.valuesWithCheck.data
                                .filter(x => x.checked)
                                .map(x => x.id);

        // or we can get all the checked objects
        let checkedObjects = this.valuesWithCheck.data
                                .filter(x => x.checked);

        // do action //
     },
  },
}
</script>
```

## Editable Columns

You can add editable columns type: TEXT, NUMBER, SELECT and CHECKBOX
Every editable column will emit 'editableInput' callback

```
<template>    
    <vue-table
      v-if="vTable.headers"
      :values="values"
      :headers="vTable.headers"
      :actions="vTable.actions"
      :options="vTable.options"
      ref="vtable"
      @editableInput="onItemChanged"
    />
</template>

...

methods: {
  onItemChanged(index, attribute, value) {
    console.log({
      index,
      attribute,
      value,
    });

    // You can now, either store the data directly into the backend, 
    // or update the VALUES array and send it all together after.
  },
}
```

## Custom CSS

You can use CSS or SCSS to modify the table appearence.

```
src/main.js or src/index.js

import Vue from 'vue';
import App from './App.vue';
import VueTables from 'vue-tables';
import 'vue-tables/dist/vue-tables.css';
import 'path/to/my-custom-table-classes.scss';

Vue.use(VueTables);
```

```
./my-custom-table-classes.scss

.p_func {
    .p_func_item {
        label {}
        
        select {}
        
        ul {
            .page-item-desktop {}
            .page-item-mobile {}
        }
    
        input {}
    }
}

// from options you can change your table,
// table header and table body classes.
.my-table-class {
    .my-table-head-class {}
    .my-table-body-class {}

    tr {}
    th {}
    td {}

    input[type=checkbox] {}

    .v-table-tooltip {}

    .btn-group {
        button {}
    }
}
```
