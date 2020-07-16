<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<style>
  body {
    font-family: Montserrat;
    font-style: normal;
    min-height: 101vh;
    background-color: transparent;
  }
</style>

<script>
  export default {
    name: 'ePass',
    computed: {
      loggedIn: function() {
        return this.$store.getters['auth/loggedIn']
      }
    },
    watch: {
      loggedIn: function(loggedIn) {
        if (loggedIn) {
          this.$store.getters['auth/signupStep'] > 0
            ||  this.$router.push({ name: "frontpage" });
        } else {
          this.$router.push({ name: "login" });
        }
      }
    }
  }
</script>
