<template>
  <div class="indexBox">
    <div class="accessPath">
      <nav-list :navList="navList"></nav-list>
    </div>
    <div class="infoContainer">
      <ul class="infoBox">
        <li class="clearfix">
          <div class="infoTitle fl">
            <h1>用户数量</h1>
            <p>{{contactNum}}</p>
          </div>
          <img src="../../../assets/img/index/bg_grid_number.png" class="fr"/>
        </li>
        <li class="clearfix">
          <div class="infoTitle fl">
            <h1>上报事件</h1>
            <p>{{eventSum}}</p>
          </div>
          <img src="../../../assets/img/index/bg_attention_number.png" class="fr"/>
        </li>
        <li class="clearfix">
          <div class="infoTitle fl">
            <h1>诉求</h1>
            <p>{{appealSum}}</p>
          </div>
          <img src="../../../assets/img/index/bg_task_number.png" class="fr"/>
        </li>
      </ul>
    </div>
    <div class="contentBox">
      <div class="contentHeader">通知</div>
      <ul class="content junScrollBar_hide" v-if='contentData.length'>
        <li v-for="(item, index) in contentData" :key="index">
          <span>{{`${item.nickName}上报了`}}{{item.type === 'ssp' ? '事件' : '诉求'}}</span>
          <span class="time fr">{{getDay(item.createTime,'yyyy-MM-dd')}}</span>
        </li>
      </ul>
      <div class='content' v-else>
        <i class='noDataBg'></i>
      </div>
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        layout="prev, pager, next,slot,jumper"
        :page-count="pageCount"
        :currentPage="currentPage"
        @current-change="handleCurrentChange"
        v-if="contentData"
      >
        <span style="margin-left:4px">共{{pageCount}}页</span>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import navList from '@/components/navList'
export default {
  name: 'index',
  data () {
    return {
      navList: [
        {
          name: '首页',
          path: 'index'
        }
      ],
      contactNum: '--',
      eventSum: '--',
      appealSum: '--',
      contentData: [],
      pageCount: 1,
      currentPage: 1,
      pageSize: 8
    }
  },
  components: {
    navList
  },
  created () {
    this.getData()
    this.getTableData()
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableData()
    },
    async getData () {
      const {data: {data}} = await this.$http.get('/urpm-wx/employee/queryUserSum')
      const {data: {data: {appealSum, eventSum}}} = await this.$http.get('/report/queryEventSum')
      this.contactNum = data
      this.eventSum = eventSum
      this.appealSum = appealSum
      this.getTableData()
    },
    async getTableData () {
      let {data: {success, data: {list, pages}}} = await this.$http.get('report/queryMessage', {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize
        }
      })
      if (!success) {
        return false
      }
      this.pageCount = pages
      list.forEach((item) => {
        item.createTime = this.getDay(new Date(item.createTime), 'yyyy-MM-dd HH:mm')
      })
      this.contentData = list
    }
  }
}
</script>
<style scoped>
.indexBox {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.indexBox .accessPath {
  width: 100%;
  height: 40px;
  background-color: #fff;
  box-sizing: border-box;
}
.indexBox .infoContainer {
  width: calc(100% - 80px);
  height: 162px;
  margin: 30px 40px;
}
.indexBox .infoBox {
  width: 100%;
  height: 100%;
}
.indexBox .infoBox li {
  width: calc((100% - 160px) / 3);
  height: 100%;
  background: #fff;
  border-radius: 6px;
  display: inline-block;
  margin-right: 75px;
}
.indexBox .infoBox li:last-child {
  margin-right: 0px;
}
.indexBox .infoBox li .infoTitle h1{
  font-size: 18px;
  color: #444;
  padding: 30px 0px 0px 50px;
}
.indexBox .infoBox li .infoTitle p {
  font-size: 60px;
  color: #53e0a1;
  margin: 22px 0px 0px 50px;
}
.indexBox .infoBox li:nth-child(1) p {
  color: #53e0a1;
}
.indexBox .infoBox li:nth-child(2) p {
  color: #fb7f33;
}
.indexBox .infoBox li:nth-child(3) p {
  color: #5792fb;
}
.indexBox .infoBox li img {
  margin: 20px 20px 0px 0px;
  width: 24%;
}
.indexBox .contentBox {
  width: calc(100% - 80px);
  height: calc(100% - 282px);
  margin-left: 40px;
  margin-bottom: 20px;
  background: #fff;
}
.indexBox .noDataBg {
  height: 380px;
}
.indexBox .contentHeader {
  width: 100%;
  height: 82px;
  background: #f9f9f9;
  font-size: 20px;
  color: #444;
  font-weight: bold;
  line-height: 82px;
  padding-left: 30px;
  box-sizing: border-box;
}
.indexBox .content {
  width: calc(100% - 40px);
  height: calc(100% - 158px);
  margin: 10px 20px 0px 20px;
  overflow: auto;
}
.indexBox .content li {
  width: 100%;
  height: 60px;
  background: #f6f8fc;
  font-size: 16px;
  color: #444;
  line-height: 60px;
  padding-left: 50px;
  box-sizing: border-box;
  margin-top: 10px;
  border-left: 10px solid #f6f8fc;
  border-right: 10px solid #f6f8fc;
}
.indexBox .content li:hover {
  cursor: pointer;
  border-color: #1e88f5;
}
.indexBox .content li .time {
  margin-right: 50px;
}
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
