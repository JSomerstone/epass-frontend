<template>
  <layout>
    <template v-slot:hero-title>Settings</template>
    <div class="columns">
      <div class="column"></div>
      <div class="column is-half">
        <div v-if="loading" class="loading">
          Loading...
        </div>
        <settings v-else />
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
    }
  },
  created() {
    this.loadData();
  }

}
</script>