// Statische Geometrie & Theming der EselWorld-Weltkarte: 8 „Länder“ (große
// Kategorie-Regionen) um einen zentralen Hub, jedes mit eigener Farbwelt,
// großer detaillierter Inselform und 20 Community-Plätzen. Kein Datenbank-
// Modell — bewusst statischer Code, weil sich die Kartenform in V1 nicht
// ändert (siehe README).

export const WORLD_VIEW_W = 1760;
export const WORLD_VIEW_H = 1360;
// Jede Land-Karte (Level 2) nutzt dieselbe lokale Box, in der auch die
// Inselform, die 20 Plätze, die Deko-Textur und die Straßen des Landes
// definiert sind.
export const LAND_VIEW_W = 1400;
export const LAND_VIEW_H = 1400;
export const PLOTS_PER_LAND = 20;
export const TOTAL_PLOTS = 160;

export type LandTheme = {
  land: string;
  landLine: string;
  accent: string;
  accentSoft: string;
  water: string;
  waterDeep: string;
};

export type Land = {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  worldX: number;
  worldY: number;
  worldScale: number;
  shape: string;
  theme: LandTheme;
};

const LAND_SHAPES: Record<string, string> = {
  "gaming-lands":
    "M 1270.2 700.0 C 1285.6 763.8, 1256.1 842.7, 1231.4 909.6 C 1206.6 976.6, 1172.6 1049.8, 1121.7 1101.7 C 1070.9 1153.5, 996.7 1182.3, 926.4 1220.5 C 856.1 1258.7, 774.6 1333.0, 700.0 1330.9 C 625.4 1328.8, 532.4 1262.3, 479.1 1208.0 C 425.7 1153.7, 431.7 1054.6, 379.9 1004.9 C 328.1 955.1, 214.5 960.5, 168.5 909.7 C 122.5 858.9, 100.3 768.6, 103.7 700.0 C 107.0 631.4, 155.4 561.3, 188.7 498.3 C 221.9 435.2, 259.8 385.1, 302.9 321.8 C 346.0 258.6, 381.1 142.4, 447.2 118.8 C 513.4 95.3, 618.8 173.8, 700.0 180.7 C 781.2 187.7, 862.1 143.0, 934.7 160.3 C 1007.4 177.7, 1101.9 223.8, 1135.9 284.9 C 1169.8 346.0, 1116.2 457.8, 1138.6 527.0 C 1160.9 596.2, 1254.7 636.2, 1270.2 700.0 Z",
  "tech-valley":
    "M 1266.3 700.0 C 1269.0 767.5, 1182.2 843.8, 1141.4 906.3 C 1100.6 968.8, 1070.6 1030.2, 1021.6 1075.0 C 972.6 1119.9, 909.7 1149.3, 847.2 1175.7 C 784.7 1202.1, 723.3 1217.8, 646.6 1233.3 C 569.9 1248.9, 449.4 1303.6, 387.1 1269.0 C 324.8 1234.5, 314.7 1099.8, 272.7 1026.0 C 230.7 952.2, 160.6 902.0, 135.2 826.1 C 109.8 750.2, 84.7 636.4, 120.1 570.6 C 155.5 504.8, 288.9 478.6, 347.6 431.2 C 406.3 383.8, 421.7 321.5, 472.4 286.1 C 523.1 250.7, 589.6 228.1, 651.8 218.6 C 714.0 209.1, 777.5 219.1, 845.7 229.2 C 913.9 239.2, 1014.5 233.7, 1061.0 279.0 C 1107.6 324.4, 1090.9 431.1, 1125.1 501.3 C 1159.3 571.4, 1263.6 632.5, 1266.3 700.0 Z",
  "roleplay-realm":
    "M 1298.6 700.0 C 1303.8 774.0, 1332.7 861.5, 1305.9 927.7 C 1279.2 994.0, 1211.3 1074.5, 1138.1 1097.6 C 1065.0 1120.6, 940.1 1046.5, 867.1 1066.0 C 794.0 1085.5, 771.2 1180.5, 700.0 1214.5 C 628.8 1248.5, 500.2 1301.0, 439.8 1270.0 C 379.4 1239.0, 388.5 1088.3, 337.8 1028.7 C 287.0 969.0, 186.9 967.0, 135.4 912.2 C 83.9 857.4, 46.1 777.2, 28.8 700.0 C 11.5 622.8, -17.9 505.4, 31.5 448.8 C 81.0 392.1, 257.4 413.0, 325.7 360.4 C 393.9 307.7, 378.6 151.7, 441.0 132.7 C 503.4 113.6, 613.5 246.4, 700.0 246.0 C 786.5 245.5, 878.8 128.1, 960.2 129.9 C 1041.7 131.7, 1136.2 197.6, 1188.6 256.6 C 1241.1 315.6, 1256.4 410.1, 1274.8 484.0 C 1293.1 557.9, 1293.4 626.0, 1298.6 700.0 Z",
  "music-island":
    "M 1309.6 700.0 C 1280.4 778.0, 1134.9 835.7, 1074.1 889.6 C 1013.4 943.6, 985.3 952.7, 945.2 1023.6 C 905.1 1094.6, 894.7 1274.7, 833.4 1315.2 C 772.1 1355.7, 652.5 1299.0, 577.1 1266.7 C 501.7 1234.3, 438.6 1176.0, 381.0 1121.1 C 323.3 1066.3, 257.5 1007.9, 231.1 937.7 C 204.8 867.5, 226.3 781.0, 222.8 700.0 C 219.4 619.0, 192.2 532.5, 210.7 451.9 C 229.1 371.4, 268.9 252.0, 333.8 216.6 C 398.7 181.2, 525.3 222.7, 600.2 239.5 C 675.0 256.3, 698.9 329.6, 783.0 317.4 C 867.1 305.1, 1027.0 148.5, 1104.7 165.9 C 1182.4 183.2, 1215.1 332.5, 1249.3 421.6 C 1283.4 510.6, 1338.8 622.0, 1309.6 700.0 Z",
  "esports-arena":
    "M 1227.2 700.0 C 1235.5 781.6, 1296.6 882.8, 1274.4 955.7 C 1252.3 1028.7, 1159.2 1085.6, 1094.3 1137.9 C 1029.4 1190.3, 958.5 1270.6, 885.2 1269.8 C 811.8 1269.1, 724.8 1160.2, 654.4 1133.6 C 584.1 1107.0, 528.5 1129.5, 463.1 1110.3 C 397.8 1091.0, 304.6 1068.9, 262.5 1017.8 C 220.4 966.8, 226.1 875.8, 210.6 804.0 C 195.1 732.3, 147.4 647.8, 169.6 587.3 C 191.7 526.7, 301.8 503.2, 343.4 440.9 C 384.9 378.6, 368.5 255.0, 419.0 213.3 C 469.5 171.5, 573.7 188.8, 646.4 190.3 C 719.1 191.8, 798.1 190.8, 855.2 222.2 C 912.4 253.7, 927.6 338.1, 989.2 378.8 C 1050.7 419.5, 1185.0 412.9, 1224.6 466.4 C 1264.3 519.9, 1218.9 618.4, 1227.2 700.0 Z",
  "car-district":
    "M 1188.6 700.0 C 1149.7 763.1, 1134.0 795.6, 1112.9 847.7 C 1091.8 899.8, 1088.6 949.1, 1062.1 1012.7 C 1035.6 1076.3, 1014.2 1192.1, 953.9 1229.3 C 893.5 1266.4, 787.1 1230.4, 700.0 1235.6 C 612.9 1240.7, 485.4 1302.7, 431.3 1260.2 C 377.2 1217.7, 399.4 1049.1, 375.3 980.4 C 351.3 911.6, 334.6 894.4, 287.2 847.7 C 239.7 801.0, 102.7 753.6, 90.6 700.0 C 78.5 646.4, 165.5 571.7, 214.5 526.3 C 263.5 480.9, 332.3 458.5, 384.5 427.5 C 436.6 396.5, 475.0 400.5, 527.6 340.5 C 580.2 280.4, 631.6 90.2, 700.0 67.3 C 768.4 44.5, 873.3 153.9, 938.2 203.3 C 1003.1 252.7, 1021.5 319.3, 1089.5 363.6 C 1157.5 407.8, 1329.7 412.7, 1346.3 468.8 C 1362.8 524.9, 1227.5 636.9, 1188.6 700.0 Z",
  "creative-zone":
    "M 1218.3 700.0 C 1190.0 773.9, 1090.6 800.5, 1066.3 879.9 C 1041.9 959.3, 1113.5 1117.4, 1072.3 1176.2 C 1031.2 1235.0, 897.2 1241.3, 819.2 1232.9 C 741.3 1224.5, 690.6 1130.0, 604.8 1125.6 C 518.9 1121.2, 386.0 1229.3, 304.0 1206.5 C 222.0 1183.6, 150.6 1072.8, 112.8 988.4 C 75.0 904.0, 41.0 778.4, 77.2 700.0 C 113.4 621.6, 272.8 577.7, 330.1 518.3 C 387.5 458.9, 384.2 422.6, 421.4 343.6 C 458.6 264.6, 485.9 78.5, 553.3 44.3 C 620.7 10.2, 745.2 101.0, 825.6 138.7 C 906.0 176.3, 967.5 220.7, 1035.9 270.3 C 1104.4 320.0, 1205.9 365.0, 1236.3 436.6 C 1266.7 508.2, 1246.6 626.1, 1218.3 700.0 Z",
  entertainment:
    "M 1359.0 700.0 C 1356.3 780.9, 1313.9 875.7, 1264.2 939.2 C 1214.5 1002.8, 1127.3 1041.1, 1060.7 1081.5 C 994.1 1122.0, 933.8 1161.5, 864.4 1182.0 C 795.0 1202.4, 711.9 1218.1, 644.4 1204.0 C 576.9 1189.9, 527.2 1127.7, 459.3 1097.1 C 391.4 1066.5, 283.1 1069.2, 236.9 1020.4 C 190.7 971.7, 185.1 874.4, 182.3 804.8 C 179.5 735.2, 202.4 667.7, 220.1 602.9 C 237.9 538.0, 247.3 462.8, 288.8 415.5 C 330.3 368.1, 412.4 380.2, 469.0 318.9 C 525.5 257.6, 561.7 65.6, 628.0 47.7 C 694.3 29.7, 793.3 167.7, 866.7 211.4 C 940.1 255.2, 999.7 269.7, 1068.6 310.1 C 1137.5 350.6, 1231.8 389.0, 1280.2 454.0 C 1328.6 518.9, 1361.6 619.1, 1359.0 700.0 Z",
};

