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
                <b-navbar-dropdown  v-else :label="username">
                  <b-navbar-item to="/settings" tag="router-link">
                      <b-icon icon="account-cog-outline"></b-icon> Settings
                  </b-navbar-item>
                  <b-navbar-item @click="handleLogout">
                      <b-icon icon="logout-variant"></b-icon> Logout
                  </b-navbar-item>
              </b-navbar-dropdown>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>
<style>
.navbar-brand {
  font-size: x-large;
}
.navbar-item > .icon {
  padding-right: 1em;
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
    },
    username: function() {
      return this.getCurrent.email.split("@").shift()
    }
  },
  methods: {
    handleLogout: function() {
      this.$store.dispatch("auth/logout");
    }
  },
}
</script>