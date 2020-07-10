<template>
    <b-navbar>
        <template slot="brand">
          <b-navbar-item tag="router-link" :to="{ path: '/' }">
            <b-icon icon="passport" size="is-large"></b-icon>
            ePass
          </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-dropdown label="Tournaments">
                <b-navbar-item 
                  v-for="year in years"
                  v-bind:key="year"
                  tag="router-link" 
                  :to="{ path: `/tournaments/${year}` }"
                >
                    {{ year }}
                </b-navbar-item>
            </b-navbar-dropdown>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons" v-if="!isLoggedIn">
                    <a class="button is-primary">
                        <strong>Sign up</strong>
                    </a>
                    <a class="button is-light">
                        Log in
                    </a>
                </div>
                <div class="buttons" v-else>
                    <b-button icon-left="account">
                      {{ getCurrent.firstName }}
                      {{ getCurrent.lastName }}
                    </b-button>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>
<style>
.navbar-brand {
  font-size: x-large;
}
</style>
<script>
export default {
  data() {
    return {
      years: [2019, 2020]
    }
  },
  computed: {
    isLoggedIn() {
      return Boolean(this.$store.getters['referees/current']);
    },
    getCurrent() {
      return this.$store.getters['referees/current'];
    }
  },
}
</script>