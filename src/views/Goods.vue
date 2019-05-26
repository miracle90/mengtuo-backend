<template>
  <div class="course">
    <h3 class="title">商品列表</h3>
    <el-button type="primary" size="medium" class="btn" @click="addGoods">新增商品</el-button>
    <el-table
      :data="goodsList"
      border
      style="width: 100%; margin-top: 20px;"
      align="center"
    >
      <el-table-column
        align="center"
        prop="id"
        label="ID"></el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="商品名称"></el-table-column>
      <el-table-column
        align="center"
        prop="points"
        label="积分"></el-table-column>
      <el-table-column
        align="center"
        prop="price"
        label="原价"></el-table-column>
      <el-table-column
        align="center"
        label="缩略图">
        <template slot-scope="scope">
          <img :src="scope.row.url" alt="" style="width: 50px; height: 50px;">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="modify(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deleteItem(scope.row.id)" type="text" size="small" style="color: red;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 新增商品 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="goodsInfo" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goodsInfo.name" placeholder="请填写商品名称"></el-input>
        </el-form-item>
        <el-form-item label="兑换积分" prop="points">
          <el-input v-model.number="goodsInfo.points" placeholder="请填写兑换积分"></el-input>
        </el-form-item>
        <el-form-item label="商品原价" prop="price">
          <el-input v-model.number="goodsInfo.price" placeholder="请填写商品原价"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleUploadChange"
            :auto-upload="false">
            <img v-if="goodsInfo.imgUrl" :src="goodsInfo.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" size="medium">确定</el-button>
          <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, editGoodsApi, delGoodsApi } from '../common/api'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  data () {
    return {
      goodsList: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      dialogTitle: '新增商品',
      dialogVisible: false,
      goodsInfo: {
        id: '',
        name: '',
        price: '',
        points: '',
        imgUrl: '',
        file: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        points: [
          { required: true, message: '请输入兑换积分', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品原价', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请选择商品图片', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    handleUploadChange (file) {
      getBase64(file.raw, imgUrl => {
        this.goodsInfo.file = file.raw
        this.$set(this.goodsInfo, 'imgUrl', imgUrl)
      })
    },
    // 修改商品信息
    modify (r) {
      console.log(r)
      const { id, name, points, price } = r
      this.goodsInfo = {
        id,
        name,
        price,
        points
      }
      this.dialogTitle = '编辑商品'
      this.dialogVisible = true
    },
    // 新增商品提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { name, points, price, file } = this.goodsInfo
          var formData = new FormData()
          // formData.append("id", id || null);
          formData.append('name', name)
          formData.append('points', points)
          formData.append('price', price)
          formData.append('file', file)
          editGoodsApi(formData).then(res => {
            const { code } = res.data
            if (code === 0) {
              this.$notify({
                title: '成功',
                message: '配置商品成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
            } else {
              this.$notify.error({
                title: '错误',
                message: '配置商品失败，请刷新重试',
                offset: 100
              })
            }
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '网络异常，请刷新重试',
              offset: 100
            })
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    addGoods () {
      this.goodsInfo = {
        id: null,
        name: '',
        price: '',
        points: '',
        imgUrl: '',
        file: ''
      }
      this.dialogTitle = '新增商品'
      this.dialogVisible = true
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    deleteItem (id) {
      delGoodsApi({
        id
      }).then(res => {
        const { code } = res.data
        if (code === 0) {
          this.$notify({
            title: '成功',
            message: '删除商品成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$notify.error({
            title: '错误',
            message: '删除商品失败，请刷新重试',
            offset: 100
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '网络异常，请刷新重试',
          offset: 100
        })
      })
    },
    getList () {
      getGoodsList({
        size: this.pageSize,
        page: this.currentPage
      }).then(res => {
        const { code, page } = res.data
        if (code === 0) {
          this.goodsList = page.records
          this.total = page.total
          // this.courseList.map(item => (item.state = true))
        } else {
          this.$notify.error({
            title: '错误',
            message: '查询数据失败，请刷新重试',
            offset: 100
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '网络异常，请刷新重试',
          offset: 100
        })
      })
    }
  }
}
</script>

<style lang="stylus">
  .course
    margin-left 20px
    .title
      padding-bottom 20px
      border-bottom 1px solid #e8e8e8
    .btn
      margin: 20px 0
    // ul
    //   li
    //     .el-input
    //       margin-right 20px
    //       width 200px
    //       height 60px
    //       line-height 60px
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
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
