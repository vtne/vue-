<template>
  <div class="liveServer">
    <div class="position">
      <nav-list :navList='navList'></nav-list>
    </div>
    <div class="taskSearch clearfix">
      <div class="con clearfix">
        <div class="server-type-label">服务类型</div>
        <div class="event_level">
          <el-select
            v-model="serverType"
            placeholder="请选择"
            @change="fetchServerListData(true)"
            :clearable='true'
          >
            <el-option
              v-for="(item,index) in serverTypeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class='search-area'>
          <el-input v-model="searchValue"
                    plcaeholder='输入名称/关键字'
                    class='search-input'
                    :clearable='true'
                    @keyup.enter.native="fetchServerListData(true)">
             <template slot="append" ><div @click="fetchServerListData(true)" class='search-button'><i class="el-icon-search" ></i></div></template>
          </el-input>
        </div>
      </div>
      <span class='new-build' @click="addNewliveServer">新建</span>
    </div>
    <div class="listPage">
      <div class="content">
        <div class="list">
          <el-table
            :data='serverListData'
            style="width:100%"
            class="junScrollBar"
            height="100%"
          >
            <template slot="empty">
              <i class="noDataBg"></i>
            </template>
            <el-table-column
              prop='serve'
              label='服务'
              style="width:10%"
            >
              <template slot-scope="scope">
                <span>{{findItem(scope.row.type, serverTypeList, 'code', 'name')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop='icon'
              label='图标'
              style="width:20%"
            >
              <template slot-scope="scope">
                <img :src="scope.row.logoImage" style="width: 50px;height: 50px">
              </template>
            </el-table-column>
            <el-table-column
              prop='name'
              label='名称'
              style="width:10%"
            ></el-table-column>
            <el-table-column
              prop='url'
              label='链接'
              style="width:10%"
            ></el-table-column>
            <el-table-column
              prop='id'
              label='操作'
              style="width:15%"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small"><i title='编辑' class="el-icon-newsEdit" @click='updateServerData(scope.row)'></i></el-button>
                <el-button type="text" size="small"><i title='删除' class="el-icon-newDelete" @click="handleClickdelete(scope.$index, scope.row)"></i></el-button>
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
            @current-change="fetchServerListData(false)"
            :current-page.sync="currentPage"
            :page-size='10'
            :page-count="pageCount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="确认删除该条信息"
      :visible.sync="actionDialog"
      width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="actionDialog=false">取 消</el-button>
        <el-button type="primary" @click="deleteServerData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新建弹框 -->
    <el-dialog  :title="dialogTitle" :visible.sync="newTypeDialog" @closed='closeDialog'>
      <el-form :model="newTypeForm" :rules="rules" ref="ruleForm">
        <el-form-item label="服务" label-width="120px" prop="type">
          <el-select v-model="newTypeForm.type" placeholder="请选择服务">
            <el-option v-for="(item, index) in serverTypeList" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" label-width="120px">
          <el-upload
            class="avatar-uploader"
            :action="iconuploadUrl"
            list-type="picture-card"
            :limit='1'
            :headers='imageConfig'
            :file-list='imageList'
            :on-remove='removeImageList'
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus "></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="名称" label-width="120px" prop="name">
          <el-input v-model="newTypeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接" label-width="120px" prop="url">
          <el-input v-model="newTypeForm.url" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import '../../../assets/css/list_common.css'
import navList from '@/components/navList'
const MAX_NUMBER = 10
const baseUrl = require('../../../../static/config')
export default {
  name: 'liveServer',
  components: {
    navList
  },
  data () {
    return {
      imageList: [], // 新增弹窗图片地址
      currentPage: 1,
      pageCount: 1,
      actionDialog: false, // 确认删除弹框
      serverListData: [], // 生活服务表格数据
      serverType: '', // 当前选择的服务类型
      serverTypeList: [], // 服务类型列表
      navList: [
        {
          name: '首页',
          path: ''
        }, {
          name: '生活服务',
          path: 'event'
        }
      ],
      searchValue: '', // input搜索框
      // 新建表单数据
      newTypeForm: { // 新增内容
        type: '', // 服务
        name: '', // 名称
        url: '', // 链接
        logoImage: '' // 图片地址
      },
      dialogTitle: '编辑', // 弹框标题
      newTypeDialog: false, // 新增生活服务弹框
      rules: {
        type: [
          { required: true, message: '请选择服务', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入链接', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async fetchServerTypeData () {
      let {data: {data = [], success}} = await this.$http.get('/service3rd/queryType')
      if (!success) {
        this.$message.error('数据加载失败')
        return false
      }
      this.serverTypeList = data
    },
    async fetchServerListData (flag) {
      var currentPage = this.currentPage
      if (flag) {
        currentPage = 1
      }
      let {data: {data: {list = [], pages}, success}} = await this.$http.get('/service3rd/query2', {
        params: {
          info: this.searchValue,
          status: this.serverType ? this.serverType : '',
          page: currentPage,
          size: MAX_NUMBER
        }
      })
      if (!success) {
        this.$message.error('数据加载失败')
        return false
      }
      this.pageCount = pages
      this.currentPage = currentPage
      this.serverListData = list
    },
    async deleteServerData () {
      this.actionDialog = false
      let {id} = this.serverTypeList[this.currentItemIndex]
      let {data: {errmsg, success}} = await this.$http.get('/service3rd/delete', {
        params: {id}
      })
      if (!success) {
        this.$message.error(errmsg)
        return false
      }
      this.serverListData.splice(this.currentItemIndex, 1)
      this.$message({message: '删除成功', type: 'success'})
    },
    updateServerData (item) {
      this.newTypeDialog = true
      this.dialogTitle = '编辑'
      this.requestUrl = '/service3rd/update'
      this.newTypeForm = {...item}
      this.imageList = [{url: item.logoImage}]
    },
    addNewliveServer () {
      this.dialogTitle = '新建'
      this.newTypeDialog = true
      this.requestUrl = '/service3rd/create'
    },
    // 编辑和新增生活服务的确定按钮
    submitForm () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          let url = this.requestUrl
          if (!this.newTypeForm.logoImage) {
            this.$message.error('请上传图片')
            return false
          }
          var {data: {success, info}} = await this.$http.post(url, {...this.newTypeForm})
          if (success) {
            this.$message({type: 'success', message: info})
            this.newTypeDialog = false
            this.fetchServerListData()
            return true
          }
          this.newTypeDialog = false
          this.$message.error(info)
        }
      })
    },
    // 删除生活服务某条数据
    handleClickdelete (index) {
      this.currentItemIndex = index
      this.actionDialog = true
    },
    // 新增弹窗上传图片
    handleAvatarSuccess (res, file, fileList) {
      this.newTypeForm.logoImage = res
    },
    removeImageList () {
      this.newTypeForm.logoImage = ''
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 关闭新增生活服务弹窗
    closeDialog () {
      this.$refs['ruleForm'].resetFields()
      this.imageList = []
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
    }
  },
  created () {
    this.iconuploadUrl = baseUrl.liveServerImageUrl
    this.imageConfig = {
      token: localStorage.getItem('X-token'),
      userId: localStorage.getItem('X-userId')
    }
    this.fetchServerTypeData()
    this.fetchServerListData()
  },
  watch: {
    searchValue (value) {
      if (value === '') {
        this.fetchServerListData(true)
      }
    }
  }
}
</script>
<style scoped>
.liveServer {
  height: 100%;
  width: 100%;
}
.liveServer .taskSearch {
  height: 56px;
  padding-top: 10px;
  box-sizing: border-box;
}
.liveServer .taskSearch .con {
  height: 36px;
  width: auto;
  float: left;
}
.liveServer .taskSearch .con div {
  float: left;
}
.liveServer .taskSearch .server-type-label{
  line-height: 36px;
}
.liveServer .server-type-label{
  font-size: 18px;
}
.liveServer .taskSearch>.new-build {
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
.liveServer .taskSearch .con .event_type {
  margin-right: 30px;
}
.liveServer .taskSearch .con .event_type,
.liveServer .taskSearch .con .event_level {
  height: 36px;
  width: 150px;
  margin-left: 20px;
}
.liveServer .taskSearch .con .event_type .el-input__inner,
.liveServer .taskSearch .con .event_level .el-input__inner {
  height: 36px;
  line-height: 40px;
}
.liveServer .taskSearch .search-area .search-input {
  width: 253px;
  margin-left: 22px;
}
.liveServer .taskSearch .search-area .search-button{
  width: 100%;
  line-height: 38px;
  height: 38px;
}

.liveServer .edit,.liveServer .del {
  cursor: pointer;
}
.liveServer .edit {
  border-right: 1px solid #c0c4cc;
  padding-right: 6px;
}
/* 列表 */
.liveServer .listPage {
  height: calc(100% - 96px);
  box-sizing: border-box;
  background: #efeff4;
  padding: 0px 20px 20px 0;
  font-size: 16px;
}
.liveServer .listPage .content {
  height: 100%;
  background: #fff;
}
.liveServer .listPage .content .list {
  height: calc(100% - 50px);
}
/* 页码 */
.liveServer .listPage .content .pages {
  height: 50px;
  text-align: center;
}
.liveServer .noDataBg {
  height: 500px;
}
.liveServer .el-icon-newsEdit{
  background: url('../../../assets/img/news/icon_edit.png');
  height: 20px;
  width: 20px;
}
.liveServer .el-icon-newDelete{
  background: url('../../../assets/img/news/icon_delete.png');
  height: 20px;
  width: 20px;
}
</style>
<style>
.avatar-uploader {
  line-height: normal;
  height: 148px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.liveServer .taskSearch .el-input-group__append{
  background-color: #1e88f5;
  color: #fff;
  width: 50px;
  padding: 0px;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-form-item>.el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}
</style>
