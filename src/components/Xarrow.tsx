// import React, {useState} from 'react';
// import Xarrow from 'react-xarrows';
//
// //{props: {line, setSelected, selected}}
// export default ({ setSelected, selected, line: { props } }) => {
//   // console.log(sss)
//   const [state, setState] = useState({ color: 'coral' });
//   const defProps = {
//     passProps: {
//       className: 'xarrow',
//       onMouseEnter: () => setState({ color: 'IndianRed' }),
//       onMouseLeave: () => setState({ color: 'coral' }),
//       onClick: (e) => {
//         e.stopPropagation(); //so only the click event on the box will fire on not on the container itself
//         setSelected({
//           id: { start: props.root, end: props.end },
//           type: 'arrow',
//         });
//       },
//       cursor: 'pointer',
//     },
//   };
//   let color = state.color;
//   if (selected && selected.type === 'arrow' && selected.id.root === props.root && selected.id.end === props.end)
//     color = 'red';
//   return <Xarrow {...{ ...defProps, ...props, ...state, color }} />;
// };
