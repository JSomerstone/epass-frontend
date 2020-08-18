<template>
  <b-autocomplete
    v-model="country"
    :placeholder="placeholder"
    :icon="icon"
    keep-first
    :required="required"
    :disalbed="disalbed"
    :expanded="expanded"
    :data="getCountries"
    @select="selectChanged"
  >
  </b-autocomplete>
</template>
<script>
export default {
  //props: ["value", "icon", "required", "expanded", "placeholder"],
  props: {
    value: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: "earth"
    },
    required: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    disalbed: {
      type: Boolean,
      default: false
    },
    onSelect: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      country: this.value || "",
    }
  },
  methods: {
    selectChanged: function(option) {
      this.$emit('input', option);
      this.onSelect(option);
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