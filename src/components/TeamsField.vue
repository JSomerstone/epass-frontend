<template>
  <div>
    <b-field>
      <b-autocomplete
          v-model="name"
          placeholder="Team name / Country"
          keep-first
          clear-on-select
          expanded
          :data="matchingNames"
          @select="addTeam">
      </b-autocomplete>
      <b-button 
        icon-left="plus" 
        @click="addTeam(name)" 
        type="is-info"
        :disabled="name.length < 2"
      >
        Add
      </b-button>
    </b-field>
    <div class="team-list">
      <b-tag v-for="(team, index) in teams" v-bind:key="index"
          closable
          aria-close-label="Remove team"
          size="is-medium"
          @close="removeTeam(index)"
        >
          {{ team }}
      </b-tag>
    </div>
  </div>
</template>
<style>
.team-list span {
  margin: 3px;
}
</style>
<script>
export default {
  data(){
    return {
      teams: this.value,
      name: "",
    };
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    removeTeam(index) {
      this.teams.splice(index, 1);
      this.$emit('input', this.teams);
    },
    addTeam(name) {
      if (name.length <= 2 || this.isDuplicate) {
        return;
      }
      this.teams.push(name);
      this.memorizeTeam(name)
      this.name="";
      this.$emit('input', this.teams);
    },
    memorizeTeam: function(team) {
      let existing = Boolean(this.teamPool.find( 
        old => old.toLowerCase() == team.toLowerCase())
      );
      if (! existing) {
        this.$store.dispatch("tournaments/addTeam", { team } );
      }
    }
  },
  computed: {
    teamPool: function() {
      return this.$store.getters['tournaments/teams'];
    },
    matchingNames: function() {
      return this.teamPool.filter( team => {
        return team
          .toString()
          .toLowerCase()
          .indexOf(this.name.toLowerCase()) >= 0
      });
    },
    isDuplicate: function () {
      return Boolean(this.teams.find( 
        team => team.toLowerCase() == this.name.toLowerCase())
      );
    },
  }
}
</script>