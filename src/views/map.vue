<script setup>
import { onBeforeMount } from "vue";
// eslint-disable-next-line no-unused-vars
import { createMap, createMarker, createLabelMarker, createMassMarks } from "@/base-ui/map/gaode";
import layout from "@/utils/layout";
import axios from "axios";

class Map extends layout {
  async init() {
    let map = await this.createMap();
    let { data } = await this.ajaxData();
    this.createMarker(map, data);
  }

  ajaxData() {
    return axios.get("/json/3000.json");
  }
  createMap() {
    return new Promise((resolve) => {
      onBeforeMount(() => {
        createMap({
          id: "gaoDeMap",
        }).then((map) => {
          resolve(map);
        });
      });
    });
  }
  createMarker(map, data) {
    data = data.slice(0, 1000)
    createMarker({
      map,
      data,
      title: "name",
      // lnglat: 'location.coordinates',
      setView: true,
      // draggable: true,
      configCallback: (config) => {
        console.log(config);
      }
    });

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
</style>