<template>
  <div class="role-list">
   <el-card class="box-card">
     <div slot="header" class="clearfix">
     <el-form ref="form" :model="form">
     <el-form-item label="⻆⾊名称" prop="name">
     <el-input v-model="form.name"></el-input>
     </el-form-item>
     <el-form-item>
     <el-button
     type="primary"
     @click="onSubmit"
     v-loading="isLoading"
     >查询</el-button>
     <el-button
     @click="onReset"
     >重置</el-button>
     </el-form-item>
     </el-form>
     </div>
     <el-button @click="handleAdd">添加⻆⾊</el-button>
     <el-table
     :data="roles"
     style="width: 100%"
     v-loading="isLoading"
     >
     <el-table-column
     prop="id"
     label="编号"
     />
     <el-table-column
     prop="name"
     label="⻆⾊名称"
     />
     <el-table-column
     prop="description"
     label="描述"
     />
     <el-table-column
     prop="createdTime"
     label="添加时间"
     />
     <el-table-column
     label="操作"
     align="center"
     width="150px"
     >
     <template slot-scope="scope">
     <div>
     <el-button
     type="text"
     @click="$router.push({
      name: 'alloc-menu',
      params:{
        roleId:scope.row.id
      }
     })"
     >分配菜单</el-button>
     <el-button
     type="text"
     >分配资源</el-button>
     </div>
     <div>
     <el-button
     type="text"
     @click="handleEdit(scope.row)"
     >编辑</el-button>
     <el-button
     type="text"
     @click="handleDelete(scope.row)"
     >删除</el-button>
     </div>
     </template>
     </el-table-column>
     </el-table>
     <!-- 添加角色的对话框结构 -->
       <el-dialog
          :title="isEdit ? '编辑角色' : '添加角色'"
          :visible.sync="dialogVisible"
          width="30%">
          <!-- 将添加与编辑功能单独封装到组件中 -->
          <create-or-edit @success="handleSuccess"
           @cancel="handleCancel"
           :is-edit="isEdit"
           :role-id="roleId"
           v-if="dialogVisible"
           ></create-or-edit>
      </el-dialog>
    </el-card>
  </div>

</template>
<script>
import { getRoles , DeleteRole} from '@/services/role'
import CreateOrEdit from './CreateOrEdit'
export default {
  name:'RoleList',
  components:{
    CreateOrEdit
  },
  data() {
    return {
        form:{
            name:''
        },
        roles: [],
        isLoading:false,
        /* 控制对话框显示 */
        dialogVisible:false,
        /* 控制对话框的功能状态  */
        isEdit:false,
        roleId : null
    };
  },
  created() {
    this.loadRoles()
  },
  methods: {
        async loadRoles (){
            this.isLoading = true
            const { data } = await getRoles(this.form)
            this.roles = data.data.records
            this.isLoading = false
        },
        onSubmit (){
        
        },
        onReset(){
        
        },
        handleEdit (role){
          // 显示对话框
          this.dialogVisible = true
          // 设置编辑状态
          this.isEdit = true
          // 将要编辑的⻆⾊ ID 传递给表单展示
          this.roleId = role.id
        },
        handleDelete(role){
          /* 目前还有问题 删除老是提示取消删除 */
            this.$confirm(`确认删除角色：${role.name}?`,'删除提示')
            .then(async () =>{
                await deleteRole(role.id)
                this.$message.success('删除成功')
                this.loadRoles()
            }).catch(err =>{
                if(err && err.response){
                    this.$message.err('删除失败，请重试')
                }else{
                    this.$message.info('取消删除')
                }
            })
        },
        handleSuccess (){
            // 关闭对话框
            this.dialogVisible = false
            // 刷新列表数据
            this.loadRoles()
        },
        handleCancel(){
            this.dialogVisible = false
        },
        handleAdd(){
          this.dialogVisible = true
          this.isEdit = false
        }

  }
};
</script>

<style lang='less' scoped>

</style>