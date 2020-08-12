<template>
  <layout>
    <template v-slot:hero-title>Tournaments</template>
    <template v-slot:hero-subtitle>{{ year }}</template>
    <tournament-form 
      class="tournament-form" 
      :editable="isEditable"
      :open="Boolean($route.query.new)"
      :year="Number(year)"
    />
    <tournament-filter />
    <tournament-list 
      :loading="isLoading" 
      :items="tournaments"
      :year="year"
    />
    <router-link 
      v-if="year == 2020"
      class="spaced"
      :to="{ name: 'print-epass', params: { refereeId: currentRef.id, year }}" 
      target="_blank"
    >
      <b-button icon-right="printer">Print E-passport</b-button>
    </router-link>
    <pre v-if="debug">{{ tournaments }}</pre>
  </layout>
</template>
<style lang="css">
  .tournament-form {
    margin-bottom: 3rem;
  }
</style>
<script>
import Layout from "../components/Layout"
import TournamentList from "../components/TournamentList";
import TournamentForm from "../components/TournamentForm";
import TournamentFilter from "../components/TournamentsFilter";
import { formatDateRange } from "../utils/dateUtils";
import { mapGetters } from 'vuex'

export default {
  components: {
    Layout,
    TournamentList,
    TournamentForm,
    TournamentFilter,
  },
  data() {
    return {
      year:  this.$route.params.year || new Date().getFullYear(),
    }
  },
  computed: {
    isEditable: function() {
      return this.year >= new Date().getFullYear() - 1;
    },
    ...mapGetters({
        debug: "tournaments/debug",
        tournaments: "tournaments/all",
        isLoading: "tournaments/loading",
        currentRef: "referees/current",
    }),
  },
  methods: {
    fetchData: function() {
      this.$store.dispatch("referees/load", { force: false });
      this.$store.dispatch("tournaments/loadTeams");
      this.$store.dispatch("tournaments/load", { year: this.year });
    },
    formatDateRange: (dates) => formatDateRange(dates),
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData',
    currentRef: function(referee) {
      referee && this.$store.dispatch("tournaments/filter");
    }
  },
}
</script>