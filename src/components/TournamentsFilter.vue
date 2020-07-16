<template>
  <b-field>
    <b-radio-button v-model="showTournaments"
        native-value="own"
        type="is-info">
        <b-icon icon="account-circle-outline"></b-icon>
        <span>Your tournaments</span>
    </b-radio-button>

    <b-radio-button v-model="showTournaments"
        native-value="all"
        type="is-info">
        <b-icon icon="earth"></b-icon>
        <span>All tournaments</span>
    </b-radio-button>
  </b-field>
</template>
<script>
export default {
  data() {
    return {
      showTournaments: "own"
    }
  },
  methods: {
    setShowTournaments(show) {
      this.$store.dispatch("tournaments/setFilter", { filter: { show } });
    }
  },
  computed: {
    filter() {
      return this.$store.getters["tournaments/filter"]
    }
  },
  watch: {
    showTournaments(newValue) {
      this.setShowTournaments(newValue);
    }
  },
  created() {
    this.showTournaments = this.filter.show || "own";
  }
}
</script>