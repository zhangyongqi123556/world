<template>
<div class="resource-list">
<!-- 使⽤ Card 组件 -->
<el-card class="box-card">
<div slot="header" class="clearfix">
<!-- 使⽤ Form 组件：⾏内表单 -->
<el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
<el-form-item label="资源名称" prop="name">
 <el-input v-model="form.name" placeholder="资源名称" clearable></el-input>
 </el-form-item>
 <el-form-item label="资源路径" prop="url">
 <el-input v-model="form.url" placeholder="资源路径" clearable></el-input>
 </el-form-item>
 <el-form-item label="资源分类" prop="categoryId">
 <el-select 
 v-model="form.categoryId" 
 placeholder="资源分类"
 clearable
 >
 <!-- 请求接口进行下拉菜单项设置 -->
<el-option
:label="item.name"
:value="item.id"
v-for="item in resourceCategories"
:key="item.id"
>
</el-option>
 </el-select>
 </el-form-item>
 <el-form-item>
  <el-button
  @click="onReset"

  >重置</el-button>
  <el-button 
  type="primary"
  @click="onSubmit"
  :disabled="isLoading">查询</el-button>
 </el-form-item>
 </el-form>
 </div>
    <!-- 使⽤ Table 组件 -->
    <el-table
    :data="resources"
    style="width: 100%"
    v-loading="isLoading">
    <el-table-column
    type="index"
    label="编号"
    width="100">
    </el-table-column>
    <el-table-column
    prop="name"
    label="资源名称">
    </el-table-column>
    <el-table-column
    prop="url"
    label="资源路径">
    </el-table-column>
     <el-table-column
   prop="description"
   label="描述">
   </el-table-column>
   <!-- 设置过滤器需要使用作用域插槽获取数据 -->
    <el-table-column
     label="添加时间">
     <template slot-scope="scope">
     <span>{{ scope.row.createdTime | dateFormat }}</span>
     </template>
     </el-table-column>
     <!-- 操作使⽤⾃定义列模板 -->
     <el-table-column
     label="操作"
     width="150">
     <template slot-scope="scope">
     <el-button
     size="mini"
     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
     <el-button
     size="mini"
     type="danger"
     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
     </template>
     </el-table-column>
    </el-table>
    <!--组件分页结构  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="form.current"
      :page-sizes="[10, 15, 20]"
      :page-size="form.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      :disabled="isLoading">
    </el-pagination>
 </el-card>
 </div>
</template>
<script>
import { getResourcePages , getResourceCategory } from '@/services/resource'
export default {
  name:'ResourceList',
  data() {
    return {
         tableData: [],
         form: {
          /* 显示当前页号 */
          current: 1,
          /* 每页显示的数据条数 */
          size:10,
          /* 资源名称 */
          name: '',
          /* 资源路径 */
          url: '',
          /* 资源ID */
          categoryId: ''
         },
         /* 数据总数 */
         totalCount:0,
         resources: [],
         resourceCategories:[],
         isLoading : true
    };
  },
  created() {
    /* 加载资源数据 */
    this.loadResources()
    /* 加载资源列表 */
    this.loadResourceCategory()
  },
  methods: {
        onReset(){
          this.$refs.form.resetFields()
        },
        onSubmit () {
          this.form.current = 1
          this.loadResources()
        },
       async loadResourceCategory(){
       const {data} = await getResourceCategory()
       if( data.code === '000000'){
        this.resourceCategories = data.data
       }
        },
        handleSizeChange(val) {
          this.form.size = val
          this.form.current = 1
          this.loadResources()
        },
        handleCurrentChange(val) {
          this.form.current = val
          this.loadResources()
        },
         async loadResources () {
          /* 开始加载数据 */
          this.isLoading = true
         // 请求，空对象必须传⼊，否则参数不完整导致接⼝报错
         const { data } = await getResourcePages(this.form)
         if(data.code ==='000000'){
            this.resources = data.data.records
            this.totalCount = data.data.total
         }
         /* 请求完毕取消加载中状态 */
         this.isLoading = false
         }, 
         handleEdit(){

         },
         handleDelete(){

         }
  },
   filters:{
            /* 日期过滤器(小于10添加前缀0可自行设置) */
            dateFormat (date){
                date = new Date (date)
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
                        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            }
         }
};
</script>

<style lang='less' scoped>

</style>