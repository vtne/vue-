<template>
  <div class="newsList">
    <div class="position"><nav-list :navList='navList'></nav-list></div>
    <div class="head">
      <span>新闻类型</span>
      <div>
        <el-select v-model="newsType" placeholder="请选择" :clearable='true'>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.typeName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span>新闻状态</span>
      <div>
        <el-select v-model="newsState" placeholder="请选择" :clearable='true'>
            <el-option
              v-for="item in newsStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </div>
      <div class="search">
        <el-input placeholder="请输入内容" v-model="condition" @keyup.enter.native="fetchNewsListData(true)" :clearable='true'>
          <template slot="append" ><div @click="fetchNewsListData(true)" class='searchBtn'><i class="el-icon-search" ></i></div></template>
        </el-input>
        <!-- <el-button class='searchBtn' @click='fetchNewsListData(true)'>
          <i class="el-icon-search"></i>
        </el-button> -->
      </div>
      <router-link to="/page/newsAdd/add" class="fr new" tag='div'>新建</router-link>
    </div>
    <div class="listPage">
      <div class="content">
        <div class="list">
          <el-table  :data='newsListData' style="width:100%" class="junScrollBar" height="calc(100% - 50px)">
            <template slot="empty">
                <i class="noDataBg"></i>
            </template>
            <el-table-column prop='id' label='ID' style="width:10%"></el-table-column>
            <el-table-column prop='summary' label='新闻标题' style="width:20%"></el-table-column>
            <el-table-column prop='newsType' label='新闻类型' style="width:10%">
              <template slot-scope="scope" >
                <span>{{findItem(Number(scope.row.type), options, 'id', 'typeName')}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='sequence' label='排序' style="width:10%"></el-table-column>
            <el-table-column prop='status' label='状态' style="width:20%">
              <template slot-scope="scope" >
                <span :class="['news-state-commonstyle', scope.row.audit === 0 ? 'nopublish' : scope.row.audit === 1 ? 'published' : 'withdrawed']">{{findItem(scope.row.audit, newsStateList, 'value', 'label')}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='status' label='发布时间' style="width:20%">
              <template slot-scope="scope" >
                <span>{{fomateTime(scope.row.createTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='scan_num_custom' label='浏览量' style="width:20%"></el-table-column>
            <el-table-column prop='scanNum' label='真实浏览量' style="width:20%"></el-table-column>
            <el-table-column prop='statusCode, id' label='操作' style="width:15%" >
              <template slot-scope="scope" v-if='scope.row.id'>
                <el-button type="text" size="small" v-if="scope.row.audit !== 1"><i title='发布' class="el-icon-newsRelease" @click="releaseFn(scope.row)"></i></el-button>
                <el-button type="text" size="small" v-if="scope.row.audit === 1"><i title='下架' class="el-icon-newsOut" @click="outFn(scope.row)"></i></el-button>
                <el-button type="text" size="small"><i title='编辑' class="el-icon-newsEdit" @click="fetchDetailById(scope.row.id)"></i></el-button>
                <el-button type="text" size="small" v-if="scope.row.audit !== 1"><i title='删除' class="el-icon-newDelete" @click="deleteFn(scope.row, scope.$index)"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pages" v-if="pages > 0">
            <el-pagination
            layout="prev,pager,next,jumper"
            @current-change="fetchNewsListData(false)"
            :current-page.sync="currentPage"
            :page-size='10'
            :page-count='pages'>
            </el-pagination>
          </div>
      </div>
      </div>
    </div>
    <!-- 操作弹框 -->
    <el-dialog
      :title="actionCon.title"
      :visible.sync="actionDialog"
      width="30%">
      <span>{{actionCon.content}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="actionDialog = false">取 消</el-button>
        <el-button type="primary" @click="actionCon.okFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import navList from '@/components/navList'
import '../../../assets/css/list_common.css'
const MAX_NUMBER = 10
export default {
  name: 'newsManage',
  components: {
    navList
  },
  data () {
    return {
      condition: '', // 搜索内容
      newsType: '', // 选择新闻类型
      newsState: '', // 新闻状态
      newsListData: [], // 新闻列表
      currentPage: 1, // 当前页
      pages: 1, // 总页数
      actionDialog: false, // 操作弹框
      actionCon: { // 操作弹框内容显示
        title: '',
        content: '',
        okFn: function () {
        }
      },
      navList: [{
        name: '系统',
        path: ''
      }, {
        name: '新闻管理',
        path: 'newsManage'
      }],
      newsStateList: [
        {
          label: '未发布',
          value: 0
        },
        {
          label: '已发布',
          value: 1
        },
        {
          label: '已下架',
          value: 2
        }
      ],
      options: []
    }
  },
  created () {
    // 请求新闻类型数据
    this.fetchNewsTypeData()
    // 请求新闻列表数据
    this.fetchNewsListData()
  },
  methods: {
    async fetchNewsTypeData () {
      let {data: {data: {list = []}, success}} = await this.$http.get('/information/informationType/queryInfoType')
      if (!success) {
        this.$message.error('数据加载失败')
        return false
      }
      this.options = list
    },
    async fetchNewsListData (flag) {
      // 当flag为true的时候，当前页变为1
      var currentPage = this.currentPage
      if (flag) {
        currentPage = 1
      }
      let {data: {data: {list = [], pages}, success}} = await this.$http.get('/information/information/queryInformation', {
        params: {
          info: this.condition,
          pageNum: currentPage,
          status: this.newsState ? this.newsState : '',
          infoType: this.newsType ? this.newsType : '',
          pageSize: MAX_NUMBER
        }
      })
      if (!success) {
        this.$message.error('数据加载失败')
        return false
      }
      this.currentPage = currentPage
      this.pages = pages
      this.newsListData = list
    },
    async changeNewsState (item, state, message) {
      let {data: {success}} = await this.$http.post('/information/information/updateStatus', {
        audit: state,
        id: item.id
      })
      this.actionDialog = false
      if (!success) {
        this.$message.error(`${message}失败`)
      } else {
        let index = this.newsListData.findIndex((i) => {
          return i.id === item.id
        })
        this.$set(this.newsListData, index, {...item, audit: state})
        this.$message.success(`${message}成功`)
      }
    },
    // 编辑按钮
    async fetchDetailById (id) {
      let {data: {success, data}} = await this.$http.get('/information/information/detail', {params: {id}})
      if (!success) {
        this.$message.error('数据加载失败')
        return false
      }
      this.$router.push({
        name: 'newsAdd',
        params: {data: data}
      })
    },
    findItem (value, group, key, getKey) {
      if (group.length === 0 || value === undefined) {
        return ''
      }
      let item = group.find((item) => {
        return item[key] === value
      })
      let lable = item ? item[getKey] : ''
      return lable
    },
    fomateTime (timer) {
      if (!timer) {
        return ''
      }
      return this.getDay(new Date(timer), 'yyyy-MM-dd HH:mm')
    },
    // 新建页面
    toAddNews () {
      this.$router.push({name: 'newsAdd'})
    },
    // 发布按钮
    releaseFn (item) {
      this.actionDialog = true
      this.$set(this.actionCon, 'title', '确认发布该文章？')
      this.$set(this.actionCon, 'content', '发布前，请确保文章内容无误。')
      this.$set(this.actionCon, 'okFn', () => {
        this.changeNewsState(item, 1, '发布')
      })
    },
    // 删除按钮
    deleteFn (item, index) {
      this.actionDialog = true
      this.$set(this.actionCon, 'title', '确认删除该文章？')
      this.$set(this.actionCon, 'content', '')
      this.$set(this.actionCon, 'okFn', async () => {
        let {data: {success}} = await this.$http.get('/information//information/delete', {params: {id: item.id}})
        this.actionDialog = false
        if (!success) {
          this.$message.error('删除失败')
        } else {
          this.$message({message: '删除成功', type: 'success'})
          this.newsListData.splice(index, 1)
        }
      })
    },
    // 下架按钮
    outFn (item) {
      this.actionDialog = true
      this.$set(this.actionCon, 'title', '确认下架该文章？')
      this.$set(this.actionCon, 'content', '下架后，该文章将不会在前端展示。')
      this.$set(this.actionCon, 'okFn', () => {
        this.changeNewsState(item, 2, '下架')
      })
    }
  },
  watch: {
    condition (value) {
      if (value === '') {
        this.fetchNewsListData(true)
      }
    },
    newsType () {
      this.fetchNewsListData(true)
    },
    newsState () {
      this.fetchNewsListData(true)
    }
  }
}
</script>
<style scoped>
.newsList{
  height: 100%;
}
.newsList .head{
  height: 56px;
  padding-top: 10px;
  box-sizing: border-box;
}
.newsList .head>span{
  font-size: 18px;
  margin-right: 14px;
}
.newsList .head>div{
  display: inline-block;
  margin-right: 20px;
  height: 36px;
  border-radius: 4px;
}
.newsList .list .news-state-commonstyle {
  display: inline-block;
  font-size: 12px;
  border-radius: 4px;
  padding: 1px 10px;
  cursor: pointer;
}
.newsList .list .withdrawed {
  color: #aaaaaa;
  background: #f3f3f3;
  border: 1px solid #bebebe;
}
.newsList .list .published {
  color: #34a160;
  background: #e9fbed;
  border: 1px solid #20af62;
}
.newsList .list .nopublish {
  color: #1e88f5;
  background: #e2f0ff;
  border: 1px solid #1e88f5;
}
.newsList .head .search .el-input__inner{
  width: 252px;
}
.newsList .head .search .searchBtn{
  width: 50px;
  height: 38px;
  line-height: 38px;
  font-size: 18px;
  text-align: center;
}
.newsList .head .el-input-group__append{
  background-color: #1e88f5;
  color: #fff;
  width: 50px;
  padding: 0px;
}
.newsList .head .new{
  width: 100px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  float: right;
  background: #1e88f5;
  color: #fff;
  margin-right: 22px;
  border-radius: 18px;
  font-size: 18px;
  cursor: pointer;
  box-shadow:rgba(30, 136, 245, .6) 0px 0px 4px;
}
.newsList .listPage{
  height: calc(100% - 98px);
  box-sizing: border-box;
  padding: 0 20px 20px 0;
}
.newsList .noDataBg {
  height: 500px;
}
.newsList .listPage .content{
  height: 100%;
  background-color: #fff;
}
.newsList .listPage .content .pages{
  text-align: center;
}
.el-icon-newsRelease,
.el-icon-newsEdit,
.el-icon-newDelete,
.el-icon-newsOut,
.el-icon-newsView,
.el-icon-space{
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
</style>
<style>
.newsList .head .el-input-group__append{
  background-color: #1e88f5;
  color: #fff;
  width: 50px;
  padding: 0;
  cursor: pointer;
  border-radius: 4px;
}
.newsList .head .el-input-group__append i{
  /* margin-left: 18px; */
}

.newsList .el-table {
  font-size: 16px;
  color: #434343;
}
</style>