// Zentrale Hub-Insel (rein dekorativ, nicht klickbar), lokal 300x300, Zentrum 150,150.
export const HUB_SHAPE =
  "M 275.5 150.0 C 277.6 170.9, 258.2 200.8, 242.6 217.3 C 227.0 233.7, 203.6 241.0, 182.0 248.6 C 160.5 256.3, 133.2 269.0, 113.2 263.2 C 93.2 257.4, 74.8 232.7, 62.2 213.8 C 49.5 195.0, 35.6 169.9, 37.5 150.0 C 39.3 130.1, 60.1 112.0, 73.1 94.1 C 86.0 76.3, 96.1 52.8, 115.2 42.9 C 134.3 33.0, 168.3 26.5, 187.5 34.6 C 206.7 42.8, 215.6 72.5, 230.2 91.7 C 244.9 110.9, 273.4 129.1, 275.5 150.0 Z";
export const HUB_WORLD_X = 890;
export const HUB_WORLD_Y = 640;
export const HUB_WORLD_SCALE = 0.62;

// Lands sind lokal in einer 1400x1400-Box (Zentrum 700,700, Basisradius ~540)
// definiert; worldScale verkleinert dieselbe Form auf der Weltkarte auf
// denselben sichtbaren Radius wie zuvor (~180), damit sich an der bereits
// abgenommenen Weltkarte optisch nichts ändert — nur die Land-Karten (Level 2)
// werden größer und detaillierter.
const WORLD_SCALE = 180 / 540;

