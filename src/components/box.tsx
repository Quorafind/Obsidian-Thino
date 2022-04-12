// import React from 'react';
// import '../less/Box.less';
// import Draggable from 'react-draggable';
// import { useXarrow } from 'react-xarrows';
//
// const Box = (props) => {
//   const updateXarrow = useXarrow();
//   // const handleDrag = () => props.setBoxes([...props.boxes]);
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
//   let background = null;
//   if (props.selected && props.selected.id === props.box.id) {
//     background = 'rgb(200, 200, 200)';
//   } else if (
//     (props.actionState === 'Add Connections' &&
//       // props.sidePos !== "right" &&
//       props.lines.filter((line) => line.root === props.selected.id && line.end === props.box.id).length === 0) ||
//     (props.actionState === 'Remove Connections' &&
//       props.lines.filter((line) => line.root === props.selected.id && line.end === props.box.id).length > 0)
//   ) {
//     background = 'LemonChiffon';
//   }
//
//   return (
//     <React.Fragment>
//       <Draggable onStart={() => props.position !== 'static'} bounds="parent" onDrag={updateXarrow}>
//         <div
//           ref={props.box.reference}
//           className={`${props.box.shape} ${props.position} hoverMarker`}
//           style={{
//             left: props.box.x,
//             top: props.box.y,
//             background,
//             // border: "black solid 2px",
//           }}
//           onClick={handleClick}
//           id={props.box.id}
//         >
//           {props.box.name ? props.box.name : props.box.id}
//         </div>
//       </Draggable>
//       {/*{type === "middleBox" && menuWindowOpened ?*/}
//       {/*  <MenuWindow setBoxes={props.setBoxes} box={props.box}/> : null*/}
//       {/*}*/}
//     </React.Fragment>
//   );
// };
//
// export default Box;
