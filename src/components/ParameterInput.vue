<template>
  <h2 class="text-xl font-bold text-gray-700 pb-3">Размеры и параметры</h2>
  <div
    class="
      text-gray-700
      border border-gray-200
      grid grid-cols-1
      lg:grid-cols-select
      2xl:grid-cols-2
    "
  >
    <img :src="getImages" alt="" class="justify-self-center" />
    <div class="grid grid-cols-1 sm:grid-cols-select p-5 sm:p-8">
      <div class="w-full px-0 sm:pr-8 lg:px-8">
        <h3 class="font-bold">Размеры вашей кровли</h3>
        <div class="my-2">
          <div v-for="size of proportions" :key="size.id" class="mb-2">
            <span class="text-sm text-gray-400">{{ size.title }}</span>
            <input
              class="
                h-9
                w-full
                bg-gray-100
                border border-gray-200
                rounded-sm
                mt-1
                px-2
              "
              type="text"
              v-model="size.value"
              @keypress="isNumber($event)"
            />
          </div>
        </div>
        <div>
          <h3 class="font-bold mt-8 mb-2">Параметры материала</h3>
          <span class="text-gray-400 text-sm">Толщина</span>
          <div class="mt-1 grid grid-cols-thickness gap-2">
            <div
              v-for="value of steelThickness"
              :key="value"
              class="
                p-2
                border border-gray-500
                rounded-sm
                text-sm
                cursor-pointer
              "
              :class="{ 'bg-gray-500 text-white': selectedThickness === value }"
              @click="selectThickness(value)"
            >
              {{ value.toFixed(2) }} мм
            </div>
          </div>
          <template v-if="paintedSide">
            <div class="mt-2">
              <span class="text-gray-400 text-sm">Сторона краски</span>
              <div class="mt-1 grid grid-cols-thickness gap-2">
                <div
                  class="
                    p-2
                    border border-gray-500
                    rounded-sm
                    text-sm
                    cursor-pointer
                  "
                  :class="{ 'bg-gray-500 text-white': paintedSide === 'top' }"
                  @click="selectSide('top')"
                >
                  краска сверху
                </div>
                <div
                  class="
                    p-2
                    border border-gray-500
                    rounded-sm
                    text-sm
                    cursor-pointer
                  "
                  :class="{ 'bg-gray-500 text-white': paintedSide !== 'top' }"
                  @click="selectSide('bottom')"
                >
                  краска снизу
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div>
        <h3 class="font-bold ml-1 mt-8 sm:mt-0">Цвет материала</h3>
        <p class="text-sm my-2 ml-1">
          <span class="text-gray-400">Цвет: </span>
          {{ selectedParam.ral !== "оцинковка" ? "RAL" : "" }}
          {{ selectedParam.ral }}
        </p>
        <div
          class="
            grid grid-cols-colors
            sm:grid-cols-4
            md:grid-cols-5
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
            gap-1
            sm:gap-2
            py-2
          "
        >
          <div
            v-for="param of materialParameters"
            :key="param.ral"
            class="w-full rounded-sm border border-white cursor-pointer"
            :class="{ 'border-gray-300': selectedParam.ral === param.ral }"
            @click="selectColor(param)"
          >
            <div
              class="w-8 sm:w-12 h-10 sm:h-14 m-1 rounded-sm"
              :style="{ backgroundColor: param.color }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ParameterInput",
  props: {
    roofs: {
      type: Array,
      required: true,
    },
    selectedRoof: {
      type: String,
      required: true,
      default: "",
    },
    materialParameters: {
      type: Array,
      required: true,
    },
    selectedParam: {
      type: Object,
      required: true,
    },
    selectedThickness: {
      type: Number,
      required: true,
    },
    paintedSide: {
      required: true,
    },
  },
  emits: {
    selectParam: null,
    selectThickness: null,
    selectSide: null,
  },
  computed: {
    getImages() {
      return require(`../assets/images/${this.selectedRoof}.jpg`);
    },
    proportions() {
      return this.roofs.find((item) => item.id === this.selectedRoof)
        .proportions;
    },
    steelThickness() {
      return this.selectedParam.steelThickness;
    },
  },
  methods: {
    selectColor(param) {
      this.$emit("selectParam", param);
    },
    selectThickness(value) {
      this.$emit("selectThickness", value);
    },
    selectSide(value) {
      this.$emit("selectSide", value);
    },
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped></style>
