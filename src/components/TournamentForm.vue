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
                    <b-field label="Referees" label-position="on-border">
                        <b-autocomplete
                            v-model="ref"
                            placeholder="e.g. Anne"
                            :keep-first="true"
                            :data="filteredReferees"
                            @select="selectReferee"
                        >
                            <template slot-scope="props">
                                {{ props.option.lastName }}, {{ props.option.firstName }}, {{ props.option.country.toUpperCase() }}
                            </template>
                            <template slot="empty">
                                No results for {{ref}}, 
                                <a @click="showAddReferee">
                                    <span> Add new... </span>
                                </a>
                            </template>
                        </b-autocomplete>
                    </b-field>
                    <b-table :data="referees" :columns="refereeTableColumns"></b-table>

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
          td: null,
          referees: [],
          refereeTableColumns: [
            {
                field: 'lastName',
                label: 'Last Name',
            },
            {
                field: 'firstName',
                label: 'First Name',
            },
            {
                field: 'country',
                label: 'Country'
            },
            {
                field: 'level',
                label: 'Level',
                centered: true
            }
          ],
          teams: [],
          ref: ''
      }
  },
  computed: {
      allValid: function() {
          return false;
      },
      filteredReferees: function() {
          return this.$store.getters['referees/search'](this.ref);
      }
  },
  methods: {
      selectReferee: function(referee) {
          if ( ! this.referees.find( r => r.id === referee.id)) {
              this.referees.push(referee);
          }
      },
      showAddReferee: function() {
          alert("Todo: Add referee form as popup/fields");
      }
  },
}
</script>