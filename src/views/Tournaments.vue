<template>
  <layout>
    <template v-slot:hero-title v-if="tournamentId">
      {{ selectedTournament.name }}
    </template> 
    <template v-slot:hero-subtitle v-if="tournamentId">
      {{ selectedTournament.city }},
      {{ selectedTournament.country }},
      {{ formatDateRange(selectedTournament.dates) }}
    </template>
    <template v-slot:hero-title v-else>
      Tournaments {{ year }}
    </template>
    <router-link :to="{ name: 'tournaments', params: { year: this.year }}">
      Back
    </router-link>
    <tournament-form 
      class="tournament-form" 
      :selected="tournamentId" 
      :editable="isEditable"
      :open="Boolean(tournamentId)"
    />
    <tournament-filter v-if="!tournamentId" />
    <tournament-list 
      :loading="isLoading" 
      :items="tournaments"
      :year="year"
      v-if="!tournamentId"
    />
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
      tournamentId:  this.$route.params.tournament || null,
    }
  },
  computed: {
    isEditable: function() {
      return this.year == new Date().getFullYear();
    },
    selectedTournament: function() {
      return this.$store.getters['tournaments/byId'](this.tournamentId) || {};
    },
    tournaments: function() {
      return this.$store.getters['tournaments/all'] || [];
    },
    isLoading: function() {
      return this.$store.getters['tournaments/loading'];
    },
    currentRef: function() {
      return this.$store.getters['referees/current'];
    }
  },
  methods: {
    fetchData: function() {
      this.$store.dispatch("referees/load");
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
    '$route': 'fetchData'
  },
}
</script>