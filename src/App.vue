<template>
  <div id="app">
    <vue-headful v-bind:title="title" />
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<style>
  body {
    font-style: normal;
    min-height: 101vh;
    background-color: transparent;
  }
</style>

<script>
  const ucfirst = (word) => word.charAt(0).toUpperCase() + word.slice(1)
  const decebab = word => word.replace( "-" ," ")

  export default {
    name: 'ePass',
    computed: {
      loggedIn: function() {
        return this.$store.getters['auth/loggedIn']
      },
      title: function() {
        return [
          "ePass", 
          this.$route.meta.title
            ? this.$route.meta.title
            : decebab(ucfirst(this.$route.name)) 
          ].join(" - ");
      }
    },
    watch: {
      loggedIn: function(loggedIn) {
        if (loggedIn) {
          if (!this.$store.getters['auth/signupOngoing']) {
            this.$store.dispatch("referees/loadCurrent", { force: true });
            this.$router.push({ name: "frontpage" });
          }
        } else {
          this.$router.push({ name: "login" });
        }
      }
    }
  }
</script>
