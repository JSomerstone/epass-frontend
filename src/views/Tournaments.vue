<template>
  <layout>
    <template v-slot:title>Tournaments {{ year }}</template>
    <tournament-form class="tournament-form"></tournament-form>
    <tournament-list :loading="isLoading" :items="tournaments" />
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

export default {
  components: {
    Layout,
    TournamentList,
    TournamentForm
  },
  data() {
    return {
      year:  this.$route.params.year || new Date().getFullYear(),
    }
  },
  computed: {
    tournaments: function() {
      return this.$store.getters['tournaments/all'] || [];
    },
    isLoading: function() {
      return this.$store.getters['tournaments/loading'];
    }
  },
  methods: {
    fetchData: function() {
      this.$store.dispatch("tournaments/load", { year: this.year });
      this.$store.dispatch("tournaments/loadTeams");
      this.$store.dispatch("referees/load");
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