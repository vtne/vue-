<template>
  <div class="newsComment">
    <div class="position"><nav-list :navList='navList'></nav-list></div>
    <div class="head">
      <span style="font-size: 18px">审核状态</span>
      <div>
        <el-select v-model="newsType" placeholder="请选择" @change="getTableData">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="search">
        <el-input placeholder="请输入内容" v-model="condition" :on-icon-click="getTableData" @keyup.enter.native="getTableData">
          <template slot="append"><i class="el-icon-search"></i></template>
        </el-input>
      </div>
    </div>
    <div class="listPage">
      <div class="content">
        <div class="list">
        <el-table  :data='newsCommentData' style="width:100%" class="junScrollBar" height="calc(100% - 50px)">
          <template slot="empty">
            <i class="noDataBg"></i>
          </template>
          <el-table-column prop='id' label='ID' style="width:10%"></el-table-column>
          <el-table-column prop='summary' label='新闻标题' style="width:25%"></el-table-column>
          <el-table-column prop='nickName' label='评论用户' style="width:10%"></el-table-column>
          <el-table-column prop='phone' label='手机号' style="width:20%">
          </el-table-column>
          <el-table-column prop='comment' label='评论内容' style="width:25%"></el-table-column>
          <el-table-column prop='createTime' label='评论时间' style="width:20%"></el-table-column>
          <el-table-column label="审核状态" style="width:20%">
            <template slot-scope="scope">
              <span :class="['checkStatus', scope.row.audit === 0 ? 'unaudited': (scope.row.audit === 1 ? 'pass' : 'nopass')]">
                {{scope.row.audit === 0 ? '未审核': (scope.row.audit === 1 ? '审核通过' : '审核未通过')}}
              </span>
            </template>
          </el-table-column>
          <!-- 0未审核 1审核通过 2审核未通过 -->
          <el-table-column prop='statusCode, id' label='操作' style="width:15%" >
            <template slot-scope="scope" >
              <i
                class="operationIcon"
                @click="updataNesStatus(scope.row.id, 1)"
                v-if="scope.row.audit===0"
                title='通过'
              >
              </i>
              <i
                class="operationIcon_nopass"
                @click="updataNesStatus(scope.row.id, 2)"
                title='未通过'
                v-if="scope.row.audit===0 || scope.row.audit===1"
              >
              </i>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages" v-if="pages > 0">
          <el-pagination
          layout="prev, pager, next,jumper"
          @current-change="getTableData"
          :current-page.sync="currentPage"
          :page-size='10'
          :page-count='pages'>
          </el-pagination>
        </div>
      </div>
      </div>
    </div>
  </div>
  <!-- 审核结果弹框 -->

