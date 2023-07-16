import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import { ReactNode, forwardRef, Ref } from "react";

const ScrollArea = forwardRef(function ScrollArea(
  { children }: { children: ReactNode },
  ref: Ref<HTMLDivElement>
) {
  return (
    <RadixScrollArea.Root className="ScrollAreaRoot">
      <RadixScrollArea.Viewport className="ScrollAreaViewport" ref={ref}>
        {children}
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        className="ScrollAreaScrollbar"
        orientation="vertical"
      >
        <RadixScrollArea.Thumb className="ScrollAreaThumb" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Scrollbar
        className="ScrollAreaScrollbar"
        orientation="horizontal"
      >
        <RadixScrollArea.Thumb className="ScrollAreaThumb" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Corner className="ScrollAreaCorner" />
    </RadixScrollArea.Root>
  );
});

export default ScrollArea;
