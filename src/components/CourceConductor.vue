<template>
  <b-select :placeholder="placeholder" @input="onChange" :expanded="expanded" v-model="selected">
      <option
        v-for="option in conductors"
        :value="option.name"
        :key="option.country"
      >
        {{ option.name }} [{{ option.country }}]
      </option>
  </b-select>
</template>
<script>
export default {
  props: ["value", "placeholder", "expanded"],
  data() {
    return {
      selected: this.value
    }
  },
  computed: {
    conductors: function() {
      return this.$store.getters['referees/conductors']
    }
  },
  methods: {
    onChange(newValue) {
      this.$emit('input', newValue);
    },
  },
}
</script>