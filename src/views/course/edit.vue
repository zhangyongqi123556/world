<template>
  <div class="course-edit">
    <create-or-edit 
    is-edit
    :courseId="courseId"></create-or-edit>
  </div>
</template>
<script>

import CreateOrEdit from './components/CreateOrEdit'
export default {
  name:'CourseEdit',
  components:{
    CreateOrEdit
  },
  props:{
    courseId:{
        type:[String,Number],
        required: true
    }
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