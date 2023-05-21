import renderBar from "./bar.js";
import renderMap from "./map.js";

// 常量定义
const SHEETNAME = "分地区综合（2012-2021）"; // 获取的sheet 名称

// 导入数据转换
const fileInput = document.querySelector("#excelFileInput");

// 选择框
const barDimensionSelect = document.querySelector("#barDimensionSelect");

const mapDimensionSelect = document.querySelector("#mapDimensionSelect");

const mapDateSelect = document.querySelector("#mapDateSelect");

fileInput.addEventListener("change", (e) => {
  let file = fileInput.files[0];

  let reader = new FileReader();
  reader.onload = function (e) {
    let data = new Uint8Array(e.target.result);
    let workbook = XLSX.read(data, { type: "array" });

    let worksheet = workbook.Sheets[SHEETNAME];

    let jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData); // 打印Excel数据，可以根据需要进行进一步处理

    // 数据处理

    //1. 获取地区枚举去重
    const areaData = [...new Set(jsonData.map((v) => v.__EMPTY_1))];
    console.log(areaData, "areaData");

    //2. 获取年份枚举去重
    const dateData = [...new Set(jsonData.map((v) => v.__EMPTY))];
    console.log(dateData, "dateData");

    // 3. 获取维度
    const dimensionData = Object.keys(jsonData[0]).filter(
      (v) => !["__EMPTY", "__EMPTY_1"].includes(v)
    );
    console.log(dimensionData, "dimensionData");

    let mapDate = dateData[0];
    let mapDimension = dimensionData[0];
    let barDimension = dimensionData[0];

    //4. 生成柱状图
    createOption(barDimensionSelect, dimensionData);
    barDimensionSelect.addEventListener("change", function () {
      barDimension = barDimensionSelect.value;
      renderBar(transformBarData(jsonData, areaData, dateData, barDimension));
    });

    //5. 生成区域图
    // 时间
    createOption(mapDateSelect, dateData);
    mapDateSelect.addEventListener("change", function () {
      mapDate = mapDateSelect.value;
      console.log(mapDateSelect.value, "change date");
      renderMap(transformMapData(jsonData, areaData, mapDate, mapDimension));
    });
    // 维度
    createOption(mapDimensionSelect, dimensionData);
    mapDimensionSelect.addEventListener("change", function () {
      mapDimension = mapDimensionSelect.value;
      renderMap(transformMapData(jsonData, areaData, mapDate, mapDimension));
    });

    // 手动触发一次change事件
    barDimensionSelect.dispatchEvent(new Event("change"));
    mapDateSelect.dispatchEvent(new Event("change"));
    mapDimensionSelect.dispatchEvent(new Event("change"));
  };
  reader.readAsArrayBuffer(file);
});

//1. 转换柱状图所需数据

const transformBarData = (data, areaData, dateData, dimension) => {
  let zData = null;

  // 设置z轴 格式化数据生成一个二维数组 [[x,y,z]]
  zData = data.map((v) => {
    return [
      areaData.indexOf(v.__EMPTY_1),
      dateData.indexOf(v.__EMPTY),
      v[dimension],
    ];
  });
  console.log(zData, "zData");

  return { xData: areaData, yData: dateData, zData, dimension };
};

// 2. 转换坐标系地图所需数据

const transformMapData = (data, areaData, year, dimension) => {
  let nameMap = {};
  let mapData = [];
  const municipalityList = ["北京", "天津", "上海", "重庆"];
  const regionMap = {
    新疆: "新疆维吾尔自治区",
    内蒙古: "内蒙古自治区",
    西藏: "西藏自治区",
    宁夏: "宁夏回族自治区",
    广西: "广西壮族自治区",
    香港: "香港特别行政区",
    澳门: "澳门特别行政区",
  };
  areaData.forEach((area) => {
    const region = regionMap[area];
    const municipality = municipalityList.find((v) => v === area);
    if (region) {
      nameMap[region] = area;
    }
    nameMap[`${area}${municipality ? "市" : "省"}`] = area; // 设置名称映射,消除差异
  });

  data.forEach((item) => {
    if (item.__EMPTY == year)
      mapData.push({ name: item.__EMPTY_1, value: item[dimension] });
  });
  console.log(mapData, "mapData");

  return { mapData, nameMap, dimension };
};

// 3. 生成 options
const createOption = (selectDom, data) => {
  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.text = item;
    selectDom.appendChild(option);
  });
};
