<template>
  <div>
    <page-functions
      :actual_page="values.current_page"
      :last_page="values.last_page"
      @changing_page="pageChanged"
      @searching="searched"
      @changing_showing="showChanged"
    />

    <div>
      <table :class="opts.tableClass">
        <thead :class="opts.theadClass">
        <tr>
          <td v-if="opts.checkeable">
            <input type="checkbox" class="mt-2" v-model="checkAll">
          </td>
          <template v-for="head in headers">
            <td :style="{width:head.width ? head.width+'%' : 'auto'}"
                :key="head.key"
                :class="head.sortable ? 'sortable' : ''"
                @click="sorted(head)">

              {{head.mask ? head.mask.ucwords() : head.title ? head.title.ucwords() : ''}}

              <i class="fa"
                 v-if="head.sortable &&
                      (sortedBy === head.title || sortedBy === head.sort_value)"
                 :class="sortedDir === 'desc' ? 'fa-sort-down' : 'fa-sort-up'"/>
              <i class="fa fa-sort"
                 v-if="head.sortable && sortedBy !== head.title && sortedBy
                      !== head.sort_value"
              />

            </td>
          </template>
          <td style="width: 1%"/>
        </tr>
        </thead>
        <tbody :class="opts.tbodyClass">
        <template
          v-if="!values || values.length === 0 ||
              Object.keys(values).length === 0 && values.constructor === Object">
          <tr>
            <td :colspan="headers.length + 1" style="text-align: center">
              <loader/>
            </td>
          </tr>
        </template>
        <tr v-for="(item,a) in values.data" :key="item.id">
          <td v-if="opts.checkeable">
            <input type="checkbox" class="mt-2" v-model="item.checked"
                   @click="$emit('itemChecked',a, $event.target.checked)">
          </td>
          <td v-for="(head,b) in headers" :key="b" v-if="truncate">
            <span v-if="item[head.title] && item[head.title].length >= truncate">
                {{head.pre}}{{item[head.title].slice(0,truncate-3)+'...'}}
                <span class="v-table-tooltip">{{item[head.title]}}</span>
            </span>
            <span v-else>
                {{head.pre}}{{item[head.title]}}
            </span>
          </td>
          <td v-for="(head,b) in headers" :key="b" v-if="!truncate">
            {{head.pre}}{{item[head.title]}}
          </td>
          <td style="text-align: right">
            <div class="btn-group">
              <button class="btn btn-sm"
                      v-for="(act,i) in actions"
                      :key="i"
                      :class="act.buttonClass"
                      v-if="item[act.callback] !== false"
                      @click="$emit(act.callback,item)">
                <i :class="act.icon"/>
                <span class="v-table-tooltip">{{act.tooltip}}</span>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <td colspan="1000" style="text-align: center"
              v-if="values.data && values.data.length > 0">Mostrando desde
            <b>{{values.from}}</b> hasta <b>{{values.to}}</b> de <b>{{values.total}}</b>
            elementos.
          </td>
          <td colspan="1000" style="text-align: center"
              v-if="values.data && values.data.length <= 0">No hay elementos para mostrar.
          </td>
        </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
/**
   * Valores recibidos
   *
   * # HEADERS
   * - title : string / nullable
   * - mask : string / nullable
   * - width: number(%) / nullable
   * - sortable: bool
   * - date: bool / unique (Solo un header con este campo, se utiliza para los filtros desde/hasta)
   *
   * # VALUES
   * - pagination from laravel (https://laravel.com/docs/5.8/pagination)
   *
   * # ACTIONS
   * - buttonClass
   * - callback
   * - tooltip
   * - icon
   *
   * # OPTIONS
   * - tableClass
   * - theadClass
   * - tbodyClass
   * - customFilters / Object array
   *      - title / nombre de columna
   *      - options / array de options
   *      # ej:
   *          - {
   *              title:'Tipos de Movimiento',
   *              column:'id_tipo_movimiento',
   *              options:[
   *                  {value:1,label:'Orden de Compra'}
   *              ]
   *          }
   */

