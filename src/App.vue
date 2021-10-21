<template>
  <div class="m-8 grid">
    <h1 class="text-3xl font-bold text-gray-700 mb-8">
      Калькулятор профнастила на крышу
    </h1>
    <item-selection
      :type="'roofs'"
      :section="'Выберите тип кровли'"
      :sectionData="roofs"
      :selected="selectedRoof"
      @select-item="selectItem"
    />
    <item-selection
      :type="'boards'"
      :section="'Тип профнастила'"
      :selected="selectedBoard"
      :sectionData="corrugatedBoard"
      @select-item="selectItem"
    />
    <parameter-input
      :roofs="roofs"
      :selectedRoof="selectedRoof"
      :selectedThickness="selectedThickness"
      :materialParameters="materialParameters"
      :paintedSide="paintedSide"
      @select-param="selectParam"
      :selectedParam="selectedParam"
      @select-thickness="selectThickness"
      @select-side="setSide"
    />
    <button
      v-if="!result"
      class="
        font-bold
        text-white
        rounded-sm
        py-1
        bg-gray-500
        w-32
        justify-self-center
        mt-8
      "
      @click="roofCalculation()"
    >
      Расчитать
    </button>
    <template v-if="result">
      <OutputtingTheResult :result="result" />
    </template>
  </div>
</template>

<script>
import defaultRoofs from "./configs/roofs";
import materialProperties from "./configs/corrugatedBoard";
import ItemSelection from "@/components/ItemSelection";
import ParameterInput from "@/components/ParameterInput";
import OutputtingTheResult from "@/components/OutputtingTheResult";
export default {
  name: "App",
  components: {
    ItemSelection,
    ParameterInput,
    OutputtingTheResult,
  },
  data() {
    return {
      roofs: [],
      selectedRoof: "singleSlope",
      corrugatedBoard: [
        { id: "C20", ruTitle: "Профнастил С20", param: "c20_21" },
        { id: "C21", ruTitle: "Профнастил С21", param: "c20_21" },
        { id: "HC35", ruTitle: "Профнастил HC35", param: "hc35_75" },
        { id: "H75", ruTitle: "Профнастил H75", param: "hc35_75" },
        { id: "HC44", ruTitle: "Профнастил HC44", param: "hc44" },
      ],
      selectedBoard: "C20",
      matProperties: {},
      selectedParam: {},
      selectedThickness: null,
      paintedSide: null,
      result: null,
      errors: "",
      workingWidth: [
        { version: "C20", value: 1.1, totalValue: 1.15 },
        { version: "C21", value: 1, totalValue: 1.051 },
        { version: "HC35", value: 1, totalValue: 1.06 },
        { version: "H75", value: 0.75, totalValue: 0.8 },
        { version: "HC44", value: 1, totalValue: 1.047 },
      ],
    };
  },
  created: function () {
    this.roofs = defaultRoofs.base;
    this.matProperties = materialProperties.base;
    this.updateInitialData();
  },
  computed: {
    materialParameters() {
      let param = this.corrugatedBoard.find(
        (board) => board.id === this.selectedBoard
      ).param;
      return this.matProperties[param];
    },
  },
  methods: {
    updateInitialData() {
      let param = this.corrugatedBoard.find(
        (board) => board.id === this.selectedBoard
      ).param;
      this.selectedParam = this.matProperties[param][0];
      this.updateInitialThickness();
      this.setStartPaintedSide();
    },
    updateInitialThickness() {
      this.selectedThickness = this.selectedParam.steelThickness[0];
    },
    setStartPaintedSide(value = "top") {
      this.paintedSide = value;
    },
    selectItem(data) {
      if (data.type === "roofs") {
        this.selectedRoof = data.id;
      } else if (data.type === "boards") {
        this.selectedBoard = data.id;
      }
      this.result = null;
    },
    selectParam(param) {
      this.selectedParam = param;
      this.result = null;
    },
    selectThickness(value) {
      this.selectedThickness = value;
      this.result = null;
    },
    setSide(value) {
      this.paintedSide = value;
      this.result = null;
    },
    roofCalculation() {
      const roof =
        this.roofs[
          this.roofs.findIndex((item) => item.id === this.selectedRoof)
        ];
      let roofWidth;
      let roofHeight;
      for (let prop of roof.proportions) {
        if (!prop.value) {
          this.errors = "Не указаны все стороны кровли";
        } else {
          if (prop.id === "roofWidth") {
            roofWidth = prop.value;
          }
          if (prop.id === "roofHeight") {
            roofHeight = prop.value;
          }
        }
      }
      if (roofWidth && roofHeight) {
        switch (this.selectedRoof) {
          case "singleSlope": {
            const currentWorkingWidth = this.workingWidth.find(
              (item) => item.version === this.selectedBoard
            );
            const meterCost = this.selectedParam.price[this.selectedThickness];
            const numberOfSheets = Math.ceil(
              Number(roofWidth) / Number(currentWorkingWidth.value)
            );
            const runningMeters = numberOfSheets * (Number(roofHeight) + 0.3);
            this.result = {
              roofArea: Number(roofWidth) * Number(roofHeight),
              numberOfSheets: numberOfSheets,
              meterCost: meterCost,
              totalPrice: runningMeters * meterCost,
              workingArea: runningMeters * Number(currentWorkingWidth.value),
              metalArea: runningMeters * currentWorkingWidth.totalValue,
              ral: this.selectedParam.ral,
              selectedBoard: this.selectedBoard,
              thickness: this.selectedThickness,
              leafLength: Number(roofHeight) + 0.3,
            };
            break;
          }
        }
      }
    },
  },
  watch: {
    selectedBoard() {
      this.updateInitialData();
      this.result = null;
    },
    selectedParam() {
      this.updateInitialThickness();
      this.selectedParam.ral === "оцинковка"
        ? this.setStartPaintedSide(null)
        : this.setStartPaintedSide();
      this.result = null;
    },
  },
};
</script>

<style></style>
