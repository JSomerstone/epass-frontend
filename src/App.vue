<template>
  <amplify-authenticator>
    <!-- The rest of your app code -->
    <div id="app">
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <amplify-sign-out></amplify-sign-out>
  </amplify-authenticator>
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
  }
</script>
