const ball = document.querySelector(".ball");

function setPositions(e) {
    const viewportOffset = ball.getBoundingClientRect();
    const cy = viewportOffset.top + viewportOffset.height / 2;
    const cx = viewportOffset.left + viewportOffset.width / 2;
    ball.style = `--cx: ${cx}; --cy: ${cy}; --cursor-x: ${Math.max(e.pageX, 0)}; --cursor-y: ${Math.max(e.pageY, 0)}`;
}

addEventListener("pointermove", setPositions, false);