export const LANDS: Land[] = [
  {
    id: "gaming-lands",
    name: "Gaming Lands",
    subtitle: "Minecraft · GTA · Shooter · Spiele",
    icon: "🎮",
    worldX: 362,
    worldY: 251,
    worldScale: WORLD_SCALE,
    shape: LAND_SHAPES["gaming-lands"],
    theme: {
      land: "#c25a3a",
      landLine: "#7a3420",
      accent: "#ff6b35",
      accentSoft: "#4a2418",
      water: "#2a6b7a",
      waterDeep: "#123a45",
    },
  },
  {
    id: "tech-valley",
    name: "Tech Valley",
    subtitle: "Technologie · Programmierung · KI",
    icon: "💻",
    worldX: 898,
    worldY: 212,
    worldScale: WORLD_SCALE,
    shape: LAND_SHAPES["tech-valley"],
    theme: {
      land: "#a9c4d8",
      landLine: "#5f88a3",
      accent: "#4fc3e8",
      accentSoft: "#173a4a",
      water: "#1c5c78",
      waterDeep: "#0c2f40",
    },
  },
  {
    id: "roleplay-realm",
    name: "Roleplay Realm",
    subtitle: "FiveM · Roleplay · Storys",
    icon: "🎭",
    worldX: 1434,
    worldY: 307,
    worldScale: WORLD_SCALE,
    shape: LAND_SHAPES["roleplay-realm"],
    theme: {
      land: "#5b8f4e",
      landLine: "#345a2c",
      accent: "#9b6bd6",
      accentSoft: "#2f2044",
      water: "#25506b",
      waterDeep: "#102838",
    },
  },
  {
    id: "music-island",
    name: "Music Island",
    subtitle: "Musik · Künstler · Streams",
    icon: "🎵",
    worldX: 221,
    worldY: 684,
    worldScale: WORLD_SCALE,
    shape: LAND_SHAPES["music-island"],
    theme: {
      land: "#4a3b6b",
      landLine: "#2c2143",
      accent: "#e0479a",
      accentSoft: "#3a1930",
      water: "#2a3d6e",
      waterDeep: "#141f3d",
    },
  },
  {
    id: "esports-arena",
    name: "Esports Arena",
    subtitle: "Turniere · Teams · Wettbewerbe",
    icon: "🏆",
    worldX: 1533,
    worldY: 714,
    worldScale: WORLD_SCALE,
    shape: LAND_SHAPES["esports-arena"],
    theme: {
      land: "#3a3a4a",
      landLine: "#1f1f2b",
      accent: "#d4af37",
      accentSoft: "#3a2f14",
      water: "#243350",
      waterDeep: "#10192c",
    },
  },
  {
    id: "car-district",
    name: "Car District",
    subtitle: "Autos · Tuning · Motorsport",
    icon: "🚗",
    worldX: 273,
    worldY: 1120,
    worldScale: WORLD_SCALE,
    shape: LAND_SHAPES["car-district"],
    theme: {
      land: "#b87355",
      landLine: "#734330",
      accent: "#e0572e",
      accentSoft: "#3d2015",
      water: "#2a5a6e",
      waterDeep: "#122e3a",
    },
  },
  {
    id: "creative-zone",
    name: "Creative Zone",
    subtitle: "Design · Kunst · Content",
    icon: "🎨",
    worldX: 717,
    worldY: 1125,
    worldScale: WORLD_SCALE,
    shape: LAND_SHAPES["creative-zone"],
    theme: {
      land: "#e0a868",
      landLine: "#96703f",
      accent: "#e0577a",
      accentSoft: "#4a1f2c",
      water: "#276a72",
      waterDeep: "#123840",
    },
  },
  {
    id: "entertainment",
    name: "Entertainment",
    subtitle: "Memes · Talk · Unterhaltung",
    icon: "😂",
    worldX: 1144,
    worldY: 1132,
    worldScale: WORLD_SCALE,
    shape: LAND_SHAPES.entertainment,
    theme: {
      land: "#f0d080",
      landLine: "#a3873f",
      accent: "#ff8c42",
      accentSoft: "#4a2f14",
      water: "#2a6b7a",
      waterDeep: "#123a45",
    },
  },
];

