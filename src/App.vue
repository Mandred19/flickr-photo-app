<template lang="pug">
  section.app
    router-view
</template>

<script>
  export default {
    name: 'App',
    created() {
      this.$store.dispatch('detectIsMobile');
      window.addEventListener('resize', this.onResizeWindow);
    },
    destroyed() {
      window.removeEventListener('resize', this.onResizeWindow);
    },
    methods: {
      onResizeWindow() {
        this.$store.dispatch('detectIsMobile');
      },
    },
  };
</script>

<style lang="scss">

</style>
