<template>
  <div class="eventManage">
    <div class="position">
      <nav-list :navList='navList'></nav-list>
    </div>
    <div class="taskSearch clearfix">
      <div class="total">
        <span>共计：{{ totalNum }}条</span>
      </div>
      <div class="con clearfix">
        <div class="search">
          <input
            type="text"
            placeholder="事件名称/上报人/手机号"
            v-model="eventContent"
            @keyup.13='getList'
          >
          <span @click="getList" class='search-button'>搜索</span>
        </div>
      </div>
    </div>
    <div class="listPage">
      <div class="content">
        <div class="list">
          <el-table
            :data='eventListData'
            style="width:100%"
            class="junScrollBar"
            height="100%"
          >
            <template slot="empty">
              <i class="noDataBg"></i>
            </template>
            <el-table-column
              prop='id'
              label='ID'
              style="width:10%"
            ></el-table-column>
            <el-table-column
              prop='eventDescribe'
              label='事件名称'
              style="width:20%"
            ></el-table-column>
            <el-table-column
              prop='nickName'
              label='上报人'
              style="width:10%"
            ></el-table-column>
            <el-table-column
              prop='mobile'
              label='手机号码'
              style="width:10%"
            ></el-table-column>
            <el-table-column
              prop='appealType'
              label='诉求类型'
              style="width:10%"
            ></el-table-column>
            <el-table-column label="上报时间">
              <template slot-scope="scope">
                <span>{{ changTimep(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="处理状态">
              <template slot-scope="scope">
                <span>{{ scope.row.code === 'sta_1' ? '已上报':'已受理'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop='id'
              label='操作'
              style="width:15%"
            >
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="查看" placement="top-start">
                  <i class="el-icon-read" @click="see(scope.row.id)"></i>
                </el-tooltip>
                <el-tooltip effect="dark" content="补报列表" placement="top-start">
                  <i class="el-icon-xubao" @click="report(scope.row.id)"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          class="pages"
          v-if="pageCount > 0"
        >
          <el-pagination
            layout="prev, pager, next,jumper"
            @current-change="getList"
            :current-page.sync="page"
            :page-size='10'
            :page-count="pageCount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="查看"
      :visible.sync="active"
      :show-close="false"
      width="630px">
        <div class="main clearfix">
          <div class="name">
            <span>诉求名称：</span>
            <span>{{ eventName }}</span>
          </div>
          <div class="person">
            <span>上报人：</span>
            <span>{{ name }}</span>
          </div>
          <div class="pho">
            <span>手机号：</span>
            <span>{{ mobile }}</span>
          </div>
          <div class="content">
            <span>诉求内容：</span>
            <span>{{ eventDescribe }}</span>
          </div>
          <div class="photo">
            <ul class="junScrollBar">
              <li v-for="(url, index) in imgList" :key="index">
                <img :src="url">
              </li>
            </ul>
          </div>
          <el-button type="primary" @click="close()">关闭</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
// import qs from 'qs'
import '../../../assets/css/list_common.css'
import navList from '@/components/navList'
export default {
  name: 'eventModel',
  components: {
    navList
  },
  data () {
    return {
      active: false,
      page: 1,
      size: 10,
      type: 'ssp',
      pageCount: 1,
      eventName: '',
      eventDescribe: '',
      name: '',
      mobile: '',
      totalNum: 0,
      imgList: [],
      eventListData: [],
      eventTypeVal: '', // 类型选项
      eventLevelVal: '', // 级别选项
      eventContent: '', // 搜索内容
      navList: [
        {
          name: '事件管理',
          path: ''
        }, {
          name: '上报事件列表',
          path: 'eventManage'
        }
      ]
    }
  },
  methods: {
    // 获取任务列表
    getList () {
      this.$http.get('/report/queryEventList', { params: {
        pageNum: this.page,
        pageSize: this.size,
        type: this.type,
        info: this.eventContent
      }}).then(res => {
        this.eventListData = res.data.data.list
        this.totalNum = res.data.data.total
        this.pageNum = res.data.data.pageNum
        this.pageSize = res.data.data.pageSize
        this.pageCount = res.data.data.pages
      })
    },
    // 时间戳
    changTimep (time) {
      let date = new Date(time)
      let newDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}   ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      return newDate
    },
    // 点击查看出现弹框
    see (id) {
      this.$http.get('/report/detail', { params: {
        reportId: id
      }}).then(res => {
        this.mobile = res.data.data.report[0].sysEmployee.mobile
        this.imgList = res.data.data.report[0].urlList
        this.name = res.data.data.report[0].sysEmployee.name
        this.eventName = res.data.data.report[0].eventDescribe
        this.eventDescribe = res.data.data.report[0].eventDescribe
        this.active = true
      })
    },
    close () {
      this.active = false
    },
    // 补报列表
    report (id) {
      this.$router.push({
        name: 'eventReport',
        params: {
          id
        }
      })
    }
  },
  created () {
    this.getList()
  },
  watch: {
    eventContent (value) {
      if (value === '') {
        this.getList()
      }
    }
  }
}
</script>
<style scoped>
.eventManage {
  height: 100%;
  width: 100%;
  position: relative;
}
.eventManage .taskSearch {
  height: 96px;
  padding-top: 30px;
  box-sizing: border-box;
}
.eventManage .taskSearch .total {
  width: auto;
  height: 20px;
  float: left;
  margin-top: 40px;
  font-size: 16px;
  color: #808080;
}
.eventManage .taskSearch .con {
  height: 36px;
  width: auto;
  float: right;
}
.eventManage .taskSearch .con div {
  float: left;
  height: 36px;
  line-height: 36px;
  font-size: 16px;
}
.eventManage .taskSearch .con .search {
  width: 304px;
  height: 36px;
  line-height: 36px;
  background: #fff;
  margin-left: 30px;
  margin-right: 20px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 0 5px #d8d8dd;
}
.eventManage .taskSearch .con .search input {
  width: 206px;
  height: 36px;
  padding-left: 20px;
  box-sizing: border-box;
}
.eventManage .taskSearch .con .search .search-button {
  width: 94px;
  height: 36px;
  line-height: 36px;
  float: right;
  background: #1e88f5;
  color: #fff;
  outline: none;
  border-radius: 18px;
  cursor: pointer;
  text-align: center;
  box-shadow:rgba(30, 136, 245, .6) 0px 0px 4px;
}
.eventManage .taskSearch .con .event_type {
  margin-right: 30px;
}
.eventManage .taskSearch .con .event_type,
.eventManage .taskSearch .con .event_level {
  height: 36px;
  width: 150px;
  margin-left: 20px;
}
.eventManage .taskSearch .con .event_type .el-input__inner,
.eventManage .taskSearch .con .event_level .el-input__inner {
  height: 36px;
  line-height: 40px;
}
/* 列表 */
.eventManage .listPage {
  height: calc(100% - 136px);
  box-sizing: border-box;
  background: #efeff4;
  padding: 0px 15px 20px 0;
}
.eventManage .listPage .content {
  height: 100%;
  background: #fff;
}
.eventManage .listPage .content .list {
  /* background: pink; */
  height: calc(100% - 50px);
}
/* 页码 */
.eventManage .listPage .content .pages {
  height: 50px;
  text-align: center;
}
.eventManage .noDataBg {
  height: 500px;
}
</style>
<style>
/* 弹窗样式 */
.eventManage .el-dialog__header {
  border-bottom: 1px solid #dfdfdf
}
.eventManage .title span {
  margin-left: 10px;
}
.eventManage .main div {
  font-size: 16px;
  margin-top: 28px;
  margin-left: 30px;
}
.eventManage .main div:first-child {
  margin-top: 0px;
}
.eventManage .main div.photo {
  width: 570px;
  height: 150px;
  margin-left: 15px;
}
.eventManage .main div.photo ul li {
  float: left;
  height: 130px;
  width: 100px;
  margin-top: 15px;
  margin-left: 20px;
}
.eventManage .main div.photo ul li img {
  width: 100%;
  height: 100%;
}
.eventManage .main button {
  margin-left: 480px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.eventManage .el-button--primary {
  width: 104px;
  height: 30px;
  padding: 0px;
}
</style>
