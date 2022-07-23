<template>
  <div class="course-image">
        <el-form-item :label="label">
            <!-- progress -->
            <el-progress
                v-if="isUploading"
                type="circle"
                :percentage="precentage"
                :width="178"
                :status="precentage === 100 ? 'success' : undefined"
            ></el-progress>                
            <!-- upload组件 -->
            <el-upload
                v-else
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :http-request="handleUpload"
                >
                <!-- img 为预览图片的显示位置 -->
                <img v-if="value" :src="value" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
  </div>
</template>
<script>
import {uploadCourseImage} from '@/services/course'
export default {
  name:'CourseImage',
  props:{
    value:{
        type:String
    },
    limit:{
        type:Number,
        default:2
    },
    label:{
        type:String
    }
  },
  data() {
    return {
        /*  保存下载状态  */
        isUploading: false,
        /* 保存上传进度百分⽐ */
        precentage:0
    };
  },
  created() {
  },
  methods: {
      /* 上传图片成功回调 */
    handleAvatarSuccess(res,file){
        this.imageUrl = URL.createObjectURL(file.raw);
    },
    /* 上传前的回调 */
    beforeAvatarUpload(file){
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2 <this.limit;
        if(!isJPG){
            this.$message.error('上传头像图⽚只能是 JPG 格式!');
        }
        if(!isLt2M) {
            this.$message.error('上传头像图⽚⼤⼩不能超过 ${this.limit}MB!');
        }
        return isJPG && isLt2M;
    },
    async handleUpload(options){
        this.isUploading = true
        /* 创建 FormData 对象保存数据 */
        /* options为上传相关信息 */
        /* options为上传文件信息 */
        /* 创建 FormData 对象保存数据 */
        const fd = new FormData()
        /* 添加数据的键要根据接⼝⽂档设置 */
        fd.append('file', options.file)
        /* 发送请求 */
        const { data } =await uploadCourseImage(fd,(event) =>{
            this.precentage = Math.floor(event.loaded / event.total * 100)
        })
        if(data.code === '000000'){
        /* 上传成功后，将数据通过⾃定义事件传递给⽗组件 */
        this.$emit('input',data.data.name)
        this.$message.success('上传成功')
        this.isUploading = false
        /* 上传成功后，设置进度信息归零，避免下次上传出现回退效果 */
        this.precentage = 0
        }
    }
  }
};
</script>

<style lang='scss' scoped>
 ::v-deep .avatar-uploader .el-upload {
         border: 1px dashed #d9d9d9;
         border-radius: 6px;
         cursor: pointer;
         position: relative;
         overflow: hidden;
         }
    ::v-deep .avatar-uploader .el-upload:hover {
         border-color: #409EFF;
         }
    .avatar-uploader-icon {
         font-size: 28px;
         color: #8c939d;
         width: 178px;
         height: 178px;
         line-height: 178px;
         text-align: center;
         }
    .avatar {
         width: 178px;
         height: 178px;
         display: block;
         }
</style>