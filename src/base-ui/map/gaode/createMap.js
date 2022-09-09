import AMapLoader from '@amap/amap-jsapi-loader'
import _ from 'lodash'

let defaultOptions = {
  "key": "af023d6fb6d5113012573aeabd087475",
  "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  "plugins": [],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  "AMapUI": {             // 是否加载 AMapUI，缺省不加载
      "version": '1.1',   // AMapUI 版本
  },
  "Loca":{                // 是否加载 Loca， 缺省不加载
      "version": '2.0'  // Loca 版本
  },
}

let defaultOptions2 = {
  zoom: 8,
  center: [113.27, 23.13],
  resizeEnable: true,
  viewMode: '3D'
}

// // 获取当前地理位置
// navigator.geolocation.getCurrentPosition((position) => {
//   defaultOptions2.center[0] = position.coords.longitude;
//   defaultOptions2.center[1] = position.coords.latitude;
// })

export function createMap(options, options2) {
  options = _.assignInWith({ ...defaultOptions }, options)
  options2 = _.assignInWith({ ...defaultOptions2 }, options2)
  return new Promise((resolve, reject) => {
    AMapLoader.load(options).then(AMap => {
      let map = new AMap.Map(options.id, options2)
      map.on('complete', () => {
        resolve(map)
      })
    }).catch(e => {
      reject(e)
    })
  })
}