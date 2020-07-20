<template>
  <layout>
    <template v-slot:hero-title>
      Goalball ePass
    </template>
    <b-tabs position="is-centered" class="block" v-model="activeTab" @change="tabChanged">
      <b-tab-item label="Login">
          <login-form />
      </b-tab-item>
      <b-tab-item label="Signup">
        <signup-form />
      </b-tab-item>
    </b-tabs>¨
  </layout>
</template>
<script>
import Layout from "../components/Layout"
import SignupForm from "../components/SignupForm"
import LoginForm from "../components/LoginForm"
export default {
  components: {
    Layout,
    SignupForm,
    LoginForm,
  },
  data() {
    return {
      activeTab: this.tab
    }
  },
  computed: {
    currentUser: function() {
      return this.$store.getters["auth/user"]
    }
  },
  props: ["tab"],
  methods: {
    tabChanged: function(tab) {
      this.$router.replace({
        name: tab == 0 ? "login" : "signup",
      });
    }
  },
}
</script>