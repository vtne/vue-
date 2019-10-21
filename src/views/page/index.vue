<template>
  <el-container class="admin_home">
    <el-header style="height:80px">
      <Head-con @handleExitEvent='handleExitEvent'></Head-con>
    </el-header>
    <el-container>
      <el-aside :width="asideW+ 'px'" :class="bgClass">
        <i class="toggle-menu-btn" @click="toggle"></i>
        <div class="menu_container junScrollBar_hide">
          <el-menu
            :collapse="isCollapse"
            :router="true"
            :collapse-transition="false"
            :default-active="defaultActive"
          >
            <el-menu-item class="clearfix no-sub-menue" index="/page/index">
              <i class="el-icon-home fl"></i>
              <span class="fl" slot="title">首页</span>
            </el-menu-item>
            <el-menu-item class="clearfix no-sub-menue" index="/page/peopleManage">
              <i class="el-icon-employer fl"></i>
              <span class="fl" slot="title">人员管理</span>
            </el-menu-item>
            <el-submenu index="event">
              <template slot="title">
                <i class="el-icon-task fl"></i>
                <span class="fl" slot="title">事件管理</span>
              </template>
              <el-menu-item index="/page/eventManage">
                <i class="el-icon-caret-right"></i>
                <span slot="title">上报事件列表</span>
              </el-menu-item>
              <el-menu-item index="/page/eventRequire">
                <i class="el-icon-caret-right"></i>
                <span slot="title">上报诉求列表</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item class="clearfix no-sub-menue" index="/page/liveServer">
              <i class="el-icon-live fl"></i>
              <span class="fl" slot="title">生活服务</span>
            </el-menu-item>
            <el-submenu index="news">
              <template slot="title">
                <i class="el-icon-task fl"></i>
                <span class="fl" slot="title">新闻管理</span>
              </template>
              <el-menu-item index="/page/newsManage">
                <i class="el-icon-caret-right"></i>
                <span slot="title">新闻列表</span>
              </el-menu-item>
              <el-menu-item index="/page/newsType">
                <i class="el-icon-caret-right"></i>
                <span slot="title">新闻类型</span>
              </el-menu-item>
              <el-menu-item index="/page/newsComments">
                <i class="el-icon-caret-right"></i>
                <span slot="title">评论管理</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <el-main :style="{'width': 100% - asideW+ 'px'}">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import HeadCon from '@/components/headCon'
