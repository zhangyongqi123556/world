<template>
  <div class="course">
    <course-list></course-list>
  </div>
</template>
<script>
import CourseList from './components/List'
export default {
    name:'CourseIndex',
    components:{
      CourseList
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