export function landById(id: string): Land | undefined {
  return LANDS.find((l) => l.id === id);
}

export type LandPlot = { index: number; landId: string; x: number; y: number };

export const LAND_PLOTS: LandPlot[] = [
  { index: 0, landId: "gaming-lands", x: 1034.5, y: 683.2 },
  { index: 1, landId: "gaming-lands", x: 1007.5, y: 508.4 },
  { index: 2, landId: "gaming-lands", x: 645.0, y: 947.7 },
  { index: 3, landId: "gaming-lands", x: 701.8, y: 744.9 },
  { index: 4, landId: "gaming-lands", x: 435.4, y: 756.1 },
  { index: 5, landId: "gaming-lands", x: 651.5, y: 537.7 },
  { index: 6, landId: "gaming-lands", x: 379.5, y: 537.4 },
  { index: 7, landId: "gaming-lands", x: 1062.9, y: 838.4 },
  { index: 8, landId: "gaming-lands", x: 901.1, y: 574.4 },
  { index: 9, landId: "gaming-lands", x: 630.4, y: 355.4 },
  { index: 10, landId: "gaming-lands", x: 811.9, y: 969.7 },
  { index: 11, landId: "gaming-lands", x: 478.9, y: 425.7 },
  { index: 12, landId: "gaming-lands", x: 962.4, y: 988.5 },
  { index: 13, landId: "gaming-lands", x: 824.8, y: 401.1 },
  { index: 14, landId: "gaming-lands", x: 895.6, y: 724.8 },
  { index: 15, landId: "gaming-lands", x: 368.7, y: 923.8 },
  { index: 16, landId: "gaming-lands", x: 580.9, y: 690.7 },
  { index: 17, landId: "gaming-lands", x: 518.6, y: 567.2 },
  { index: 18, landId: "gaming-lands", x: 571.6, y: 1052.3 },
  { index: 19, landId: "gaming-lands", x: 522.0, y: 934.7 },
  { index: 20, landId: "tech-valley", x: 898.3, y: 558.8 },
  { index: 21, landId: "tech-valley", x: 504.2, y: 368.0 },
  { index: 22, landId: "tech-valley", x: 674.5, y: 379.0 },
  { index: 23, landId: "tech-valley", x: 722.0, y: 694.9 },
  { index: 24, landId: "tech-valley", x: 674.9, y: 1029.5 },
  { index: 25, landId: "tech-valley", x: 1042.3, y: 557.8 },
  { index: 26, landId: "tech-valley", x: 759.0, y: 518.1 },
  { index: 27, landId: "tech-valley", x: 843.4, y: 962.1 },
  { index: 28, landId: "tech-valley", x: 407.0, y: 872.8 },
  { index: 29, landId: "tech-valley", x: 623.0, y: 860.2 },
  { index: 30, landId: "tech-valley", x: 457.1, y: 554.0 },
  { index: 31, landId: "tech-valley", x: 312.2, y: 672.1 },
  { index: 32, landId: "tech-valley", x: 878.4, y: 383.4 },
  { index: 33, landId: "tech-valley", x: 985.8, y: 829.9 },
  { index: 34, landId: "tech-valley", x: 499.1, y: 776.6 },
  { index: 35, landId: "tech-valley", x: 553.6, y: 638.7 },
  { index: 36, landId: "tech-valley", x: 544.7, y: 1026.3 },
  { index: 37, landId: "tech-valley", x: 959.1, y: 989.4 },
  { index: 38, landId: "tech-valley", x: 797.1, y: 811.4 },
  { index: 39, landId: "tech-valley", x: 966.2, y: 675.2 },
  { index: 40, landId: "roleplay-realm", x: 637.0, y: 365.1 },
  { index: 41, landId: "roleplay-realm", x: 894.2, y: 607.8 },
  { index: 42, landId: "roleplay-realm", x: 991.9, y: 920.1 },
  { index: 43, landId: "roleplay-realm", x: 747.0, y: 997.1 },
  { index: 44, landId: "roleplay-realm", x: 702.1, y: 824.8 },
  { index: 45, landId: "roleplay-realm", x: 564.7, y: 494.5 },
  { index: 46, landId: "roleplay-realm", x: 862.1, y: 971.0 },
  { index: 47, landId: "roleplay-realm", x: 408.8, y: 578.5 },
  { index: 48, landId: "roleplay-realm", x: 535.7, y: 908.4 },
  { index: 49, landId: "roleplay-realm", x: 508.1, y: 717.9 },
  { index: 50, landId: "roleplay-realm", x: 622.5, y: 998.0 },
  { index: 51, landId: "roleplay-realm", x: 731.0, y: 490.2 },
  { index: 52, landId: "roleplay-realm", x: 506.0, y: 1022.9 },
  { index: 53, landId: "roleplay-realm", x: 783.9, y: 668.4 },
  { index: 54, landId: "roleplay-realm", x: 1091.9, y: 658.2 },
  { index: 55, landId: "roleplay-realm", x: 859.0, y: 495.2 },
  { index: 56, landId: "roleplay-realm", x: 640.6, y: 695.4 },
  { index: 57, landId: "roleplay-realm", x: 358.4, y: 831.8 },
  { index: 58, landId: "roleplay-realm", x: 1071.4, y: 778.5 },
  { index: 59, landId: "roleplay-realm", x: 815.5, y: 383.8 },
  { index: 60, landId: "music-island", x: 634.5, y: 834.0 },
  { index: 61, landId: "music-island", x: 967.1, y: 806.7 },
  { index: 62, landId: "music-island", x: 646.5, y: 563.9 },
  { index: 63, landId: "music-island", x: 750.9, y: 724.1 },
  { index: 64, landId: "music-island", x: 891.6, y: 595.0 },
  { index: 65, landId: "music-island", x: 485.0, y: 831.2 },
  { index: 66, landId: "music-island", x: 909.4, y: 988.9 },
  { index: 67, landId: "music-island", x: 545.2, y: 987.1 },
  { index: 68, landId: "music-island", x: 673.7, y: 1056.2 },
  { index: 69, landId: "music-island", x: 717.9, y: 358.2 },
  { index: 70, landId: "music-island", x: 561.0, y: 646.7 },
  { index: 71, landId: "music-island", x: 522.8, y: 447.1 },
  { index: 72, landId: "music-island", x: 823.1, y: 832.8 },
  { index: 73, landId: "music-island", x: 334.9, y: 684.9 },
  { index: 74, landId: "music-island", x: 410.2, y: 499.1 },
  { index: 75, landId: "music-island", x: 840.2, y: 368.4 },
  { index: 76, landId: "music-island", x: 794.2, y: 1054.6 },
  { index: 77, landId: "music-island", x: 1045.2, y: 568.4 },
  { index: 78, landId: "music-island", x: 455.2, y: 702.1 },
  { index: 79, landId: "music-island", x: 757.0, y: 515.2 },
  { index: 80, landId: "esports-arena", x: 782.5, y: 819.6 },
  { index: 81, landId: "esports-arena", x: 515.4, y: 860.3 },
  { index: 82, landId: "esports-arena", x: 885.7, y: 520.4 },
  { index: 83, landId: "esports-arena", x: 682.5, y: 703.9 },
  { index: 84, landId: "esports-arena", x: 1054.9, y: 615.5 },
  { index: 85, landId: "esports-arena", x: 664.3, y: 509.3 },
  { index: 86, landId: "esports-arena", x: 971.4, y: 969.8 },
  { index: 87, landId: "esports-arena", x: 880.1, y: 381.0 },
  { index: 88, landId: "esports-arena", x: 915.8, y: 736.7 },
  { index: 89, landId: "esports-arena", x: 825.4, y: 635.6 },
  { index: 90, landId: "esports-arena", x: 668.5, y: 317.9 },
  { index: 91, landId: "esports-arena", x: 507.6, y: 570.5 },
  { index: 92, landId: "esports-arena", x: 694.1, y: 1077.8 },
  { index: 93, landId: "esports-arena", x: 458.5, y: 748.9 },
  { index: 94, landId: "esports-arena", x: 460.7, y: 977.7 },
  { index: 95, landId: "esports-arena", x: 1042.0, y: 768.2 },
  { index: 96, landId: "esports-arena", x: 682.2, y: 908.9 },
  { index: 97, landId: "esports-arena", x: 355.1, y: 578.8 },
  { index: 98, landId: "esports-arena", x: 419.9, y: 478.8 },
  { index: 99, landId: "esports-arena", x: 1023.8, y: 486.3 },
  { index: 100, landId: "car-district", x: 749.4, y: 862.1 },
  { index: 101, landId: "car-district", x: 585.4, y: 416.0 },
  { index: 102, landId: "car-district", x: 1001.0, y: 711.8 },
  { index: 103, landId: "car-district", x: 1009.6, y: 521.4 },
  { index: 104, landId: "car-district", x: 790.2, y: 738.8 },
  { index: 105, landId: "car-district", x: 808.3, y: 499.8 },
  { index: 106, landId: "car-district", x: 727.9, y: 1015.6 },
  { index: 107, landId: "car-district", x: 433.4, y: 667.7 },
  { index: 108, landId: "car-district", x: 422.9, y: 927.1 },
  { index: 109, landId: "car-district", x: 926.3, y: 894.0 },
  { index: 110, landId: "car-district", x: 296.3, y: 581.4 },
  { index: 111, landId: "car-district", x: 600.9, y: 928.3 },
  { index: 112, landId: "car-district", x: 519.6, y: 551.8 },
  { index: 113, landId: "car-district", x: 702.5, y: 440.7 },
  { index: 114, landId: "car-district", x: 1052.9, y: 896.8 },
  { index: 115, landId: "car-district", x: 459.7, y: 431.6 },
  { index: 116, landId: "car-district", x: 857.9, y: 994.8 },
  { index: 117, landId: "car-district", x: 330.4, y: 852.4 },
  { index: 118, landId: "car-district", x: 632.0, y: 640.7 },
  { index: 119, landId: "car-district", x: 897.4, y: 400.2 },
  { index: 120, landId: "creative-zone", x: 958.3, y: 518.8 },
  { index: 121, landId: "creative-zone", x: 854.9, y: 856.5 },
  { index: 122, landId: "creative-zone", x: 462.2, y: 978.7 },
  { index: 123, landId: "creative-zone", x: 812.8, y: 400.6 },
  { index: 124, landId: "creative-zone", x: 787.8, y: 532.4 },
  { index: 125, landId: "creative-zone", x: 313.7, y: 727.6 },
  { index: 126, landId: "creative-zone", x: 663.5, y: 1042.7 },
  { index: 127, landId: "creative-zone", x: 792.8, y: 1043.7 },
  { index: 128, landId: "creative-zone", x: 670.2, y: 339.8 },
  { index: 129, landId: "creative-zone", x: 686.8, y: 815.6 },
  { index: 130, landId: "creative-zone", x: 435.6, y: 652.4 },
  { index: 131, landId: "creative-zone", x: 943.6, y: 734.3 },
  { index: 132, landId: "creative-zone", x: 644.7, y: 540.7 },
  { index: 133, landId: "creative-zone", x: 555.6, y: 752.6 },
  { index: 134, landId: "creative-zone", x: 975.1, y: 879.2 },
  { index: 135, landId: "creative-zone", x: 516.4, y: 440.9 },
  { index: 136, landId: "creative-zone", x: 471.0, y: 846.7 },
  { index: 137, landId: "creative-zone", x: 825.3, y: 701.1 },
  { index: 138, landId: "creative-zone", x: 1080.3, y: 734.9 },
  { index: 139, landId: "creative-zone", x: 1077.1, y: 604.4 },
  { index: 140, landId: "entertainment", x: 966.8, y: 730.0 },
  { index: 141, landId: "entertainment", x: 723.0, y: 572.6 },
  { index: 142, landId: "entertainment", x: 721.2, y: 833.5 },
  { index: 143, landId: "entertainment", x: 661.2, y: 991.3 },
  { index: 144, landId: "entertainment", x: 918.0, y: 590.6 },
  { index: 145, landId: "entertainment", x: 843.5, y: 835.2 },
  { index: 146, landId: "entertainment", x: 831.6, y: 674.5 },
  { index: 147, landId: "entertainment", x: 403.0, y: 566.6 },
  { index: 148, landId: "entertainment", x: 1003.9, y: 867.2 },
  { index: 149, landId: "entertainment", x: 795.1, y: 1066.6 },
  { index: 150, landId: "entertainment", x: 963.0, y: 978.2 },
  { index: 151, landId: "entertainment", x: 686.3, y: 411.1 },
  { index: 152, landId: "entertainment", x: 597.4, y: 326.2 },
  { index: 153, landId: "entertainment", x: 666.7, y: 701.1 },
  { index: 154, landId: "entertainment", x: 414.9, y: 779.0 },
  { index: 155, landId: "entertainment", x: 548.8, y: 793.7 },
  { index: 156, landId: "entertainment", x: 908.2, y: 369.0 },
  { index: 157, landId: "entertainment", x: 437.1, y: 436.6 },
  { index: 158, landId: "entertainment", x: 989.5, y: 496.2 },
  { index: 159, landId: "entertainment", x: 459.9, y: 928.8 },
];

