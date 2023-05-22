const renderMap = (data) => {
  const { mapData, nameMap, dimension } = data;

  const chartDom = document.getElementById("map");
  const mapChart = echarts.init(chartDom);
  let mapOptions;

  // 获取 value, 来设置最大值和最小值
  const valueList = mapData.map((v) => v.value);
  const max = Math.max(...valueList);
  const min = Math.min(...valueList);
  console.log("最大值:", max); // 输出：最大值: 9
  console.log("最小值:", min); // 输出：最小值: 1

  mapChart.showLoading();

  fetch("./china.json")
    .then((response) => response.json())
    .then((geoJson) => {
      mapChart.hideLoading();
      echarts.registerMap("CN", geoJson);
      mapChart.setOption(
        (mapOptions = {
          title: {},
          tooltip: {
            trigger: "item",
          },
          toolbox: {
            show: false,
            orient: "vertical",
            left: "right",
            top: "center",
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {},
            },
          },
          visualMap: {
            show: false,
            min,
            max,
            inRange: {
              color: [
                "#cdebd3",
                "#8fd8a8",
                "#4dbd7f",
                "#2c995e",
                "#1a773e",
                "#11572d",
              ],
            },
          },
          series: [
            {
              name: dimension,
              type: "map",
              map: "CN",
              label: {
                show: false,
              },
              data: mapData,
              // 自定义名称映射
              nameMap,
            },
          ],
        })
      );
    })
    .catch((error) => {
      console.error("加载中国地图数据失败:", error);
    });

  if (mapOptions) {
    mapChart.setOption(mapOptions);
  }
};

export default renderMap;
