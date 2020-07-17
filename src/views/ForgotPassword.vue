¨<template>
  <layout>
    <template v-slot:hero-title>Forgot password?</template>
    <template v-slot:hero-subtitle>Verify address and set new password</template>
    <div class="columns">
      <div class="column"></div>
      <div class="column is-half">
        <forgot-password-form />
      </div>
      <div class="column"></div>
    </div>
  </layout>
</template>
<style lang="scss">

</style>
<script>
import Layout from "../components/Layout"
import ForgotPasswordForm from "../components/ForgotPasswordForm"
export default {
  components: {
    Layout,
    ForgotPasswordForm
  },
}
</script>