<template>
  <h2
    class="text-xl font-bold text-gray-700 border-b border-gray-200 pb-3 mb-8"
  >
    {{ section }}
  </h2>
  <div
    class="
      grid grid-cols-1 grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      xl:grid-cols-5
      gap-5
      mb-5
    "
  >
    <div
      v-for="item in sectionData"
      :key="item.name"
      class="flex cursor-pointer border-2 border-white rounded-md"
      :class="{
        'border-gray-300': selected === item.id,
      }"
      @click="selectItem(item.id)"
    >
      <img
        :src="require(`../assets/images/${item.id}-select.jpg`)"
        :alt="item.ruTitle"
        width="90"
        class="rounded-md m-2 mr-4 border border-gray-100"
      />
      <span class="self-center text-sm pr-3">{{ item.ruTitle }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemSelection",
  props: {
    section: {
      type: String,
      required: true,
      default: "",
    },
    type: {
      type: String,
      required: true,
      default: "",
    },
    selected: {
      type: String,
      required: true,
      default: "",
    },
    sectionData: {
      type: Array,
      required: true,
    },
  },
  emits: {
    selectItem: null,
  },
  methods: {
    selectItem(id) {
      this.$emit("selectItem", { type: this.type, id: id });
    },
  },
};
</script>

<style scoped></style>
