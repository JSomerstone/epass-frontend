
<template>
  <layout>
    <template v-slot:hero-title>About ePass</template>
    <template v-slot:hero-subtitle>for goalball referees</template>
    <p>
      If you're a <a href="#">goalball</a> referee who is not pleased
      with the way tournaments are reported to <a href="#">IBSA</a> annually,
      you have come to right place. 
    </p>
    <p>
      ePass for goalball referees is a webapp designed to make reporting tournaments easy.
      Each tournament only have to be reported once - not by every referee induvitially.
    </p>
    <p>
      Start filling your ePass by <router-link :to="{ name: 'signup' }">signing up</router-link>.
    </p>
  </layout>
</template>
<script>
import Layout from "../components/Layout"
export default {
  components: {
    Layout
  }
}
</script>