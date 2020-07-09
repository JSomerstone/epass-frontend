<template>
  <div class="referee-form">
    <div class="field">
      <b-field>
        <b-input v-model="firstName" :required="true" placeholder="Given name"></b-input>
        <b-input v-model="lastName" :required="true" placeholder="Family name"></b-input>
      </b-field>
    </div>
    <div class="field">
      <b-field label="Email" label-position="on-border">
        <b-input v-model="email" placeholder="@" :required="emailRequired"></b-input>
      </b-field>
    </div>
    <div class="field">
      <b-field label="Nationality" label-position="on-border">
        <b-input v-model="country" placeholder="As in passport" :required="countryRequired"></b-input>
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
      </b-field>
    </div>
    <div class="field">
      <button class="button is-success" @click="handleSave" outlined>Add</button>
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
    emailRequired: {
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
    }
  },
}
</script>