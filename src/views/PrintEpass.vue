<template>
  <div>
    <h1>Referee ePass {{ year }}</h1>
    <pre>
      {{ referee }}
    </pre>
    <pre>
      {{ association }}
    </pre>
    <pre>
      {{ tournaments }}
    </pre>
  </div>
</template>
<style lang="scss">

</style>
<script>
export default {
  components: {
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
    },
    association() {
      const { associationId } = this.referee;
      return this.$store.getters["referees/nationalAssociations"].find(
        a => a.id == associationId
      );
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