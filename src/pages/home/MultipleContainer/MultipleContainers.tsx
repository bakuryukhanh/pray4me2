/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import type {
  CancelDrop,
  CollisionDetection,
  Modifiers,
  UniqueIdentifier,
  KeyboardCoordinateGetter,
} from "@dnd-kit/core";
import { DropAnimation, closestCorners } from "@dnd-kit/core";
import {
  closestCenter,
  pointerWithin,
  rectIntersection,
  DndContext,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensors,
  useSensor,
  MeasuringStrategy,
} from "@dnd-kit/core";
import type { SortingStrategy } from "@dnd-kit/sortable";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { coordinateGetter as multipleContainersCoordinateGetter } from "./multipleContainersKeyboardCoordinates";

import { Item } from "../DnDComponent";
import DroppableContainer from "./DropppableContainer";
import type { ItemRouterOutput } from "../../../server/trpc/router/item";
import { trpc } from "../../../utils/trpc";
import { cornersOfRectangle } from "@dnd-kit/core/dist/utilities/algorithms/helpers";
import { SortableItem } from "./SortableItem";

interface Props {
  adjustScale?: boolean;
  cancelDrop?: CancelDrop;
  columns?: number;
  containerStyle?: React.CSSProperties;
  coordinateGetter?: KeyboardCoordinateGetter;
  getItemStyles?(args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }): React.CSSProperties;
  wrapperStyle?(args: { index: number }): React.CSSProperties;
  itemCount?: number;
  items: {
    [key: string]: ItemRouterOutput["getAll"];
  };
  handle?: boolean;
  renderItem?: any;
  strategy?: SortingStrategy;
  scrollable?: boolean;
  statusArr: {
    id: string;
    name: string;
  }[];
}

const PLACEHOLDER_ID = "placeholder";

