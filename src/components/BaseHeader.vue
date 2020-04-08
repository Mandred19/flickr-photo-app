<template lang="pug">
  b-navbar(toggleable='lg' type='dark' variant='info')
    b-navbar-brand(
      tag="router-link"
      :to="{ name: 'main' }"
      ) {{ appName }}

    b-navbar-toggle(target='nav-collapse')

    b-collapse#nav-collapse(is-nav='')
      NavBarMenu

      b-navbar-nav.ml-auto
        b-nav-form(@submit.prevent="onSearch(search)")
          b-form-input.mr-sm-2(v-model="search" size='sm', placeholder='Search')
          b-button.my-2.my-sm-0(size='sm' type='submit') Search

        b-button-group(size='sm')
          b-button(variant='success') Success
          b-button(variant='warning') Warning

        NavBarSelect(
          @action="setLanguage($event)"
          :selectTitle="'Language'"
          :selectList="[{ value: 0, text: 'English' }, { value: 1, text: 'Русский' }]"
        )

        NavBarSelect(
          @action="userAction($event)"
          :selectTitle="'User'"
          :selectList="[{ value: 0, text: 'Profile' }, { value: 1, text: 'Sign out' }]"
        )
</template>

<script>
  import NavBarMenu from './NavBarMenu';
  import NavBarSelect from './NavBarSelect';

  export default {
    name: 'BaseHeader',
    components: {
      NavBarSelect,
      NavBarMenu
    },
    methods: {
      onSearch(ev) {
        console.log(ev);
        this.search = null;
      },
      setLanguage(ev) {
        console.log(ev);
      },
      userAction(ev) {
        console.log(ev);
      },
    },
    data: () => ({
      search: null,
    }),
  };
</script>

<style lang="scss">

</style>
