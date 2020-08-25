<template>
  <div class="tournament-list">
    <b-table
      :data="items"
      :bordered="false"
      :striped="true"
      :hoverable="true"
      :loading="isLoading"
      default-sort="name"
      default-sort-direction="asc"
      detailed
      detail-key="id"
      ref="table"
    >
      <template slot-scope="props">
        <b-table-column field="name" label="Name" sortable class="name-column">
          <a @click="toggle(props.row)">
            {{ props.row.name }}
          </a>
          <b-tooltip label="Tournament is locked" v-if="props.row.locked" type="is-info">
            <b-icon icon="lock" size="is-small"/>
          </b-tooltip>
        </b-table-column>
        <b-table-column field="dates" label="Date" sortable :custom-sort="sortDates" class="date-column">
          {{ props.row.dates | dateRange }} 
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
        <tournament-detail-row :tournament="props.row" />
      </template>
      <template slot="empty" v-if="!loading">
        <p>
          No tournaments to show, use the form above to add new or
          <b-button @click="handleReload" ref="reloadBtn">Reload</b-button>
        </p>
      </template>
    </b-table>
  </div>
</template>
<style>
.tournament-list {
  margin-bottom: 2em;
}
</style>
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
    },
    year: {
      type: [Number, String],
      required: true
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
    sortDates(rowA, rowB, isAsc) {
      let diff = new Date(rowA.dates[0]).getTime() 
        - new Date(rowB.dates[0]).getTime();
      return isAsc ? diff : diff * -1;
    },
    toggle(row) {
        this.$refs.table.toggleDetails(row)
    },
    handleReload: function() {
      this.$store.dispatch("tournaments/load", { year: this.year, force: true });
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
  filters: {
    dateRange: (dates) => {
      if (! dates) {
        return;
      } else if (dates[0] == dates[1]) {
        return new Date(dates[0]).toLocaleDateString();
      } else {
        return dates.map(
          d => new Date(d).toLocaleDateString()
        ).join(" - ");
      }
    }
  }
}
</script>