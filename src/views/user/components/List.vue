<template>
  <div class="user-list">
      <el-card>
         <div slot="header">
         <el-form
            :inline="true"
            :model="filterParams"
            ref="filter-form">
         <el-form-item label="⼿机号" prop="phone">
         <el-input v-model="filterParams.phone"></el-input>
         </el-form-item>
         <el-form-item label="注册时间" prop="rangeDate">
         <el-date-picker
            v-model="filterParams.rangeDate"
            type="datetimerange"
            range-separator="⾄"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
         />
         </el-form-item>
         <el-form-item>
         <el-button
            :disabled="isLoading"
            @click="handleReset"
            >重置</el-button>
         <el-button
            type="primary"
            @click="handleQuery"
            :disabled="isLoading"
            >查询</el-button>
         </el-form-item>
         </el-form>
         </div>
         <el-table
            :data="users"
            style="width: 100%"
            v-loading="isLoading"
         >
         <el-table-column
            prop="id"
            label="⽤户ID"
            width="150">
         </el-table-column>
         <el-table-column
            prop="name"
            label="头像"
            width="100">
         <template slot-scope="scope">
            <img width="30px" :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
         </template>
         </el-table-column>
         <el-table-column
            prop="name"
            label="⽤户名">
         </el-table-column>
         <el-table-column
            prop="phone"
            label="⼿机号">
         </el-table-column>
         <el-table-column
            prop="createTime"
            label="注册时间">
         <!-- ⽤户状态操作（服务端没有开放权限，只能演示） -->
         </el-table-column>
         <el-table-column
            prop="name"
            label="状态"
            width="80">
         <template slot-scope="scope">
         <el-switch
            v-model="scope.row.status"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleForbidUser(scope.row)"
         >
         </el-switch>
         </template>
         </el-table-column>
         <el-table-column
            prop="address"
            label="操作">
         <template slot-scope="scope">
         <el-button
            type="text"
            @click="handleSelectRole(scope.row)"
            >分配⻆⾊</el-button>
         </template>
         </el-table-column>
         </el-table>
         <!-- 分配⻆⾊的 Dialog -->
         <el-dialog
             type="text"
             title="分配⻆⾊"
             :visible.sync="dialogVisible"
             width="50%"
              >
              <!-- 下拉菜单组件 -->
               <el-select v-model="roleIdList" multiple placeholder="请选择">
                    <!-- 根据 options 遍历⽣成选项列表 -->
                    <el-option
                    v-for="item in roles"
                     :key="item.value"
                     :label="item.name"
                     :value="item.id">
                     </el-option>
                </el-select>
              <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary"
               @click="handleAllocRole"
               >确 定</el-button>
              </span>
         </el-dialog>          
        </el-card>     
  </div>
</template>
<script>
import { getUserPages, forbidUser } from '@/services/user'
import { getAllRoles ,allocateUserRoles ,getUserRoles} from '@/services/role'
export default {
    name:'UserList',
  data() {
    return {
       users: [],
       currentRoleID: null,
       filterParams: {
            currentPage: 1,
            pageSize: 100,
            phone: '',
            startCreateTime: '',
            endCreateTime: '',
            rangeDate: []
       },
       dialogVisible:false,
/*        // 列表数据
       options:[],
       // 选中的数据
       value1:[], */
       // 所有⻆⾊，对象示例的 option
       roles: [],
       // 选中⻆⾊，对应示例的 value1
        roleIdList: [], 
  }

  },
  created() {
    this.loadUsers()
  },
  methods: {
    // 加载⽤户
    async loadUsers () {
     this.isLoading = true
     const { rangeDate } = this.filterParams
     if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
     } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
     }
     const { data } = await getUserPages(this.filterParams)
     this.users = data.data.records
     this.isLoading = false
     },
    async handleForbidUser (user) {
     const { data } = await forbidUser(user.id)
     console.log(data)
     },
    handleQuery () {
     this.filterParams.currentPage = 1
     this.loadUsers()
     },
    handleReset () {
     this.$refs['filter-form'].resetFields()
     this.loadUsers()
     },
     // 点击⽤户的分配⻆⾊按钮
     async handleSelectRole (userInfo) {
        this.currentRoleID = userInfo.id
        /*显示对话框  */
        this.dialogVisible = true
        /* 点击后加载⻆⾊列表 */
        const { data } = await getAllRoles()
        if(data.code === '000000'){
            this.roles = data.data
        }
        /* 根据⽤户id请求⻆⾊信息（data 被之前的请求使⽤过了，换个名字） */
        const { data: data2 } = await getUserRoles(userInfo.id)
        /* 遍历得到的⻆⾊列表，将id组成数据替换给 roleIdList 即可 */
        if(data2.code === '000000'){
            this.roleIdList = data2.data.map(item => item.id)
        }
     },
     /* 提交分配⻆⾊操作 */
     async handleAllocRole () {
        // 提交
        // - ⽤户 ID 可以在显示对话框时接收到组件传值，保存即可
        const { data } = await allocateUserRoles({
            userId: this.currentRoleID,
            roleIdList: this.roleIdList
        })
        if (data.code === '000000') {
            // 提示
            this.$message.success('分配⻆⾊成功')
            // 关闭对话框
            this.dialogVisible = false
         }
     }    
    }
};
</script>

<style lang='less' scoped>

</style>