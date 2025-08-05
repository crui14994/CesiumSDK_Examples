/**根据矢量切片单独配置不同类型地类的颜色 */
const getFillColor = () => {
  //  耕地（颜色：255,255,0）
  // 	所含类型：水田0101、水浇地0102、旱地0103
  let plough = ['0101', '0102', '0103'];
  // 园地（颜色：255,0,127）
  // 	所含类型：果园0201(k)、茶园0202、其他园地0204(k)
  let garden = ['0201', '0201k', '0202', '0204', '0204k'];
  // 林地（颜色：0, 127, 0）
  // 所含类型：乔木林地0301(k)、竹林地0302(k)、灌木林地0305、其他林地0307
  let woodland = ['0301', '0301k', '0305', '0307', '0302', '0302k'];
  // 建设用地（颜色：165,0,0）
  // 所含类型：商业服务业设施用地05H1、物流仓储用地0508、工业用地0601、采矿用地0602、
  // 城镇	住宅用地0701、农村宅基地0702、机关团体新闻出版社用地08H1、科教文卫用地08H2(a)、公共设施用地0809、
  // 公园与绿地0810、特殊用地09、铁路用地1001、轨道交通用地1002、公路用地1003、城镇村道路用地1004、
  // 交通服务场站用地1005、机场用地1007、港口码头用地1008、水工建筑用地1109、空闲地1201
  let constructionLand = [
    '05H1',
    '0508',
    '0601',
    '0602',
    '0701',
    '0702',
    '08H1',
    '08H2',
    '08H2a',
    '0809',
    '0810',
    '09',
    '1001',
    '1002',
    '1003',
    '1004',
    '1005',
    '1007',
    '1008',
    '1109',
    '1201',
  ];

  let FillColor = ['match', ['get', 'DLBM']];
  [plough, garden, woodland, constructionLand].forEach((pItem, pIndex) => {
    pItem.forEach(item => {
      switch (pIndex) {
        case 0:
          FillColor.push(...[item, 'rgba(255,255,0,1)']);
          break;
        case 1:
          FillColor.push(...[item, 'rgba(255,0,127,1)']);
          break;
        case 2:
          FillColor.push(...[item, 'rgba(0,127,0,1)']);
          break;
        case 3:
          FillColor.push(...[item, 'rgba(165,0,0,1)']);
          break;
      }
    });
  });
  // 基本农田（颜色：248,221,134）
  FillColor.push('rgba(248,221,134,1)');
  return FillColor;
};

export const exampleStyle = {
  version: 8,
  sources: {
    pengshan: {
      type: 'vector',
      tiles: ['http://192.168.10.18:8082/cesium/zhny-tzz-service/web/dks/xyz/{x}/{y}/{z}.pbf'],
      minzoom: 12,
      maxzoom: 16,
    },
  },
  layers: [
    {
      id: 'polygons',
      source: 'pengshan',
      'source-layer': 'polygons',
      type: 'fill',
      paint: {
        'fill-color': getFillColor(),
        'fill-opacity': 1,
        // "fill-outline-color": "rgba(19, 129, 187, 1)"
      },
    },
  ],
};

// export const exampleStyle = {
//   version: 8,
//   sources: {
//     ksdq_tdql: {
//       type: "vector",
//       tiles: ["https://tiles.stadiamaps.com/data/openmaptiles/{z}/{x}/{y}.pbf?api_key=e296edff-4d3c-47ed-8a36-3128af55b57e"],
//       maxzoom: 8,
//     },
//   },
//   layers: [
//     {
//       "id": "water",
//       "source": "ksdq_tdql",
//       "source-layer": "water",
//       "type": "fill",
//       "paint": {
//         "fill-color": "#06405C",
//         "fill-opacity": 1,
//         "fill-outline-color": "rgba(19, 129, 187, 1)"
//       }
//     }
//   ],

// };
