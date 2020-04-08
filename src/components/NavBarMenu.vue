<template lang="pug">
  b-navbar-nav
    b-nav-item(
      v-for="(item, key) of baseNavBarList"
      :key="key"
      tag="router-link"
      :to="item.to"
      :disabled="item.isDisabled"
    ) {{ item.title }}
</template>

<script>
  export default {
    name: 'NavBarMenu',
    computed: {
      baseNavBarList() {
        return [
          {
            to: { name: 'main' },
            title: 'Link Title',
            isDisabled: false,
          },
        ];
      },
    },
  };
</script>

<style lang="scss">

</style>
