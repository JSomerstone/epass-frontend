<template>
  <layout>
    <template v-slot:hero-title>Statistics</template>
    <template v-slot:hero-subtitle>{{ year }}</template>
    <statistics-table 
      :year="year"
      :tournaments="tournaments"
      :referee="referee"
    />
    <router-link 
      class="spaced"
      :to="{ name: 'print-epass', params: { refereeId: referee.id, year }}" 
      target="_blank"
    >
      <b-button icon-right="printer">Print E-passport</b-button>
    </router-link>
  </layout>
</template>
<style lang="css" >
.statistics {
  margin-bottom: 2em;
}
</style>
<script>
import Layout from "../components/Layout"
import StatisticsTable from "../components/StatisticsTable"
export default {
  components: {
    Layout,
    StatisticsTable,
  },
  data() {
    return {
      year: this.$route.params.year || new Date().getFullYear()
    }
  },
  computed: {
    loading: function() {
      return this.$store.getters["referees/loading"] || this.$store.getters["tournaments/loading"];
    },
    tournaments() {
      return this.$store.getters["tournaments/all"];
    },
    referee() {
      return this.$store.getters["referees/current"];
    }
  },
  methods: {
    loadData: function() {
      this.$store.dispatch("tournaments/load", { year: this.year });
      this.$store.dispatch("referees/load", { force: false });
      this.$store.dispatch("referees/loadAssociations", { force: false });
      this.$store.dispatch("tournaments/setFilter", { filter: { show: "own" } });
      this.$store.dispatch("tournaments/filter");
    }
  },
  created() {
    this.loadData();
  }

}
</script>