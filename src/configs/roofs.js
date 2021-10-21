export default {
  base: [
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
};
