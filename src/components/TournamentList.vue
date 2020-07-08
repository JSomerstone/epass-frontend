<template>
  <pre>
    {{ tournaments }}
  </pre>
</template>
<script>
export default {
  computed: {
    tournaments: function() {
      return this.$store.getters['tournaments/all'] || [];
    }
  },
}
</script>