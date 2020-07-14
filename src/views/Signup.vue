<template>
  <layout>
    <template v-slot:hero-title>
      Goalball ePass
    </template>
    <b-tabs position="is-centered" class="block" v-model="activeTab">
      <b-tab-item label="Login">
          Login-form goes here
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
export default {
  components: {
    Layout,
    SignupForm
  },
  data() {
    return {
      activeTab: 0
    }
  },
  props: ["tab"],
  mounted(){
    this.activeTab = Number(this.tab);
  }
}
</script>