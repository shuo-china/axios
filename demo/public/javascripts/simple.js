import axios from '../dist/bundle.esm.js'

// axios({
//   method: 'get',
//   url: '/simple/get',
//   params: {
//     foo: ['bar', 'baz']
//   }
// })

// axios({
//   method: 'get',
//   url: '/simple/get',
//   params: {
//     foo: {
//       bar: 'baz'
//     }
//   }
// })

// const date = new Date()

// axios({
//   method: 'get',
//   url: '/simple/get',
//   params: {
//     date
//   }
// })

// axios({
//   method: 'get',
//   url: '/simple/get',
//   params: {
//     foo: '@:$, '
//   }
// })

// axios({
//   method: 'get',
//   url: '/simple/get',
//   params: {
//     foo: 'bar',
//     baz: null
//   }
// })

// axios({
//   method: 'get',
//   url: '/simple/get#hash',
//   params: {
//     foo: 'bar'
//   }
// })

// axios({
//   method: 'get',
//   url: '/simple/get?foo=bar',
//   params: {
//     bar: 'baz'
//   }
// })

const service = axios.create()

service.interceptors.request.use(config => {
  console.log('request interceptor')
  return config
})

service.interceptors.response.use(
  response => {
    console.log('response interceptor')
    return response
  },
  err => {
    console.log('response error', err)
    return err
  }
)

service
  .post('/simple/post', {
    a: 1,
    b: 2
  })
  .then(res => {
    console.log('result', res)
  })
  .catch(err => {
    console.log('result', err)
  })

// axios
//   .post('/simple/post', {
//     a: 1,
//     b: 2
//   })
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => {
//     console.log('err', err.response)
//   })

// const arr = new Int32Array([21, 31])

// axios({
//   method: 'post',
//   url: '/simple/buffer',
//   data: arr
// })
