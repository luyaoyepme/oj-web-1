<template>
    <div class="discusslist view">
      <Card :bordered="true">
        <p slot="title">{{this.$route.params.topicID}}. {{this.topic.title}}</p>
        <p class="usrInfo">   用户：{{this.topic.userId}}
          创建于：{{this.topic.createAt}}
          <i id="likeCharge"  style="font-size: 20px;" @click="change()"></i>
          <icon type="ios-bell" size="20"></icon>
        </p>
        <div v-html="this.topic.content" class="content-container markdown-body"></div>
      </Card>
      <Card :padding="20" dis-hover style="margin-top: 20px">
        <Table style="width: 100%; font-size: 16px;"
               :columns="commentTableColumns"
               :data="commentList"
               disabled-hover>
        </Table>
      </Card>
      <div class="layout-content">
        <div slot="title" align="left" style="font-size: larger">Comment here</div>
        <i-form :model="comment">
          <Form-item label="在这里发表你的评论：">
            <Simditor v-model="comment.content"></Simditor>
          </Form-item>
          <Form-item>
            <i-button type="primary" @click="submmitComment">提交</i-button>
          </Form-item>
        </i-form>
      </div>
    </div>
</template>

<script>
  import api from '@oj/api.js'
  import Simditor from '../../components/Simditor.vue'

  export default {
    name: 'DiscussDetails',
    components: {
      Simditor
    },
    data () {
      return {
        commentTableColumns: [
          {
            title: 'User',
            key: 'userId'
          },
          {
            title: 'Content',
            key: 'content',
            ellipsis: true
          },
          {
            title: 'Time',
            key: 'createdAt'
          }
        ],
        commentList: [],
        limit: 20,
        total: 0,
        topicID: '',
        likeFlag: false,
        loadings: {
          table: true,
          tag: true
        },
        // 当前topic下的信息 主题、内容、点赞数、发表时间
        topic: {
          title: '',
          content: '',
          createAt: '',
          likeCount: 0,
          page: 1,
          userId: ''
        },
        comment: {
          content: ''
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.topicID = this.$route.params.topicID
        this.getTopic(this.topicID)
        this.likeCharge()
      },
      // 获取topic具体信息
      getTopic (id) {
        api.getTopic(id).then(res => {
          // console.log(res.data)
          this.topic.content = res.data.content
          this.topic.title = res.data.title
          this.topic.likeCount = res.data.likeCount
          this.topic.userId = res.data.userId
          this.topic.createAt = res.data.createdAt
          this.commentList = res.data.comments
          console.log(this.commentList)
        })
      },
      likeCharge () {
        api.getCurrentUsrLike(this.topicID).then(res => {
          this.likeFlag = res.data
          this.show(this.likeFlag)
        }).catch()
        // console.log()
      },
      change () {
        this.likeFlag === false ? this.likeFlag = true : this.likeFlag = false
        api.voteThisTopic(this.topicID).then(res => {
          // console.log(res.data)
        }).catch()
        this.show(this.likeFlag)
      },
      show (flag) {
        // console.log(flag)
        let oDiv = document.getElementById('likeCharge')
        if (flag) {
          oDiv.setAttribute('class', 'ivu-icon ivu-icon-heart')
        } else {
          oDiv.setAttribute('class', 'ivu-icon ivu-icon-ios-heart-outline')
        }
      },
      submmitComment (data = undefined) {
        // let funName = ''
        data = {
          id: this.topicID,
          content: this.comment.content
          // visible: this.discuss.visible
        }
        // console.log(data)
        api.submmitComment(data).then(res => {
          this.comment.content = null
          // this.showEditDiscussDialog = false
          this.init()
        }).catch()
      }
    }
  }
</script>

<style lang="less">
  .usrInfo{
    border-bottom:1px solid #7b7b7b;
  }
  .body-content{
    height: 50px;
  }
  .usrInfo i {
    float: right;
    margin-left: 8px;

  }
  .textarea {
    width: 100%;
    height: 220px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .postbtn button{
    float: right;
    margin-right: 10px;
  }
</style>
