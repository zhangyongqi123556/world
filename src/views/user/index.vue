<template>
  <div class="user">
    <user-list></user-list>
  </div>
</template>
<script>

import UserList from './components/List'
export default {
    name:'UserIndex',
    components:{
      UserList
    },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style lang='less' scoped>

</style>