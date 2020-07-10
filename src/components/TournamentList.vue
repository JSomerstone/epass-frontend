<template>
  <div class="tournament-list">
    <b-table
      :data="items"
      :bordered="false"
      :striped="true"
      :hoverable="true"
      :loading="isLoading"
      default-sort="dates"
      default-sort-direction="desc"
      detailed
      detail-key="id"
      ref="table"
    >
      <template slot-scope="props">
        <b-table-column field="name" label="Name" sortable>
          <a @click="toggle(props.row)">
            {{ props.row.name }}
          </a>
        </b-table-column>
        <b-table-column field="dates" label="Date" sortable>
          {{ formatDateRange(props.row.dates) }} 
        </b-table-column>
        <b-table-column field="international" label="Type" sortable>
          {{ props.row.international ? "International" : "National" }}
        </b-table-column>
        <b-table-column field="city" label="Location" sortable>
            {{ props.row.city }}, {{ props.row.country }}
        </b-table-column>
        <b-table-column label="Statistics" title="Games / official duties">
            {{ getStatistics(props.row) }}
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        <tournament-detail-row :tournament="props.row">
        </tournament-detail-row>
      </template>
    </b-table>
  </div>
</template>
<script>
import TournamentDetailRow from "./TournamentDetailRow";

export default {
  components: {
    TournamentDetailRow
  },
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
    isLoading: function() {
      return this.$store.getters['tournaments/loading'];
    }
  },
  methods: {
    toggle(row) {
        this.$refs.table.toggleDetails(row)
    },
    formatDateRange(dates) {
      if (!dates) {
        return;
      }
      const formatted = dates.map(
        d => new Date(d).toLocaleDateString()
      );
      if (formatted[0] == formatted[1]) {
        return formatted[0]
      } else {
        return formatted.join(" - ");
      }
    },
    getStatistics(tournament) {
      const current = this.$store.getters['referees/current'];
      if (! current) {
        return;
      }
      const referee = tournament.referees.find( r => r.id == current.id );
      const { games= "-", tenSeconds= "-"} = referee || {};
      return `${games} / ${tenSeconds}`;
    }
  },
}
</script>