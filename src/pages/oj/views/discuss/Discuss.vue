<template>
  <div class="discussList view">
    <div id="discuss-main">
      <Panel :padding="0" shadow>
        <div slot="title">
          <Tabs>
            <Tab-pane label="ACMDiscuss" icon="ribbon-a">
              <div class="sortWay">
                <div class="sortWay-1">
                  <li @click="filterByTag(5)"><label>Newest to Oldest</label></li>
                  <li @click="filterByTag(2)"><label>Most Votes</label></li>
                  <li @click="filterByTag(3)"><label>Most Posts</label></li>
                  <li @click="filterByTag(4)"><label>Recent Activity</label></li>
                  <li @click="filterByTag(1)"><label>Oldest to Newest</label></li>
                  <li>
                    <i-button type="primary" @click="showDialog(true)">
                      New +
                    </i-button>
                  </li>
                  <i-input icon="ios-search" placeholder="请输入..." style="width: 200px"></i-input>
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
            </Tab-pane>
            <Tab-pane label="CourseDiscuss" icon="university">
              <div class="sortWay">
                <div class="sortWay-1">
                  <li @click="filterByTag(5)"><label>Newest to Oldest</label></li>
                  <li @click="filterByTag(2)"><label>Most Votes</label></li>
                  <li @click="filterByTag(3)"><label>Most Posts</label></li>
                  <li @click="filterByTag(4)"><label>Recent Activity</label></li>
                  <li @click="filterByTag(1)"><label>Oldest to Newest</label></li>
                  <li>
                    <i-button type="primary" @click="showDialog(true)">
                      New +
                    </i-button>
                  </li>
                  <i-input icon="ios-search" placeholder="请输入..." style="width: 200px"></i-input>
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
            </Tab-pane>
            <Tab-pane label="GeneralDiscuss" icon="happy-outline">
              <div class="sortWay">
                <div class="sortWay-1">
                  <li @click="filterByTag(5)"><label>Newest to Oldest</label></li>
                  <li @click="filterByTag(2)"><label>Most Votes</label></li>
                  <li @click="filterByTag(3)"><label>Most Posts</label></li>
                  <li @click="filterByTag(4)"><label>Recent Activity</label></li>
                  <li @click="filterByTag(1)"><label>Oldest to Newest</label></li>
                  <li>
                    <i-button type="primary" @click="showDialog(true)">
                      New +
                    </i-button>
                  </li>
                  <i-input icon="ios-search" placeholder="请输入..." style="width: 200px"></i-input>
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
            </Tab-pane>
          </Tabs>
        </div>
        <!--     dialog-->
        <div class="topicwrapper">
          <div class="topic-create" style="background-color: #eeeeee">
            <i-form v-model="discuss" >
              <div class="close">
                <Icon type="ios-close-empty" size="20" @click="showDialog(false)"></Icon>
              </div>
              <div class="title">Create Topic
              </div>
              <Form-item label="Title" prop="title">
                <i-input v-model="discuss.title"></i-input>
              </Form-item>
              <Form-item label="Content" prop="content" :height="400">
                <i-input v-model="discuss.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
                <!--                <Simditor v-model="discuss.content" ></Simditor>-->
              </Form-item>
              <div class="buttons">
                <i-button @click="showDialog(false)">Cancel</i-button>
                <i-button type="primary" @click="createNewTopic">Create</i-button>
              </div>
            </i-form>
          </div>
        </div>
      </Panel>
    </div>
  </div>
</template>

<script>
  import api from '@oj/api.js'
  import utils from '@/utils/utils'
  import Pagination from '@oj/components/Pagination'
  import Simditor from '../../../admin/components/Simditor.vue'
  export default {
    name: 'Discuss',
    components: {
      Pagination,
      Simditor
    },
    data () {
      return {
        tagList: [
          {
            id: 2,
            name: 'c'
          },
          {
            id: 3,
            name: 'c++'
          },
          {
            id: 4,
            name: 'java'
          },
          {
            id: 5,
            name: '查找'
          },
          {
            id: 6,
            name: '计算机'
          },
          {
            id: 7,
            name: '软件工程'
          }
        ],
        discussTableColumns: [
          {
            title: '#',
            key: 'id',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    console.log(params)
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
            title: 'Content',
            key: 'content'
          },
          {
            title: 'Votes',
            key: 'likeCount'
          }
        ],
        // 当前problem下所有帖子
        discussList: [],
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
          keyword: '',
          page: 1,
          contestId: '',
          tag: ''
          // problemId: ''
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let id = this.$route.query.problemID
        let query = this.$route.query
        this.query.page = parseInt(query.page) || 1
        this.query.contestId = this.$route.query.contestId
        this.query.keyword = query.keyword || ''
        // this.routeName = this.$route.name
        this.created_byId = this.$route.query.created_byId
        this.query.problemID = id
        this.showDialog(this.showEditDiscussDialog)
        this.getDiscussList(id, this.query.contestId, this.created_byId)
        if (this.query.page < 1) {
          this.query.page = 1
        }
      },
      pushRouter () {
        console.log(this.query)
        this.$router.push({
          name: 'discuss-list',
          query: utils.filterEmptyValue(this.query)
        })
      },
      // 获取topic列表
      getDiscussList () {
        console.log('i m getting problem discuss')
        api.getDiscussList(10001).then(res => {
          this.discussList = res.data
          // console.log(res.data)
        })
      },
      // 列表按tag排序
      filterByTag (num) {
        console.log(num)
        api.getDiscussList(this.$route.query.problemID, num).then(res => {
          this.discussList = res.data
        })
      },
      // 列表按关键字排序
      filterByKeyword () {
        api.getDiscussListBykeyword(this.$route.query.problemID, this.query.keyword).then(res => {
          this.discussList = res.data
        })
      },
      // 创建新的topic
      createNewTopic (data = undefined) {
        let funName = ''
        data = {
          title: this.discuss.title,
          content: this.discuss.content,
          problemId: this.query.problemID,
          contest_id: this.query.contestId,
          discussStatus: 1,
          userId: 1
          // visible: this.discuss.visible
        }
        // console.log(data)
        if (this.query.contestId) {
          funName = 'createNewContestTopic'
        } else {
          funName = 'createNewTopic'
        }
        api[funName](data).then(res => {
          console.log(data)
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
      },
      showDialog (flag) {
        let odiv = document.getElementsByClassName('topicwrapper')[0]
        if (flag) {
          odiv.style.display = 'block'
        } else {
          odiv.style.display = 'none'
        }
      }
    }
  }
</script>

<style scoped>
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
    height:400px;
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
  .taglist-title {
    margin-left: -10px;
    margin-bottom: -10px;
  }

  .tag-btn {
    margin-right: 5px;
    margin-bottom: 10px;
  }

  #pick-one {
    margin-top: 10px;
  }
</style>
