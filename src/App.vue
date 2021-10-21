<template>
  <div class="m-8 grid">
    <h1 class="text-3xl font-bold text-gray-700 mb-8">
      Калькулятор профнастила на крышу
    </h1>
    <item-selection
      :type="'roofs'"
      :section="'Выберите тип кровли'"
      :sectionData="roof"
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
      :roof="roof"
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
      v-if="result.length === 0"
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
    >
      Расчитать
    </button>
  </div>
</template>

<script>
import ItemSelection from "@/components/ItemSelection";
import ParameterInput from "@/components/ParameterInput";
export default {
  name: "App",
  components: {
    ItemSelection,
    ParameterInput,
  },
  data() {
    return {
      roof: [
        {
          id: "singleSlope",
          ruTitle: "Односкатная",
          proportions: [
            { title: "Ширина ската, м", value: "", id: "roofWidth" },
            { title: "Длина ската, м", value: "", id: "roofHeight" },
          ],
        },
        {
          id: "gable",
          ruTitle: "Двускатная",
          proportions: [
            { title: "Ширина ската, м", value: "", id: "roofWidth" },
            { title: "Длина ската 1, м", value: "", id: "side1Length" },
            { title: "Длина ската 2, м", value: "", id: "side2Length" },
          ],
        },
        {
          id: "valm",
          ruTitle: "Вальмовая",
          proportions: [
            { title: "Ширина ската 1, м", value: "", id: "side1Width" },
            { title: "Ширина ската 2, м", value: "", id: "side2Width" },
            { title: "Ширина конька, м", value: "", id: "colicWidth" },
            { title: "Длина ската 1, м", value: "", id: "side1Length" },
            { title: "Длина ската 2, м", value: "", id: "side2Length" },
          ],
        },
        {
          id: "hipRoof",
          ruTitle: "Шатровая",
          proportions: [
            { title: "Ширина ската 1, м", value: "", id: "side1Width" },
            { title: "Ширина ската 2, м", value: "", id: "side2Width" },
            { title: "Длина ската 1, м", value: "", id: "side1Length" },
            { title: "Длина ската 2, м", value: "", id: "side2Length" },
          ],
        },
        {
          id: "attic",
          ruTitle: "Мансардная",
          proportions: [
            { title: "Ширина ската 1, м", value: "", id: "side1Width" },
            { title: "Длина ската 1,4, м", value: "", id: "side14Length" },
            { title: "Длина ската 2,3, м", value: "", id: "side23Length" },
          ],
        },
      ],
      selectedRoof: "singleSlope",
      corrugatedBoard: [
        { id: "C20", ruTitle: "Профнастил С20", param: "c20_21" },
        { id: "C21", ruTitle: "Профнастил С21", param: "c20_21" },
        { id: "HC35", ruTitle: "Профнастил HC35", param: "hc35_75" },
        { id: "H75", ruTitle: "Профнастил H75", param: "hc35_75" },
        { id: "HC44", ruTitle: "Профнастил HC44", param: "hc44" },
      ],
      selectedBoard: "C20",
      colors: {
        c20_21: [
          {
            ral: 6005,
            color: "#104336",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.65],
          },
          { ral: 1014, color: "#dccd9d", steelThickness: [0.4, 0.45] },
          { ral: 1015, color: "#ebd6bb", steelThickness: [0.4, 0.45] },
          { ral: 1018, color: "#f3e03b", steelThickness: [0.4, 0.45] },
          { ral: 3003, color: "#8d1c2c", steelThickness: [0.4, 0.45] },
          {
            ral: 3005,
            color: "#5c2028",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.65],
          },
          { ral: 3009, color: "#81443f", steelThickness: [0.4, 0.45] },
          { ral: 3011, color: "#7e292c", steelThickness: [0.4, 0.45] },
          { ral: 3020, color: "#d93637", steelThickness: [0.4, 0.45] },
          { ral: 5002, color: "#2b2c7c", steelThickness: [0.4, 0.45] },
          {
            ral: 5005,
            color: "#154889",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.65],
          },
          { ral: 5021, color: "#0a727d", steelThickness: [0.4, 0.45] },
          { ral: 7004, color: "#9fa0a2", steelThickness: [0.4, 0.45] },
          { ral: 7024, color: "#474a51", steelThickness: [0.4, 0.45] },
          {
            ral: 8017,
            color: "#44332c",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.65],
          },
          {
            ral: 9003,
            color: "#eff0eb",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.65],
          },
          { ral: 9006, color: "#a6a8a7", steelThickness: [0.4, 0.45] },
          { ral: 6002, color: "#276234", steelThickness: [0.4, 0.45] },
          { ral: 6029, color: "#008242", steelThickness: [0.4] },
          {
            ral: "оцинковка",
            color: "#b1bcc0",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.7],
          },
          { ral: 2004, color: "#df5e34", steelThickness: [0.45] },
        ],
        hc35_75: [
          { ral: 6005, color: "#104336", steelThickness: [0.5, 0.65] },
          { ral: 3005, color: "#5c2028", steelThickness: [0.5, 0.65] },
          { ral: 5005, color: "#154889", steelThickness: [0.5, 0.65] },
          { ral: 8017, color: "#44332c", steelThickness: [0.5, 0.65] },
          { ral: 9003, color: "#eff0eb", steelThickness: [0.5, 0.65] },
          {
            ral: "оцинковка",
            color: "#b1bcc0",
            steelThickness: [0.5, 0.7, 0.8, 0.9],
          },
          { ral: 2004, color: "#df5e34", steelThickness: [0.45] },
        ],
        hc44: [
          { ral: 6005, color: "#104336", steelThickness: [0.65] },
          { ral: 3005, color: "#5c2028", steelThickness: [0.5, 0.65] },
          { ral: 5021, color: "#0a727d", steelThickness: [0.4, 0.45] },
          { ral: 8017, color: "#44332c", steelThickness: [0.5, 0.65] },
          { ral: 9003, color: "#eff0eb", steelThickness: [0.5, 0.65] },
          {
            ral: "оцинковка",
            color: "#b1bcc0",
            steelThickness: [0.5, 0.7, 0.8],
          },
        ],
      },
      selectedParam: {},
      selectedThickness: null,
      paintedSide: null,
      result: [],
    };
  },
  created: function () {
    this.updateInitialData();
  },
  computed: {
    materialParameters() {
      let param = this.corrugatedBoard.find(
        (board) => board.id === this.selectedBoard
      ).param;
      return this.colors[param];
    },
  },
  methods: {
    updateInitialData() {
      let param = this.corrugatedBoard.find(
        (board) => board.id === this.selectedBoard
      ).param;
      this.selectedParam = this.colors[param][0];
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
    },
    selectParam(param) {
      this.selectedParam = param;
    },
    selectThickness(value) {
      this.selectedThickness = value;
    },
    setSide(value) {
      this.paintedSide = value;
    },
  },
  watch: {
    selectedBoard() {
      this.updateInitialData();
    },
    selectedParam() {
      this.updateInitialThickness();
      this.selectedParam.ral === "оцинковка"
        ? this.setStartPaintedSide(null)
        : this.setStartPaintedSide();
    },
  },
};
</script>

<style></style>
