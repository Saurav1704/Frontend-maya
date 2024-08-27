<template>
    <ion-grid>
      <ion-row>
        <ion-col v-for="(value, key) in data[0]" :key="key">{{ key }}</ion-col>
      </ion-row>
      <ion-row v-for="row in data" :key="row.id">
        <ion-col v-for="(value, key) in row" :key="key">{{ value }}</ion-col>
      </ion-row>
    </ion-grid>
  </template>
  
  <script>
  export default {
    props: ['data'],
  };
  </script>
  