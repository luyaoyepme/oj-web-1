import Vue from 'vue'
import store from '@/store'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = '/api'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = true
axios.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/json'
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

const FORUM_BASE_URL = process.env.FORUM_URL
console.log(FORUM_BASE_URL)

export default {
  getWebsiteConf (params) {
    return ajax('website', 'get', {
      params
    })
  },
  getAnnouncementList () {
    return ajax('announcement', 'get')
  },
  login (data) {
    return ajax('login', 'post', {
      data
    })
  },
  checkUsernameOrEmail (username, email) {
    return ajax('check_username_or_email', 'post', {
      data: {
        username,
        email
      }
    })
  },
  // 注册
  register (data) {
    return ajax('register', 'post', {
      data
    })
  },
  logout () {
    return ajax('logout', 'get')
  },
  getCaptcha () {
    return ajax('captcha', 'get')
  },
  getUserInfo (username = undefined) {
    return ajax('profile', 'get', {
      params: {
        username
      }
    })
  },
  updateProfile (profile) {
    return ajax('profile', 'put', {
      data: profile
    })
  },
  freshDisplayID (userID) {
    return ajax('profile/fresh_display_id', 'get', {
      params: {
        user_id: userID
      }
    })
  },
  twoFactorAuth (method, data) {
    return ajax('two_factor_auth', method, {
      data
    })
  },
  tfaRequiredCheck (username) {
    return ajax('tfa_required', 'post', {
      data: {
        username
      }
    })
  },
  getSessions () {
    return ajax('sessions', 'get')
  },
  deleteSession (sessionKey) {
    return ajax('sessions', 'delete', {
      params: {
        session_key: sessionKey
      }
    })
  },
  applyResetPassword (data) {
    return ajax('apply_reset_password', 'post', {
      data
    })
  },
  resetPassword (data) {
    return ajax('reset_password', 'post', {
      data
    })
  },
  changePassword (data) {
    return ajax('change_password', 'post', {
      data
    })
  },
  changeEmail (data) {
    return ajax('change_email', 'post', {
      data
    })
  },
  getLanguages () {
    return ajax('languages', 'get')
  },
  getProblemTagList () {
    return ajax('problem/tags', 'get')
  },
  getProblemList (offset, limit, searchParams) {
    let params = {
      paging: true,
      offset,
      limit
    }
    Object.keys(searchParams).forEach((element) => {
      if (searchParams[element]) {
        params[element] = searchParams[element]
      }
    })
    console.log(params)
    return ajax('problem', 'get', {
      params: params
    })
  },
  pickone () {
    return ajax('pickone', 'get')
  },
  getProblem (problemID) {
    return ajax('problem', 'get', {
      params: {
        problem_id: problemID
      }
    })
  },
  getContestList (offset, limit, searchParams) {
    let params = {
      offset,
      limit
    }
    if (searchParams !== undefined) {
      Object.keys(searchParams).forEach((element) => {
        if (searchParams[element]) {
          params[element] = searchParams[element]
        }
      })
    }
    return ajax('contests', 'get', {
      params
    })
  },
  getContest (id) {
    return ajax('contest', 'get', {
      params: {
        id
      }
    })
  },
  getContestAccess (contestID) {
    return ajax('contest/access', 'get', {
      params: {
        contest_id: contestID
      }
    })
  },
  checkContestPassword (contestID, password) {
    return ajax('contest/password', 'post', {
      data: {
        contest_id: contestID,
        password
      }
    })
  },
  getContestAnnouncementList (contestId) {
    return ajax('contest/announcement', 'get', {
      params: {
        contest_id: contestId
      }
    })
  },
  getContestProblemList (contestId) {
    return ajax('contest/problem', 'get', {
      params: {
        contest_id: contestId
      }
    })
  },
  getContestProblem (problemID, contestID) {
    return ajax('contest/problem', 'get', {
      params: {
        contest_id: contestID,
        problem_id: problemID
      }
    })
  },
  submitCode (data) {
    return ajax('submission', {data})
  },
  getSubmissionList (offset, limit, params) {
    params.limit = limit
    params.offset = offset
    return ajax('submissions', 'get', {
      params
    })
  },
  getContestSubmissionList (offset, limit, params) {
    params.limit = limit
    params.offset = offset
    return ajax('contest_submissions', 'get', {
      params
    })
  },
  getSubmission (id) {
    return ajax('submission', 'get', {
      params: {
        id
      }
    })
  },
  submissionExists (problemID) {
    return ajax('submission_exists', 'get', {
      params: {
        problem_id: problemID
      }
    })
  },
  submissionRejudge (id) {
    return ajax('admin/submission/rejudge', 'get', {
      params: {
        id
      }
    })
  },
  updateSubmission (data) {
    return ajax('submission', 'put', {
      data
    })
  },
  getUserRank (offset, limit, rule = 'acm') {
    let params = {
      offset,
      limit,
      rule
    }
    return ajax('user_rank', 'get', {
      params
    })
  },
  getContestRank (params) {
    return ajax('contest_rank', 'get', {
      params
    })
  },
  getACMACInfo (params) {
    return ajax('admin/contest/acm_helper', 'get', {
      params
    })
  },
  updateACInfoCheckedStatus (data) {
    return ajax('admin/contest/acm_helper', 'put', {
      data
    })
  },
  getDiscussList (id, sortType) {
    console.log(FORUM_BASE_URL)
    let url = ''
    if (sortType) {
      url = `${FORUM_BASE_URL}/api/problems/${id}/sort/${sortType}`
    } else {
      url = `${FORUM_BASE_URL}/api/problems/${id}/topics`
    }
    return window.fetch(url, {credentials: 'include'}, {
      method: 'GET',
      mode: 'no-cors'
    }).then(res => {
      // console.log(res)
      return res.json()
    }).then(json => {
      // console.log('ok')
      // console.log('获取的结果', json.data)
      return json
    })
  },
  getContestDiscussList (problemId, contestId) {
    // console.log(problemId, contestId)
    let url = `${FORUM_BASE_URL}/api/contests/${contestId}/problem/${problemId}/topics`
    return window.fetch(url, {credentials: 'include'}, {
      method: 'GET',
      mode: 'no-cors'
    }).then(res => {
      return res.json()
    }).then(json => {
      // console.log('获取的结果', json.data)
      return json
    })
  },
  getDiscussListBykeyword (problemId, keyword) {
    let url = `${FORUM_BASE_URL}/api/topics/search?keywords=${keyword}&problemId=${problemId}`
    return window.fetch(url, {credentials: 'include'}, {
      method: 'GET',
      mode: 'no-cors'
    }).then(res => {
      return res.json()
    }).then(json => {
      return json
    })
  },
  getTopic (id) {
    let url = `${FORUM_BASE_URL}/api/topics/${id}`
    return window.fetch(url, {credentials: 'include'}, {
      method: 'GET',
      mode: 'no-cors'
    }).then(res => {
      return res.json()
    }).then(json => {
      return json
    })
  },
  voteThisTopic (topicId) {
    let url = `${FORUM_BASE_URL}/api/topics/vote?id=${topicId}`
    return window.fetch(url, {credentials: 'include'}, {
      method: 'GET',
      mode: 'no-cors'
    }).then(res => {
      return res.json()
    }).then(json => {
      console.log('获取的结果', json.data)
      return json
    })
  },
  getCurrentUsrLike (id) {
    let url = `${FORUM_BASE_URL}/api/topics/judge-vote?id=${id}`
    return window.fetch(url, {credentials: 'include'}, {
      method: 'GET',
      mode: 'no-cors'
    }).then(res => {
      return res.json()
    }).then(json => {
      return json
    })
  },
  createNewTopic (data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      axios({
        url: `${FORUM_BASE_URL}/api/topics`,
        method: 'post',
        data: {
          title: data.title,
          content: data.content,
          problemId: data.problemId
        }
      })
        .then((res) => {
          resolve(res.data)
          Vue.prototype.$success('Succeeded')
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },
  createNewContestTopic (data) {
    console.log(data)
    let url = `${FORUM_BASE_URL}/api/contests/problem/topic`
    return window.fetch(url, {credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        problemId: data.problemId,
        discussStatus: data.discussStatus,
        userId: data.userId,
        contestId: data.contest_id
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    }).then(res => {
      return res.json()
    }).then(json => {
      return json
    })
    // return new Promise((resolve, reject) => {
    //   axios({
    //     url: `${FORUM_BASE_URL}/api/contests/problem/topic`,
    //     method: 'post',
    //     data: {
    //       title: data.title,
    //       content: data.content,
    //       problemId: data.problemId,
    //       discussStatus: data.discussStatus,
    //       userId: data.userId,
    //       contestId: data.contest_id
    //     }
    //   })
    //     .then((res) => {
    //       resolve(res.data)
    //       Vue.prototype.$success('Succeeded')
    //     })
    //     .catch(function (error) {
    //       reject(error)
    //     })
    // })
  },
  getUsr () {
    let url = `${FORUM_BASE_URL}/api/user`
    return window.fetch(url, {credentials: 'include'}, {
      method: 'GET',
      // body: JSON.stringify({title: 'test'}, {content: 'test'}),
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // },
      mode: 'no-cors'
    }).then(res => {
      return res.json()
    }).then(json => {
      // console.log('ok')
      // console.log('获取的结果', json.data)
      return json
    })
  },
  getContestCommentStatus (contestId) {
    let url = `${FORUM_BASE_URL}/api/contests/${contestId}/discuss-status`
    return window.fetch(url, {credentials: 'include'}, {
      method: 'GET',
      mode: 'no-cors'
    }).then(res => {
      return res.json()
    }).then(json => {
      return json
    })
  },
  submmitComment (data) {
    let url = FORUM_BASE_URL + '/api/comments'
    return window.fetch(url, {credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        content: data.content,
        topicId: data.id}),
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    }).then(res => {
      return res.json()
    }).then(json => {
      return json
    })
  }
}

/**
 * @param url
 * @param method get|post|put|delete...
 * @param params like queryString. if a url is index?a=1&b=2, params = {a: '1', b: '2'}
 * @param data post data, use for method put|post
 * @returns {Promise}
 */
function ajax (url, method, options) {
  if (options !== undefined) {
    var {params = {}, data = {}} = options
  } else {
    params = data = {}
  }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      params,
      data
    }).then(res => {
      // API正常返回(status=20x), 是否错误通过有无error判断
      if (res.data.error !== null) {
        Vue.prototype.$error(res.data.data)
        reject(res)
        // 若后端返回为登录，则为session失效，应退出当前登录用户
        if (res.data.data.startsWith('Please login')) {
          store.dispatch('changeModalStatus', {'mode': 'login', 'visible': true})
        }
      } else {
        resolve(res)
        // if (method !== 'get') {
        //   Vue.prototype.$success('Succeeded')
        // }
      }
    }, res => {
      // API请求异常，一般为Server error 或 network error
      reject(res)
      Vue.prototype.$error(res.data.data)
    }).catch(function (error) {
      console.log(error)
    })
  })
}
