import renderBar from "./bar.js";
import renderMap from "./map.js";

// 导入数据转换
const fileInput = document.querySelector("#excelFileInput");
fileInput.addEventListener("change", (e) => {
  var file = fileInput.files[0];

  var reader = new FileReader();
  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: "array" });

    const SHEETNAME = "分地区综合（2012-2021）";
    // var sheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[SHEETNAME];

    var jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData); // 打印Excel数据，可以根据需要进行进一步处理

    // 柱状图
    const barData = transformBarData(jsonData);
    renderBar(barData);
  };
  reader.readAsArrayBuffer(file);
});

//1. 转换柱状图所需数据

const transformBarData = (data) => {
  let xData = null;
  let yData = null;
  let zData = null;

  const zLabelName = "人力资本（平均受教育年限）";

  //设置x轴 获取地区枚举去重
  xData = [...new Set(data.map((v) => v.__EMPTY_1))];
  console.log(xData, "xData");

  //设置y轴 获取年份去重
  yData = [...new Set(data.map((v) => v.__EMPTY))];
  console.log(yData, "yData");

  // 设置z轴 格式化数据生成一个二维数组 [[x,y,z]]
  zData = data.map((v) => {
    return [
      xData.indexOf(v.__EMPTY_1),
      yData.indexOf(v.__EMPTY),
      v[zLabelName],
    ];
  });
  console.log(zData, "zData");

  return { xData, yData, zData, zLabelName };
};

// 2. 转换坐标系地图所需数据

const transformMapData = (data) => {};
