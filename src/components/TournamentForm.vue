<template>
    <b-collapse :open="true" aria-id="newEntryForm" animation="slide" >
        <button
            class="button is-primary"
            slot="trigger"
            aria-controls="newEntryForm"
            slot-scope="props"
        >
            New entry&nbsp;
            <b-icon
                :icon="props.open ? 'menu-down' : 'menu-up'">
            </b-icon>
        </button>
        <div class="panel">
            <div class="panel-heading">
                Add tournament to your ePass
            </div>
            <div class="panel-block center">
                <form>
                    <b-field label="Name of tournament" label-position="on-border">
                        <b-input v-bind="name" :required="true"></b-input>
                    </b-field>
                    <b-field label="Place of the tournament" label-position="on-border" grouped>
                        <b-input v-bind="city" :required="true" placeholder="City"></b-input>
                        <b-input v-bind="country" :required="true" placeholder="Country"></b-input>
                    </b-field>
                    <b-field label="Date" grouped label-position="on-border">
                        <b-datepicker
                            placeholder="Start date"
                            icon="calendar-today"
                            trap-focus
                            :required="true"
                            v-bind="startDate">
                        </b-datepicker>
                        <b-datepicker
                            placeholder="End date (optional)"
                            icon="calendar-today"
                            trap-focus
                            v-bind="endDate">
                        </b-datepicker>
                    </b-field>

                    <b-field label="Technical Delegate" label-position="on-border" grouped>
                        <b-autocomplete
                            v-if="!td"
                            v-model="tdQuery"
                            placeholder="Search by name"
                            :keep-first="true"
                            :data="filteredTd"
                            icon="magnify"
                            @select="option => td = option">
                        >
                            <template slot-scope="props">
                                {{ props.option.firstName }} {{ props.option.lastName }}, {{ props.option.country.toUpperCase() }}
                            </template>
                            <template slot="empty">
                                <a @click="showAddReferee">
                                    <span> Add TD... </span>
                                </a>
                            </template>
                        </b-autocomplete>
                        <b-tag 
                            v-if="td"
                            size="is-medium" 
                            closable 
                            rounded
                            @close="td=null"
                        >
                            {{ td.firstName }} {{ td.lastName }} &lt;{{td.email}}&gt;
                        </b-tag>
                    </b-field>
                    
                    <b-field label="Add referees" label-position="on-border">
                        <b-autocomplete
                            v-model="ref"
                            placeholder="Search by name"
                            :keep-first="true"
                            icon="magnify"
                            :data="filteredReferees"
                            @select="selectReferee"
                        >
                            <template slot-scope="props">
                                {{ props.option.firstName }} {{ props.option.lastName }}, {{ props.option.country.toUpperCase() }}
                            </template>
                            <template slot="empty">
                                No results for {{ref}}, 
                                <a @click="showAddReferee">
                                    <span> Add new... </span>
                                </a>
                            </template>
                        </b-autocomplete>
                    </b-field>
                    <div>
                    <b-tag 
                            v-for="ref in referees"
                            v-bind:key="ref.id"
                            size="is-medium" 
                            closable 
                            rounded
                            @close="removeReferee(ref)"
                        >
                            {{ ref.firstName }} {{ ref.lastName }} [{{ ref.country }}]
                        </b-tag>
                    </div>
                    <b-field label="Teams competing (Name / Country)">
                        <b-taginput
                            v-model="teams"
                            :data="filteredTeams"
                            autocomplete
                            :keep-first="true"
                            :allow-new="true"
                            icon="label"
                            placeholder="Add new team"
                            @typing="getFilteredTeams"
                            @add="newTeam"
                        >
                        </b-taginput>
                    </b-field>
                    <pre style="max-height: 400px"><b>Pool:</b>{{ existingTeams }}</pre>
                </form>
            </div>
            <div class="panel-block">
                <button class="button is-primary is-outlined">
                    Save
                </button>
            </div>
        </div>
    </b-collapse>
</template>
<style lang="css">
.panel-block > form{
    margin: 24px;
}
</style>
<script>
export default {
  props: [""],
  data: () => {
      return {
          name: "",
          city: "",
          country: "",
          startDate: null,
          endDate: null,
          tdQuery: "",
          td: null,
          ref: "",
          referees: [],
          teams: [],
          existingTeams: [],
          filteredTeams: [],
          noOfGames: 0,
          noOfTenSeconds: 0
      }
  },
  computed: {
        allValid: function() {
            return false;
        },
        filteredReferees: function() {
            return this.$store.getters['referees/search'](this.ref);
        },
        filteredTd: function() {
            return this.$store.getters['referees/search'](this.tdQuery);
        },
        allTeams: function() {
            return this.$store.getters['tournaments/teams'] || [];
        },
        
  },
  methods: {
      selectReferee: function(referee) {
          if ( ! this.referees.find( r => r.id === referee.id)) {

              this.referees.push({ ...referee, games: 0, officials: 0 });
          }
      },
      removeReferee: function (referee) {
          let index = this.referees.findIndex( ref => ref.id === referee.id );
          if (index) {
              this.referees.splice(index, 1);
          }
      },
      getFilteredTeams: function(text) {
        this.filteredTeams = this.existingTeams.filter((option) => {
                return option
                    .toString()
                    .toLowerCase()
                    .indexOf(text.toLowerCase()) >= 0
            })
        },
      newTeam: function(team) {
            let existing = this.existingTeams.find( 
              t => t.toString().toLowerCase() === team.toLowerCase()
            );
            if ( ! existing) {
                this.$store.dispatch("tournaments/addTeam", { team } );
            }
      },
      showAddReferee: function() {
          alert("Todo: Add referee form as popup/fields");
      }
  },
  mounted() {
      let existingTeams = this.$store.getters['tournaments/teams'] || [];
      this.existingTeams = existingTeams;
      this.filteredTeams = existingTeams;
  },
}
</script>