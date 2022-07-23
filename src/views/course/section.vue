<template>
  <div class="course-section">
     <el-card>
         <div slot="header">
            课程名称
         </div>
         <el-tree
            v-loading="isLoading"
            :data="sections"
            :props="defaultProps"
            draggable
            :allow-drop="handleAllowDrop"
            @node-drop="handleNodeDrop"
         >
          <!-- 设置插槽，并通过插槽接收组件暴露的数据 -->
          <div class="inner" slot-scope="{ node, data }">
          <!-- 设置内容 -->
          <span>{{ node.label }}</span>
          <!-- 设置后续按钮结构 -->
          <!-- section 结构 -->
           <span v-if="data.sectionName" class="actions">
           <el-button>编辑</el-button>
           <el-button>添加课时</el-button>
           <el-button>状态</el-button>
           </span>
           <!-- lesson 结构 -->
           <span v-else class="actions">
           <el-button>编辑</el-button>
           <el-button 
           type="success"
           @click="$router.push({
              name: 'course-video',
              params:{
                courseId
              },
              query:{
                lessonId: data.id
              }
           })">上传视频</el-button>
           <el-button>状态</el-button>
           </span>
           </div>
         </el-tree>
     </el-card>
  </div>
</template>
<script>
import { getSectionAndLesson ,saveOrUpdateSection,saveOrUpdateLesson} from '@/services/course-section'

export default {
  name:'CourseSection',
  props:{
    courseId:{
        type:[String,Number],
        required:true
    }
  },
 data() {
      return {
        isLoading:false,
        /* 章节信息 */
        sections:[],
        /* 根据响应数据调整属性 */
        defaultProps: {
          children: 'lessonDTOS',
          label(data){
            /* data是章节或课时的时候 label的属性名不同 需要检测后使用  */
            return data.sectionName || data.theme
          }
        }
      }
      },
  created() {
    this.loadSection()
  },
  methods: {
    async handleNodeDrop (draggingNode, dropNode, type, event){
        this.isLoading = true
        try{
          await Promise.all(dropNode.parent.childNodes.map((item, index) =>{
            if (draggingNode.data.lessonDTOS){
              return saveOrUpdateSection({
                id: item.data.id,
                orderNum: index
              })
            }else{
              return saveOrUpdateLesson({
                id: item.data.id,
                orderNum: index
              })
            }
          }))
          this.$message.success('数据更新成功')
        }catch(err){
          this.$message.success('数据更新失败',err)
        } 
        this.isLoading = false
    },
    async loadSection (){
        const { data } = await getSectionAndLesson(this.courseId)
        if(data.code === '000000'){
            /* 绑定数据 */
            this.sections = data.data
        }
    },
    /* 节点拖拽处理 */
    handleAllowDrop(draggingNode, dropNode, type){
      /* 不能有放⼊内部的操作，但例如将章节1拖拽到章节2的课时1之前时，type 为prev，需要进⼀步处理 */
      /* 所有课时都具有 sectionId，通过下⾯的条件，限制章节不能移动到课时前后，也不能将章节的课时移动到其他章节 */
        return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    }
  }
};
</script>

<style lang='scss' scoped>
.inner {
    // 浏览器观察到⽗元素设置了 flex，所以当前元素 flex: 1 占满⼀⾏
    flex: 1;
    // 内部元素希望左右分开，所以给当前元素设置 flex
    display: flex;
    justify-content: space-between;
    align-items: center;
    // 其他样式美化
    padding: 10px;
    border-bottom: 1px solid #ebeef5;
 }

 /* 当前⾏具有类名 .el-tree-node__content 设置了固定⾼度 26px, 这⾥要改为auto ⾃适应 */
 /* 由于为 Tree 组件内的元素，需要设置样式穿透 */
  ::v-deep .el-tree-node__content {
    height: auto;
  }

</style>