<template>
    <div class="create-or-edit">
    <el-card>
        <!-- 设置 slot 后 Element 会⾃动设置为上下两部分的布局样式（具有分割线） -->
        <!-- 由于组件没有 click 事件应添加 .native 设置原⽣事件 -->
        <div slot="header">
            <el-steps :active="activeStep" simple>
               <el-step
               v-for="(item,i) in steps"
               :key="item.id"
               :title="item.title"
               :icon="item.icon"
               @click.native="activeStep = i"
               ></el-step>
            </el-steps>
        </div>
        <!-- 步骤容器 0:基本信息 -->
        <el-form label-width="80px">
            <div v-show="activeStep === 0">
              <el-form-item label="课程名称">
                <el-input v-model="course.courseName"></el-input>
              </el-form-item>
              <el-form-item label="课程简介">
                <el-input v-model="course.brief"></el-input>
              </el-form-item>
              <!-- style="width: 49%; min-width:300px; margin-right: 15px;" -->
              <el-form-item label="课程概述">
                <el-input 
                 v-model="course.previewFirstField"
                 placeholder="概述1"
                 style="width: 49%;min-width: 300px; margin-right: 15px;"
                 >
                <template slot="append">
                    {{course.previewFirstField.length}}/20
                </template>
                </el-input>
<!--                 <el-input 
                    v-model="course.previewSecondField"
                    placeholder="概述2"
                    style="width: 49%;min-width: 300px ;"
                >
                </el-input> -->
               </el-form-item>
               <el-form-item label="讲师姓名">
                 <el-input v-model="course.teacherDTO.teacherName"></el-input>
               </el-form-item>
               <el-form-item label="讲师简介">
                 <el-input v-model="course.teacherDTO.description"></el-input>
               </el-form-item>
               <el-form-item label="课程排序">
                 <!-- 计数器组件 -->
                 <el-input-number
                 label="描述⽂字"
                 control-position="right"
                 v-model="course.sortNum"
                 ></el-input-number>
                </el-form-item>
            </div>
             <div v-show="activeStep === 1">
                <!-- 课程封⾯图上传 -->
                <course-image 
                v-model="course.courseListImg"
                label="课程封面"
                :limit="2"></course-image>
                <!-- 解锁封⾯图上传 -->
                <course-image 
                v-model="course.courseImgUrl"
                label="解锁封面"
                :limit="5"></course-image>
             </div>
             <div v-show="activeStep === 2">
                <el-form-item label="售卖价格">
                    <el-input
                    type="number"
                    v-model="course.discounts"
                    :min="0">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品原价">
                    <el-input 
                    type="number"
                    v-model="course.price"
                    :min="0">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销量">
                    <el-input
                    type="number"
                    v-model="course.sales"
                    :min="0">
                        <template slot="append">单</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="活动标签">
                    <el-input
                    v-model="course.discountsTag"
                    ></el-input>
                </el-form-item>
             </div>
             <div v-show="activeStep === 3">
             <!-- 设置秒杀状态开关 -->
            <el-form-item label="限时秒杀开关" label-width="120px">
            <el-switch
                v-model="course.activityCourse"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
            </el-form-item>
            <template v-if="course.activityCourse">
                <el-form-item label="开始时间">
                    <el-date-picker
                         v-model="course.activityCourseDTO.beginTime"
                         type="datetime"
                         placeholder="选择开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                        v-model="course.activityCourseDTO.endTime"
                        type="datetime"
                        placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="秒杀价">
                    <el-input 
                    v-model="course.activityCourseDTO.amount"
                    type="number"
                    :min="0"> 
                    </el-input>
                    <template slot="append">元</template>
                </el-form-item>
                <el-form-item label="秒杀库存">
                     <el-input
                     v-model="course.activityCourseDTO.stock"
                     type="number"
                     :min="0">
                     </el-input>
                     <template slot="append">个</template>
                </el-form-item>
            </template>
             </div>
             <div v-show="activeStep === 4">
             <!-- 最后步骤中设置保存按钮 -->
             <el-form-item label="课程详情">
              
             </el-form-item>
             <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
             <!-- 增加上架开关 -->
             <el-form-item label="是否上架">
                <el-switch
                v-model="course.status"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949">
                </el-switch>
             </el-form-item>
             <!-- 最后步骤中设置保存按钮 -->
             <el-form-item>
             <el-button 
             type="primary"
             @click="handleSave"
             >保存</el-button>
             </el-form-item>
             </div>
             <!-- 下⼀步 -->
             <el-form-item v-if="activeStep !== steps.length - 1">
             <el-button @click="activeStep++">下⼀步</el-button>
             </el-form-item>
        </el-form>             
    </el-card>
    </div>
