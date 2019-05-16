<template>
	<div class="discussList view" style="overflow: auto;">
    <div id="discuss-main">
      <Panel :padding="0" shadow>
        <div slot="title">{{$route.query.problemID}}. {{$route.query.title}}</div>
        <div slot="extra">
          <li>
            <Input
              v-model="query.keywords"
              @on-click="filterByKeyword"
              placeholder="Search topics or comments"
              icon="ios-search-strong"
              style="width:216px;"/>
          </li>
        </div>
        <div class="sortWay">
          <div class="sortWay-1">
              <i-button type="primary"  id="showEdit" @click="showEditDiscussDialog = !showEditDiscussDialog">
                New +
              </i-button>
          </div>
        </div>
        <Card :padding="20" dis-hover style="margin-top: 20px">
          <Table style="width: 100%; font-size: 16px;"
                 :columns="discussTableColumns"
                 :data="discussList"
                 disabled-hover>
          </Table>
          <Pagination :total='total' :page-size="limit" @on-change="pushRouter" :current.sync="query.page"></Pagination>
        </Card>
      </Panel>
    </div>
    <Modal v-model="showEditDiscussDialog">
      <div>
        <div slot="title" align="center" style="font-size: larger">Create Topic</div>
        <i-form :model="discuss" label-position="top">
          <Form-item label="Title">
            <i-input v-model="discuss.title"></i-input>
          </Form-item>
          <Form-item label="Content">
            <Simditor v-model="discuss.content"></Simditor>
          </Form-item>
        </i-form>
      </div>
      <div slot="footer">
        <i-button type="primary" @click="createNewTopic(null)">Create</i-button>
        <Button type="ghost" @click="showEditDiscussDialog=false">Cancel</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '@oj/api.js'
  import utils from '@/utils/utils'
  import Pagination from '@oj/components/Pagination'
  import Simditor from '../../../admin/components/Simditor.vue'

  export default {
    name: 'DiscussList',
    components: {
      Pagination,
      Simditor
    },
    data () {
      return {
        // echarts 无法获取隐藏dom的大小，需手动指定
        largePieInitOpts: {
          width: '500',
          height: '480'
        },
        discussTableColumns: [
          {
            title: '#',
            key: 'id',
            width: 80,
            sortable: true,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    // console.log(params)
                    this.$router.push({ name: 'discuss-details', params: { topicID: params.row.id } })
                  }
                },
                style: {
                  padding: '2px 0'
                }
              }, params.row.id)
            }
          },
          {
            title: 'Title',
            key: 'title'
          },
          {
            title: 'Creator',
            key: 'userId'
          },
          {
            title: 'Created Time',
            key: 'createdAt',
            sortable: true
          },
          {
            title: 'Votes',
            key: 'likeCount',
            sortable: true
          },
          {
            title: 'ViewCount',
            key: 'viewCount',
            sortable: true
          }
        ],
        // 当前problem下所有帖子
        discussList: [],
        contestID: '',
        problemID: '',
        realproblemId: '',
        routeName: '',
        limit: 20,
        total: 0,
        loadings: {
          table: true,
          tag: true
        },
        created_byID: '',
        // 创建新贴
        showEditDiscussDialog: false,
        discussDialogTitle: 'create Topic',
        discuss: {
          title: '',
          content: '',
          status: ''
        },
        // 帖子的关键字搜索
        query: {
          keywords: '',
          page: 1
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init: function () {
        console.log(this.$store)
        let query = this.$route.query
        this.query.page = parseInt(query.page) || 1
        this.contestID = this.$route.query.contestId
        this.query.keywords = query.keywords || ''
        this.created_byId = this.$route.query.created_byId
        this.problemID = this.$route.query.problemID
        this.realproblemId = this.$route.query.realProblemId
        if (this.contestID) {
          console.log(this.$route.query)
          this.getContestDiscussList(this.realproblemId, this.contestID, this.created_byId)
        } else {
          this.getDiscussList(this.problemID)
        }
        if (this.query.page < 1) {
          this.query.page = 1
        }
      },
      pushRouter () {
        if (this.contestID) {
          this.$router.push({
            name: 'contest-discuss-list',
            query: utils.filterEmptyValue(this.query)
          })
        } else {
          this.$router.push({
            name: 'discuss-list',
            query: utils.filterEmptyValue(this.query)
          })
        }
      },
      // 获取topic列表
      getContestDiscussList (problemId, contestId, createdbyId) {
        console.log(problemId, contestId, createdbyId)
        if (contestId) {
          console.log('i am getting contest discuss')
          api.getContestCommentStatus(contestId).then(res => {
            this.discuss.status = res.data
            if (this.$store.getters.user.id === createdbyId || this.discuss.status === 1) {
              api.getContestDiscussList(problemId, contestId).then(res => {
                this.discussList = res.data
                // this.total = res.data.total
              })
            } else {
              this.discussList = []
            }
          })
        }
      },
      getDiscussList (problemId) {
        api.getDiscussList(problemId).then(res => {
          console.log('i am getting  discuss')
          this.discussList = res.data
          // this.total = res.data.total
        })
      },
      // 列表按tag排序
      // 列表按关键字排序
      filterByKeyword (data = undefined) {
        let funName = ''
        if (this.contestID) {
          funName = 'getContestDiscussListBykeyword'
          data = {
            keywords: this.query.keywords,
            problemId: this.realproblemId,
            contestId: this.contestID
          }
        } else {
          funName = 'getDiscussListBykeyword'
          data = {
            keywords: this.query.keywords,
            problemId: this.problemID
          }
        }
        api[funName](data).then(res => {
          console.log(res.data)
          this.discussList = res.data
        })
      },
      // 创建新的topic
      createNewTopic (data = undefined) {
        let funName = ''
        if (this.contestID) {
          funName = 'createNewContestTopic'
          console.log('i am create contest discuss')
        } else {
          funName = 'createNewTopic'
          console.log('i am create a  discuss')
        }
        data = {
          title: this.discuss.title,
          content: this.discuss.content,
          problemId: this.problemID,
          realproblemId: this.realproblemId,
          contest_id: this.contestID,
          discussStatus: this.discuss.status,
          userId: this.created_byId
          // visible: this.discuss.visible
        }
        console.log(data)
        api[funName](data).then(res => {
          this.showEditDiscussDialog = false
          this.init()
        }).catch()
      },
      onOpenEditDialog () {
        // todo 优化
        // 暂时解决 文本编辑器显示异常bug
        setTimeout(() => {
          if (document.createEvent) {
            let event = document.createEvent('HTMLEvents')
            event.initEvent('resize', true, true)
            window.dispatchEvent(event)
          } else if (document.createEventObject) {
            window.fireEvent('onresize')
          }
        }, 0)
      }
    }
}
</script>

