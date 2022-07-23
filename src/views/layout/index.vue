<template>
  <div class="layout">
    <el-container>
        <el-aside width="200px">
        <app-aside></app-aside>
        </el-aside>
        <el-container>
        <el-header>
          <app-header></app-header>
        </el-header>
        <el-main>
          <!-- 设置子路由的出口 -->
          <router-view></router-view>
          </el-main>
        </el-container>
   </el-container>
   
  </div>
</template>
<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
    name:'Layout',
    components:{
      AppAside,
      AppHeader
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

<style lang='scss' scoped>
.el-container{
  height: 100vh;
  min-width: 980px;
}
 .el-aside {
    background-color: #d3dce6;
  }

  .el-header {
    background-color: #b3c0d1;
  }

  .el-main {
    background-color: #e9eef3;
  }
</style>