import qs from 'qs'
export default {
  name: 'page',
  data () {
    return {
      isCollapse: false, // 是否收起导航
      defaultActive: '/page/index'
    }
  },
  computed: {
    asideW () {
      return this.isCollapse ? 79 : 267
    },
    bgClass () {
      return this.isCollapse ? 'menu_close' : 'menu-on'
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.defaultActive = val.path
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    HeadCon
  },
  methods: {
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    async handleExitEvent () {
      let id = localStorage.getItem('X-userId')
      let {data: {data, success}} = await this.$http.post('/urpm-wx/logout', qs.stringify({
        id
      }))
      if (!success) {
        this.$message.error(data)
      }
      localStorage.setItem('X-token', '')
      localStorage.setItem('X-userId', '')
      this.$message({
        message: data,
        type: 'success'
      })
      this.$router.push({name: 'login'})
    }
  }
}
</script>
<style>
.admin_home {
  height: 100%;
}
.admin_home .el-container {
  background: #efeff4;
  height: -webkit-calc(100% - 80px);
  height: calc(100% - 80px);
  height: -moz-calc(100% - 80px);
}
.admin_home .el-header {
  padding: 0px;
}
.admin_home .el-aside {
  height: 100%;
  box-sizing: border-box;
  padding-top: 30px;
  background: url("../../assets/img/page/navBg.png") no-repeat;
  background-position: center center;
  position: relative;
}
.admin_home .el-aside.menu_close {
  background-image: url("../../assets/img/page/navHide.png");
}
.admin_home .el-aside .toggle-menu-btn {
  display: block;
  width: 8px;
  height: 17px;
  background: url("../../assets/img/page/toggle-btn-on.png") no-repeat;
  position: absolute;
  left: -webkit-calc(100% -17px);
  left: calc(100% - 17px);
  left: -moz-calc(100% - 17px);
  top: -webkit-calc(50% -4px);
  top: calc(50% - 4px);
  top: -moz-calc(50% - 4px);
  z-index: 1;
  cursor: pointer;
}
.admin_home .el-aside.menu_close .toggle-menu-btn {
  background-image: url("../../assets/img/page/toggle-btn-close.png");
  top: -webkit-calc(50% -9px);
  top: calc(50% - 9px);
  top: -moz-calc(50% - 9px);
}
.admin_home .menu_container {
  height: 100%;
  overflow-y: auto;
}
.admin_home .el-menu {
  width: 250px;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
  border-right: none;
  margin-top: 6px;
}
.admin_home .el-menu--collapse {
  width: 62px;
}
.el-menu > li.no-sub-menue,
.el-menu .el-submenu .el-submenu__title {
  min-width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  padding: 0px 20px;
  border-radius: 21px;
  background: #f5f8fe;
  color: #303133;
}
.el-menu > li.no-sub-menue.is-active,
.el-menu .el-submenu.is-active .el-submenu__title {
  background: #1e88f5;
  box-shadow: 0px 0px 7px 2px rgba(30, 136, 245, 0.5);
  color: #fff;
}
.el-menu .el-submenu.is-active .el-submenu__title i {
  color: #fff;
}
.el-menu > li.no-sub-menue i,
.el-menu .el-submenu__title i:nth-child(1) {
  display: block;
  width: 32px;
  height: 27px;
  background: url("../../assets/img/page/iconList.png") no-repeat;
  margin-top: 6px;
  margin-right: 10px;
  background-position-x: 0;
}
.el-menu > li.no-sub-menue.is-active i,
.el-menu .el-submenu.is-active .el-submenu__title i:nth-child(1) {
  background-position-x: -42px;
  color: #fff;
}
.el-menu li[role="menuitem"] i.el-icon-employer {
  background-position-y: -27px;
}
.el-menu li[role="menuitem"] i.el-icon-task {
  height: 29px;
  background-position-y: -53px;
}
.el-menu li[role="menuitem"] i.el-icon-live {
  height: 28px;
  background-position-y: -83px;
}
.el-menu li[role="menuitem"] i.el-icon-newsmanage {
  height: 28px;
  background-position-y: -113px;
}
.el-menu li[role="menuitem"] i.el-icon-settings {
  height: 27px;
  background-position-y: -143px;
}
.el-menu li[role="menuitem"] i.el-icon-safe {
  background-position-y: -170px;
}
.el-menu li[role="menuitem"] i.el-icon-notice {
  background-position-y: -198px;
}
.el-menu li[role="menuitem"] i.el-icon-version {
  background-position-y: -226px;
}
.el-menu > li.no-sub-menue,
.el-menu .el-submenu {
  margin-bottom: 20px;
}
.admin_home .el-menu .el-submenu .el-menu {
  width: auto;
  padding: 0px;
}
.admin_home .el-menu .el-submenu .el-menu .el-menu-item {
  box-sizing: border-box;
  font-size: 14px;
  color: #7d8085;
  height: 60px;
  line-height: 20px;
  padding: 20px 35px;
}

.admin_home .el-menu .el-submenu .el-menu-item.is-active {
  color: #1e88f5;
  background: #fff;
}
.admin_home .el-menu .el-submenu .el-menu-item:hover {
  background: #fff;
}
.admin_home .el-main {
  padding: 0px;
}
.admin_home .el-main .org_manage {
  height: 100%;
}
.admin_home .el-menu.el-menu--collapse .no-sub-menue {
  padding: 0 !important;
}
.admin_home .el-menu.el-menu--collapse .el-submenu .el-submenu__title,
.admin_home .el-menu.el-menu--collapse .no-sub-menue .el-tooltip {
  padding: 0px !important;
}
.el-menu-item,
.el-submenu__title {
  padding-top: 20px;
  padding-bottom: 20px;
  line-height: 16px;
}
.admin_home
  .el-menu.el-menu--collapse
  .el-submenu
  .el-submenu__title
  i:nth-child(1),
.admin_home .el-menu.el-menu--collapse .no-sub-menue .el-tooltip i {
  width: 32px;
  display: block;
  margin-top: 6px;
  margin-left: 8px;
}
.admin_home
  .el-menu.el-menu--collapse
  .el-submenu
  .el-submenu__title
  i.router-icon-employer {
  margin-left: 4px;
}
.admin_home
  .el-menu.el-menu--collapse
  .el-submenu
  .el-submenu__title
  i.el-icon-statistics {
  margin-left: 6px;
}
</style>
