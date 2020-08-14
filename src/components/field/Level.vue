<template>
  <b-field :label="label" :label-position="labelPosition">
    <b-radio-button v-model="level" :native-value="0" v-if="!hideNational">
        National
    </b-radio-button>
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
</template>
<script>
export default {
  props: {
    value: { type: Number, required: true },
    label: { type: String, default: "Level" },
    'label-position': { type: String, default: "on-border" },
    'hide-national': { type: Boolean, default: false},
  },
  data() {
    return {
      level: this.value
    }
  },
  watch: {
    level: function(newValue) {
      this.$emit('input', newValue);
    }
  },
}
</script>