<script setup>
import { onBeforeMount } from "vue";
// eslint-disable-next-line no-unused-vars
import { createMap, createMarker, createLabelMarker, createMassMarks, createScatterLayer } from "@/base-ui/map/gaode";
import layout from "@/utils/layout";
import axios from "axios";

class Map extends layout {
  async init() {
    let map = await this.createMap();
    let { data } = await this.ajaxData();
    this.createMarker(map, data);
  }

  ajaxData() {
    return axios.get("/json/50000.json");
  }
  createMap() {
    return new Promise((resolve) => {
      onBeforeMount(() => {
        createMap({
          id: "gaoDeMap",
        }, {viewMode: '3D'}).then((map) => {
          resolve(map);
        });
      });
    });
  }
  createMarker(map, data) {
    // createMarker({
    //   map,
    //   data,
    //   title: "name",
    //   // lnglat: 'location.coordinates',
    //   setView: true,
    //   // draggable: true,
    //   configCallback: (config) => {
    //     console.log(config);
    //   }
    // });

    // createLabelMarker({
    //   map,
    //   data,
    //   setView: true
    // })
    // createMassMarks({
    //   map,
    //   data,
    //   lnglat: 'location.coordinates',
    //   setView: true
    // }).then(mass => {
    //   mass.on('click', (e) => {
    //     console.log(e)
    //   })
    // })
    map.setCity('北京市')
    createScatterLayer({
      map,
      data
    }).then(scatter => {
      let markers = []
      map.on('mousemove', e => {
        let feat = scatter.queryFeature(e.pixel.toArray())
        markers.length && map.remove(markers)
        markers = []
        if(!feat) {
          map.setCursor('default');
        }else {
          map.setCursor('pointer');
          let properties = feat.properties
          // eslint-disable-next-line no-undef
          let marker = new AMap.Marker({
            map,
            position: properties.data,
            title: properties.title,
            content: `<span class="marker-content" title="${properties.title}"></span>`
          })
          markers.push(marker)
        }
      })
    })
  }
}
let map = new Map();
map.init();
</script>


<template>
  <div>
    <div id="gaoDeMap" class="map"></div>
  </div>
</template>

<style lang="scss">
#gaoDeMap {
  height: 100%;
}

    .marker-content {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: blue;
      transform: translate(-48%, -110%);
    }
</style>