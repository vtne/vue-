<template>
  <div class="nesAdd">
    <div class="position"><nav-list :navList='navList'></nav-list></div>
    <div class="content">
      <div class="head">{{this.$route.params.data !== 'add' ? '编辑':'新建'}}</div>
      <div class="addInfo junScrollBar">
        <el-form :label-position="'right'" label-width="156px" :model="formData" :rules="rules" ref="ruleForm">
          <el-form-item label="新闻标题" prop="summary">
            <el-input v-model="formData.summary" placeholder="输入新闻标题"></el-input>
          </el-form-item>
          <el-form-item label="选择类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择" :clearable='true'>
              <el-option
                v-for="item in newTypeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传封面">
            <el-upload
              class='up-image-component'
              :action="upImageUrl"
              list-type="picture-card"
              :file-list="upLoadImageUrl"
              :limit='1'
              :headers='imageConfig'
              :on-remove='removeImageList'
              :on-success='upSuccessEvent'
              :on-error='upErrorEvent'>
                <i class="uploadImg"></i>
                <p>上传图片</p>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
           <el-form-item label="图片地址(可选)">
            <el-input v-model="inputImageUrl" placeholder="图片地址" @blur='changeUploadImage'></el-input>
            <div class="chooseTip">如已上传封面，此处可不填</div>
          </el-form-item>
          <el-form-item label="内容" prop="detail">
            <div class="editor">
              <quill ref='editor' @editorContent='editorContent'></quill>
            </div>
          </el-form-item>
          <el-form-item label="浏览量">
            <el-input v-model="formData.scanNum" placeholder="输入浏览量"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import navList from '@/components/navList'
import quill from '@/components/quill'
const upImageUrl = require('../../../../static/config')
export default {
  name: 'newsAdd',
  components: {
    navList,
    quill
  },
  data () {
    return {
      newTypeList: [],
      // 新建内容
      formData: {
        summary: '',
        type: '',
        detail: '',
        scanNum: ''
      },
      inputImageUrl: '',
      upLoadImageUrl: [],
      // 预览弹框
      dialogImageUrl: '',
      dialogVisible: false,
      navList: [
        {
          name: '系统',
          path: ''
        },
        {
          name: '新闻管理',
          path: 'newsManage'
        },
        {
          name: '新建',
          path: 'newAdd'
        }
      ],
      rules: {
        summary: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {max: 200, message: '长度在200个字符以内', trigger: 'blur'}
        ],
        type: {required: true, message: '请选择新闻类型', trigger: 'change'}
      }
    }
  },
  methods: {
    async fetchNewsTypeData () {
      let {data: {data: {list = []}, success}} = await this.$http.get('/information/informationType/queryInfoType')
      if (!success) {
        this.$message.error('数据加载失败')
        return false
      }
      this.newTypeList = list
    },
    editorContent (content) {
      this.$set(this.formData, 'detail', content)
    },
    upErrorEvent (msg) {
      this.$message.error('文件上传发生错误')
    },
    upSuccessEvent (res, file, fileList) {
      this.upLoadImageUrl[0] = {url: res}
    },
    removeImageList () {
      this.upLoadImageUrl = []
    },
    changeUploadImage () {},
    onSubmit () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          let url = this.requestUrl
          if (!this.formData.detail) {
            this.$message.error('请填写新闻内容')
            return false
          }
          let upLoadImageUrl = this.upLoadImageUrl[0] ? this.upLoadImageUrl[0].url : ''
          let logoImage = this.inputImageUrl || upLoadImageUrl
          var {data: {success, info}} = await this.$http.post(url, {...this.formData, logoImage})
          if (success) {
            this.$message({type: 'success', message: info})
            this.$router.replace({name: 'newsManage'})
            return true
          }
          this.$message.error(info)
        }
      })
    }
  },
  created () {
    // 初始化上传图片上传地址
    this.upImageUrl = upImageUrl.upImageUrl
    // 初始化上传图片请求头
    this.imageConfig = {
      token: localStorage.getItem('X-token'),
      userId: localStorage.getItem('X-userId')
    }
    // 获取新闻类型列表
    this.fetchNewsTypeData()
    let item = this.$route.params.data
    // 如果刷新了页面，直接返回上一级
    if (item === '[object Object]') {
      this.$router.replace({name: 'newsManage'})
    } else if (item && item !== 'add') {
      this.formData = {...item, type: Number(item.type)}
      this.upLoadImageUrl = item.logoImage ? [{url: item.logoImage}] : []
      this.requestUrl = '/information/information/update'
      setTimeout(() => {
        this.$refs.editor.setEditorContent(item.detail)
      }, 20)
      return true
    } else if (!item) {
      this.$router.replace({name: 'newsManage'})
    } else {
      this.requestUrl = '/information/information/create'
      return false
    }
  }
}
</script>
<style>
.nesAdd{
    height: 100%;
}
.nesAdd .content{
  height: calc(100% - 40px);
  box-sizing: border-box;
  padding: 0 20px 20px 0;
}
.nesAdd .content .head{
  height: 56px;
  line-height: 56px;
  font-size: 18px;
  font-weight: bold;
}
.nesAdd .content .addInfo{
    height: calc(100% - 56px);
    background-color: #fff;
    padding-top: 25px;
    box-sizing: border-box;
    overflow: auto;
}
.nesAdd .content .addInfo .el-input,
.nesAdd .content .addInfo .el-textarea
{
    width: 344px;
}
.nesAdd .content .addInfo .el-upload--picture-card{
    width: 85px;
    height: 85px;
    border-color: #479df6;
    line-height: 0
}
.nesAdd .content .addInfo .el-upload--picture-card p{
    color: #479df6;
    height: 30px;
    line-height: 30px;
}
.nesAdd .content .up-image-component {
  line-height: normal;
  height: 85px;
}
.nesAdd .content .addInfo .uploadImg{
    width: 37px;
    height: 33px;
    display: inline-block;
    margin-top: 16px;
    background: url('../../../assets/img/news/icon-upload.png') no-repeat;
}
.nesAdd .content .addInfo .el-upload-list--picture-card .el-upload-list__item{
    width: 85px;
    height: 85px;
}
.nesAdd .content .addInfo .chooseTip{
    font-size: 12px;
    line-height: normal;
}
.nesAdd .content .editor{
  height: 200px;
  width: 900px;
  line-height: normal;
  border: 1px solid #d7dee7;
  overflow: auto;
}
</style>
