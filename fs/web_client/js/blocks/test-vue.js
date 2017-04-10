<hr>
<div id="vue-components">
  <culture-inputs></culture-inputs>
</div>
<hr>

// Vue компонент для культур
Vue.component('culture-item', {
  template: `
    <li>
      {{ title }}
      <button @click="$emit('remove')">x</button>
    </li>
  `,
  props: ['title']
});

Vue.component('culture-inputs', {
  data: function () {
    return {
      currentCulture: '',
      cultures: [],
      serverCultures: []
    }
  },
  created: function () {
    // get cultures from server and add autocomplete to input
  },
  methods: {
    addCulture: function () {
      if (this.currentCulture !== '') {
        this.cultures.push(this.currentCulture);
        this.currentCulture = '';
      }
    }
  },
  template: `
  <div>
    <label>
      Введите культурные принадлежности
      <input
        v-model="currentCulture"
        @keyup.enter="addCulture"
        placeholder="Именьковская"
      >
    </label>
    <button @click="addCulture">+</button>
    <ul>
      <culture-item
        v-for="(culture, index) in cultures"
        :key="culture"
        :title="culture"
        @remove="cultures.splice(index, 1)"
      ></culture-item>
    </ul>
  </div>
  `
});

new Vue({
  el: '#vue-components'
});