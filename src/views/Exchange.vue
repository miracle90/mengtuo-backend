<template>
  <div class="teacher">
    <h3 class="title">兑换列表</h3>
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px;"
      align="center"
    >
      <el-table-column
        align="center"
        prop="userId"
        label="用户ID"></el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="用户姓名"></el-table-column>
      <el-table-column
        align="center"
        prop="goodsId"
        label="商品ID"></el-table-column>
      <el-table-column
        align="center"
        prop="goodsName"
        label="商品名称"></el-table-column>
      <el-table-column
        align="center"
        prop="userPoints"
        label="用户积分"></el-table-column>
      <el-table-column
        align="center"
        prop="points"
        label="兑换积分"></el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">
          {{scope.row.status === 0 ? '待确认' : (scope.row.status === 1 ? '已发货' : '不通过')}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope" v-if="scope.row.status === 0">
          <el-button @click="handleClick(scope.row, '1')" type="text" size="small">通过</el-button>
          <el-button @click="handleClick(scope.row, '2')" type="text" size="small">不通过</el-button>
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
    <!-- <el-dialog title="变更用户积分" :visible.sync="dialogModifyVisible" width="500px">
      <el-form :model="modifyForm" ref="modifyForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="modifyForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="email">
          <el-input v-model="modifyForm.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="变更类型" prop="resource">
          <el-radio-group v-model="modifyForm.type">
            <el-radio label="1">增加积分</el-radio>
            <el-radio label="0">消费积分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="积分"
          prop="score"
          :rules="[
            { required: true, message: '积分不能为空'},
            { type: 'number', message: '积分必须为数字类型'}
          ]"
        >
          <el-input v-model.number="modifyForm.score" placeholder="请输入积分数值"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateForm('modifyForm')" size="medium">确定</el-button>
          <el-button @click="resetForm('modifyForm')" size="medium">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->
  </div>
</template>

<script>

import { getOrderCourseList, auditOrderApi } from '../common/api'

export default {
  data () {
    return {
      searchName: '',
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      dialogModifyVisible: false,
      modifyForm: {
        id: '',
        name: '',
        mobile: '',
        type: '1',
        score: ''
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // updateForm (formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       const { id, type, score: point } = this.modifyForm
    //       userUpdateScore({
    //         type,
    //         id,
    //         point
    //       }).then(res => {
    //         const { code } = res.data
    //         if (code === 0) {
    //           this.$notify({
    //             title: '成功',
    //             message: '变更用户积分成功',
    //             type: 'success'
    //           })
    //           this.dialogModifyVisible = false
    //           this.getList()
    //         } else {
    //           this.$notify.error({
    //             title: '错误',
    //             message: '变更用户积分失败，请刷新重试',
    //             offset: 100
    //           })
    //         }
    //       }).catch(() => {
    //         this.$notify.error({
    //           title: '错误',
    //           message: '变更用户积分失败，请刷新重试',
    //           offset: 100
    //         })
    //       })
    //     } else {
    //       this.$notify.error({
    //         title: '错误',
    //         message: '请输入正确的信息！',
    //         offset: 100
    //       })
    //     }
    //   })
    // },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    // 审核
    handleClick (r, status) {
      auditOrderApi({
        id: r.id,
        status
      }).then(res => {
        if (res.data.code === 0) {
          this.$notify({
            title: '成功',
            message: '审核成功！',
            type: 'success'
          })
          this.getList()
        } else {
          this.$notify.error({
            title: '错误',
            message: '审核失败，请刷新重试',
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
      getOrderCourseList({
        size: this.pageSize,
        page: this.currentPage
        // name: this.searchName
      }).then(res => {
        const { code, pageList } = res.data
        if (code === 0) {
          this.tableData = pageList.records
          this.total = pageList.total
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
          message: '查询数据失败，请刷新重试',
          offset: 100
        })
      })
    }
  }
}
</script>

<style lang="stylus">
  .teacher
    margin-left 20px
    .form-wrapper
      margin 20px 0
      padding-bottom 10px
      border-bottom 1px solid #e8e8e8
      .btn
        float right
    .search
      width 280px
    .pagination
      margin-top 20px
      text-align center
    .record-pagination
      margin 20px 0
      text-align center
</style>
