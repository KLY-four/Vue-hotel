<template>
  <div class="login-container" >
    <mu-card class="login-card" raised>
      <mu-form ref="form" :model="validateForm" label-position="left" label-width="100" class="mu-demo-form">
        <mu-card-title title="找回密码" ></mu-card-title>
        <mu-card-text>
          <mu-form-item label="用户名" help-text="" prop="username" >
            <mu-text-field v-model="validateForm.username"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="身份证号" help-text="" prop="idcard" >
            <mu-text-field v-model="validateForm.idcard"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="找回密码" v-if="validateForm.pw!=null">
            <mu-text-field v-model="validateForm.pw" ></mu-text-field>
          </mu-form-item>
        </mu-card-text>
        <mu-card-actions>
          <mu-form-item>
            <mu-button color="secondary" @click="submit">找回</mu-button>
            <mu-button color="secondary" @click="navigateTo('/login')">登录</mu-button>
          </mu-form-item>
        </mu-card-actions>
      </mu-form>
    </mu-card>
  </div>
</template>

<script>

  import {getPassword} from "@/api/user";
  import Vue from "vue";

  export default {
    name: "Register",
    data () {
      return {
        validateForm: {
          username: null,
          idcard: '',
          pw:null
        },
      }
    },

    methods: {
      getPass(password){
        this.validateForm.pw=password
        console.log(this.validateForm.pw);
      },
      navigateTo(val){
        this.$router.push(val);
      },
      submit() {
        getPassword(this.validateForm).then((res)=> {
          if (res.code === 1000){
           this.getPass(res.data)
            this.$toast.message("成功找回密码")
          }else {
            this.$toast.message("请检查信息是否填写正确")
          }
        }).catch(err => {
          this.$toast.message("密码查找失败：" + err.toString())
        })
      },
    }
  }
</script>

<style scoped>
  .login-container{
    width: 100%;
    background-image: linear-gradient(270deg,#8146b4,#6990f6);
    padding: 8px;
  }
  .mu-demo-form {
    width: 100%;
    /*max-width: 460px;*/
  }
  .login-card{
    width: 100%;
    max-width: 80%;
    margin: 50px auto;
  }
</style>
