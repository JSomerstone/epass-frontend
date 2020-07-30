<template>
  <div class="referee-form">
    <div class="field">
      <b-field>
        <b-input 
          v-model="firstName" 
          :required="true" 
          placeholder="Given name" 
          :expanded="true"
        ></b-input>
        <b-input 
          v-model="lastName" 
          :required="true" 
          placeholder="Family name" 
          :expanded="true"
        ></b-input>
      </b-field>
    </div>
    <div class="field">
      <b-field label="Email" label-position="on-border">
        <b-input type="email" v-model="email" placeholder="@" required></b-input>
      </b-field>
    </div>
    <div class="field">
      <b-field :label="countryTitle" label-position="on-border" :required="countryRequired">
        <b-autocomplete
            v-model="countryQuery"
            placeholder="As in passport"
            icon="passport"
            :keep-first="true"
            :required="countryRequired"
            :data="getCountries(countryQuery)"
            :expanded="true"
            @select="option => country = option"
        >
        </b-autocomplete>
      </b-field>
    </div>
    <div class="field">
      <b-field label="Level" label-position="on-border">
        <b-radio-button v-model="level" :native-value="1" >
            1
        </b-radio-button>
        <b-radio-button v-model="level" :native-value="2" >
            2
        </b-radio-button>
        <b-radio-button v-model="level" :native-value="3" >
            3
        </b-radio-button>
        <b-radio-button v-model="level" :native-value="0" >
            National
        </b-radio-button>
      </b-field>
    </div>
    <div class="field">
      <b-button type="is-info" outlined @click="handleSave" icon-left="account-plus" :disabled="!isReady">
        Add</b-button>
      <button class="button is-text" @click="handleCancel">Cancel</button>
    </div>
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
  props: {
    onSave: {
      type: Function,
      default: () => {}
    },
    onCancel: {
      type: Function,
      default: () => {}
    },
    countryRequired: {
      type: Boolean,
      default: true
    },
    levelRequired: {
      type: Boolean,
      default: true
    },
    prefilled: {
      type: String,
      default: ""
    }
  },
  data: () => {
    return {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      countryQuery: "",
      level: 1
    }
  },
  methods: {
    handleSave: function() {
      const referee = new Referee({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        country: this.country,
        level: this.level
      });
      this.onSave(referee);
      this.reset();
    },
    handleCancel: function() {
      this.onCancel();
      this.reset();
    },
    reset: function(){
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.country = "";
      this.level = 1;
    },
    getCountries: function(name) {
      return name
        ? this.$store.getters['countries/byName'](name)
        : [];
    }
  },
  computed: {
    countryTitle: function() {
      return this.countryQuery 
        ? "Nationality"
        : "Nationality (optional)";
    },
    isReady: function() {
      return (
        this.firstName && this.lastName && this.email && (this.country || !this.countryRequired)
      )
    }
  },
}
</script>