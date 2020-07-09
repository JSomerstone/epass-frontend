<template>
  <div class="columns">
    <div class="column is-one-third">
      {{ tournament.td }}
    </div>
    <div class="column is-one-third">
      {{ tournament.referees }}
    </div>
    <div class="column is-one-third">
      {{ tournament.teams }}
    </div>
  </div>
</template>
<script>
import Tournament from "../store/models/Tournament"
export default {
  props: {
    tournament: {
      type: Object,
      default: () => new Tournament()
    }
  }
}
</script>