</template>
<script>
import navList from '@/components/navList'
import '../../../assets/css/list_common.css'
import qs from 'qs'
const MAX_NUMBER = 10
export default {
  name: 'newsComments',
  components: {
    navList
  },
  data () {
    return {
      condition: '', // 搜索内容
      newsType: '', // 选择新闻类型
      newsCommentData: [],
      currentPage: 1, // 当前页
      pages: 5, // 总页数
      currentId: '', // 当前节点id
      currentStatus: '', // 当前节点状态
      navList: [{
        name: '系统',
        path: ''
      }, {
        name: '新闻管理',
        path: 'newsManage'
      }, {
        name: '评论列表',
        path: 'newsComments'
      }],
      options: [
        {
          value: '',
          label: '无'
        },
        {
          value: '0',
          label: '未审核'
        },
        {
          value: '1',
          label: '审核通过'
        }, {
          value: '2',
          label: '审核未通过'
        }
      ]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () { // 获取表格数据
      let {data: {success, data: {list, pages}}} = await this.$http.get('information/information/queryInfoComment', {
        params: {
          audit: this.newsType,
          param: this.condition,
          pageNum: this.currentPage,
          pageSize: MAX_NUMBER
        }
      })
      if (!success) {
        this.$message.error('数据获取失败')
        return false
      }
      this.pages = pages
      list.forEach((item) => {
        item.createTime = this.getDay(new Date(item.createTime), 'yyyy-MM-dd HH:mm')
      })
      this.newsCommentData = list
    },
    async updateInfoComment () { // 更新评论状态
      let {data: {success, info}} = await this.$http.post('/information/information/updateInfoComment', qs.stringify({
        id: this.currentId,
        audit: this.currentStatus
      }))
      if (!success) {
        this.$message.error('更新失败')
        return false
      }
      this.getTableData()
      this.$message({
        type: 'success',
        message: info
      })
    },
    // 更新新闻状态
    updataNesStatus (id, status) {
      this.currentId = id
      this.currentStatus = status
      this.updateInfoComment()
    }
  }
}
</script>
<style>

</style>
<style scoped>
.newsComment{
  height: 100%;
}
.newsComment .head{
  height: 56px;
  line-break: 56px;
  padding-top: 8px;
  box-sizing: border-box;
  padding-right: 20px;
}
.newsComment .head > div{
  display: inline-block;
  margin-left: 14px;
  height: 36px;
  border-radius: 4px;
}
.newsComment .head .search .el-input__inner{
  width: 252px;
}
.newsComment .head .search .el-input-group__append{
  background-color: #1e88f5;
  color: #fff;
  width: 50px;
  padding: 0;
  text-align: center;
  font-size: 18px;
}
.newsComment .head .new{
  height: 40px;
  width: 100px;
  background: #1e88f5;
  border-radius: 20px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.newsComment .listPage{
  height: calc(100% - 96px);
  box-sizing: border-box;
  padding: 0 20px 20px 0;
}
.newsComment .listPage .content{
  height: 100%;
  background-color: #fff;
}
.newsComment .listPage .content .pages{
  text-align: center;
}

.newsComment .noDataBg {
  height: 500px;
}
.el-icon-newsRelease,.el-icon-newsEdit,.el-icon-newDelete,.el-icon-newsOut,.el-icon-newsView{
  height: 20px;
  width: 20px;
}
.el-icon-newsRelease{
  background: url('../../../assets/img/news/icon_release.png')
}
.el-icon-newsEdit{
  background: url('../../../assets/img/news/icon_edit.png')
}
.el-icon-newDelete{
  background: url('../../../assets/img/news/icon_delete.png')
}
.el-icon-newsOut{
  background: url('../../../assets/img/news/icon_out.png')
}
.el-icon-newsView{
  background: url('../../../assets/img/news/icon_view.png')
}
.newsComment .checkStatus {
  padding: 1px 10px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
}
.newsComment .list .unaudited {
  color: #1e88f5;
  background: #e2f0ff;
  border: 1px solid #1e88f5;
}
.newsComment .list .pass {
  color: #34a160;
  background: #e9fbed;
  border: 1px solid #20af62;
}
.newsComment .list .nopass {
  color: #e73b3b;
  background: #fee4e1;
  border: 1px solid #f55545;
}
.operationIcon {
  display: inline-block;
  width: 19px;
  height: 21px;
  background: url('../../../assets/img/news/icon_pass.png') no-repeat;
  margin-right: 10px;
  cursor: pointer;
}
.operationIcon_nopass {
  display: inline-block;
  width: 19px;
  height: 21px;
  background: url('../../../assets/img/news/icon_nopass.png') no-repeat;
  cursor: pointer;
}
</style>
<style >
.newsComment .head .search .el-input-group__append {
  background-color: #1e88f5;
  color: #fff;
  width: 50px;
  padding: 0;
  cursor: pointer;
  text-align: center;
  font-size: 18px;
  border-radius: 4px;
}
.list a {
  color: #606266;
}
.newsComment .el-table th>.cell {
  font-size: 18px;
  font-weight: bold;
}
.newsComment .el-table {
  font-size: 16px;
  color: #434343;
}
</style>
