<template>
  <div class="p_func">
    <div class="flex-row">
      <div class="p_func_item">
        <div class="flex-row">
          <label>Mostrar</label>
          <select
            v-model="showing"
            class="form-control"
            style="min-width: 50px"
            @change="changeShowing"
          >
            <option value="10">
              10
            </option>
            <option value="50">
              50
            </option>
            <option value="100">
              100
            </option>
          </select>
          <label>Items</label>
        </div>
      </div>
      <div class="p_func_item">
        <div>
          <ul class="flex-row">
            <li
              class="page-item-desktop"
              :class="current_page - 1 === 0 ? 'disabled' : ''"
              @click.prevent="changePage(1)"
            >
              <a
                class="page-link"
                href="#"
              >Primera</a>
            </li>
            <li
              v-for="page in pages_list"
              :key="page.number"
              class="page-item-desktop"
              :class="current_page === page.number ? 'active' : ''"
              @click.prevent="changePage(page.number)"
            >
              <a
                class="page-link"
                href="#"
              >{{ page.number }}</a>
            </li>
            <li
              class="page-item-desktop"
              :class="!lastPage || current_page + 1 > lastPage ? 'disabled' : ''"
              @click.prevent="changePage(lastPage)"
            >
              <a
                class="page-link"
                href="#"
              >Última</a>
            </li>

            <li
              class="page-item-mobile"
              :class="current_page - 1 === 0 ? 'disabled' : ''"
              @click.prevent="changePage(current_page - 1)"
            >
              <a
                class="page-link"
                href="#"
              >Anterior</a>
            </li>
            <li
              class="page-item-mobile"
              :class="current_page + 1 > lastPage ? 'disabled' : ''"
              @click.prevent="changePage(current_page + 1)"
            >
              <a
                class="page-link"
                href="#"
              >Siguiente</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="p_func_item">
        <div>
          <input
            type="text"
            placeholder="Buscar..."
            class="form-control"
            @change="search"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
   * # INPUT
   * - lastPage | required
   *
   * # OUTPUT
   * - changing_page
   * - searching
   * - changing_showing
   */
export default {
  props: {
    lastPage: {
      type: [Number, String],
      default: 1,
    },
    actualPage: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    return {
      showing: 10,
      current_page: 1,
      pages_list: [],
    };
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    lastPage(oldVal, newVal) {
      this.doPagesList();
    },
    actualPage(val) {
      this.current_page = val;
    },
  },
  mounted() {
    this.doPagesList();
  },
  methods: {
    doPagesList() {
      // Reseteo la lista
      this.pages_list = [];

      // Agrego los items antes del actual
      if (this.current_page > 3) {
        for (let i = this.current_page; i >= this.current_page - 2; i -= 1) {
          this.pages_list.unshift({
            number: i,
          });
        }
      } else {
        for (let i = 1; i <= this.current_page; i += 1) {
          this.pages_list.push({
            number: i,
          });
        }
      }

      // Agrego los items despues del actual
      let rest = this.lastPage - this.current_page;

      if (rest !== 0) {
        // reasigno a la cantidad maxima de paginas por delante
        rest = rest > 2 ? 2 : rest;

        for (let i = this.current_page + 1; i <= this.current_page + rest; i += 1) {
          this.pages_list.push({
            number: i,
          });
        }
      }
    },

    changePage(number) {
      if (number > 0 || number <= this.lastPage()) {
        this.current_page = number;
        this.doPagesList();
        this.$emit('changing_page', number);
      }
    },

    changeShowing() {
      this.$emit('changing_showing', this.showing);
    },

    search(evt) {
      this.$emit('searching', evt.target.value);
    },
  },
};
</script>

<style scoped lang="scss">
  .flex-row {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .p_func {
    margin: 30px 0;
    &_item {
      @media(max-width: 767px) {
        width: 100%;
        margin-bottom: 15px;
      }
      @media(min-width: 768px) {
        width: 33.33%;
      }
      text-align: center;

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
    }
  }
  .page-item {
    &-mobile {
      display: none;

      @media(max-width: 767px) {
        display: block;
      }
    }
    &-desktop {
      display: block;

      @media(max-width: 767px) {
        display: none;
      }
    }
  }

  .page-link {
    min-width: 2.6em;
    margin-right: .5em;
    text-align: center;
    border-radius: 4em;
    color: black;
  }

  .page-item:first-child .page-link {
    margin-left: 0;
  }

  .page-item:first-child .page-link, .page-item:last-child .page-link {
    margin-left: 0;
    border-radius: 4rem;
  }

  .form-inline label {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0;
  }
</style>
