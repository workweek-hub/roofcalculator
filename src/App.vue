<template>
  <div class="m-8">
    <h1 class="text-3xl font-bold text-gray-700 mb-8">
      Калькулятор профнастила на крышу
    </h1>
    <item-selection
      :type="'roofs'"
      :section="'Выберите тип кровли'"
      :sectionData="roof"
      @select-item="selectItem"
    />
    <item-selection
      :type="'boards'"
      :section="'Тип профнастила'"
      :sectionData="corrugatedBoard"
      @select-item="selectItem"
    />
  </div>
</template>

<script>
import itemSelection from "@/components/itemSelection";
export default {
  name: "App",
  components: {
    itemSelection,
  },
  data() {
    return {
      roof: [
        {
          id: "singleSlope",
          ruTitle: "Односкатная",
        },
        {
          id: "gable",
          ruTitle: "Двускатная",
        },
        {
          id: "valm",
          ruTitle: "Вальмовая",
        },
        {
          id: "hipRoof",
          ruTitle: "Шатровая",
        },
        {
          id: "attic",
          ruTitle: "Мансардная",
        },
      ],
      selectedRoof: null,
      corrugatedBoard: [
        {
          id: "C20",
          ruTitle: "Профнастил С20",
        },
        {
          id: "C21",
          ruTitle: "Профнастил С21",
        },
        {
          id: "HC35",
          ruTitle: "Профнастил HC35",
        },
        {
          id: "H75",
          ruTitle: "Профнастил H75",
        },
        {
          id: "HC44",
          ruTitle: "Профнастил HC44",
        },
      ],
      selectedBoard: null,
    };
  },
  methods: {
    selectItem(data) {
      if (data.type === "roofs") {
        this.selectedRoof = data.id;
      } else if (data.type === "boards") {
        this.selectedBoard = data.id;
      }
    },
  },
};
</script>

<style></style>
