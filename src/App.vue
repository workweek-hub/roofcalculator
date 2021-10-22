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
      switch (this.selectedRoof) {
        case "singleSlope":
          this.calculateSingleSlope(roof);
          break;
        case "gable":
          this.calculateGable(roof);
          break;
        case "valm":
          this.calculateValm(roof);
          break;
        case "hipRoof":
          this.calculateHipRoof(roof);
          break;
        case "attic":
          this.calculateAttic(roof);
          break;
      }
    },
    calculateAttic(roof) {
      let side1Width;
      let side14Length;
      let side23Length;

      for (let prop of roof.proportions) {
        if (!prop.value) {
          this.errors = "Не указаны все стороны кровли";
        } else {
          if (prop.id === "side1Width") {
            side1Width = prop.value;
          }
          if (prop.id === "side14Length") {
            side14Length = prop.value;
          }
          if (prop.id === "side23Length") {
            side23Length = prop.value;
          }
        }
      }
      if (side1Width && side14Length && side23Length) {
        const currentWorkingWidth = this.workingWidth.find(
          (item) => item.version === this.selectedBoard
        );
        const meterCost = this.selectedParam.price[this.selectedThickness];
        const numberOfSheets =
          Math.ceil(Number(side1Width) / Number(currentWorkingWidth.value)) * 2;
        const runningMeters1 = numberOfSheets * (Number(side14Length) + 0.15);
        const runningMeters2 = numberOfSheets * (Number(side23Length) + 0.15);
        this.result = {
          roofArea:
            Number(side1Width) *
            (Number(side14Length) + Number(side23Length)) *
            2,
          numberOfSheets: numberOfSheets * 2,
          meterCost: meterCost,
          totalPrice: (runningMeters1 + runningMeters2) * meterCost,
          workingArea:
            (runningMeters1 + runningMeters2) *
            Number(currentWorkingWidth.value),
          metalArea:
            (runningMeters1 + runningMeters2) * currentWorkingWidth.totalValue,
          ral: this.selectedParam.ral,
          selectedBoard: this.selectedBoard,
          thickness: this.selectedThickness,
          positions: [
            {
              numberOfSheets: numberOfSheets,
              leafLength: Number(side14Length) + 0.15,
              metalArea: runningMeters1 * currentWorkingWidth.totalValue,
              totalPrice: runningMeters1 * meterCost,
            },
            {
              numberOfSheets: numberOfSheets,
              leafLength: Number(side23Length) + 0.15,
              metalArea: runningMeters2 * currentWorkingWidth.totalValue,
              totalPrice: runningMeters2 * meterCost,
            },
          ],
        };
      }
    },
    calculateHipRoof(roof) {
      let side1Width;
      let side2Width;
      let side1Length;
      let side2Length;
      for (let prop of roof.proportions) {
        if (!prop.value) {
          this.errors = "Не указаны все стороны кровли";
        } else {
          if (prop.id === "side1Width") {
            side1Width = prop.value;
          }
          if (prop.id === "side2Width") {
            side2Width = prop.value;
          }
          if (prop.id === "side1Length") {
            side1Length = prop.value;
          }
          if (prop.id === "side2Length") {
            side2Length = prop.value;
          }
        }
      }
      if (side1Width && side1Width && side1Length && side2Length) {
        const currentWorkingWidth = this.workingWidth.find(
          (item) => item.version === this.selectedBoard
        );
        const meterCost = this.selectedParam.price[this.selectedThickness];
        const triangle1Width = Number(side1Width) / 3;
        const triangle2Width = triangle1Width * 2;
        const triangle3Width = Number(side2Width) / 3;
        const triangle4Width = triangle3Width * 2;
        const numberOfSheetsTriangle1 =
          Math.ceil(
            Number(triangle1Width) / Number(currentWorkingWidth.value)
          ) * 2;
        const numberOfSheetsTriangle2 =
          Math.ceil(
            Number(triangle2Width) / Number(currentWorkingWidth.value)
          ) * 2;
        const numberOfSheetsTriangle3 =
          Math.ceil(
            Number(triangle3Width) / Number(currentWorkingWidth.value)
          ) * 2;
        const numberOfSheetsTriangle4 =
          Math.ceil(
            Number(triangle4Width) / Number(currentWorkingWidth.value)
          ) * 2;
        const runningMetersTriangle1 =
          numberOfSheetsTriangle1 * (Number(side1Length) / 2 + 0.15);
        const runningMetersTriangle2 =
          numberOfSheetsTriangle2 * (Number(side1Length) + 0.15);
        const runningMetersTriangle3 =
          numberOfSheetsTriangle3 * (Number(side2Length) / 2 + 0.15);
        const runningMetersTriangle4 =
          numberOfSheetsTriangle4 * (Number(side2Length) + 0.15);
        const totalMetersTriangle4 =
          runningMetersTriangle1 +
          runningMetersTriangle2 +
          runningMetersTriangle3 +
          runningMetersTriangle4;
        this.result = {
          roofArea:
            (Number(side1Width) * Number(side1Length) +
              Number(side2Width) * Number(side2Length)) *
            2,
          numberOfSheets:
            numberOfSheetsTriangle1 +
            numberOfSheetsTriangle2 +
            numberOfSheetsTriangle3 +
            numberOfSheetsTriangle4,
          meterCost: meterCost,
          totalPrice: totalMetersTriangle4 * meterCost,
          workingArea: totalMetersTriangle4 * Number(currentWorkingWidth.value),
          metalArea: totalMetersTriangle4 * currentWorkingWidth.totalValue,
          ral: this.selectedParam.ral,
          selectedBoard: this.selectedBoard,
          thickness: this.selectedThickness,
          positions: [
            {
              numberOfSheets: numberOfSheetsTriangle1,
              leafLength: Number(side1Length) / 2 + 0.15,
              metalArea:
                runningMetersTriangle1 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle1 * meterCost,
            },
            {
              numberOfSheets: numberOfSheetsTriangle2,
              leafLength: Number(side1Length) + 0.15,
              metalArea:
                runningMetersTriangle2 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle2 * meterCost,
            },
            {
              numberOfSheets: numberOfSheetsTriangle3,
              leafLength: Number(side2Length) / 2 + 0.15,
              metalArea:
                runningMetersTriangle3 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle3 * meterCost,
            },
            {
              numberOfSheets: numberOfSheetsTriangle4,
              leafLength: Number(side2Length) + 0.15,
              metalArea:
                runningMetersTriangle4 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle4 * meterCost,
            },
          ],
        };
      }
    },
    calculateValm(roof) {
      let side1Width;
      let side2Width;
      let colicWidth;
      let side1Length;
      let side2Length;

      for (let prop of roof.proportions) {
        if (!prop.value) {
          this.errors = "Не указаны все стороны кровли";
        } else {
          if (prop.id === "side1Width") {
            side1Width = prop.value;
          }
          if (prop.id === "side2Width") {
            side2Width = prop.value;
          }
          if (prop.id === "colicWidth") {
            colicWidth = prop.value;
          }
          if (prop.id === "side1Length") {
            side1Length = prop.value;
          }
          if (prop.id === "side2Length") {
            side2Length = prop.value;
          }
        }
      }
      if (
        side1Width &&
        side2Width &&
        colicWidth &&
        side1Length &&
        side2Length
      ) {
        const currentWorkingWidth = this.workingWidth.find(
          (item) => item.version === this.selectedBoard
        );
        const meterCost = this.selectedParam.price[this.selectedThickness];
        const triangle1Width = (Number(side1Width) - Number(colicWidth)) / 2;
        const rectangleWidth = triangle1Width + Number(colicWidth);
        const triangle2Width = side2Width / 2;
        const roofArea =
          (Number(colicWidth) * Number(side1Length) +
            Number(side1Length) * triangle1Width +
            Number(side2Width) * Number(side2Length)) *
          2;
        const numberOfSheetsRectangle =
          Math.ceil(
            Number(rectangleWidth) / Number(currentWorkingWidth.value)
          ) * 2;
        const numberOfSheetsTriangle1 =
          Math.ceil(
            Number(triangle1Width) / Number(currentWorkingWidth.value)
          ) * 2;
        const numberOfSheetsTriangle2 =
          Math.ceil(
            Number(triangle2Width) / Number(currentWorkingWidth.value)
          ) * 2;
        const runningMetersRectangle =
          numberOfSheetsRectangle * (Number(side1Length) + 0.15);
        const runningMetersTriangle1 =
          numberOfSheetsTriangle1 * (Number(side1Length) / 2 + 0.15);
        const runningMetersTriangle2 =
          numberOfSheetsTriangle2 * (Number(side2Length) + 0.15);
        const runningMetersTriangle3 =
          numberOfSheetsTriangle2 * (Number(side2Length) / 2 + 0.15);
        const totalRunningMeters =
          runningMetersRectangle +
          runningMetersTriangle1 +
          runningMetersTriangle2 +
          runningMetersTriangle3;
        this.result = {
          roofArea: roofArea,
          numberOfSheets:
            numberOfSheetsRectangle +
            numberOfSheetsTriangle1 +
            numberOfSheetsTriangle2,
          meterCost: meterCost,
          totalPrice: totalRunningMeters * meterCost,
          workingArea: totalRunningMeters * Number(currentWorkingWidth.value),
          metalArea: totalRunningMeters * currentWorkingWidth.totalValue,
          ral: this.selectedParam.ral,
          selectedBoard: this.selectedBoard,
          thickness: this.selectedThickness,
          positions: [
            {
              numberOfSheets: numberOfSheetsRectangle,
              leafLength: Number(side1Length) + 0.15,
              metalArea:
                runningMetersRectangle * currentWorkingWidth.totalValue,
              totalPrice: runningMetersRectangle * meterCost,
            },
            {
              numberOfSheets: numberOfSheetsTriangle1,
              leafLength: Number(side1Length) / 2 + 0.15,
              metalArea:
                runningMetersTriangle1 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle1 * meterCost,
            },
            {
              numberOfSheets: numberOfSheetsTriangle2,
              leafLength: Number(side1Length) + 0.15,
              metalArea:
                runningMetersTriangle2 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle2 * meterCost,
            },
            {
              numberOfSheets: numberOfSheetsTriangle2,
              leafLength: Number(side1Length) / 2 + 0.15,
              metalArea:
                runningMetersTriangle3 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle3 * meterCost,
            },
          ],
        };
      }
    },
    calculateGable(roof) {
      let roofWidth;
      let side1Length;
      let side2Length;
      for (let prop of roof.proportions) {
        if (!prop.value) {
          this.errors = "Не указаны все стороны кровли";
        } else {
          if (prop.id === "roofWidth") {
            roofWidth = prop.value;
          }
          if (prop.id === "side1Length") {
            side1Length = prop.value;
          }
          if (prop.id === "side2Length") {
            side2Length = prop.value;
          }
        }
      }
      if (roofWidth && side1Length && side2Length) {
        const currentWorkingWidth = this.workingWidth.find(
          (item) => item.version === this.selectedBoard
        );
        const meterCost = this.selectedParam.price[this.selectedThickness];
        const numberOfSheets =
          Math.ceil(Number(roofWidth) / Number(currentWorkingWidth.value)) * 2;
        const runningMeters1 = numberOfSheets * (Number(side1Length) + 0.15);
        const runningMeters2 = numberOfSheets * (Number(side2Length) + 0.15);
        this.result = {
          roofArea:
            Number(roofWidth) * (Number(side1Length) + Number(side2Length)),
          numberOfSheets: numberOfSheets,
          meterCost: meterCost,
          totalPrice: (runningMeters1 + runningMeters2) * meterCost,
          workingArea:
            (runningMeters1 + runningMeters2) *
            Number(currentWorkingWidth.value),
          metalArea:
            (runningMeters1 + runningMeters2) * currentWorkingWidth.totalValue,
          ral: this.selectedParam.ral,
          selectedBoard: this.selectedBoard,
          thickness: this.selectedThickness,
          positions: [
            {
              numberOfSheets: numberOfSheets / 2,
              leafLength: Number(side1Length) + 0.15,
              metalArea: runningMeters1 * currentWorkingWidth.totalValue,
              totalPrice: runningMeters1 * meterCost,
            },
            {
              numberOfSheets: numberOfSheets / 2,
              leafLength: Number(side2Length) + 0.15,
              metalArea: runningMeters2 * currentWorkingWidth.totalValue,
              totalPrice: runningMeters2 * meterCost,
            },
          ],
        };
      }
    },
    calculateSingleSlope(roof) {
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
          positions: [
            {
              numberOfSheets: numberOfSheets,
              leafLength: Number(roofHeight) + 0.3,
              metalArea: runningMeters * currentWorkingWidth.totalValue,
              totalPrice: runningMeters * meterCost,
            },
          ],
        };
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
