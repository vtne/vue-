<template>
  <div>
    <div style="background:#fff;width:100%;height:100%">
      <quill-editor
        v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        @change="onEditorChange($event)"
        :style="{ height: '158px',width: '100%' }"
        class="junScrollBar"
      >
        <!-- 自定义toolar -->
        <div id="toolbar" slot="toolbar">
          <!-- Add a bold button -->
          <button class="ql-bold" title="加粗">Bold</button>
          <button class="ql-italic" title="斜体">Italic</button>
          <button class="ql-underline" title="下划线">underline</button>
          <button class="ql-strike" title="删除线">strike</button>
          <button class="ql-blockquote" title="引用"></button>
          <button class="ql-code-block" title="代码"></button>
          <button class="ql-header" value="1" title="标题1"></button>
          <button class="ql-header" value="2" title="标题2"></button>
          <!--Add list -->
          <button class="ql-list" value="ordered" title="有序列表"></button>
          <button class="ql-list" value="bullet" title="无序列表"></button>
          <!-- Add font size dropdown -->
          <select class="ql-header" title="段落格式">
            <option selected>段落</option>
            <option value="1">标题1</option>
            <option value="2">标题2</option>
            <option value="3">标题3</option>
            <option value="4">标题4</option>
            <option value="5">标题5</option>
            <option value="6">标题6</option>
          </select>
          <select class="ql-size" title="字体大小">
            <option value="10px">10px</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px" selected>16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
          </select>
          <select class="ql-font" title="字体">
            <option value="SimSun">宋体</option>
            <option value="SimHei">黑体</option>
            <option value="Microsoft-YaHei">微软雅黑</option>
            <option value="KaiTi">楷体</option>
            <option value="FangSong">仿宋</option>
            <option value="Arial">Arial</option>
          </select>
          <!-- Add subscript and superscript buttons -->
          <select class="ql-color" value="color" title="字体颜色"></select>
          <select class="ql-background" value="background" title="背景颜色"></select>
          <select class="ql-align" value="align" title="对齐"></select>
          <button class="ql-clean" title="还原"></button>
          <button class="ql-link" title="超链接"></button>
          <!-- You can also add your own -->
          <button class="ql-image" title="图片"></button>
          <button class="ql-video" title="视频"></button>
        </div>
      </quill-editor>
      <el-upload
        class="upload-demo"
        action="http://192.168.1.209:16888/file/upload"
        :before-upload="beforeUpload"
        :data="uploadData"
        :on-success="upScuccess"
        ref="upload"
        style="display:none"
      >
        <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
      </el-upload>
    </div>
  </div>
</template>
<script>
// 图片服务器地址
import { Quill, quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
let fileIp = 'http://192.168.1.209'
// 自定义字体大小
let Size = Quill.import('attributors/style/size')
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
Quill.register(Size, true)
// 自定义字体类型
var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif', '宋体', '黑体']
var Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)
export default {
  name: 'eventRequire',
  data () {
    return {
      content: '',
      str: '',
      editorOption: {
        modules: {
          toolbar: {
            container: '#toolbar'
          }
        }
      },
      addRange: [],
      uploadData: {},
      photoUrl: '', // 上传图片地址
      uploadType: '' // 上传的文件类型（图片、视频
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    this.editor.getModule('toolbar').addHandler('image', this.imgHandler)
    this.editor.getModule('toolbar').addHandler('video', this.videoHandler)
    let content = '' // 请求后台返回的内容字符串
    this.str = this.escapeStringHTML(content)
  },
  methods: {
    escapeStringHTML (str) {
      str = str.replace(/</g, '<')
      str = str.replace(/>/g, '>')
      return str
    },
    setEditorContent (content) {
      this.content = content
    },
    getEditorContent (content) {
      return this.content
    },
    // 图片上传之前调取的函数
    // 这个钩子还支持 promise
    beforeUpload (file) {
      // return this.qnUpload(file)
    },
    // 点击图片ICON触发事件
    imgHandler (state) {
      this.addRange = this.editor.getSelection()
      if (state) {
        let fileInput = document.getElementById('imgInput')
        fileInput.click() // 加一个触发事件
      }
      this.uploadType = 'image'
    },
    onEditorChange ({ editor, html, text }) {
      this.content = html
      this.$emit('editorContent', html)
    },
    // 点击视频ICON触发事件
    videoHandler (state) {
      this.addRange = this.editor.getSelection()
      if (state) {
        let fileInput = document.getElementById('imgInput')
        fileInput.click() // 加一个触发事件
      }
      this.uploadType = 'video'
    },
    upScuccess (e, file, fileList) {
      let vm = this
      let url = fileIp + e
      if (url != null && url.length > 0) {
        let value = url
        vm.addRange = this.editor.getSelection()
        value = value.indexOf('http') !== -1 ? value : 'http:' + value
        this.editor.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER)
      } else {
        this.$message.error(`${vm.uploadType}插入失败`)
      }
      this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
    }
  },
  components: {
    quillEditor
  }
}
</script>
<style>
</style>
