<template>
  <b-autocomplete
    v-model="country"
    :placeholder="placeholder"
    :icon="icon"
    keep-first
    :required="required"
    :expanded="expanded"
    :data="getCountries"
    @select="onSelect"
  >
  </b-autocomplete>
</template>
<script>
export default {
  props: ["value", "icon", "required", "expanded", "placeholder"],
  data() {
    return {
      country: this.value || "",
    }
  },
  methods: {
    onSelect: function(option) {
      this.$emit('input', option);
    }
  },
  computed: {
    getCountries: function() {
      return this.country
        ? this.$store.getters['countries/byName'](this.country)
        : this.$store.getters['countries/all'];
    },
  },
}
</script>