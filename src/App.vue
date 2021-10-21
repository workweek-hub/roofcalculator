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
            price: {
              0.3: 513,
              0.35: 556,
              0.4: 740,
              0.45: 799,
              0.5: 745,
              0.65: 988,
            },
          },
          {
            ral: 1014,
            color: "#dccd9d",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 626, 0.45: 680 },
          },
          {
            ral: 1015,
            color: "#ebd6bb",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 626, 0.45: 680 },
          },
          {
            ral: 1018,
            color: "#f3e03b",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 649, 0.45: 703 },
          },
          {
            ral: 3003,
            color: "#8d1c2c",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 651, 0.45: 705 },
          },
          {
            ral: 3005,
            color: "#5c2028",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.65],
            price: {
              0.3: 513,
              0.35: 556,
              0.4: 740,
              0.45: 799,
              0.5: 745,
              0.65: 988,
            },
          },
          {
            ral: 3009,
            color: "#81443f",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 637, 0.45: 954 },
          },
          {
            ral: 3011,
            color: "#7e292c",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 638, 0.45: 692 },
          },
          {
            ral: 3020,
            color: "#d93637",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 652, 0.45: 706 },
          },
          {
            ral: 5002,
            color: "#2b2c7c",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 642, 0.45: 696 },
          },
          {
            ral: 5005,
            color: "#154889",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.65],
            price: {
              0.3: 513,
              0.35: 556,
              0.4: 740,
              0.45: 799,
              0.5: 745,
              0.65: 988,
            },
          },
          {
            ral: 5021,
            color: "#0a727d",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 638, 0.45: 692 },
          },
          {
            ral: 7004,
            color: "#9fa0a2",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 636, 0.45: 690 },
          },
          {
            ral: 7024,
            color: "#474a51",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 626, 0.45: 943 },
          },
          {
            ral: 8017,
            color: "#44332c",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.65],
            price: {
              0.3: 513,
              0.35: 556,
              0.4: 740,
              0.45: 799,
              0.5: 745,
              0.65: 988,
            },
          },
          {
            ral: 9003,
            color: "#eff0eb",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.65],
            price: {
              0.3: 513,
              0.35: 556,
              0.4: 740,
              0.45: 799,
              0.5: 745,
              0.65: 988,
            },
          },
          {
            ral: 9006,
            color: "#a6a8a7",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 638, 0.45: 692 },
          },
          {
            ral: 6002,
            color: "#276234",
            steelThickness: [0.4, 0.45],
            price: { 0.4: 637, 0.45: 691 },
          },
          {
            ral: 6029,
            color: "#008242",
            steelThickness: [0.4],
            price: { 0.4: 641 },
          },
          {
            ral: "оцинковка",
            color: "#b1bcc0",
            steelThickness: [0.3, 0.35, 0.4, 0.45, 0.5, 0.7],
            price: {
              0.3: 491,
              0.35: 513,
              0.4: 605,
              0.45: 616,
              0.5: 664,
              0.7: 988,
            },
          },
          {
            ral: 2004,
            color: "#df5e34",
            steelThickness: [0.45],
            price: { 0.45: 714 },
          },
        ],
        hc35_75: [
          {
            ral: 6005,
            color: "#104336",
            steelThickness: [0.5, 0.65],
            price: { 0.5: 745, 0.65: 988 },
          },
          {
            ral: 3005,
            color: "#5c2028",
            steelThickness: [0.5, 0.65],
            price: { 0.5: 745, 0.65: 988 },
          },
          {
            ral: 5005,
            color: "#154889",
            steelThickness: [0.5, 0.65],
            price: { 0.5: 745, 0.65: 988 },
          },
          {
            ral: 8017,
            color: "#44332c",
            steelThickness: [0.5, 0.65],
            price: { 0.5: 745, 0.65: 988 },
          },
          {
            ral: 9003,
            color: "#eff0eb",
            steelThickness: [0.5, 0.65],
            price: { 0.5: 745, 0.65: 988 },
          },
          {
            ral: "оцинковка",
            color: "#b1bcc0",
            steelThickness: [0.5, 0.7, 0.8, 0.9],
            price: { 0.5: 664, 0.7: 988, 0.8: 1123, 0.9: 1328 },
          },
          {
            ral: 2004,
            color: "#df5e34",
            steelThickness: [0.45],
            price: { 0.45: 714 },
          },
        ],
        hc44: [
          {
            ral: 6005,
            color: "#104336",
            steelThickness: [0.65],
            price: { 0.65: 988 },
          },
          {
            ral: 3005,
            color: "#5c2028",
            steelThickness: [0.5, 0.65],
            price: { 0.5: 745, 0.65: 988 },
          },
          {
            ral: 5021,
            color: "#0a727d",
            steelThickness: [0.4, 0.45],
            price: { 0.5: 745, 0.65: 988 },
          },
          {
            ral: 8017,
            color: "#44332c",
            steelThickness: [0.5, 0.65],
            price: { 0.5: 745, 0.65: 988 },
          },
          {
            ral: 9003,
            color: "#eff0eb",
            steelThickness: [0.5, 0.65],
            price: { 0.5: 745, 0.65: 988 },
          },
          {
            ral: "оцинковка",
            color: "#b1bcc0",
            steelThickness: [0.5, 0.7, 0.8],
            price: { 0.5: 664, 0.7: 988, 0.8: 1123 },
          },
        ],
      },
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
        this.roof[this.roof.findIndex((item) => item.id === this.selectedRoof)];
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
            this.result = {};
            this.result.roofArea = Number(roofWidth) * Number(roofHeight);
            const currentWorkingWidth = this.workingWidth.find(
              (item) => item.version === this.selectedBoard
            );
            this.result.numberOfSheets = Math.ceil(
              Number(roofWidth) / Number(currentWorkingWidth.value)
            );
            const meterCost = this.selectedParam.price[this.selectedThickness];
            this.result.meterCost = meterCost;
            const runningMeters =
              this.result.numberOfSheets * (Number(roofHeight) + 0.3);
            this.result.totalPrice = runningMeters * meterCost;
            this.result.workingArea =
              runningMeters * Number(currentWorkingWidth.value);
            this.result.metalArea =
              runningMeters * currentWorkingWidth.totalValue;
            this.result.ral = this.selectedParam.ral;
            this.result.selectedBoard = this.selectedBoard;
            this.result.thickness = this.selectedThickness;
            this.result.leafLength = Number(roofHeight) + 0.3;
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
