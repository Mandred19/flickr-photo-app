<template lang="pug">
  section.app
    BaseHeader

    router-view
</template>

<script>
  import BaseHeader from './components/BaseHeader';

  export default {
    name: 'App',
    components: {
      BaseHeader,
    },
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
  .app {
    display: flex;
    flex-flow: column nowrap;
  }
</style>
