// import React, { useRef, useState } from 'react';
// import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
// import { Rnd } from 'react-rnd';
// import '../less/home.less';
// // import Xarrow from '../components/Xarrow';
// import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
// import { MarkdownRenderer } from 'obsidian';
// import appStore from '../stores/appStore';
//
// // export interface ZoomPanPinchRefActions {
// //   zoomIn: () => void;
// //   zoomOut: () => void;
// //   resetTransform: () => void;
// // }
//
// const ResizeNDraggableBox = (props) => {
//   const updateXarrow = useXarrow();
//
//   const handleClick = (e) => {
//     e.stopPropagation(); //so only the click event on the box will fire on not on the container itself
//     if (props.actionState === 'Normal') {
//       props.handleSelect(e);
//     } else if (props.actionState === 'Add Connections' && props.selected.id !== props.box.id) {
//       props.setLines((lines) => [
//         ...lines,
//         {
//           props: { start: props.selected.id, end: props.box.id },
//           menuWindowOpened: false,
//         },
//       ]);
//     } else if (props.actionState === 'Remove Connections') {
//       props.setLines((lines) =>
//         lines.filter((line) => !(line.root === props.selected.id && line.end === props.box.id)),
//       );
//     }
//   };
//
//   // let background = null;
//   // if (props.selected && props.selected.id === props.box.id) {
//   //   // background = 'rgb(200, 200, 200)';
//   // } else if (
//   //   (props.actionState === 'Add Connections' &&
//   //     // props.sidePos !== "right" &&
//   //     props.lines.filter((line) => line.root === props.selected.id && line.end === props.box.id).length === 0) ||
//   //   (props.actionState === 'Remove Connections' &&
//   //     props.lines.filter((line) => line.root === props.selected.id && line.end === props.box.id).length > 0)
//   // ) {
//   //   // background = 'LemonChiffon';
//   // }
//   console.log(props.box.id, 'render');
//
//   // const RndEl = () => {
//   //   return;
//   //   <Rnd
//   //     // size={{ width: box.width, height: box.height }}
//   //     // position={{ x: box.x, y: box.y }}
//   //     // style={boxStyle}
//   //     onDrag={updateXarrow}
//   //     onDragStop={updateXarrow}
//   //     onResize={updateXarrow}
//   //     onResizeStop={updateXarrow}
//   //     minHeight={150}
//   //     minWidth={150}
//   //     style={{ zIndex: 10, width: 'auto' }}
//   //     default={{
//   //       x: props.box.x,
//   //       y: props.box.y,
//   //       width: props.box.width,
//   //       height: props.box.height,
//   //     }}
//   //     className={'Dragable'}
//   //   >
//   //     console.log("23123")
//   //     <div
//   //       // ref={props.box.reference}
//   //       style={{
//   //         ...boxStyle,
//   //       }}
//   //       onClick={handleClick}
//   //       id={props.box.id}
//   //     >
//   //       {props.box.content}
//   //     </div>
//   //   </Rnd>;
//   // };
//
//   // const ContentEl = RndEl.createDiv;
//
//   return (
//     <Rnd
//       // size={{ width: box.width, height: box.height }}
//       // position={{ x: box.x, y: box.y }}
//       // style={boxStyle}
//       onDrag={updateXarrow}
//       onDragStop={updateXarrow}
//       onResize={updateXarrow}
//       onResizeStop={updateXarrow}
//       minHeight={150}
//       minWidth={150}
//       style={{ zIndex: 10, width: 'auto' }}
//       default={{
//         x: props.box.x,
//         y: props.box.y,
//         width: props.box.width,
//         height: props.box.height,
//       }}
//       className={'Dragable'}
//     >
//       <div
//         // ref={props.box.reference}
//         style={{
//           ...boxStyle,
//         }}
//         onClick={handleClick}
//         id={props.box.id}
//         dangerouslySetInnerHTML={{ __html: formatContent(props.box.content) }}
//       >
//         {/*{props.box.content}*/}
//       </div>
//     </Rnd>
//     // <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
//     //   <div id={box.id} style={{ ...boxStyle, position: 'absolute', left: box.x, top: box.y }}>
//     //     {box.content}
//     //   </div>
//     // </Draggable>
//   );
// };
//
// export function formatContent(content: string) {
//   const tempDivContainer = document.createElement('div');
//   MarkdownRenderer.renderMarkdown(
//     content,
//     tempDivContainer,
//     '',
//     null, //this.#markdownRenderChild
//   );
//   for (let i = 0; i < tempDivContainer.children.length; i++) {
//     const c = tempDivContainer.children[i];
//
//     if (c.tagName === 'P' && c.textContent === '' && c.firstElementChild?.tagName !== 'BR') {
//       c.remove();
//       i--;
//       continue;
//     }
//   }
//   return tempDivContainer.innerHTML;
// }
//
// export const canvasStyle = {
//   width: '100%',
//   height: '100vh',
//   background: 'white',
//   overflow: 'hidden',
//   display: 'flex',
// };
//
// export const boxStyle = {
//   // position: 'absolute',
//   border: '1px #999 solid',
//   borderRadius: '5px',
//   padding: '10px',
//   backgroundColor: '#95c4a4',
//   width: '100%',
//   height: '100%',
// };
//
// const FewArrows = () => {
//   const { memos } = appStore.getState().memoState;
//   console.log(memos);
//   const [, setRerender] = useState({});
//   const forceRerender = () => setRerender({});
//   const ref = useRef<ReactZoomPanPinchRef | null>(null);
//   const updateXarrow = useXarrow();
//   const [boxes, setBoxes] = useState([
//     {
//       id: 'box1',
//       x: 50,
//       y: 20,
//       width: 150,
//       height: 150,
//       content: 'Obsidian 是一个很好用的本地知识库软件，它能让我折腾很多次',
//       // reference: useRef(null),
//     },
//     {
//       id: 'box2',
//       x: 20,
//       y: 250,
//       width: 150,
//       height: 150,
//       content: 'Obsidian 是一个很好用的本地知识库软件，它能让我折腾很多次',
//       // reference: useRef(null),
//     },
//     {
//       id: 'box3',
//       x: 350,
//       y: 80,
//       width: 150,
//       height: 150,
//       content: 'Obsidian 是一个很好用的本地知识库软件，它能让我折腾很多次',
//       // reference: useRef(null),
//     },
//   ]);
//   const [lines, setLines] = useState([
//     {
//       start: 'box1',
//       end: 'box2',
//       headSize: 3,
//       monitorDOMchanges: true,
//       // labels: { end: 'endLabel' },
//     },
//     {
//       start: 'box2',
//       end: 'box3',
//       color: 'red',
//       labels: {
//         middle: (
//           <div
//             contentEditable
//             suppressContentEditableWarning={true}
//             style={{ font: 'italic 0.7em serif', color: 'purple' }}
//           >
//             这里可以编辑
//           </div>
//         ),
//       },
//       headSize: 0,
//       strokeWidth: 3,
//       monitorDOMchanges: true,
//     },
//     {
//       start: 'box3',
//       end: 'box1',
//       color: 'green',
//       // path: 'grid',
//       // endAnchor: ["right", {position: "left", offset: {y: -10}}],
//       dashness: { animation: 1 },
//       monitorDOMchanges: true,
//     },
//   ]);
//
//   const [selected, setSelected] = useState(null);
//   const [actionState, setActionState] = useState('Normal');
//
//   const handleSelect = (e) => {
//     if (e === null) {
//       setSelected(null);
//       setActionState('Normal');
//     } else setSelected({ id: e.target.id, type: 'box' });
//   };
//
//   const handleDropDynamic = (e) => {
//     // console.log(e.dataTransfer.getData('text'));
//     const text = e.dataTransfer.getData('text');
//     const l = boxes.length;
//     const { x, y } = e.target.getBoundingClientRect();
//     const newBox = {
//       id: 'box' + l,
//       x: e.clientX - x,
//       y: e.clientY - y,
//       content: text,
//       width: 150,
//       height: 150,
//       // reference: useRef(null),
//     };
//     setBoxes([...boxes, newBox]);
//   };
//
//   const panOptions = {
//     disableOnTarget: ['Dragable'],
//   } as any;
//
//   // const handleZoomIn = () => {
//   //   return ref.current?.zoomIn();
//   // };
//   //
//   // const handleZoomOut = () => {
//   //   return ref.current?.zoomOut();
//   // };
//   //
//   // const handleResetTransform = () => {
//   //   return ref.current?.resetTransform();
//   // };
//
//   const boxProps = {
//     boxes,
//     setBoxes,
//     selected,
//     handleSelect,
//     actionState,
//     setLines,
//     lines,
//   };
//
//   return (
//     // <React.Fragment>
//     <>
//       <div style={{ ...canvasStyle }} id="canvas" onDragOver={(e) => e.preventDefault()} onDrop={handleDropDynamic}>
//         <Xwrapper>
//           <TransformWrapper
//             ref={ref}
//             initialScale={1}
//             limitToBounds={false}
//             minScale={0.25}
//             maxScale={3}
//             panning={{
//               activationKeys: ['Control', '17'],
//             }}
//             centerOnInit={true}
//             velocityAnimation={{
//               disabled: true,
//             }}
//             onPanning={() => {
//               forceRerender();
//               updateXarrow;
//             }}
//             doubleClick={{
//               disabled: true,
//             }}
//             onWheel={() => {
//               forceRerender();
//               updateXarrow;
//             }}
//           >
//             {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
//               <React.Fragment>
//                 <div
//                   style={{
//                     position: 'absolute',
//                     bottom: '20px',
//                     left: '20px',
//                     zIndex: 100,
//                   }}
//                 >
//                   <button
//                     onClick={() => {
//                       zoomIn();
//                     }}
//                   >
//                     +
//                   </button>
//                   <button
//                     style={{ marginLeft: '5px' }}
//                     onClick={() => {
//                       zoomOut();
//                     }}
//                   >
//                     -
//                   </button>
//                   <button
//                     style={{ marginLeft: '5px' }}
//                     onClick={() => {
//                       resetTransform();
//                     }}
//                   >
//                     x
//                   </button>
//                 </div>
//                 <div style={{ zIndex: 10 }}>
//                   <TransformComponent>
//                     {/*{boxes.map((box, i) => (*/}
//                     {/*  <ResizeNDraggableBox {...boxProps} box={box} key={i} />*/}
//                     {/*))}*/}
//
//                     {boxes.map((box) => (
//                       <ResizeNDraggableBox {...boxProps} key={box.id} box={box} />
//                     ))}
//                   </TransformComponent>
//                 </div>
//                 {lines.map((line, i) => (
//                   <Xarrow key={i} {...line} />
//                 ))}
//               </React.Fragment>
//             )}
//           </TransformWrapper>
//         </Xwrapper>
//       </div>
//     </>
//   );
// };
//
// export default FewArrows;
