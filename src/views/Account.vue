<template>
  <div class="account">
    <h3 class="title">修改密码</h3>
    <el-form :model="teacherForm" :rules="rules" ref="ruleForm" label-width="100px" class="psd-form">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="teacherForm.oldPassword" placeholder="请填写原来的密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="teacherForm.password" placeholder="请填写新的密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPsd">
        <el-input v-model="teacherForm.confirmPsd" placeholder="请再次填写新密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" size="medium">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.teacherForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      teacherForm: {
        oldPassword: '',
        password: '',
        confirmPsd: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请填写原来的密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写6-16位的密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        confirmPsd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // this.getList()
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const MIDLogInfo = JSON.parse(localStorage.getItem('MIDLogInfo'))
          const {
            createTime,
            email,
            id,
            name,
            password,
            type,
            username,
            wechat
          } = MIDLogInfo
          if (this.teacherForm.oldPassword !== password) {
            this.$notify.error({
              title: '错误',
              message: '原密码不正确，请重新输入',
              offset: 100
            })
          } else {
            this.axios.post('http://39.98.181.204:8080/mid/user/update', {
              id,
              username,
              email,
              password: this.teacherForm.password,
              name,
              wechat,
              createTime,
              type
            }).then(res => {
              console.log(res)
              const { code } = res.data
              if (code === 0) {
                this.$notify({
                  title: '成功',
                  message: '修改密码成功，请使用新密码登录',
                  type: 'success'
                })
                localStorage.removeItem('MIDLogInfo')
                this.$router.push('/')
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '修改密码失败，请刷新重试',
                  offset: 100
                })
              }
            }).catch(() => {
              this.$notify.error({
                title: '错误',
                message: '修改密码失败，请刷新重试',
                offset: 100
              })
            })
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '请输入正确的信息！',
            offset: 100
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus">
  .account
    margin-left 20px
    .title
      padding-bottom 20px
      border-bottom 1px solid #e8e8e8
    .psd-form
      margin 50px auto
      padding 0 50px
</style>