export function plotById(index: number): LandPlot | undefined {
  return LAND_PLOTS.find((p) => p.index === index);
}

export function plotsForLand(landId: string): LandPlot[] {
  return LAND_PLOTS.filter((p) => p.landId === landId);
}

// Rein dekorative Landschafts-Textur (kleine, transparente Kopien des
// Land-Icons als Terrain-Deko) — macht die großen Land-Karten "detailreicher",
// ohne dass es interaktive Elemente sind.
export type TexturePoint = { landId: string; x: number; y: number };

export const LAND_TEXTURE: TexturePoint[] = [
  { landId: "gaming-lands", x: 632.0, y: 808.7 },
  { landId: "gaming-lands", x: 396.1, y: 561.2 },
  { landId: "gaming-lands", x: 403.2, y: 883.0 },
  { landId: "gaming-lands", x: 833.9, y: 360.5 },
  { landId: "gaming-lands", x: 829.7, y: 682.3 },
  { landId: "gaming-lands", x: 930.0, y: 640.7 },
  { landId: "gaming-lands", x: 730.0, y: 706.6 },
  { landId: "gaming-lands", x: 874.1, y: 797.5 },
  { landId: "gaming-lands", x: 398.9, y: 1016.6 },
  { landId: "gaming-lands", x: 455.0, y: 744.8 },
  { landId: "gaming-lands", x: 563.1, y: 600.1 },
  { landId: "gaming-lands", x: 925.6, y: 411.5 },
  { landId: "tech-valley", x: 1081.0, y: 905.0 },
  { landId: "tech-valley", x: 516.2, y: 1075.2 },
  { landId: "tech-valley", x: 691.5, y: 457.7 },
  { landId: "tech-valley", x: 776.0, y: 304.5 },
  { landId: "tech-valley", x: 288.4, y: 599.0 },
  { landId: "tech-valley", x: 542.1, y: 803.5 },
  { landId: "tech-valley", x: 729.3, y: 1063.4 },
  { landId: "tech-valley", x: 799.0, y: 993.6 },
  { landId: "tech-valley", x: 803.1, y: 556.6 },
  { landId: "tech-valley", x: 728.8, y: 718.1 },
  { landId: "tech-valley", x: 722.2, y: 940.6 },
  { landId: "tech-valley", x: 842.2, y: 389.4 },
  { landId: "roleplay-realm", x: 846.9, y: 652.3 },
  { landId: "roleplay-realm", x: 568.6, y: 908.1 },
  { landId: "roleplay-realm", x: 608.7, y: 681.0 },
  { landId: "roleplay-realm", x: 580.6, y: 1102.7 },
  { landId: "roleplay-realm", x: 706.0, y: 1027.1 },
  { landId: "roleplay-realm", x: 716.4, y: 699.3 },
  { landId: "roleplay-realm", x: 261.6, y: 584.8 },
  { landId: "roleplay-realm", x: 438.7, y: 944.9 },
  { landId: "roleplay-realm", x: 444.6, y: 546.0 },
  { landId: "roleplay-realm", x: 719.0, y: 922.2 },
  { landId: "roleplay-realm", x: 666.7, y: 440.3 },
  { landId: "roleplay-realm", x: 748.2, y: 553.0 },
  { landId: "music-island", x: 806.2, y: 901.4 },
  { landId: "music-island", x: 437.6, y: 383.0 },
  { landId: "music-island", x: 859.9, y: 530.5 },
  { landId: "music-island", x: 776.2, y: 591.8 },
  { landId: "music-island", x: 610.3, y: 485.2 },
  { landId: "music-island", x: 799.4, y: 996.7 },
  { landId: "music-island", x: 1078.2, y: 766.0 },
  { landId: "music-island", x: 400.1, y: 691.1 },
  { landId: "music-island", x: 935.8, y: 923.4 },
  { landId: "music-island", x: 614.8, y: 602.6 },
  { landId: "music-island", x: 503.2, y: 545.0 },
  { landId: "music-island", x: 601.4, y: 726.4 },
  { landId: "esports-arena", x: 556.3, y: 401.1 },
  { landId: "esports-arena", x: 859.1, y: 777.6 },
  { landId: "esports-arena", x: 1044.9, y: 768.9 },
  { landId: "esports-arena", x: 796.5, y: 1098.9 },
  { landId: "esports-arena", x: 571.3, y: 594.1 },
  { landId: "esports-arena", x: 784.6, y: 688.3 },
  { landId: "esports-arena", x: 428.0, y: 461.0 },
  { landId: "esports-arena", x: 820.6, y: 332.6 },
  { landId: "esports-arena", x: 461.1, y: 641.9 },
  { landId: "esports-arena", x: 650.7, y: 806.4 },
  { landId: "esports-arena", x: 502.3, y: 1041.1 },
  { landId: "esports-arena", x: 776.8, y: 870.5 },
  { landId: "car-district", x: 711.7, y: 928.0 },
  { landId: "car-district", x: 1036.7, y: 694.0 },
  { landId: "car-district", x: 439.6, y: 1032.6 },
  { landId: "car-district", x: 570.6, y: 819.3 },
  { landId: "car-district", x: 864.7, y: 550.8 },
  { landId: "car-district", x: 980.0, y: 864.2 },
  { landId: "car-district", x: 614.2, y: 992.6 },
  { landId: "car-district", x: 1110.4, y: 638.0 },
  { landId: "car-district", x: 888.4, y: 1048.8 },
  { landId: "car-district", x: 656.4, y: 742.3 },
  { landId: "car-district", x: 362.3, y: 768.6 },
  { landId: "car-district", x: 385.3, y: 602.1 },
  { landId: "creative-zone", x: 571.3, y: 335.0 },
  { landId: "creative-zone", x: 792.6, y: 972.7 },
  { landId: "creative-zone", x: 894.3, y: 966.7 },
  { landId: "creative-zone", x: 1022.1, y: 786.0 },
  { landId: "creative-zone", x: 385.9, y: 971.5 },
  { landId: "creative-zone", x: 755.0, y: 319.0 },
  { landId: "creative-zone", x: 309.8, y: 777.2 },
  { landId: "creative-zone", x: 555.3, y: 764.5 },
  { landId: "creative-zone", x: 993.5, y: 963.4 },
  { landId: "creative-zone", x: 544.5, y: 1078.5 },
  { landId: "creative-zone", x: 700.4, y: 891.0 },
  { landId: "creative-zone", x: 846.6, y: 420.2 },
  { landId: "entertainment", x: 471.1, y: 1016.1 },
  { landId: "entertainment", x: 530.8, y: 335.8 },
  { landId: "entertainment", x: 957.8, y: 671.6 },
  { landId: "entertainment", x: 942.1, y: 469.5 },
  { landId: "entertainment", x: 752.8, y: 1019.5 },
  { landId: "entertainment", x: 751.3, y: 683.1 },
  { landId: "entertainment", x: 1039.6, y: 960.0 },
  { landId: "entertainment", x: 595.2, y: 563.4 },
  { landId: "entertainment", x: 442.8, y: 889.7 },
  { landId: "entertainment", x: 660.9, y: 282.9 },
  { landId: "entertainment", x: 1073.5, y: 748.1 },
  { landId: "entertainment", x: 951.8, y: 910.1 },
];

