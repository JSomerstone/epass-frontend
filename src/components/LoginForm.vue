<template>
  <div class="columns">
    <div class="column"></div>
    <div class="column is-half">
      <b-field label="Email" label-position="on-border">
        <b-input type="email" v-model="email" placeholder="@" required></b-input>
      </b-field>
      <b-field label="Password" label-position="on-border">
        <b-input type="password" v-model="password" placeholder="********" required></b-input>
      </b-field>
      <b-field>
        <b-button 
          @click="handleLogin" 
          type="is-primary" 
          expanded 
          icon-left="login-variant"
          v-bind:disabled="!authFormReady"
        >Login
        </b-button>
        <router-link
          class="button is-text"
          :to="{ name: 'forgot-password'}"
        >Forgot password?
        </router-link>
      </b-field>
    </div>
    <div class="column"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    }
  },
  computed: {
    isLoading: function() {
      return this.$store.getters['auth/loading'];
    },
    authFormReady: function (){
      return this.email && this.password.length >= 8
    },
    isLoggedIn: function() {
      return this.$store.getters['auth/loggedIn'];
    }
  },
  methods: {
    handleLogin() {
      this.$store.dispatch("auth/login", {
        email: this.email,
        password: this.password
      });
    }
  }
}
</script>