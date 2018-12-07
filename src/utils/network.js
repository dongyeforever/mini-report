import wepy from 'wepy'

const request = (method, url, params, message = '', loading = true) => {
  try {
    console.log(url, 'params=' + JSON.stringify(params))
  } catch (e) {
  }

  wepy.hideLoading()
  if (loading) {
    wepy.showLoading({
      mask: true,
      title: message || '加载中'
    })
  }

  let reqURL = url
  if (!url.startsWith('http')) {
    reqURL = wepy.$instance.globalData.apiHost + url
  }

  return wepy.request({
    url: reqURL,
    method: method || 'GET',
    data: params,
    header: {
      'Content-Type': 'application/json',
      'timestamp': new Date().getTime(),
      'X-Bmob-Application-Id': 'f5dfac324702c185eed91508cc8c3999',
      'X-Bmob-REST-API-Key': 'd0289c1ad03f59ef8a9ce42716422f1b'
    }
  }).then(res => {
    console.log(res)
    wepy.hideLoading()
    if (res.statusCode >= 200 && res.statusCode < 400) {
      return {
        success: true,
        result: res.data
      }
    } else {
      return handleError(res, loading)
    }
  }, res => {
    return handleError(res, loading)
  }).catch(res => {
    return handleError(res, loading)
  })
}

const get = (url, params = {}, message = '', loading = true) => {
  return request('GET', url, params, message, loading)
}

const post = (url, params = {}, message = '', loading = true) => {
  return request('POST', url, params, message, loading)
}

const put = (url, params = {}, message = '', loading = true) => {
  return request('PUT', url, params, message, loading)
}

const del = (url, params = {}, message = '', loading = true) => {
  return request('DELETE', url, params, message, loading)
}

const handleError = (res, loading) => {
  console.log(res)
  wepy.hideLoading()
  if (loading) {
    toastError()
  }
  const error = {
    success: false,
    errorMsg: res.errMsg
  }
  return error
}

const toastError = () => {
  wepy.getNetworkType().then(res => {
    const networkType = res.networkType
    let message
    if (networkType === 'none') {
      message = '请求失败，请检查网络'
    } else {
      message = '请求失败，请稍后再试'
    }
    wepy.showToast({title: message, icon: 'none'})
  })
}

export default {
  get,
  post,
  put,
  del
}
