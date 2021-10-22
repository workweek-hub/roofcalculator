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
      :matProperties="matProperties"
      :paintedSide="paintedSide"
      @select-color="selectColor"
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
import defaultPrice from "./configs/price";
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
        { id: "C20", ruTitle: "Профнастил С20" },
        { id: "HC44", ruTitle: "Профнастил HC44" },
        { id: "H75", ruTitle: "Профнастил H75" },
        { id: "H114", ruTitle: "Профнастил H114" },
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
        { version: "HC44", value: 1, totalValue: 1.25 },
        { version: "H75", value: 0.75, totalValue: 0.8 },
        { version: "H114", value: 0.807, totalValue: 0.75 },
      ],
      price: {},
    };
  },
  created: function () {
    this.roofs = defaultRoofs.base;
    this.price = defaultPrice.base;
    this.matProperties = materialProperties.base;
    this.updateInitialData("polymer");
  },
  methods: {
    updateInitialData(param) {
      this.selectedParam = {
        ral: this.matProperties.colors[0].ral,
        color: this.matProperties.colors[0].color,
        steelThickness:
          this.matProperties.steelThickness[this.selectedBoard][param],
      };
      this.updateInitialThickness();
      this.setStartPaintedSide();
    },
    updateInitialThickness() {
      this.selectedThickness =
        this.matProperties.steelThickness[this.selectedBoard].polymer[0];
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
    selectColor(item) {
      if (this.selectedParam.ral !== "оцинковка" && item.ral === "оцинковка") {
        const zincArr =
          this.matProperties.steelThickness[this.selectedBoard].zinc;
        this.selectedParam.steelThickness = zincArr;
        this.selectedThickness = zincArr[0];
      }
      if (this.selectedParam.ral === "оцинковка" && item.ral !== "оцинковка") {
        const polyArr =
          this.matProperties.steelThickness[this.selectedBoard].polymer;
        this.selectedParam.steelThickness = polyArr;
        this.selectedThickness = polyArr[0];
      }
      this.selectedParam = {
        ...this.selectedParam,
        ral: item.ral,
        color: item.color,
      };
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
      let price;
      if (this.selectedParam.ral === "оцинковка") {
        price = this.price.zinc[this.selectedBoard][this.selectedThickness];
      } else {
        price = this.price.polymer[this.selectedBoard][this.selectedThickness];
      }
      switch (this.selectedRoof) {
        case "singleSlope":
          this.calculateSingleSlope(roof, price);
          break;
        case "gable":
          this.calculateGable(roof, price);
          break;
        case "valm":
          this.calculateValm(roof, price);
          break;
        case "hipRoof":
          this.calculateHipRoof(roof, price);
          break;
        case "attic":
          this.calculateAttic(roof, price);
          break;
      }
    },
    calculateAttic(roof, price) {
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
          meterCost: price,
          totalPrice: (runningMeters1 + runningMeters2) * price,
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
              totalPrice: runningMeters1 * price,
            },
            {
              numberOfSheets: numberOfSheets,
              leafLength: Number(side23Length) + 0.15,
              metalArea: runningMeters2 * currentWorkingWidth.totalValue,
              totalPrice: runningMeters2 * price,
            },
          ],
        };
      }
    },
    calculateHipRoof(roof, price) {
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
          meterCost: price,
          totalPrice: totalMetersTriangle4 * price,
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
              totalPrice: runningMetersTriangle1 * price,
            },
            {
              numberOfSheets: numberOfSheetsTriangle2,
              leafLength: Number(side1Length) + 0.15,
              metalArea:
                runningMetersTriangle2 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle2 * price,
            },
            {
              numberOfSheets: numberOfSheetsTriangle3,
              leafLength: Number(side2Length) / 2 + 0.15,
              metalArea:
                runningMetersTriangle3 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle3 * price,
            },
            {
              numberOfSheets: numberOfSheetsTriangle4,
              leafLength: Number(side2Length) + 0.15,
              metalArea:
                runningMetersTriangle4 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle4 * price,
            },
          ],
        };
      }
    },
    calculateValm(roof, price) {
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
        side2Length &&
        Number(side1Width) > Number(colicWidth)
      ) {
        const currentWorkingWidth = this.workingWidth.find(
          (item) => item.version === this.selectedBoard
        );
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
          meterCost: price,
          totalPrice: totalRunningMeters * price,
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
              totalPrice: runningMetersRectangle * price,
            },
            {
              numberOfSheets: numberOfSheetsTriangle1,
              leafLength: Number(side1Length) / 2 + 0.15,
              metalArea:
                runningMetersTriangle1 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle1 * price,
            },
            {
              numberOfSheets: numberOfSheetsTriangle2,
              leafLength: Number(side1Length) + 0.15,
              metalArea:
                runningMetersTriangle2 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle2 * price,
            },
            {
              numberOfSheets: numberOfSheetsTriangle2,
              leafLength: Number(side1Length) / 2 + 0.15,
              metalArea:
                runningMetersTriangle3 * currentWorkingWidth.totalValue,
              totalPrice: runningMetersTriangle3 * price,
            },
          ],
        };
      }
    },
    calculateGable(roof, price) {
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
        const numberOfSheets =
          Math.ceil(Number(roofWidth) / Number(currentWorkingWidth.value)) * 2;
        const runningMeters1 = numberOfSheets * (Number(side1Length) + 0.15);
        const runningMeters2 = numberOfSheets * (Number(side2Length) + 0.15);
        this.result = {
          roofArea:
            Number(roofWidth) * (Number(side1Length) + Number(side2Length)),
          numberOfSheets: numberOfSheets,
          meterCost: price,
          totalPrice: (runningMeters1 + runningMeters2) * price,
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
              totalPrice: runningMeters1 * price,
            },
            {
              numberOfSheets: numberOfSheets / 2,
              leafLength: Number(side2Length) + 0.15,
              metalArea: runningMeters2 * currentWorkingWidth.totalValue,
              totalPrice: runningMeters2 * price,
            },
          ],
        };
      }
    },
    calculateSingleSlope(roof, price) {
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
        const numberOfSheets = Math.ceil(
          Number(roofWidth) / Number(currentWorkingWidth.value)
        );
        const runningMeters = numberOfSheets * (Number(roofHeight) + 0.3);
        this.result = {
          roofArea: Number(roofWidth) * Number(roofHeight),
          numberOfSheets: numberOfSheets,
          meterCost: price,
          totalPrice: runningMeters * price,
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
              totalPrice: runningMeters * price,
            },
          ],
        };
      }
    },
  },
  watch: {
    selectedRoof() {
      this.updateInitialData("polymer");
      this.result = null;
    },
    selectedBoard() {
      this.updateInitialData("polymer");
      this.result = null;
    },
    selectedParam() {
      this.selectedParam.ral === "оцинковка"
        ? this.setStartPaintedSide(null)
        : this.setStartPaintedSide();
      this.result = null;
    },
  },
};
</script>

<style></style>
