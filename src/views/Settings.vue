<template>
  <layout>
    <template v-slot:hero-title>Settings</template>
    <div class="columns">
      <div class="column"></div>
      <div class="column is-half">
        <settings/>
      </div>
      <div class="column"></div>
    </div>
  </layout>
</template>
<style lang="scss">

</style>
<script>
import Layout from "../components/Layout"
import Settings from "../components/Settings"
export default {
  components: {
    Layout,
    Settings
  },
  computed: {
    loading: function() {
      return this.$store.getters["referees/loading"];
    }
  },
  methods: {
    loadData: function() {
      if (!this.$store.getters["referees/all"].length) {
        this.$store.dispatch("referees/load");
      }
      if (!this.$store.getters["referees/nationalAssociations"].length) {
        this.$store.dispatch("referees/loadAssociations");
      }
      if (!this.$store.getters["referees/current"].id) {
        this.$store.dispatch("referees/loadCurrent");
      }
    }
  },
  created() {
    this.loadData();
  }

}
</script>