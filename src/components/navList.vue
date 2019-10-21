<template>
  <div class="notice">
    <div class="nav">
      <span>您的位置：</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          v-for="(item,index) in navList"
          :key="index"
          :to="item.path"
          @click.native="changeRouter(item.areaId , index)"
        >{{item.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>
<script>
export default {
  name: 'navList',
  data () {
    return {
    }
  },
  props: {
    navList: {
      type: Array
    }
  },
  methods: {
    changeRouter (id, index) {
      let obj = {
        index: index,
        areaId: id
      }
      this.$emit('router-change', obj)
    }
  }
}
</script>
<style>
.notice .nav {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  background-color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 14px;
  color: #cecece;
}
.notice .nav > span {
  vertical-align: middle;
}
.notice .nav .el-breadcrumb {
  display: inline-block;
  vertical-align: middle;
}
.nav .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner,
.el-breadcrumb__inner.is-link,
.el-breadcrumb__inner.is-link,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  font-size: 14px;
  color: #cecece;
  font-weight: normal;
}
</style>
