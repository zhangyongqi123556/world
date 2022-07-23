<template>
  <div class="resource">
    <resource-list></resource-list>
  </div>
</template>
<script>
import ResourceList from './components/List'

export default {
  name:'Resource',
  components:{
      ResourceList
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