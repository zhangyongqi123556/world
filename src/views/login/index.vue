<template>
  <div class="login">
   <el-form ref="form" 
   :model="form" 
  :rules="rules"
   label-width="80px"
   label-position="top">
  <el-form-item 
  label="手机号"
  prop="phone">
    <el-input v-model="form.phone"></el-input>
  </el-form-item>
  <el-form-item 
  label="密码"
  prop="password">
    <el-input 
    v-model="form.password"
    type="password"
    ></el-input>
  </el-form-item>
  <el-form-item>
    <el-button 
    type="primary" 
    :loading = "isLoginLoading"
    @click="onSubmit"
    >登录</el-button>
  </el-form-item>
</el-form>
  </div>
</template>
<script>
/* import  request  from '@/utils/request' */
/* import qs from 'qs' */
/* 封装请求模块后，引⼊使⽤ */
import { login } from '@/services/user'

export default {
  name:'LoginIndex',
  data() {
    return {
      form: {
        phone: '18201288771',
        password:'111111'
      },
      /* 用于保存加载状态 */
      isLoginLoading:false,
      /* 设置校验规则 */
      rules: {
        phone:[
          {required: true, message: '请输⼊⼿机号', trigger: 'blur'},
          { pattern: /^1\d{10}$/, message: '请输⼊正确的⼿机号', trigger:'blur' }
        ],
        password:[
          { required: true, message: '请输⼊密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码⻓度为 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
  },
  methods: {
   async onSubmit (){
      try{
        /* 1.设置校验 */
        await this.$refs.form.validate()
        /* 2.发送请求 */
        this.isLoginLoading = true
/*         const { data } = await request({
          method: 'POST',
          url: '/front/user/login',
          data: qs.stringify(this.form)
        }) */
         /* qs的作用是 由于 axios 的请求参数默认为 application/json 格式，⽽接⼝需要 x-www-form-urlencoded 格式，
导致请求参数处理失败。*/
        const { data } = await login(this.form)
        this.isLoginLoading = false
        /* 3.相应处理 */
        if(data.state === 1){
          /* 下拉式弹框 */
          this.$message.success(data.message)
         /* 将用户信息存储到Vuex中 */
          this.$store.commit('setUser', data.content)
          /* 根据可能存储的 redirect 数据进行跳转设置 */
          this.$router.push(this.$route.query.redirect || '/')
        }else{
          this.$message.error(data.message)
        }
      }catch(err){
        console.log('验证失败')
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.login{
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

    el-form {
      background-color: #fff;
      width: 300px;
      padding: 20px;
      border-radius: 10px;
        .el-button{
          width: 100%;
        }
    }
}

</style>