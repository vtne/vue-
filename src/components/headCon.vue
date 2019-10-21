<template>
    <div class="header clearfix">
        <div class="logo_con fl clearfix">
          <img class="fl" src="../assets/img/logo.png" alt>
          <p class="fl">综治通后台管理系统</p>
        </div>
        <div class="user_info fr clearfix">
          <div class="message fl" @click="list()">
            <img src="../assets/img/info.png" alt>
            <i></i>
          </div>
          <div class="user fl clearfix">
            <img class="fl" src="../assets/img/user.png" alt>
            <p class="fl">Administrator</p>
          </div>
          <div class="exit fl" @click="exit()">
            <img src="../assets/img/exit.png" alt>
          </div>
        </div>
      </div>
</template>

<script>
// import qs from 'qs'
export default {
  name: 'head-con',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    list () {
      this.$router.push('notice')
    },
    exit () {
      this.$emit('handleExitEvent')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.admin_home .header {
  height: 80px;
  background: url(../assets/img/header.png) no-repeat;
  background-size: cover;
}
.admin_home .header .logo_con {
  padding-left: 40px;
}
.admin_home .header .logo_con img {
  display: block;
  margin-top: 18px;
}
.admin_home .header .logo_con p {
  font-size: 28px;
  line-height: 28px;
  color: #fff;
  margin-left: 30px;
  margin-top: 26px;
}
.admin_home .header .user_info {
  padding-right: 20px;
}
.admin_home .header .user_info .message {
  padding-top: 24px;
  position: relative;
}
.admin_home .header .user_info .message img {
  display: block;
  cursor: pointer;
}
.admin_home .header .user_info .message i {
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  background: #ff5757;
  border-radius: 50%;
  top: 20px;
  right: -3px;
}
.admin_home .header .user_info .user {
  margin-left: 26px;
  padding: 19px 0;
}
.admin_home .header .user_info .user img {
  display: block;
  margin-right: 10px;
}
.admin_home .header .user_info .user p {
  font-size: 16px;
  color: #fff;
  line-height: 42px;
  letter-spacing: 2px;
}
.admin_home .header .user_info .exit {
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #a1c0f3;
  margin-top: 25px;
}
.admin_home .header .user_info .exit img {
  display: block;
  cursor: pointer;
}
</style>
