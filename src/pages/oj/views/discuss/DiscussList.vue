<template>
	<div class="wrapper">
    <div id="discuss-main">
      <Panel :padding="0" shadow>
        <div slot="title">{{$route.query.problemID}}</div>
      </Panel>
      <Card :padding="20" dis-hover style="margin-top: 20px">
      <Table style="width: 100%; font-size: 16px;"
             :columns="discussTableColumns"
             :data="discussList"
             disabled-hover></Table>
      </Card>
    </div>
  </div>
</template>

<script>
  import api from '@oj/api.js'
  export default {
    name: 'DiscussList',
    data () {
      return {
        discussTableColumns: [
          {
            title: '#',
            key: '_id',
            width: 80,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({ name: 'problem-details', params: { problemID: params.row._id } })
                  }
                },
                style: {
                  padding: '2px 0'
                }
              }, params.row._id)
            }
          },
          {
            title: 'Title',
            key: 'title',
            width: 300
          },
          {
            title: 'Creator',
            key: 'creator'
          },
          {
            title: 'Created Time',
            key: 'created_time'
          },
          {
            title: 'Last reply Time',
            key: 'last_reply_time'
          },
          {
            title: 'Votes',
            key: 'Votes'
          }
        ],
        discussList: [
          {
            _id: 1
          }
        ]
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.getDiscussList()
      },
      getDiscussList () {
        console.log('1')
        api.getDiscussList()
        console.log('out')
      }
    }
  }
</script>

<style lang="less">

</style>
