import { useSortable } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import type { ItemRouterOutput } from "../../../server/trpc/router/item";
import { Item } from "../DnDComponent";

interface SortableItemProps {
  containerId: string;
  id: string;
  index: number;
  handle: boolean;
  disabled?: boolean;
  getIndex(id: string): number;
  renderItem(): React.ReactElement;
  wrapperStyle({ index }: { index: number }): React.CSSProperties;
  style: any;
  renderProps?: ItemRouterOutput["getAll"][0];
}

export function SortableItem({
  disabled,
  id,
  index,
  handle,
  renderItem,
  containerId,
  getIndex,
  wrapperStyle,
  renderProps,
  style,
}: SortableItemProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
  } = useSortable({
    id,
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      renderProps={renderProps}
      ref={disabled ? undefined : setNodeRef}
      value={id}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      index={index}
      wrapperStyle={wrapperStyle({ index })}
      style={style({
        index,
        value: id,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id) : overIndex,
        containerId,
      })}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      renderItem={renderItem}
    />
  );
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
