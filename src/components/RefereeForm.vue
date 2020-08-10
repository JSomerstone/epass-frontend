<template>
  <div class="referee-form">
    <div class="field">
      <b-field label="Name*" label-position="on-border">
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
        <b-input type="email" v-model="email" placeholder="@"></b-input>
      </b-field>
    </div>
    <div class="field">
      <b-field label="Nationality" label-position="on-border">
        <b-autocomplete
            v-model="countryQuery"
            placeholder="As in passport"
            icon="passport"
            :keep-first="true"
            :data="getCountries(countryQuery)"
            :expanded="true"
            @select="option => country = option"
        >
        </b-autocomplete>
      </b-field>
    </div>
    <div class="field">
      <level v-model="level" />
    </div>
    <div class="field">
      <b-button type="is-info" outlined @click="handleSave" icon-left="account-plus" :disabled="!isReady">
        Add</b-button>
      <button class="button is-text" @click="handleCancel">Cancel</button>
    </div>
  </div>
</template>
<script>
import Referee from "../store/models/RefereeClass";
import Level from "./field/Level"
export default {
  components: {
    Level
  },
  props: {
    onSave: {
      type: Function,
      default: () => {}
    },
    onCancel: {
      type: Function,
      default: () => {}
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
    isReady: function() {
      return (
        this.firstName && this.lastName
      )
    }
  },
}
</script>