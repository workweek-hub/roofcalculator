<template>
  <div
    class="
      text-gray-700
      border border-gray-200
      grid grid-cols-1
      lg:grid-cols-select
      xl:grid-cols-3
      gap-4
      mt-8
      pb-8
      lg:pb-0
      mb-10
    "
  >
    <div class="col-span-1 xl:col-span-2">
      <h2 class="text-xl font-bold text-gray-700 pb-3 text-center mt-4">
        Ваш заказ
      </h2>
      <div
        class="
          ml-8
          mr-8
          lg:mr-2
          xl:mr-6
          p-8
          mb-0
          lg:mb-8
          border border-gray-200
          rounded-r-lg
          flex
        "
      >
        <div class="hidden xl:block">
          <img src="@/assets/images/board.png" width="120" alt="Профнастил" />
        </div>
        <div class="ml-0 xl:ml-6 w-full">
          <div class="block sm:flex">
            <div class="w-full pr-5 mb-2 sm:mb-0">
              <p class="font-bold">{{ resultTitle }}</p>
              <p class="text-xs font-bold text-gray-500 mt-3">
                {{ characteristic }}
              </p>
            </div>
            <span class="text-sm font-bold text-gray-500 inline sm:hidden mr-2">
              Цена:
            </span>
            <span
              class="
                text-sm
                font-bold
                text-gray-500
                whitespace-nowrap
                self-center
              "
            >
              {{ result.meterCost.toFixed(2) }} руб / п.м.
            </span>
          </div>
          <div class="mt-4 sm:mt-8 block sm:flex">
            <span
              class="
                block
                text-xs text-gray-400
                w-full
                self-center
                pr-5
                mb-4
                sm:mb-0
              "
            >
              {{ orderDescription }}
            </span>
            <span class="font-bold mr-2 inline sm:hidden text-sm">
              Сумма:
            </span>
            <span
              class="
                whitespace-nowrap
                font-bold
                self-center
                text-sm
                sm:text-base
              "
            >
              {{ result.totalPrice.toFixed(2) }} руб
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="
        mt-4
        lg:mt-20
        xl:mt-16
        pr-16
        md:pr-8
        ml-8
        lg:ml-0
        min-w-max
        w-full
        md:w-max
        lg:w-full
        justify-self-auto
        md:justify-self-end
        lg:justify-self-auto
      "
    >
      <div
        v-for="(row, ind) in finalCalculation"
        :key="`rw-${ind}`"
        class="block sm:flex mb-2 text-base lg:text-sm xl:text-base"
      >
        <span class="block sm:inline font-bold w-full mr-8">{{
          row.title
        }}</span>
        <span class="whitespace-nowrap text-gray-500 sm:text-gray-900">{{
          row.value
        }}</span>
      </div>
      <div class="block sm:flex mt-8 sm:mt-0">
        <span class="block sm:inline font-bold w-full mr-8"
          >Общая стоимость:</span
        >
        <span
          class="
            whitespace-nowrap
            font-bold
            text-xl
            relative
            -top-0.5
            text-gray-500
            sm:text-gray-900
          "
        >
          {{ result.totalPrice.toFixed(2) }} руб
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OutputtingTheResult",
  props: {
    result: {
      type: Object,
      required: true,
    },
  },
  computed: {
    resultTitle() {
      return `Профнастил ${this.result.selectedBoard} ${
        this.result.ral
          ? "RAL " + this.result.ral + " полимерное покрытие"
          : "оцинкованное покрытие"
      }`;
    },
    characteristic() {
      return `Цвет: ${
        this.result.ral ? "RAL" + this.result.ral : this.result.ral
      } / Толщина: ${this.result.thickness.toFixed(2)} мм`;
    },
    orderDescription() {
      return `Количество листов: ${this.result.numberOfSheets} шт.
      Длина листа: ${this.result.leafLength.toFixed(2)} м.
      Площадь: ${this.result.metalArea.toFixed(2)} м2`;
    },
    finalCalculation() {
      return [
        { title: "Площадь кровли:", value: `${this.result.roofArea} м2` },
        {
          title: "Площадь листов полная:",
          value: `${this.result.metalArea.toFixed(2)} м2`,
        },
        {
          title: "Площадь листов полезная:",
          value: `${this.result.workingArea.toFixed(2)} м2`,
        },
        { title: "Листы:", value: `${this.result.numberOfSheets} ед` },
      ];
    },
  },
};
</script>

<style scoped></style>
