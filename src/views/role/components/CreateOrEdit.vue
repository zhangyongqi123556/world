<template>
  <div class="create-or-edit">    
  <el-form>
  <el-form-item label="⻆⾊名称">
  <el-input v-model="role.name"></el-input>
  </el-form-item>
  <el-form-item label="⻆⾊编码">
  <el-input v-model="role.code"></el-input>
   </el-form-item>
   <el-form-item label="⻆⾊描述">
   <el-input type="textarea" v-model="role.description"></el-input>
   </el-form-item>
   <el-form-item>
   <el-button @click="onCancel">取消</el-button>
   <el-button type="primary" @click="onSubmit">确认</el-button>
   </el-form-item>
   </el-form>
  </div>
</template>
<script>
 import { createOrupdate , getRoleById} from "@/services/role"
export default {
    name:'CreateOrEdit',
    props:{
      isEdit:{
        type:Boolean,
        default:false
      },
      roleId:{
        type:[Number,String]
      }
    },   
  data() {
    return {
        role:{
            code: '',
            name: '',
            description: ''
        }
    };
  },
  created() {
    if(this.isEdit){
      /* 加载用户角色 */
      this.loadRole()
    }
  },
  methods: {
    async loadRole (){
      const { data } = await getRoleById(this.roleId)
      if(data.code === '000000'){
        // 将⻆⾊数据更新给 role 即可
        this.role = data.data
      }
    },
    async onSubmit (){
        const { data } = await createOrupdate(this.role)
        if(data.code === '000000'){
           /* 提示 */
           this.$message.success('添加成功') 
           /* 子组件出发自定义事件 */
           this.$emit('success')
           /* 清空内容 */
           this.role = {}
        }
    },
    onCancel (){
        this.$emit('cancel')
        this.role = {}
    }
  }
};
</script>

<style lang='less' scoped>

</style>