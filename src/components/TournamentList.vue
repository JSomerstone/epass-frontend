<template>
  <div>
    <b-table
      :data="isEmpty ? [] : items"
      :bordered="false"
      :striped="true"
      :hoverable="true"
      :loading="loading"
    >
      <template slot-scope="props">
          <b-table-column field="name" label="Name" >
              {{ props.row.name }}
          </b-table-column>
          <b-table-column field="date" label="Date" >
            <span v-if="props.row.date.length > 1">
              {{ props.row.date[0] }} - {{ props.row.date[1] }}
            </span>
            <span v-else>
               {{ props.row.date[0] || "" }}
            </span>
          </b-table-column>
          <b-table-column field="city" label="Location">
              {{ props.row.city }}, {{ props.row.country }}
          </b-table-column>
          <b-table-column field="teams" label="Teams" numeric>
              {{ props.row.teams.length }}
          </b-table-column>
      </template>
    </b-table>
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }, 
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    isEmpty: function() {
      return this.items.length == 0;
    },
  },
}
</script>