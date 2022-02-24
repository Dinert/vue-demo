<script setup>
/* eslint-disable no-unused-vars */
import { onMounted } from "vue";
import { createMap, createMarker } from "@/base-ui/map/gaode";
import layout from "@/utils/layout";
import axios from "axios";

class Map extends layout {
  async init() {
    let map = await this.createMap();
    let { data } = await this.ajaxData();
    this.createMarker(map, data);
  }

  ajaxData() {
    return axios.get("/json/lnglat.json");
  }
  createMap() {
    return new Promise((resolve) => {
      onMounted(() => {
        createMap({
          id: "gaoDeMap",
        }).then((map) => {
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
    //   lnglat: 'location.coordinates',
    //   setView: true,
    // });
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