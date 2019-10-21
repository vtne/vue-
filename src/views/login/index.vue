<template>
  <div class="login">
    <div class="content">
      <div class="appname">综&nbsp;治&nbsp;通&nbsp;服&nbsp;务&nbsp;管&nbsp;理&nbsp;系&nbsp;统</div>
      <div class="maincon">
        <div class="logo">
          <div>用户登录</div>
          <div>USER LOGIN</div>
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item
            prop='userName'
            class="adminval"
          >
            <el-input
              type="text"
              v-model="ruleForm.userName"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop='password'
            class="pwdval"
          >
            <el-input
              type="password"
              v-model="ruleForm.password"
              placeholder="密码"
              @keyup.enter.native="login"
            ></el-input>
          </el-form-item>
          <el-checkbox v-model="checked">记住用户名和密码</el-checkbox>
          <el-form-item>
            <el-button
              type="primary"
              @click="login"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    let checked = localStorage.getItem('checked')
    var flag = false
    if (checked === 'true') {
      flag = true
    }
    return {
      ruleForm: {
        userName: localStorage.getItem('userName'),
        password: localStorage.getItem('password')
      },
      checked: flag,
      rules: {
        userName: [
          { required: true, trigger: 'blur', message: '请输入用户名' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          let {data: {success, errmsg, token, data: {id}}} = await this.$http.post('/urpm-wx/login', {
            ...this.ruleForm,
            loginType: 0
          })
          if (!success) {
            this.$message.error(errmsg)
            return false
          }
          localStorage.setItem('X-token', token)
          localStorage.setItem('X-userId', id)
          if (this.checked) {
            localStorage.setItem('userName', this.ruleForm.userName)
            localStorage.setItem('password', this.ruleForm.password)
            localStorage.setItem('checked', true)
          } else {
            localStorage.setItem('userName', '')
            localStorage.setItem('password', '')
            localStorage.setItem('checked', false)
          }
          this.$router.push({name: 'page'})
        }
      })
    }
  }
}
</script>
<style scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/img/login/login_bg.png");
  background-position: center center;
  overflow: hidden;
}
.login .content {
  width: 480px;
  height: 574px;
  position: absolute;
  top: 50%;
  margin-top: -287px;
  left: 50%;
  margin-left: -240px;
}
.login .appname {
  height: 65px;
  line-height: 65px;
  color: #fff;
  font-size: 36px;
  text-align: center;
}
.login .maincon {
  height: 390px;
  padding: 40px;
  background: #fff;
}
.login .logo div:nth-child(1) {
  color: #1e88f5;
  font-size: 24px;
}
.login .logo div:nth-child(2) {
  color: #adadad;
  font-size: 14px;
}
.login .adminval input {
  background: url("../../assets/img/login/admin_icon.png") no-repeat 12px 10px;
  padding-left: 60px;
  font-size: 16px;
}
.login .adminval {
  margin: 40px 0 30px 0;
}
.login .pwdval {
  margin-bottom: 35px;
}
.login .pwdval input {
  background: url("../../assets/img/login/pw_icon.png") no-repeat 12px 10px;
  padding-left: 60px;
  font-size: 16px;
}
.login .zhuce {
  font-size: 16px;
}
.login .zhuce a {
  color: #1e88f5;
  text-decoration: underline;
}
</style>

<style>
.login .el-checkbox .el-checkbox__label {
  font-size: 16px;
}
.login .el-checkbox__inner {
  width: 25px;
  height: 25px;
}
.login .el-checkbox__inner::after {
  height: 15px;
  left: 10px;
}
.login .el-button {
  width: 100%;
  height: 55px;
  background: #1e88f5;
  font-size: 24px;
  margin: 30px 0 15px 0;
}
.login .el-form-item__error {
  font-size: 14px;
}
</style>