// Schwach sichtbare "Straßen" zwischen benachbarten Plätzen (Paare von
// LAND_PLOTS.index) — rein dekorativ, gibt den Land-Karten das Gefühl eines
// vernetzten Siedlungsgebiets statt lose verstreuter Punkte.
export const LAND_ROADS: [number, number][] = [
  [0, 14], [0, 7], [1, 8], [1, 0], [2, 19], [2, 18], [3, 16], [3, 14],
  [4, 16], [4, 15], [5, 17], [5, 16], [6, 17], [6, 11], [7, 12], [8, 14],
  [9, 11], [9, 5], [10, 12], [10, 2], [11, 17], [13, 8], [13, 9], [15, 19],
  [16, 17], [18, 19], [20, 39], [20, 25], [21, 22], [21, 30], [22, 26],
  [23, 38], [23, 35], [24, 36], [24, 29], [25, 39], [26, 20], [27, 37],
  [27, 38], [28, 34], [28, 36], [29, 34], [30, 35], [30, 31], [31, 34],
  [32, 20], [32, 26], [33, 39], [33, 37], [34, 35], [36, 29], [40, 45],
  [40, 51], [41, 55], [41, 53], [42, 46], [42, 58], [43, 46], [43, 50],
  [44, 56], [44, 53], [45, 51], [47, 49], [47, 45], [48, 52], [48, 50],
  [49, 56], [50, 52], [51, 55], [51, 59], [53, 56], [54, 58], [54, 41],
  [55, 59], [57, 49], [57, 48], [60, 65], [60, 63], [61, 72], [61, 66],
  [62, 70], [62, 79], [63, 72], [64, 77], [64, 79], [65, 78], [66, 76],
  [66, 72], [67, 68], [67, 65], [68, 76], [69, 75], [69, 79], [70, 78],
  [71, 74], [71, 62], [73, 78], [73, 74], [75, 79], [77, 61], [80, 96],
  [80, 83], [81, 93], [81, 94], [82, 89], [82, 87], [83, 89], [84, 99],
  [84, 95], [85, 91], [85, 90], [86, 95], [86, 88], [87, 99], [88, 95],
  [88, 89], [90, 87], [91, 98], [91, 97], [92, 96], [92, 94], [93, 91],
  [94, 93], [97, 98], [99, 82], [100, 104], [100, 106], [101, 113],
  [101, 115], [102, 103], [102, 114], [103, 119], [104, 118], [105, 113],
  [105, 119], [106, 116], [106, 111], [107, 112], [107, 110], [108, 117],
  [108, 111], [109, 116], [109, 114], [110, 115], [111, 100], [112, 115],
  [112, 118], [117, 107], [120, 139], [120, 124], [121, 134], [121, 131],
  [122, 136], [122, 126], [123, 124], [123, 128], [124, 132], [125, 130],
  [125, 136], [126, 127], [127, 121], [128, 135], [129, 133], [129, 121],
  [130, 133], [131, 137], [131, 138], [132, 135], [133, 136], [134, 131],
  [137, 121], [138, 139], [140, 148], [140, 146], [141, 153], [141, 146],
  [142, 145], [142, 153], [143, 149], [143, 142], [144, 158], [144, 146],
  [145, 146], [147, 157], [147, 154], [148, 150], [149, 150], [150, 145],
  [151, 152], [151, 141], [152, 157], [154, 155], [154, 159], [155, 153],
  [156, 158], [156, 144], [159, 155],
];

export function textureForLand(landId: string): TexturePoint[] {
  return LAND_TEXTURE.filter((t) => t.landId === landId);
}

export function roadsForLand(landId: string): [number, number][] {
  const indexes = new Set(plotsForLand(landId).map((p) => p.index));
  return LAND_ROADS.filter(([a, b]) => indexes.has(a) && indexes.has(b));
}
