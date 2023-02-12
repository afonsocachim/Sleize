import React from "react";

const useContextMenu = () => {
	const [anchorPoint, setAnchorPoint] = React.useState({ x: 0, y: 0 });
	const [show, setShow] = React.useState(false);

	const handleContextMenu = React.useCallback(
		(event) => {
			event.preventDefault();
			setAnchorPoint({ x: event.pageX, y: event.pageY });
			setShow(true);
		},
		[setShow, setAnchorPoint],
	);

	const handleClick = React.useCallback(
		() => (show ? setShow(false) : null),
		[show],
	);

	React.useEffect(() => {
		document.addEventListener("click", handleClick);
		document.addEventListener("contextmenu", handleContextMenu);
		return () => {
			document.removeEventListener("click", handleClick);
			document.removeEventListener("contextmenu", handleContextMenu);
		};
	});
	return { anchorPoint, show };
};

export default useContextMenu;
