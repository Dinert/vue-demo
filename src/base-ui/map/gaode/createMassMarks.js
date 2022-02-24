/* eslint-disable no-undef */

/**
 * 使用方式
 * map、和data数据是必传的
 *  defaultOptions是默认配置项
 *  deleteOptions的主要作用是去除marker中没有用的配置项
 *  数据最好不要超过10000个点，超过会卡顿
 */
import _ from 'lodash'


 export const createMassMarks = (options) => {
  let defaultOptions = {
    opacity: 0.8,
    zIndex: 111,
    cursor: 'pointer',
    style: [{
      url: 'https://webapi.amap.com/images/mass/mass0.png',
      anchor: new AMap.Pixel(6, 6),
      size: new AMap.Size(11, 11),
      zIndex: 3,
    }, {
        url: 'https://webapi.amap.com/images/mass/mass1.png',
        anchor: new AMap.Pixel(4, 4),
        size: new AMap.Size(7, 7),
        zIndex: 2,
    }, {
        url: 'https://webapi.amap.com/images/mass/mass2.png',
        anchor: new AMap.Pixel(3, 3),
        size: new AMap.Size(5, 5),
        zIndex: 1,
    }]
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
  return new Promise(resolve => {
    // 创建 AMap.LabelsLayer 图层
    // eslint-disable-next-line no-undef
    if(deleteOptions.data && deleteOptions.data.length && deleteOptions.data[0].lnglat) {
      options.data = deleteOptions.data
    }else {
      
      options.data = []
      for(let i = 0; i < deleteOptions.data.length; i ++) {
        let data = deleteOptions.data[i]
        options.data.push({
          lnglat: _.get(data, deleteOptions.lnglat, data),
          style: 0,
          ...data
        })
        typeof deleteOptions.configCallback === 'function' && deleteOptions.configCallback(options)
      }
    }

    let mass = new AMap.MassMarks(options.data, options)
    deleteOptions.map && mass.setMap(deleteOptions.map);
    deleteOptions.setView && deleteOptions.map.setFitView(mass.jT);
    resolve(mass)
  })
 }