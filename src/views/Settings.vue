<template>
  <layout>
    <template v-slot:hero-title>Settings</template>
    <div class="columns">
      <div class="column"></div>
      <div class="column is-half">
        <settings />
      </div>
      <div class="column"></div>
    </div>
  </layout>
</template>
<style lang="scss">

</style>
<script>
import Layout from "../components/Layout"
import Settings from "../components/Settings"
export default {
  components: {
    Layout,
    Settings
  }
}
</script>