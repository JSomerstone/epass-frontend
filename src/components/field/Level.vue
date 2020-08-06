<template>
  <b-field label="Level" label-position="on-border">
    <b-radio-button v-model="level" :native-value="0" >
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
  props: ["value"],
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