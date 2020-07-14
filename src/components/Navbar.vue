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
                  <router-link :to="{ path: '/login'}" class="button is-primary">
                    <strong>Login</strong>
                  </router-link>
                  <router-link :to="{ path: '/signup'}" class="button is-light">
                    Sign up
                  </router-link>
                </div>
                <div class="buttons" v-else>
                    <b-button icon-left="account">
                      {{ getCurrent.email }}
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
      years: [2020, 2019]
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['auth/loggedIn'];
    },
    getCurrent() {
      return this.$store.getters['auth/user'];
    }
  },
}
</script>