<template>
  <div class="tournament-list">
    <b-table
      :data="items"
      :bordered="false"
      :striped="true"
      :hoverable="true"
      :loading="loading"
      default-sort="dates"
      default-sort-direction="desc"
    >
      <template slot-scope="props">
        <b-table-column field="name" label="Name" sortable>
            {{ props.row.name }}
        </b-table-column>
        <b-table-column field="dates" label="Date" sortable>
          {{ formatDateRange(props.row.dates) }} 
        </b-table-column>
        <b-table-column field="city" label="Location" sortable>
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
  methods: {
    formatDateRange: function(dates) {
      if (!dates) {
        return;
      }
      const formatted = [
        new Date(dates[0]).toISOString().split("T").shift(),
        new Date(dates[1]).toISOString().split("T").shift()
      ];
      if (formatted[0] == formatted[1]) {
        return formatted[0]
      } else {
        return formatted.join(" - ");
      }
    }
  },
}
</script>