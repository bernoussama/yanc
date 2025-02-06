"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

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
          <iframe
            src={`https://vidsrc.xyz/embed/tv/${id}`}
            allowFullScreen
            className="rounded-lg border-0 w-full h-full aspect-[21/9]"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default WatchNowButton;
