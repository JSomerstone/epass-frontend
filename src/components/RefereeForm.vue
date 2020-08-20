<template>
  <div class="referee-form">
    <div class="field">
      <b-field label="Name*" label-position="on-border">
        <b-input 
          v-model="referee.firstName" 
          :required="true" 
          placeholder="Given name"
          :expanded="true"
        ></b-input>
        <b-input 
          v-model="referee.lastName" 
          :required="true" 
          placeholder="Family name" 
          :expanded="true"
        ></b-input>
      </b-field>
    </div>
    <div class="field">
      <b-field label="Email" label-position="on-border">
        <b-input type="email" v-model="referee.email" placeholder="@"></b-input>
      </b-field>
    </div>
    <div class="field">
      <b-field label="Nationality" label-position="on-border">
        <country-autocomplete
            v-model="referee.country"
            placeholder="As in passport"
            icon="passport"
            expanded
        >
        </country-autocomplete>
      </b-field>
    </div>
    <div class="field">
      <level v-model="referee.level" />
    </div>
  </div>
</template>
<script>
import Referee from "../store/models/RefereeClass";
import Level from "./field/Level";
import CountryAutocomplete from "./field/CountryAutocomplete";
export default {
  components: {
    Level,
    CountryAutocomplete,
  },
  props: {
    value: {
      type: Object,
      default: new Referee()
    }
  },
  data() {
    return {
      referee: this.value
    }
  },
  watch: {
    referee: function(v) {
      this.$emit('value', v);
    }
  }
}
</script>