export function MultipleContainers({
  cancelDrop,
  columns,
  handle = false,
  items: initialItems,
  containerStyle,
  coordinateGetter = multipleContainersCoordinateGetter,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  renderItem,
  strategy = verticalListSortingStrategy,
  scrollable,
  statusArr,
}: Props) {
  const [items, setItems] = useState(() => initialItems);
  const [containers, setContainers] = useState(Object.keys(items));
  const [activeId, setActiveId] = useState<string | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const utils = trpc.useContext();
  const updateItems = trpc.item.update.useMutation({
    onSuccess: (value) => {
      console.log(value);
      utils.item.invalidate();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    setItems(initialItems);
    setContainers(Object.keys(initialItems));
  }, [initialItems]);

  const updateIndex = trpc.itemStatus.updateIndex.useMutation({
    onSuccess: (value) => {
      console.log(value);
      utils.item.invalidate();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const updateItemsIndexOnDrag = (
    arrIdx: number,
    containerId: string,
    item: ItemRouterOutput["getAll"][0]
  ) => {
    if (arrIdx === 0) {
      const nextIndex = items[containerId]?.[arrIdx + 1];
      const nextDate = nextIndex?.ItemStatus[0]?.index;
      if (nextDate) {
        updateIndex.mutate({
          id: item.ItemStatus[0]!.id,
          index: new Date(nextDate.getTime() / 2),
        });
      }
    } else if (arrIdx === items[containerId]?.length) {
      const prevIndex = items[containerId]?.[arrIdx - 1];
      const prevDate = prevIndex?.ItemStatus[0]?.index;

      if (prevDate) {
        updateIndex.mutate({
          id: item.ItemStatus[0]!.id,
          index: new Date((prevDate.getTime() + new Date().getTime()) / 2),
        });
      }
    } else {
      const prevIndex = items[containerId]?.[arrIdx - 1];
      const nextIndex = items[containerId]?.[arrIdx + 1];
      const prevDate = prevIndex?.ItemStatus[0]?.index;
      const nextDate = nextIndex?.ItemStatus[0]?.index;
      if (prevDate && nextDate) {
        updateIndex.mutate({
          id: item.ItemStatus[0]!.id,
          index: new Date((prevDate.getTime() + nextDate.getTime()) / 2),
        });
      }
    }
  };

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId !== null && overId !== undefined) {
        if (overId in items) {
          const containerItems = items[overId];

          if (containerItems!.length > 0) {
            overId =
              closestCenter({
                ...args,
                droppableContainers: args.droppableContainers.filter(
                  (container) => {
                    return (
                      container.id !== overId &&
                      containerItems?.some((item) => item.id === container.id)
                    );
                  }
                ),
              })[0]?.id || null;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );
  const findContainer = (id: string) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) =>
      items[key]?.some((item) => item.id === id)
    );
  };

  const getIndex = (id: string) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    const index = items[container]?.findIndex((item) => item.id === id) || -1;

    return index;
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id as string);
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id;

        if (overId == null || active.id in items) {
          return;
        }

        const overContainer = findContainer(overId as string);
        const activeContainer = findContainer(active.id as string);

        if (!overContainer || !activeContainer) {
          return;
        }

        if (activeContainer !== overContainer) {
          setItems((items) => {
            const activeItems = items[activeContainer]!;
            const overItems = items[overContainer]!;
            const overIndex = overItems.findIndex((item) => item.id === overId);
            const activeIndex = activeItems.findIndex(
              (item) => item.id === active.id
            );

            let newIndex: number;

            if (overId in items) {
              newIndex = overItems.length + 1;
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                  over.rect.top + over.rect.height;

              const modifier = isBelowOverItem ? 1 : 0;

              newIndex =
                overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            recentlyMovedToNewContainer.current = true;

            return {
              ...items,
              [activeContainer]:
                items[activeContainer]?.filter(
                  (item) => item.id !== active.id
                ) || [],
              [overContainer]: [
                ...(items[overContainer]?.slice(0, newIndex) || []),
                items[activeContainer]![activeIndex],
                ...(items[overContainer]?.slice(
                  newIndex,
                  items[overContainer]?.length
                ) || []),
              ],
            };
          });
        } else {
          const activeIndex =
            items[activeContainer]?.findIndex(
              (item) => item.id === active.id
            ) || -1;
          const overIndex =
            items[overContainer]?.findIndex((item) => item.id === overId) || -1;

          if (activeIndex === -1 || overIndex === -1) return;
          setItems((items) => ({
            ...items,
            [overContainer]: arrayMove(
              items[overContainer] || [],
              activeIndex,
              overIndex
            ),
          }));
        }
      }}
      onDragEnd={({ active, over }) => {
        const originContainer = Object.values(items)
          .flat()
          .find((item) => item.id === active.id)?.status.id;

        if (!originContainer) {
          setActiveId(null);
          return;
        }

        const overId = over?.id;

        if (overId == null) {
          setActiveId(null);
          return;
        }

        const overContainer = findContainer(overId as string);
        if (!overContainer) {
          console.log("No container found for overId");
        }

        if (overContainer) {
          const activeIndex = items[originContainer]?.findIndex(
            (item) => item.id === active.id
          );
          const overIndex = items[overContainer]?.findIndex(
            (item) => item.id === over?.id
          );
          const activeItem = Object.values(items)
            .flat()
            .find((item) => item.id === active.id);
          if (activeItem) {
            if (originContainer === overContainer) {
              if (activeIndex !== undefined && overIndex !== undefined) {
                updateItemsIndexOnDrag(overIndex, overContainer, activeItem);
                setItems((items) => ({
                  ...items,
                  [overContainer]: arrayMove(
                    items[overContainer] || [],
                    activeIndex,
                    overIndex
                  ),
                }));
              }
            } else {
              if (overIndex !== undefined) {
                updateItems.mutate({
                  ...activeItem,
                  category: activeItem.category.id,
                  users: activeItem.users.map((user) => user.id),
                  status: overContainer as string,
                });
                updateItemsIndexOnDrag(overIndex, overContainer, activeItem);
              }
            }
          }
        }

        setActiveId(null);
      }}
      cancelDrop={cancelDrop}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "5px",
          boxSizing: "border-box",
          padding: 20,
        }}
      >
        <SortableContext
          items={[...containers, PLACEHOLDER_ID]}
          strategy={horizontalListSortingStrategy}
        >
          {containers.map((containerId) => (
            <DroppableContainer
              key={containerId}
              id={containerId}
              label={statusArr.find((item) => item.id === containerId)?.name}
              columns={columns}
              items={items[containerId]!.map((item) => item.id)}
              scrollable={scrollable}
              style={containerStyle}
            >
              <SortableContext
                items={items[containerId]!.map((item) => item.id)}
                strategy={strategy}
              >
                {items[containerId]!.map((value, index) => {
                  return (
                    <SortableItem
                      key={value.id}
                      id={value.id}
                      index={index}
                      handle={handle}
                      style={getItemStyles}
                      wrapperStyle={wrapperStyle}
                      renderItem={renderItem}
                      containerId={containerId}
                      getIndex={getIndex}
                      renderProps={value}
                    />
                  );
                })}
              </SortableContext>
            </DroppableContainer>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
