<template>
  <layout>
    <template v-slot:title>Tournaments {{ year }}</template>
    This is where the list of tournaments will be
    <tournament-list />
  </layout>
</template>
<style lang="scss">

</style>
<script>
import Layout from "../components/Layout"
import TournamentList from "../components/TournamentList";
export default {
  components: {
    Layout,
    TournamentList
  },
  data() {
    return {
      year: new Date().getFullYear(),
    }
  }
}
</script>