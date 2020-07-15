<template>
  <layout>
    <template v-slot:hero-title>
      Goalball ePass
    </template>
    <b-tabs position="is-centered" class="block" v-model="activeTab">
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
      activeTab: 0
    }
  },
  computed: {
    currentUser: function() {
      return this.$store.getters["auth/user"]
    }
  },
  props: ["tab"],
  mounted(){
    this.activeTab = Number(this.tab);
  }
}
</script>