<!--
 * @Author: caorui 778943319@qq.com
 * @Date: 2024-12-25 11:05:21
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2024-12-25 15:19:56
 * @FilePath: \cesium-plugins-fn\src\CesiumSDK\src\modules\Material\README.md
 * @Description:
 *
-->

### Cesium 自定义 MaterialProperty 简单说明

参考

[Cesium 自定义 MaterialProperty 原理解析](https://blog.csdn.net/hongxianqiang/article/details/141435837)

#### Property 类

Property 类是所有属性的抽象接口类，它将属性和时间关联起来，可以动态获取或者设置属性的值

- isConstant 用来判断该属性是否会随时间变化，是一个布尔值。Cesium 会通过这个变量来决定是否需要在场景更新的每一帧中都获取该属性的数值，从而来更新三维场景中的物体。如果 isConstant 为 true，则只会获取一次数值，除非 definitionChanged 事件被触发。

- definitionChanged 是一个事件，可以通过该事件，来监听该 Property 自身所发生的变化，比如数值发生修改。（注意：自定义材质必须要设置此属性，否则不会触发 getValue 和 equals 方法影响材质的效果的创建）

- getValue 用来获取某个时间点的特定属性值。它有两个参数：第一个是 time，用来传递一个时间点；第二个是 result，用来存储属性值。改方法在渲染每一帧时都会调用。

- equals 用来检测属性值是否相等。如果相等，就不会重复创建该属性。

#### MaterialProperty 类

- getType MaterialProperty 是用来专门表示材质的 Property，继承自 Property 类，增加了 getType 方法，用来获取材质类型。在渲染场景时，Cesium 内部通过调用该方法，查找内存中的材质 shader，作用于使用该材质的图元。

#### 创建材质参数说明 以 color 为例

在 constructor 定义 this.\_color 和 this.color 俩个变量；

- this.\_color 私有属性；必须要在 defineProperties 中通过 Cesium.createPropertyDescriptor('color')中定义好才可以在 getValue 方法中获取值赋给 this.color；

- this.color 用于接收参数，接收参数传过来的值；也是着色器的取值来源！
