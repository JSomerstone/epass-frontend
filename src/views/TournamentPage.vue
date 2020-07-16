<template>
  <div>
    <layout>
        <template v-slot:hero-title>
        {{ tournament.name }}
        </template> 
        <template v-slot:hero-subtitle>
          {{ tournament.city }},
          {{ tournament.country }},
          {{ tournament.dates | daterange }}
        </template>
        <router-link :to="{ name: 'tournaments', params: { year: this.year }}" class="button is-link">
          Back
        </router-link>
        <tournament-form 
          class="tournament-form" 
          :tournament="tournament" 
          :editable="isEditable"
          open
        />
    </layout>
  </div>
</template>
<style lang="css">
  .tournament-form {
    margin-bottom: 3rem;
  }
</style>
<script>
import Layout from "../components/Layout"
import TournamentForm from "../components/TournamentForm";
import Tournament from "../store/models/Tournament";
import { formatDateRange } from "../utils/dateUtils";

export default {
  components: {
    Layout,
    TournamentForm,
  },
  data() {
    return {
      tournamentId:  this.$route.params.id,
      tournament: new Tournament(),
    }
  },
  computed: {
    isEditable: function() {
      return this.year == new Date().getFullYear();
    },
    year: function(){
      return this.selectedTournament.year || new Date().getFullYear();
    },
    selectedTournament: function() {
      return this.$store.getters['tournaments/wip'] || new Tournament();
    },
    isLoading: function() {
      return this.$store.getters['tournaments/loading'] 
        || this.$store.getters['referees/loading']
        || this.$store.getters['auth/loading'];
    }
  },
  filters: {
    daterange: function (value) {
      return formatDateRange(value);
    }
  },
  methods: {
    fetchData: function() {
      this.$store.dispatch("referees/load");
      this.$store.dispatch("tournaments/loadTeams");
      this.$store.dispatch("tournaments/loadTournament", { 
        id: this.tournamentId,
        onSuccess: (tournament) => {
          this.tournament = tournament;
        }
      });
    }
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