<style lang="less">
  li{
    list-style:none;
  }
  .sortWay{
    padding: 0;
    width: 100%;
    height: 20px;
    display: flex;
    margin: 15px;
  }
  .sortWay-1 li{
    display: inline-block;
    font-size: 14px;
    height: 24px;
    color: #37474f;
    padding: 5px;
    margin-left: 6px;
    /*cursor: pointer;*/
    /*border:1px solid #999999 ;*/
  }
  .posi{
    /*position: absolute;*/
    float: right;
    right: 20px;
    background: #455a64;
    border: 1px solid #455a64;
  }
  .vertical-center-modal{
    width:300px;
    height: 500px;
  }
  .topicwrapper {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.5);
    display: none;
  }
  .topic-create {
    position: absolute !important;
    -webkit-transform: translate(50%,25%);
    -moz-transform: translate(50%,25%);
    -ms-transform: translate(50%,25%);
    -o-transform: translate(50%,25%);
    transform: translate(50%,25%);
    z-index: 400;
    /*display: block;*/
    padding: 20px;
    width:600px;
    height:700px;
    border-radius: 5px;
    backround: rgba(58, 99, 101, 0.78);
    border: 1px solid #999999;
  }
  .topic-create .title{
    font-size: 16px;
    color: #464c5b;
    text-align: center;
  }
  .buttons{
    position: absolute;
    right: 20px;
  }
  .buttons button{
    margin-left: 20px;
  }
  .close{
    float: right;
    cursor: pointer;
  }
  #pieChart-detail {
    margin-top: 20px;
    width: 500px;
    height: 480px;
  }

</style>
