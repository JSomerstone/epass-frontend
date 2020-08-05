<template>
  <layout>
    <template v-slot:hero-title>Statistics</template>
    <template v-slot:hero-subtitle>{{ year }}</template>
    <statistics-table 
      :year="year"
      :tournaments="tournaments"
      :referee="referee"
    />
  </layout>
</template>
<style lang="scss">

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
      if (!this.$store.getters["tournaments/all"].length) {
        this.$store.dispatch("tournaments/load", { year: this.year });
      }
      if (!this.$store.getters["referees/all"].length) {
        this.$store.dispatch("referees/load");
      }
      if (!this.$store.getters["referees/nationalAssociations"].length) {
        this.$store.dispatch("referees/loadAssociations");
      }
      this.$store.dispatch("tournaments/setFilter", { filter: { show: "own" } });
      this.$store.dispatch("tournaments/filter");
    }
  },
  created() {
    this.loadData();
  }

}
</script>