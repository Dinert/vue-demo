/* eslint-disable no-undef */
/**
 * 使用方式
 * map、和data数据是必传的
 *  defaultOptions是默认配置项
 *  deleteOptions的主要作用是去除marker中没有用的配置项
 *  数据最好不要超过5000个点，超过会卡顿
 */
 import _ from 'lodash'

 export const createLabelMarker = (options) => {
  let defaultOptions = {
    icon: {
      type: 'image',
      image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
      size: [6, 9],
      anchor: 'bottom-center'
    },
    labelsLayer: {
      zooms: [3, 20],
      zIndex: 1000,
      collision: false
    }
  }

  let deleteOptions = {
    map: null,
    data: [],
    setView: false,
    configCallback: () => {},
    callback: () => {},
    lnglat: 'lnglat'
}

  // 合并配置项
  options = _.assignInWith({ ...defaultOptions }, options)
  
  // 删除marker不需要的配置项，或者是配置项是变量的marker配置项
  for(const prop in deleteOptions) {
    if(options[prop] !== undefined) {
      deleteOptions[prop] = options[prop]
    }
    delete options[prop]
  }

  // 创建 AMap.LabelsLayer 图层
  let layer = new AMap.LabelsLayer(options.labelsLayer)

  // 创建markers的数据
  let markers = []
  return new Promise(resolve => {
    for(let i = 0; i < deleteOptions.data.length; i ++) {
      let data = deleteOptions.data[i]
      options.position = _.get(data, deleteOptions.lnglat, data)
      
      // 数据组装完成的回调
      typeof deleteOptions.configCallback === 'function' && deleteOptions.configCallback(options)
      let labelMarker = new AMap.LabelMarker(options)

       // 创建单个点标记完成的回调
      typeof deleteOptions.callback === 'function' && deleteOptions.callback.call(labelMarker, options) 
      markers.push(labelMarker)
    }
    layer.add(markers)
    deleteOptions.map && deleteOptions.map.add(layer)
    deleteOptions.setView && deleteOptions.map.setFitView(markers)
    resolve(layer, markers)
  });

 }