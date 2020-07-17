<template>
  <div>
    <!-- PROFILE -->
    <b-collapse
      class="card"
      animation="slide"
      :open="isOpen == P"
      @open="isOpen = P"
    >
      <div
          slot="trigger"
          slot-scope="props"
          class="card-header"
          role="button">
          <span class="card-header-title">Profile</span>
          <a class="card-header-icon">
              <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'">
              </b-icon>
          </a>
      </div>
      <div class="card-content">
        <div class="content referee-form">
          <div class="field">
            <b-field>
              <b-input 
                v-model="referee.firstName" 
                required
                placeholder="Given name" 
                :expanded="true"
              ></b-input>
              <b-input 
                v-model="referee.lastName" 
                required
                placeholder="Family name" 
                :expanded="true"
              ></b-input>
            </b-field>
          </div>
          <div class="field">
            <b-field label="Nationality" label-position="on-border">
              <b-autocomplete
                  v-model="countryQuery"
                  placeholder="As in passport"
                  icon="passport"
                  :keep-first="true"
                  required
                  :data="getCountries(countryQuery)"
                  :expanded="true"
                  @select="option => referee.country = option"
              >
              </b-autocomplete>
            </b-field>
          </div>
          <div class="field">
            <b-field label="Level" label-position="on-border">
              <b-radio-button v-model="referee.level" :native-value="1" >
                  1
              </b-radio-button>
              <b-radio-button v-model="referee.level" :native-value="2" >
                  2
              </b-radio-button>
              <b-radio-button v-model="referee.level" :native-value="3" >
                  3
              </b-radio-button>
              <b-radio-button v-model="referee.level" :native-value="0" >
                  National
              </b-radio-button>
            </b-field>
          </div>
          <div class="field">
            <b-button 
              type="is-primary" 
              @click="handleSave" 
              icon-left="account-check"
              v-bind:loading="isLoading"
            >
              Save</b-button>
            <button class="button is-text" @click="handleCancel">Cancel</button>
          </div>
        </div>
      </div>
    </b-collapse><!-- /PROFILE -->

    <!-- SECURITY -->
    <b-collapse
      class="card"
      animation="slide"
      :open="isOpen == S"
      @open="isOpen = S"
    >
      <div
          slot="trigger"
          slot-scope="props"
          class="card-header"
          role="button">
          <span class="card-header-title">Security</span>
          <a class="card-header-icon">
              <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'">
              </b-icon>
          </a>
      </div>
      <div class="card-content">
        Placeholder for email/password/2fa settings
      </div>
    </b-collapse><!-- /SERCURITY -->
    <!-- ASSOCIATION -->
    <b-collapse
      class="card"
      animation="slide"
      :open="isOpen == N"
      @open="isOpen = N"
    >
      <div
          slot="trigger"
          slot-scope="props"
          class="card-header"
          role="button">
          <span class="card-header-title">National Association</span>
          <a class="card-header-icon">
              <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'">
              </b-icon>
          </a>
      </div>
      <div class="card-content">
        Placeholder for national association of {{ referee.country }} settings.
        Or whatever country the referee lives in...
      </div>
    </b-collapse><!-- /ASSOCIATION -->
  </div>
</template>
<style lang="css">
.referee-form {
  padding: 20px;
}
</style>
<script>
import Referee from "../store/models/RefereeClass";
export default {
  data: () => {
    return {
      S: 'security',
      P: 'profile',
      N: 'national-association',
      isOpen: 'profile',
      referee: new Referee(),
      password: "",
      countryQuery: "",
    }
  },
  computed: {
    userId: function() {
      return this.$store.getters["auth/user"].userId || null
    },
    isLoading: function() {
      return this.$store.getters["auth/loading"] || this.$store.getters["referees/loading"]
    },
    referees: function() {
      return this.$store.getters['referees/all'];
    },
  },
  methods: {
    handleSave: function() {
      if (this.referee.id) {
        this.$store.dispatch("referees/update", { referee: this.referee });
      } else {
        this.$store.dispatch("referees/create", { referee: this.referee });
      }
    },
    handleCancel: function() {
      this.referee = new Referee({ id: null });
    },
    getCountries: function(name) {
      return name
        ? this.$store.getters['countries/byName'](name)
        : [];
    },
    loadData: function() {
      this.referee = new Referee(
        this.$store.getters["referees/byUserId"](this.userId) || {}
      );
      this.countryQuery = this.referee.country;
    }
  },
  watch: {
    userId: function() {
      this.loadData();
    }
  },
  created() {
    this.loadData();
  }
}
</script>