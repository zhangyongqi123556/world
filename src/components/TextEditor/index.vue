<template>
  <div ref="editor" class="text-editor" >
  </div>
</template>
<script>

/* 引⼊富⽂本编辑器*/
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'

export default {
  props:{
    value:{
        type:String,
        default:''
    }
  },
  name:'TextEditor',
  /* 由于需要进⾏ DOM 操作，使⽤ mounted 钩⼦ */
  mounted() {
    /* 初始化富⽂本编辑器 */
    this.initEditor()
  },
  data() {
    return {
      editor: null,
      /* 要编辑的数据是否加载完毕 */
      isLoaded: false
    };
  },
  watch:{
    value () {
     // 编辑数据加载成功后，为富⽂本编辑器更新初始内容即可
     if (this.isLoaded === false) {
        this.editor.txt.html(this.value)
        this.isLoaded = true
     }
    }

  },
  created() {
  },
  methods: {
    initEditor (){
        /* 创建富⽂本编辑器实例 */
        const editor = new E(this.$refs.editor)
        /* 设置回调 */
        editor.config.onchange = value =>{
           /* value 为输⼊的内容，通过⾃定义事件传出即可 */ 
           this.$emit('input' , value)
        }
        /*  ⾃定义上传图⽚ 功能 */
        editor.config.customUploadImg = async function(resultFiles ,insertImgFn){
            /* 发送请求（参数需要 FormData 类型） */
            const fd = new FormData()
            fd.append('file' , resultFiles[0])
            const {data} = await uploadCourseImage(fd)
            if(data.code === '000000'){
                /* 根据地址创建 img 并插⼊到富⽂本编辑器 */
                insertImgFn(data.data.name)
            }
        }
        /* 创建化富⽂本编辑器 */
        editor.create()
        /* 初始化后设置内容 */
        editor.txt.html(this.value)
        /* 将富⽂本编辑器实例保存给 this 以便在 watch 中操作 */
        this.editor = editor
    }
  }
};
</script>

<style lang='scss' scoped>
</style>