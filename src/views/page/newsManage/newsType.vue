<template>
<div class="newsType">
  <div class="position"><nav-list :navList='navList'></nav-list></div>
  <div class="head clearfix">
    <div class="fr newType" @click="toAddType">新建</div>
  </div>
  <div class="content">
    <div class="list">
      <el-table  style="width:100%" class="junScrollBar" height="calc(100% - 50px)" :data='newsTypeData'>
        <template slot="empty">
          <i class="noDataBg"></i>
        </template>
         <el-table-column prop='id' label='ID' style="width:10%"></el-table-column>
          <el-table-column prop='typeName' label='分类名称' style="width:20%"></el-table-column>
          <el-table-column prop='sequence' label='排序' style="width:10%"></el-table-column>
          <el-table-column label='操作' style="width:15%" >
            <template slot-scope="scope" >
              <el-button type="text" size="small"><i class="el-icon-newsEdit" @click="editNewsType(scope.row)"></i></el-button>
              <el-button type="text" size="small"><i class="el-icon-newDelete" @click="deleteNewsType(scope.row)"></i></el-button>
            </template>
          </el-table-column>
      </el-table>
      <div class="pages" v-if="pages > 0">
          <el-pagination
          layout="prev, pager, next,jumper"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size='10'
          :page-count='pages'>
          </el-pagination>
      </div>
    </div>
  </div>
  <!-- 新建弹框 -->
  <el-dialog  :title="dialogTitle" :visible.sync="newTypeDialog">
    <el-form :model="newTypeForm" :rules="rules">
      <el-form-item label="类型名称" :label-width="formLabelWidth" prop="typeName">
        <el-input v-model="newTypeForm.typeName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
        <el-input v-model="newTypeForm.sort" autocomplete="off" type="number"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="newTypeDialog = false">取 消</el-button>
      <el-button type="primary" @click="addNewsType">确 定</el-button>
    </div>
  </el-dialog>
<!-- 删除弹框 -->
  <el-dialog  title="删除" :visible.sync="deleteDialog">
    <span>确认删除该分类?</span>
    <div slot="footer" class="dialog-footer">
      <el-button @click="deleteDialog = false">取 消</el-button>
      <el-button type="primary" @click="deleteNewsTypeOK">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import navList from '@/components/navList'
// import {newsTypeData} from '../../../../static/newsData.js'
import '../../../assets/css/list_common.css'
import qs from 'qs'
export default {
  name: 'newsType',
  components: {
    navList
  },
  data () {
    return {
      newsTypeData: [],
      currentPage: 1, // 当前页
      pages: 1, // 总页数
      pageSize: 10, // 每页显示条数
      newTypeDialog: false, // 新建弹框
      deleteDialog: false, // 删除弹框
      currentId: 1, // 当前节点id
      dialogTitle: '', // 弹框标题
      formLabelWidth: '120px', // 新增弹框表单宽度
      newTypeForm: { // 新增内容
        typeName: '',
        sort: ''
      },
      rules: {
        typeName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      },
      navList: [{
        name: '系统',
        path: ''
      }, {
        name: '新闻管理',
        path: 'newsManage'
      }, {
        name: '新闻类型',
        path: 'newsType'
      }]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableData()
    },
    async getTableData () { // 获取表格数据
      let {data: {success, data: {list, pages}}} = await this.$http.get('information/informationType/queryInfoType', {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize
        }
      })
      if (!success) {
        return false
      }
      this.pages = pages
      list.forEach((item) => {
        item.createTime = this.getDay(new Date(item.createTime), 'yyyy-MM-dd HH:mm')
      })
      list.sort(this.compare('sequence', this.compare('createTime')))
      this.newsTypeData = list
    },
    async addNews () { // 新增
      let {data: {success, message}} = await this.$http.post('information/informationType/createInforType', qs.stringify({
        typeName: this.newTypeForm.typeName,
        sequence: this.newTypeForm.sort
      }))
      if (!success) {
        return false
      } else {
        this.newTypeDialog = false
        this.getTableData()
      }
      this.$message(message)
    },
    async deleteNews () { // 删除
      let {data: {success, message}} = await this.$http.post('information/informationType/deleteById', qs.stringify({
        id: this.currentId
      }))
      if (!success) {
        return false
      } else {
        this.newTypeDialog = false
        this.getTableData()
      }
      this.$message(message)
    },
    async editNews () { // 编辑
      let {data: {success, message}} = await this.$http.post('information/informationType/updateInfoType', qs.stringify({
        id: this.currentId,
        typeName: this.newTypeForm.typeName,
        sequence: this.newTypeForm.sort
      }))
      if (!success) {
        return false
      } else {
        this.newTypeDialog = false
        this.getTableData()
      }
      this.$message(message)
    },
    // 新建类型
    toAddType () {
      this.dialogTitle = '新建'
      this.newTypeDialog = true
      this.newTypeForm.typeName = ''
      this.newTypeForm.sort = ''
    },
    // 保存按钮
    addNewsType () {
      if (this.newTypeForm.typeName !== '' && this.newTypeForm.sort !== '') {
        if (this.dialogTitle === '新建') {
          this.addNews()
        } else if (this.dialogTitle === '编辑') {
          this.editNews()
        }
      } else {
        this.$message('请填写完整')
      }
    },
    // 编辑按钮
    editNewsType (item) {
      this.dialogTitle = '编辑'
      this.newTypeDialog = true
      this.currentId = item.id
      this.newTypeForm.typeName = item.typeName
      this.newTypeForm.sort = item.sequence
    },
    // 删除按钮
    deleteNewsType (item) {
      this.deleteDialog = true
      this.currentId = item.id
    },
    // 删除确认
    deleteNewsTypeOK () {
      this.deleteDialog = false
      this.deleteNews()
    },
    // 多个字段排序
    compare (sequence, createTime) {
      return function (o, p) {
        let a, b
        if (o && p && typeof o === 'object' && typeof p === 'object') {
          a = o[sequence]
          b = p[sequence]
          if (a === b) {
            return typeof createTime === 'function' ? createTime(o, p) : 0
          }
          if (typeof a === typeof b) {
            return a < b ? -1 : 1
          }
          return typeof a < typeof b ? -1 : 1
        }
      }
    }
  }
}
</script>
<style>
.newsType{
   height: 100%;
   width: 100%;
}
.newsType .head .newType{
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
  margin-top: 10px;
  margin-bottom: 10PX;
  box-shadow:rgba(30, 136, 245, .6) 0px 0px 4px;
}
.newsType .content{
  height: calc(100% - 101px);
  box-sizing: border-box;
  padding: 0 20px 20px 0;
}
.newsType .noDataBg{
  height: 500px;
}

.newsType .content .list{
  height: 100%;
  background-color: #fff;
}
.newsType .content .pages{
  text-align: center;
}
.el-icon-newsEdit,
.el-icon-newDelete
{
  height: 20px;
  width: 20px;
}
.el-icon-newsEdit{
  background: url('../../../assets/img/news/icon_edit.png')
}
.el-icon-newDelete{
  background: url('../../../assets/img/news/icon_delete.png')
}
.newsType .el-table th>.cell {
  font-size: 18px;
  font-weight: bold;
}
.newsType .el-table {
  font-size: 16px;
  color: #434343;
}
</style>
