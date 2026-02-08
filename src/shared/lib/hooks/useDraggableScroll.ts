import {MouseEvent, RefObject, useRef, useState} from "react";

export const useDraggableScroll = <T extends HTMLElement>(): {
  ref: RefObject<T | null>;
  onMouseDown: (e: MouseEvent<T>) => void;
  onMouseLeave: () => void;
  onMouseUp: () => void;
  onMouseMove: (e: MouseEvent<T>) => void;
} => {
  const ref = useRef<T>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: MouseEvent<T>) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: MouseEvent<T>) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2;
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return {ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove};
};
