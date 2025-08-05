/*
 * @Author:
 * @Date: 2022-02-16 16:04:03
 * @LastEditTime: 2025-01-03 17:45:53
 * @LastEditors: caorui 778943319@qq.com
 * @Description:
 */
import { getContext } from '../context';

class BaseFn {
  constructor() {
    const { viewer } = getContext();
    this.viewer = viewer;
  }

  /**空间点位数组距离计算函数 */
  getSpaceDistance(positions) {
    var distance = 0;
    for (var i = 0; i < positions.length - 1; i++) {
      var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
      var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
      /**根据经纬度计算出距离**/
      var geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      var s = geodesic.surfaceDistance;
      //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
      //返回两点之间的距离
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
      distance = distance + s;
    }
    return distance.toFixed(2);
  }

  /**计算多边形面积 */
  getArea(points) {
    var radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
    var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度
    var res = 0;
    //拆分三角曲面
    for (var i = 0; i < points.length - 2; i++) {
      var j = (i + 1) % points.length;
      var k = (i + 2) % points.length;
      var totalAngle = Angle(points[i], points[j], points[k]);

      var dis_temp1 = this.getSpaceDistance([points[i], points[j]]);
      var dis_temp2 = this.getSpaceDistance([points[j], points[k]]);
      res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
      // console.log(res);
    }
    return (res / 1000000.0).toFixed(4);

    /*角度*/
    function Angle(p1, p2, p3) {
      var bearing21 = Bearing(p2, p1);
      var bearing23 = Bearing(p2, p3);
      var angle = bearing21 - bearing23;
      if (angle < 0) {
        angle += 360;
      }

      return angle;
    }
    /*方向*/
    function Bearing(from, to) {
      var lat1 = c(from).lat * radiansPerDegree;
      var lon1 = c(from).lng * radiansPerDegree;
      var lat2 = c(to).lat * radiansPerDegree;
      var lon2 = c(to).lng * radiansPerDegree;
      var angle = -Math.atan2(
        Math.sin(lon1 - lon2) * Math.cos(lat2),
        Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
      );
      if (angle < 0) {
        angle += Math.PI * 2.0;
      }
      angle = angle * degreesPerRadian; //角度
      return angle;
    }

    /**cartesian 转经纬度 */
    function c(cartesian) {
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      var heightString = cartographic.height;
      return {
        lng: longitudeString,
        lat: latitudeString,
        hei: heightString,
      };
    }
  }

  /**根据多个坐标点,计算中心点坐标 */
  getPointsCenter(pointsArr) {
    let points = [];
    pointsArr.forEach((item) => {
      points.push(`${item[1]},${item[0]}`);
    });
    var point_num = points.length; //坐标点个数
    var X = 0,
      Y = 0,
      Z = 0;
    for (let i = 0; i < points.length; i++) {
      if (points[i] == '') {
        continue;
      }
      let point = points[i].split(',');
      var lat, lng, x, y, z;
      lat = (parseFloat(point[0]) * Math.PI) / 180;
      lng = (parseFloat(point[1]) * Math.PI) / 180;
      x = Math.cos(lat) * Math.cos(lng);
      y = Math.cos(lat) * Math.sin(lng);
      z = Math.sin(lat);
      X += x;
      Y += y;
      Z += z;
    }
    X = X / point_num;
    Y = Y / point_num;
    Z = Z / point_num;

    var tmp_lng = Math.atan2(Y, X);
    var tmp_lat = Math.atan2(Z, Math.sqrt(X * X + Y * Y));

    return { lat: (tmp_lat * 180) / Math.PI, lng: (tmp_lng * 180) / Math.PI };
  }

  /**使用canvas根据图片和文字绘制图片
   * @param icon 图片地址，可以是url及base64 或者require引入的图片
   * @param text 文本内容
   * @param imgConfig 其它配置
   */
  canvasToImage(icon, text, imgConfig) {
    return new Promise((resolve, reject) => {
      let config = {
        iconWidth: 152,
        iconHeight: 152,
        txtColor: '#fff',
        txtFontSize: '16px',
        ...imgConfig,
      };

      const canvas = document.createElement('canvas');
      var cxt = canvas.getContext('2d');
      var img = new Image();
      canvas.width = config.iconWidth;
      canvas.height = config.iconHeight;
      img.src = icon;
      img.onload = () => {
        // 画图(这里画布与图片等宽高)
        cxt.drawImage(img, 0, 0);
        // 设置字体大小
        cxt.font = `400 ${config.txtFontSize}px Microsoft YaHei`;
        // 更改字号后，必须重置对齐方式，否则居中麻烦。设置文本的垂直对齐方式
        cxt.textBaseline = 'middle';
        cxt.textAlign = 'center';
        // 距离左边的位置
        var left = config.txtLeft || canvas.width / 2;
        // 距离上边的位置 (图片高-文字距离图片底部的距离)
        var top = config.txtTop || canvas.height / 2 + 3;
        // 文字颜色
        cxt.fillStyle = config.txtColor;
        // 文字在画布的位置
        cxt.fillText(text, left, top);
        img.src = canvas.toDataURL('image/png');

        resolve(img);
      };
    });
  }

