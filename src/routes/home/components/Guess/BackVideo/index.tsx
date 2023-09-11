import VideoPlayer from "@components/VideoPlayer";
import React from "react";

import './index.less'

const video1 = "https://hf-sim.allschoolcdn.com/sim/sparkenglish-sv/groot-teaching/video/1694269289859/background.MOV"

const BackVideo = ({ videoPlayerRef }: any) => {
  return <div className="back-vide-wrapper">
    <VideoPlayer ref={videoPlayerRef} src={video1} autoplay controls />
  </div>
}

export default BackVideo;
