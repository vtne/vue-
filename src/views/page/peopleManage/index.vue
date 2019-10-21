<template>
  <div class="peopleManage">
    <div class="position">
      <nav-list :navList='navList'></nav-list>
    </div>
    <div class="taskSearch clearfix">
      <div class="con clearfix">
        <div class="">绑定时间</div>
        <div class="event_level">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
            @change='fetchTableData(true)'
          >
          </el-date-picker>
        </div>
        <div class="search">
          <input
            type="text"
            placeholder="事件名称/上报人/手机号"
            v-model="eventContent"
            @keyup.13='fetchTableData(true)'
          >
          <span @click="fetchTableData(true)" class='search-button'>搜索</span>
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
              prop='nickName'
              label='微信名称'
              style="width:20%"
            ></el-table-column>
            <el-table-column
              prop='mobile'
              label='手机号码'
              style="width:10%"
            ></el-table-column>
            <el-table-column
              prop='createTime'
              label='绑定时间'
              style="width:20%"
            ></el-table-column>
            <el-table-column
              prop='operation'
              label='操作'
              style="width:15%"
            >
              <template slot-scope="scope">
                <i class="el-icon-read"  @click="showDetail(scope.row)"></i>
                <span class='get-detail-btn'  @click="showDetail(scope.row)">查看</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pages" v-if="pageCount > 0">
          <el-pagination
            layout="prev, pager, next,jumper"
            @current-change="fetchTableData(false)"
            :current-page.sync="currentPage"
            :page-count="pageCount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 查看弹窗 -->
    <el-dialog
      title="查看"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="520px">
      <div class="clearfix">
        <div class="fl">
          <div class="imgborder">
            <img :src="detailObj.headUrl">
          </div>
          <div class="imgName">
            <span>头像</span>
          </div>
        </div>
        <div class="fl eventManageDesc">
          <div>
            <span>微信名称</span>
            <span>{{detailObj.nickName}}</span>
          </div>
          <div>
            <span>手机号</span>
            <span>{{detailObj.mobile}}</span>
          </div>
          <div>
            <span>绑定时间</span>
            <span>{{detailObj.createTime}}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import '../../../assets/css/list_common.css'
import navList from '@/components/navList'
const MAX_NUMBER = 10

export default {
  name: 'peopleManage',
  components: {
    navList
  },
  data () {
    return {
      currentPage: 1,
      pageCount: 4,
      eventListData: [],
      eventContent: '', // 搜索内容
      navList: [
        {
          name: '首页',
          path: ''
        }, {
          name: '人员管理',
          path: 'peopleManage'
        }
      ],
      dateRange: '',
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dialogVisible: false,
      detailObj: ''
    }
  },
  methods: {
    async fetchTableData (flag) {
      // 当flag为true的时候,将当前页重置为1。
      var currentPage = this.currentPage
      if (flag) {
        currentPage = 1
      }
      let {data: {success, data: {list, pages}}} = await this.$http.get('/urpm-wx/employee/query', {
        params: {
          endTime: this.dateRange ? this.changTimep(this.dateRange[1]) : '',
          startTime: this.dateRange ? this.changTimep(this.dateRange[0]) : '',
          param: this.eventContent,
          page: currentPage,
          results: MAX_NUMBER
        }
      })
      if (!success) {
        this.$message.error('数据请求失败')
        return false
      }
      this.pageCount = pages
      this.currentPage = currentPage
      list.forEach((item) => {
        item.createTime = this.getDay(new Date(item.createTime), 'yyyy-MM-dd HH:mm')
      })
      this.eventListData = list
    },
    // 时间戳
    changTimep (time) {
      let date = new Date(time)
      let newDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      return newDate
    },
    showDetail (item) {
      this.dialogVisible = true
      this.detailObj = item
    }
  },
  created () {
    this.fetchTableData()
  },
  watch: {
    eventContent (value) {
      if (value === '') {
        this.fetchTableData(true)
      }
    }
  }
}
</script>
<style scoped>
.peopleManage {
  height: 100%;
  width: 100%;
}
.peopleManage .taskSearch {
  height: 96px;
  padding-top: 30px;
  box-sizing: border-box;
}
.peopleManage .taskSearch .con {
  height: 36px;
  width: auto;
  float: right;
}
.peopleManage .taskSearch .con div {
  float: left;
  height: 36px;
  line-height: 36px;
  font-size: 16px;
}
.peopleManage .taskSearch .con .search {
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
.peopleManage .taskSearch .con .search input {
  width: 206px;
  height: 36px;
  padding-left: 20px;
  box-sizing: border-box;
}
.peopleManage .taskSearch .con .search .search-button {
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
.peopleManage .taskSearch .con .event_type {
  margin-right: 30px;
}
.peopleManage .taskSearch .con .event_type,
.peopleManage .taskSearch .con .event_level {
  height: 36px;
  margin-left: 20px;
}
.peopleManage .taskSearch .con .event_type .el-input__inner,
.peopleManage .taskSearch .con .event_level .el-input__inner {
  height: 36px;
  line-height: 40px;
}

/* 列表 */
.peopleManage .listPage {
  height: calc(100% - 136px);
  box-sizing: border-box;
  background: #efeff4;
  padding: 0px 15px 20px 0;
}
.peopleManage .listPage .content {
  height: 100%;
  background: #fff;
}
.peopleManage .listPage .content .list {
  height: calc(100% - 50px);
}
/* 页码 */
.peopleManage .listPage .content .pages {
  height: 50px;
  text-align: center;
}
.peopleManage .noDataBg {
  height: 500px;
}
.peopleManage .el-icon-read{
  margin-top: -2px;
  vertical-align: middle;
  display: inline-block;
}
.peopleManage .get-detail-btn {
  font-size: 16px;
  color: #1e88f5;
  display: inline-block;
  line-height: 28px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
<style>
/* 弹窗样式 */
.peopleManage .el-dialog__header {
  border-bottom: 1px solid #dfdfdf
}
.peopleManage .imgborder {
  width: 100px;
  height: 130px;
  border:1px solid #bfbfbf;
}
.peopleManage .imgborder img {
  width: 100%;
  height: 100%;
}
.peopleManage .imgName {
  text-align: center;
  margin-top: 15px;
}
.peopleManage .peopleManageDesc {
  margin-left: 60px;
}
.peopleManage .peopleManageDesc div {
  margin-bottom: 20px;
}
.peopleManage .peopleManageDesc div span:nth-child(1) {
  display: inline-block;
  width: 85px;
}
.peopleManage .el-dialog {
  /* top:50%; */
}
.peopleManage .el-button--primary {
  width: 104px;
  height: 30px;
  padding: 0px;
}
.eventManageDesc {
  margin-left: 60px;
  overflow: hidden;
}
.eventManageDesc>div {
  margin-top: 20px;
}
.eventManageDesc>div:first-child {
  margin-top: 0px;
}
.eventManageDesc>div>span:nth-child(1) {
  display: inline-block;
  width: 60px;
}
.eventManageDesc>div>span:nth-child(2) {
  margin-left: 30px;
}
</style>