  /**计算一个84数组的最大经纬度和最小经纬度并生成rectangle范围
   * @param wgs84Arr 84坐标数组
   * @param extended Rectangle对象需要扩大的值。值越大显示的Rectangle范围越大
   * @param callback 回调函数，返回最大经纬度和最小经纬度 和Cesium.Rectangle对象
   */
  computedRectangle(wgs84Arr, callback, extended = 0.0005) {
    let maxLng, minLng, maxLat, minLat;
    let lngArr = wgs84Arr.map((i) => Number(i.lng));
    let latArr = wgs84Arr.map((i) => Number(i.lat));

    maxLng = Math.max.apply(null, lngArr);
    minLng = Math.min.apply(null, lngArr);
    maxLat = Math.max.apply(null, latArr);
    minLat = Math.min.apply(null, latArr);

    var rectangle = new Cesium.Rectangle.fromDegrees(
      minLng - extended,
      minLat - extended,
      maxLng + extended,
      maxLat + extended
    );
    callback({ maxLng, minLng, maxLat, minLat }, rectangle);
  }

  /**
   * 根据两个坐标点,获取Pitch(仰角)
   * @param { Cesium.Cartesian3 } pointA
   * @param { Cesium.Cartesian3 } pointB
   * @returns
   */
  getPitch(pointA, pointB) {
    let transfrom = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
    const vector = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
    let direction = Cesium.Matrix4.multiplyByPointAsVector(
      Cesium.Matrix4.inverse(transfrom, transfrom),
      vector,
      vector
    );
    Cesium.Cartesian3.normalize(direction, direction);
    //因为direction已归一化，斜边长度等于1，所以余弦函数等于direction.z
    let pitch = Cesium.Math.PI_OVER_TWO - Cesium.Math.acosClamped(direction.z);
    return Cesium.Math.toDegrees(pitch);
  }

  /**根据两个坐标点,获取Heading(朝向)
   * @param { Cesium.Cartesian3 } pointA
   * @param { Cesium.Cartesian3 } pointB
   * @returns
   */
  getCartesian3Heading(pointA, pointB) {
    // 将点A视为原点，建立东-北-上坐标系
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
    // 计算点A到点B的向量
    const positionVector = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
    // 将向量从世界坐标系统转换到以点A为原点的坐标系统
    const vector = Cesium.Matrix4.multiplyByPointAsVector(
      Cesium.Matrix4.inverse(transform, new Cesium.Matrix4()),
      positionVector,
      new Cesium.Cartesian3()
    );
    // 归一化方向向量
    const direction = Cesium.Cartesian3.normalize(vector, new Cesium.Cartesian3());
    // 计算偏航角
    let heading = Math.atan2(direction.y, direction.x) - Cesium.Math.PI_OVER_TWO;
    heading = Cesium.Math.TWO_PI - Cesium.Math.zeroToTwoPi(heading);
    heading = Cesium.Math.toDegrees(heading);
    // 确保偏航角在0到360度范围内
    heading = (heading + 360) % 360;
    return heading;
  }

  /** 根据两个坐标点,获取Heading(朝向)
   * @param { wgs_84 } pointA
   * @param { wgs_84 } pointB
   * @returns
   */
  getWGS84Heading(pointA, pointB) {
    // 将经纬度转换为弧度
    const lat1Rad = Cesium.Math.toRadians(pointA.lat);
    const lat2Rad = Cesium.Math.toRadians(pointB.lat);
    const deltaLon = Cesium.Math.toRadians(pointB.lng - pointA.lng);
    // 计算偏航角
    const y = Math.sin(deltaLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon);
    let heading = Math.atan2(y, x);
    // 将偏航角转换为度
    heading = Cesium.Math.toDegrees(heading);
    // 确保偏航角在0到360度范围内
    heading = (heading + 360) % 360;
    return heading;
  }
}
export default BaseFn;
