/* eslint-disable no-undef */
/**
 * 使用方式
 * map、和data数据是必传的
 *  defaultOptions是默认配置项
 *  deleteOptions的主要作用是去除marker中没有用的配置项
 *  数据最好不要超过100000个点，超过会有点卡顿
 */

import _ from 'lodash'


export const createScatterLayer = (options) => {
  let defaultOptions = {
    geoJSONSource: {
      data: {
        type: 'FeatureCollection',
        'features': []
      }
    },  
    scatterLayer: {
      zIndex: 1,
      visible: true,
    },
    scatterLayerSource: {
      unit: 'px',
      size: [10, 10],
      // texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/blue.png',
      color: 'rgba(255, 0, 0, 1)',
      borderWidth: 0
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

    let loca = new Loca.Container({map: deleteOptions.map,});
    let geo = new Loca.GeoJSONSource(options.geoJSONSource)

    return new Promise((resolve) => {
      for(let i = 0; i < deleteOptions.data.length; i ++) {
        let data = deleteOptions.data[i]
        let tempObj = {type: 'Feature',  geometry: {type: 'Point',  'coordinates': _.get(data, deleteOptions.lnglat, data)}, properties: { data, index: i }}
        typeof deleteOptions.configCallback === 'function' && deleteOptions.configCallback(tempObj)
        options.geoJSONSource.data.features.push(tempObj)
        typeof deleteOptions.callback === 'function' && deleteOptions.callback.call(options, tempObj) 
      }
  
      // 创建 AMap.LabelsLayer 图层
      let scatter = new Loca.ScatterLayer(options.scatterLayer)
      scatter.setSource(geo, options.scatterLayerSource);
      loca.add(scatter);
      resolve(scatter)
    })
}
