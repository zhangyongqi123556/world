<template>
  <div class="menu-create">
    <!-- 引入并通过 is-edit -->
    <create-or-edit is-Edit="true"></create-or-edit>
  </div>
</template>
<script>
import CreateOrEdit from './compoents/CreateOrEdit'
export default {
    name:'MenuEdit',
    components:{
        CreateOrEdit
    }
};
</script>

<style lang='less' scoped>

</style>