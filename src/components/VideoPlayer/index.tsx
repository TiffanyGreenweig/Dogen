import React from 'react'

/**
 * 视频基础控件
 * 1. 只作为视频组件UI层和视频层两层中的视频层UI层需要单独开发采用定位方式覆盖在视频层上
 *
 * @property {Object} refName 操纵dom的ref
 *
 * @property {String} src 视频地址
 *
 * @property {Boolean} autoPlay 自动播放 true: 是 false:否
 *
 * @property {String} width 视频宽度 默认 100%
 *
 * @property {String} height 视频高度 默认100%
 *
 * @property {String} controlsList 控件列表 可填1个或多个 用空格间隔 默认全部选中
 *       1. nodownload 隐藏下载控件
 *       2. nofullscreen 隐藏全屏控件
 *       3. noremoteplayback 隐藏远程播放控件
 *
 * @property {String} preload 视频预下载 默认开启
 *       1. auto 预加载 音频/视频
 *       2. metadata 仅加载 音频/视频的元数据
 *       3. none 不预加载
 *       4. 如过autoplay开启 此属性无效
 *
 * @property  {Boolean} playsInline  内联播放 在播放时不触发系统本身播放，保持页面播放 默认开启
 *
 * @property {String} webkitPlaysinline webkit内核浏览器的内联播放 默认开启
 *
 * @property {String} x5VideoPlayerType 微信X5浏览器同层
 *
 * @property {String} mttPlaysinline QQ浏览器 播放完不展示推荐
 *
 * @property {Function} onLoadedMetadata 加载元数据回调方法
 *
 * @property {Function} onPlay 播放回调方法
 *
 * @property {Function} onPause 暂停回调方法
 *
 * @property {Function} onEnded 结束播放回调方法
 *
 * @property {Function} onTimeUpdate 时间更新回调
 *
 * @property {Boolean} controls 是否显示控制台 true:显示 false:隐藏
 *
 * @property {Object} style video 内联样式
 *
 * @property {String} classNames video 样式类名
 *
 * @property {String} poster video 封面图
 *
 * @property {Boolean} muted 是否静音 true:静音 false:不静音
 *
 * @property {Boolean} loop 是否循环播放 true: 循环 false: 不循环
 *
 */

const VideoPlayer = React.forwardRef((props: any, ref: any): any => {
  const {
    src,
    autoplay = false,
    width = 'auto',
    maxWidth = '100%',
    height = '100%',
    preload = 'auto',
    playsInline = true,
    onCanPlay,
    onLoadedMetadata,
    onPlay,
    onPause,
    onEnded,
    onError,
    onTimeUpdate,
    style,
    controls = false,
    classNames,
    poster,
    muted = false,
    loop = false,
  } = props

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={ref}
      autoPlay={autoplay}
      src={src}
      width={width}
      height={height}
      preload={preload}
      webkit-playsinline={playsInline}
      playsInline={playsInline}
      onCanPlay={onCanPlay}
      onLoadedMetadata={onLoadedMetadata}
      onPlay={onPlay}
      onPause={onPause}
      onError={onError}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      controls={controls}
      style={{ maxWidth, ...style }}
      className={classNames}
      poster={poster}
      muted={muted}
      loop={loop}
      x5-video-player-fullscreen="true"
      x5-video-orientation="landscape">
      video Error
    </video>
  )
})

export default VideoPlayer
