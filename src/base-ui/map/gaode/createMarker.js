/* eslint-disable no-undef */
/**
 * 使用方式
 * map、和data数据是必传的
 *  defaultOptions是默认配置项
 *  deleteOptions的主要作用是去除marker中没有用的配置项
 *  数据最好不要超过260个点，超过会卡顿
 */
import _ from 'lodash'

export const createMarker = (options) => {

  let defaultOptions = {
    icon: 'http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
    // offset: new AMap.Pixel(-13, -34),
    anchor: 'bottom-center',
    // label: {
    //   content: '哈哈哈',
    //   direction: 'top'
    // }
  }
  
  let deleteOptions = {
      map: null,
      data: [],
      setView: false,
      configCallback: () => {},
      callback: () => {},
      title: 'name',
      lnglat: 'lnglat',
  }

  // 合并配置项
  options = _.assignInWith({ ...defaultOptions }, options)
  
  // 删除marker不需要的配置项，或者是配置项是变量的marker配置项
  for(const prop in deleteOptions) {
    if(options[prop] !== undefined) {
      deleteOptions[prop] = options[prop];
    }
    delete options[prop];
  }

  // 创建markers的数据
  let markers = []
  return new Promise(resolve => {
    for(let i = 0; i < deleteOptions.data.length; i ++) {
      let data = deleteOptions.data[i]
      options.position = _.get(data, deleteOptions.lnglat, data)
      options.title = _.get(data, deleteOptions.title, data)

      // 数据组装完成的回调
      typeof deleteOptions.configCallback === 'function' && deleteOptions.configCallback(options)  
      let marker = new AMap.Marker(options)
      // 创建单个点标记完成的回调
      typeof deleteOptions.callback === 'function' && deleteOptions.callback.call(marker, options) 
      markers.push(marker)
    }
    deleteOptions.map.add(markers)
    deleteOptions.setView && deleteOptions.map.setFitView(markers)
    resolve(markers)
  })
}