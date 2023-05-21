const renderMap = (data) => {
  const { mapData, nameMap, dimension } = data;

  const chartDom = document.getElementById("map");
  const mapChart = echarts.init(chartDom);
  let mapOptions;

  mapChart.showLoading();

  fetch("./china.json")
    .then((response) => response.json())
    .then((geoJson) => {
      mapChart.hideLoading();
      echarts.registerMap("CN", geoJson);
      mapChart.setOption(
        (mapOptions = {
          title: {
            text: "",
            subtext: "",
            sublink: "",
          },
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
            show: "false",
            min: 800,
            max: 50000,
            text: ["High", "Low"],
            realtime: false,
            calculable: true,
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
                show: true,
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
