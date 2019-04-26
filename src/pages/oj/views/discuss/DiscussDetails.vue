<template>
    <div class="discusslist view">
<!--      <div style="background:#eee;padding: 20px">-->
<!--        <Card :bordered="false">-->
<!--          <p slot="title">{{this.$route.params.topicID}}.  {{this.topic.title}}</p>-->
<!--          <p>用户：{{this.topic.userId}}</p>-->
<!--          <p>创建于： {{this.topic.createAt}}</p>-->
<!--          <p>{{this.topic.content}}</p>-->
<!--        </Card>-->
<!--      </div>-->
      <Card :bordered="true">
        <p slot="title">{{this.$route.params.topicID}}. {{this.topic.title}}</p>
        <p class="usrInfo">   用户：{{this.topic.userId}}
          创建于：{{this.topic.createAt}}
<!--          <i class="ivu-icon ivu-icon-heart" style="font-size: 20px;" @click="change()"></i>-->
          <i id="likeCharge"  style="font-size: 20px;" @click="change()"></i>
          <icon type="ios-bell" size="20"></icon>
        </p>
        <p class="body-content">讨论内容：{{this.topic.content}}</p>
      </Card>
      <Card :padding="20" dis-hover style="margin-top: 20px">
        <Table style="width: 100%; font-size: 16px;"
               :columns="commentTableColumns"
               :data="commentList"
               disabled-hover>
        </Table>
<!--        <Pagination :total='total' :page-size="limit" @on-change="pushRouter" :current.sync="query.page"></Pagination>-->
      </Card>
      <div class="layout-content">
        <i-form :model="comment">
          <Form-item label="在这里发表你的评论：">
            <i-input v-model="comment.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
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

  export default {
    name: 'DiscussDetails',
    data () {
      return {
        commentTableColumns: [
          {
            title: 'User',
            key: 'userId'
          },
          {
            title: 'Centent',
            key: 'content'
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
