<template>
  <div class="columns">
    <div class="column is-one-third">
      <b-button outline type="is-info" @click="openEditForm" icon-left="file-document-edit-outline">
        Edit
      </b-button>
      <div v-if="hasGames">
        <strong>Your statistics:</strong>
        <ul>
            <li>{{ statistics.games }} Game(s) as referee</li>
            <li>{{ statistics.games }} Game(s) as table official / 10 sec timer</li>
        </ul>
      </div>
    </div>
    <div class="column is-one-third">
      <div>
        <strong>TD:</strong> {{ getRefereeName(tournament.td) }}
      </div>
      <div>
        <strong>Referees:</strong>
        <ul>
          <li v-for="referee in tournament.referees" v-bind:key="referee.id">
            {{ getRefereeName(referee.id) }}
          </li>
        </ul>
      </div>
    </div>
    <div class="column is-one-third">
      <strong>Teams</strong>
      <ul>
        <li v-for="team in tournament.teams" v-bind:key="team">
          {{ team }}
        </li>
      </ul>
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
  },
  computed: {
    statistics: function() {
      const { games= 0, tenSeconds= 0} = this.getCurrentRef() || {};
      return { games, tenSeconds }
    },
    hasGames: function() {
      const ref = this.getCurrentRef();
      return ref 
        ? ref.games || ref.tenSeconds
        : false;
    }
  },
  methods: {
    getRefereeName: function(id) {
      const ref = this.$store.getters['referees/byId'](id);
      return `${ref.firstName} ${ref.lastName} [${ref.country}]`;
    },
    getCurrentRef: function() {
      const current = this.$store.getters['referees/current'];
      if (! current) {
        return;
      }
      return this.tournament.referees.find( r => r.id == current.id );
    },
    openEditForm: function() {
      this.$store.dispatch("tournaments/openForEdit", { tournament: this.tournament });
    }
  },
}
</script>