</template>
<script>
import { saveOrUpdateCourse ,getCourseById } from '@/services/course'
import CourseImage from './CourseImage'
import TextEditor from '@/components/TextEditor'

export default{
    name: 'CreateOrEdit',
    components:{
     CourseImage,
     TextEditor
    },
    props:{
        isEdit:{
            type:Boolean,
            default:false
        },
        courseId:{
            type: [String,Number]
        }
    },

  data() {
    return {
        /* 步骤条进度 */
        activeStep: 0,
          steps:[
         { id: 1, title: '基本信息', icon: 'el-icon-edit'    },
         { id: 2, title: '课程封⾯', icon: 'el-icon-upload'  },
         { id: 3, title: '销售信息', icon: 'el-icon-picture' },
         { id: 4, title: '秒杀信息', icon: 'el-icon-picture' },
         { id: 5, title: '课程详情', icon: 'el-icon-picture' }      
          ],
        imageUrl: '',
        isSeckill:false,
        /* 保存课程信息 */
        course:{
          /* 需要将 data.course 中与 id 相关的数据去除，id 相关功能为编辑使⽤， */
             activityCourse: false,
             //id: 0,
             courseName: '',
             brief: '',
             teacherDTO: {
                //id: 0,
                //courseId: 0,
                teacherName: '',
                teacherHeadPicUrl: '',
                position: '',
                description: ''
             },
             /* 课程详情内容 */
             courseDescriptionMarkDown: '',
             /* 商品原价 */
             price: 0,
             discounts: 0,
             priceTag: '',
             discountsTag: '',
             isNew: true,
             isNewDes: '',
             /* 课程封面地址 */
             courseListImg: '',
             /* 解锁封面地址 */
             courseImgUrl: '',
             sortNum: 0,
             previewFirstField: '',
             previewSecondField: '',
             /* 上架状态 */
             status: 0,
             sales: 0,
             /* 参与秒杀的课程 */
             activityCourse: true,
             activityCourseDTO: {
                //id: 0,
                //courseId: 0,
                /* 秒杀开始时间 */
                beginTime: '',
                /* 秒杀结束时间 */
                endTime: '',
                amount: 0,
                stock: 0
             },
             autoOnlineTime: ''
        }      
  }
},
 methods: {
   async handleSave(){
      const { data } = await saveOrUpdateCourse(this.course)
      if (data.code === '000000'){
        this.$router.push({ name: 'course'})
        this.$message.success(`${this.isEdit ? '编辑' : '添加'}课程成功`)
      }
    },
    /* 编辑功能根据ID加载课程信息 */
  async loadCourse(){
       const { data } = await getCourseById(this.courseId)
       if(data.code === '000000'){
        /* 为⾮秒杀课程初始化属性 */
         if (!data.data.activityCourse) {
            data.data.activityCourseDTO = {
                beginTime: '',
                 endTime: '',
                amount: 0,
                stock: 0
            }
         }
        this.course = data.data
        /* 将要编辑的分类数据保存到 course 中 */
        this.course = data.data
       }
 
    }
  },
create(){
    if(this.isEdit){
        /* 编辑时，加载课程内容 */
        this.loadCourse()
    }
}
}
</script>
 <style lang="scss" scoped>
 .el-step{
    cursor: pointer
 }
 </style>