/**
   * Valores Emitidos
   * - changed (se modifican los parametros de busqueda)
   */
import '../utils/ucwords';
import '../utils/paginable';
import PageFunctions from './PageFunctions.vue';
import loader from './loader.vue';

export default {
  name: 'vueTables',
  components: {
    PageFunctions,
    loader,
  },
  props: {
    headers: {
      type: Array,
    },
    values: {
      type: Object,
    },
    options: {
      type: Object,
    },
    actions: {
      type: Array,
    },
    truncate: {
      type: [Number, Boolean],
      default: false,
    },
  },
  data() {
    return {
      opts: {
        tableClass: 'table table-bordered table-hover',
        theadClass: '',
        tbodyClass: '',
        checkeable: false,

      },
      sortedBy: '',
      sortedDir: 'asc',
      date_column: null,
      vTableParams: {
        page: 1,
        search: null,
        sortBy: null,
        sortDir: null,
        filters: null,
        per_page: 10,
      },
      checkAll: false,
    };
  },
  mounted() {
    if (!this.values) throw new Error('Debe ingresar informacion en el input VALUES. (ej.: :values="myData")');
    if (!this.headers) throw new Error('Debe ingresar informacion en el input HEADERS. (ej.: :headers="myHeaders")');

    let dateCounter = 0;
    this.headers.map((x) => {
      if (x.date) {
        this.date_column = x.title;
        dateCounter += 1;
      }

      if (dateCounter > 1) throw new Error('No puede haber mas de un campo DATE=TRUE');
      return x;
    });

    if (this.options) {
      Object.keys(this.options).map((key) => {
        if (key in this.opts) {
          if (key === 'checkeable' && typeof this.options[key] !== 'boolean') {
            return null;
          }
          this.opts[key] = this.options[key];
        }
        return key;
      });
    }
  },
  watch: {
    checkAll: {
      handler(val) {
        this.$emit('checkAll', val);
      },
    },
  },
  methods: {
    pageChanged(val) {
      this.vTableParams.page = val;
      this.changed();
    },
    searched(val) {
      this.vTableParams.page = 1;
      this.vTableParams.search = val;
      this.changed();
    },
    showChanged(val) {
      this.vTableParams.page = 1;
      this.vTableParams.per_page = val;
      this.changed();
    },
    sorted(item) {
      if (item.sortable) {
        if (this.sortedBy === item.title || this.sortedBy === item.sort_value) {
          this.sortedDir = this.sortedDir === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortedDir = 'asc';
        }

        this.sortedBy = item.sort_value ? item.sort_value : item.title;

        this.vTableParams.sortBy = this.sortedBy;
        this.vTableParams.sortDir = this.sortedDir;

        this.changed();
      }
    },

    changed() {
      this.$emit('changed', this.vTableParams);
    },

    init() {
      this.$emit('changed', {
        page: 1,
        search: null,
        sortBy: null,
        sortDir: null,
        filters: null,
        per_page: 10,
      });
    },
  },
};
</script>

<style scoped>
  table {
    width: 100%;
  }
  table td, table tr {
    font-size: 98%;
  }

  .sortable {
    cursor: pointer;
  }

  td, th {
    padding: 5px !important;
  }

  .btn-group {
    margin: 5px 1px !important;
  }

  td {
    border-top: none;
    white-space: nowrap;
  }

  .btn.btn-sm {
    padding: 4px;
    width: 25px;
  }

  .btn-sm i {
    font-size: 100% !important;
  }

  .table-responsive {
    overflow-y: hidden;
  }

  .v-table-tooltip {
    position:absolute;
    background: rgba(0,0,0,.75);
    color: white;
    padding: 8px 10px;
    border-radius: .25rem;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: ease .5s;
  }

  .btn:hover .v-table-tooltip,
  span:hover .v-table-tooltip {
    opacity: 1;
    transition: ease .5s;
  }
</style>
