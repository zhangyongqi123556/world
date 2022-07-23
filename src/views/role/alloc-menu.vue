<template>
  <div class="alloc-menu">
     <el-card>
        <el-tree
        ref="menu-tree"
        node-key="id"
        :data="menus"
        :props="defaultProps"
        show-checkbox
        :default-expand-all="true"
        :default-checked-keys="checkedKeys"
        ></el-tree>
        <div style="margin: 20px;">
            <el-button @click="onReset">清空</el-button>
            <el-button type="primary" @click="onSave">保存</el-button>
        </div>
      </el-card>
  </div>
</template>
<script>
import  { getMenuNodeList , allocateRoleMenus ,getRoleMenus} from '@/services/menu'
export default {
  name:'AllocMenu',
  props:{
    roleId:{
        type:[String, Number],
        required: true
    }
  },
  data() {
    return {
        menus:[],
        defaultProps:{
            children: 'subMenuList',
            label:'name'
        },
        // 存储选择的数据 id
        checkedKeys: []
    };
  },
  created() {
    /* 加载所有的菜单信息（用于展示树形结构） */
    this.loadMenus ()
    /*  加载⻆⾊拥有的菜单列表 */
    this.loadRoleMenus()
  },
  methods: {
    async loadMenus(){
        const { data } = await getMenuNodeList()
        if(data.code === '000000'){
            this.menus = data.data
        }
    },
    async onSave(){
        const { data } = await allocateRoleMenus({
            roleId: this.roleId,
            menuIdList: this.$refs['menu-tree'].getCheckedKeys()
        })
        if(data.code === '000000'){
            this.$message.success('分配菜单成功')
            // 返回⻆⾊列表⻚即可
            this.$router.push({name:'/role'})
        }
    },
    async loadRoleMenus (){
        /* 请求⻆⾊拥有的菜单列表 */
        const { data } = await getRoleMenus(this.roleId)
        if(data.code === '000000'){
            /* 获取选中的数据 */
            this.getCheckedKeys(data.data)
        }
    },
    /*  数据筛选功能 */
    getCheckedKeys(menus){
        menus.forEach(menu =>{
            /* 检测是否存在⼦数据，如果有，递归查找 
            同时说明当前节点为‘⽗节点’，不能存⼊，
            否则勾选会导致⼦选项全选，设置 return*/
            if(menu.subMenuList){
                return this.getCheckedKeys(menu.subMenuList)
            }
            /* 存储选中数据的 id */
            if(menu.selected){
             this.checkedKeys = [...this.checkedKeys, menu.id]
            }
        })
    },
    /* 设置清空⽅法 */
    onReset(){
       this.$refs['menu-tree'].setCheckedKeys([]) 
    }
  }
};
</script>

<style lang='less' scoped>

</style>