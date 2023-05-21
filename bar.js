// 文字排列

const formatter = (params) => {
  // params为x轴文字内容
  var newParamsName = "";
  var paramsNameNumber = params.length;
  var provideNumber = 1; //一行显示几个字
  var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
  if (paramsNameNumber > provideNumber) {
    for (var p = 0; p < rowNumber; p++) {
      var tempStr = "";
      var start = p * provideNumber;
      var end = start + provideNumber;
      if (p == rowNumber - 1) {
        tempStr = params.substring(start, paramsNameNumber);
      } else {
        tempStr = params.substring(start, end) + "\n";
      }
      newParamsName += tempStr;
    }
  } else {
    newParamsName = params;
  }
  return newParamsName;
};

const renderBar = (data) => {
  const { xData, yData, zData, dimension } = data;
  const barDom = document.getElementById("bar");
  const barChart = echarts.init(barDom);

  const barOptions = {
    tooltip: {
      show: false,
    },
    visualMap: {
      show: false, // 关闭颜色条选择器
      max: 20,
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
    xAxis3D: {
      name: "",
      type: "category",
      data: xData,
      splitLine: {
        show: false, // 取消 轴平面网格线展示
      },
      axisLabel: {
        interval: 0, // 设置刻度标签的显示间隔为 0，即每个刻度都显示
        // 此为关键点
        formatter,
      },
    },
    yAxis3D: {
      name: "",
      type: "category",
      data: yData,
      splitLine: {
        show: false, // 取消 轴平面网格线展示
      },
      axisLabel: {
        interval: 0, // 设置刻度标签的显示间隔为 0，即每个刻度都显示
        rotate: -90, // 可选：如果省份名称较长，你可以设置刻度标签的旋转角度，以便更好地展示
      },
    },
    zAxis3D: {
      name: dimension,
      type: "value",
    },
    grid3D: {
      boxWidth: 300,
      boxDepth: 120,
      left: "10%",
      top: "10%",
      width: "90%",
      height: "90%",
      light: {
        main: {
          intensity: 1.2,
          shadow: true, // 阴影
        },
        ambient: {
          intensity: 0,
        },
      },
      viewControl: {
        // 视角控制
      },
    },
    series: [
      {
        type: "bar3D",
        data: zData.map((item) => {
          return {
            value: [item[0], item[1], item[2]],
          };
        }),
        shading: "lambert",
        label: {
          show: false,
          fontSize: 10,
          borderWidth: 1,
        },
        itemStyle: {
          opacity: 1,
        },
        emphasis: {
          label: {
            fontSize: 20,
            color: "#900",
          },
          itemStyle: {
            color: "#900",
          },
        },
      },
    ],
  };

  barOptions && barChart.setOption(barOptions);
};

export default renderBar;
