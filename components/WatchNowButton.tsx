"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

interface WatchNowButtonProps {
  id: string;
}

const WatchNowButton: React.FC<WatchNowButtonProps> = ({ id }) => {
  const [isIframeVisible, setIsIframeVisible] = useState(false);

  const toggleIframe = () => {
    setIsIframeVisible(!isIframeVisible);
  };

  return (
    <div className="container">
      <Button size="lg" className="gap-2" onClick={toggleIframe}>
        <PlayCircle className="w-5 h-5" /> Watch Now
      </Button>
      {isIframeVisible && (
        <div className="container mx-auto mt-8">
          <VideoPlayer type="tv" id={id} className="h-full w-full" />
        </div>
      )}
    </div>
  );
};

export default WatchNowButton;
