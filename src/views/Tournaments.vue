<template>
  <layout>
    <template v-slot:title>Tournaments {{ year }}</template>
    <tournament-form></tournament-form>
    <tournament-list :loading="isLoading" :items="tournaments" />
  </layout>
</template>
<style lang="scss">

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
      year: new Date().getFullYear(),
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
  },
}
</script>