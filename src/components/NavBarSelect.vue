<template lang="pug">
  b-nav-item-dropdown(right='')
    template(v-slot:button-content='')
      em {{ selectTitle }}

    b-dropdown-item(
      @click="$emit('action', item)"
      v-for="(item, key) of selectList"
      :key="key"
      :id="item.id ? item.id : `id_${key}`"
    ) {{ item.text }}
</template>

<script>
  export default {
    name: 'NavBarSelect',
    props: {
      selectTitle: {
        type: String,
        default: '',
      },
      selectList: {
        type: Array,
        default: () => ([{ value: 0, text: '', }]),
      },
    },
  };
</script>

<style lang="scss">

</style>
