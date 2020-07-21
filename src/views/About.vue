
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
    <p>
      This site has been done voluntarily without any compensation from IBSA. If it makes your life
      little easier, please concider giving me a small tip:
    </p>
    <div class="content has-text-centered">
      <donate />
    </div>
  </layout>
</template>
<script>
import Layout from "../components/Layout"
import Donate from "../components/Donate"
export default {
  components: {
    Layout,
    Donate
  }
}
</script>