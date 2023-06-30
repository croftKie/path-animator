import { gsap } from "gsap";

export const resetAnimationPath = (element, elementStartLocation) => {
  gsap.to(element, { x: elementStartLocation.x, y: elementStartLocation.y });
};

export const isPathComplete = (element, elementLocation, endLocation) => {
  const size = element.getBoundingClientRect();
  if (
    elementLocation.x <= endLocation.x + size.width &&
    elementLocation.x >= endLocation.x &&
    elementLocation.y <= endLocation.y + size.height &&
    elementLocation.y >= endLocation.y
  ) {
    return true;
  } else {
    return false;
  }
};

export const animator = (element, inputs, parentHeight, parentWidth) => {
  const { X, Y } = _getPosition(element);
  const tl = _initTimeline();
  const { repeatStartIndex, repeatEndIndex, repeatableInputs, repeatNumber } =
    _utils(inputs);

  for (let i = 0; i < inputs.length; i++) {
    if (i === repeatStartIndex) {
      let j = 0;
      while (j < repeatNumber) {
        repeatableInputs.forEach((el) => {
          _animatePath(
            element,
            el.type,
            el,
            tl,
            parentHeight,
            parentWidth,
            X,
            Y
          );
        });
        j++;
      }
      i = repeatEndIndex;
    } else {
      _animatePath(
        element,
        inputs[i].type,
        inputs[i],
        tl,
        parentHeight,
        parentWidth,
        X,
        Y
      );
    }
  }
  tl.resume();
  return { x: X, y: Y };
};

const _animatePath = (element, type, el, tl, height, width, X, Y) => {
  switch (type) {
    case "forward":
      if (Y - el.value < 0) {
        tl.to(element, { y: 0 });
        Y = 0;
      } else {
        tl.to(element, { y: Y - Math.abs(el.value) });
        Y -= Math.abs(el.value);
      }
      break;
    case "backwards":
      if (Y + el.value > height) {
        tl.to(element, { y: height });
        Y = height;
      } else {
        tl.to(element, { y: Y + Math.abs(el.value) });
        Y += Math.abs(el.value);
      }
      break;
    case "right":
      if (X + el.value > width) {
        tl.to(element, { x: width });
        X = width;
      } else {
        tl.to(element, { x: X + Math.abs(el.value) });
        X += Math.abs(el.value);
      }
      break;
    case "left":
      if (X - el.value < 0) {
        tl.to(element, { x: 0 });
        X = 0;
      } else {
        tl.to(element, { x: X - Math.abs(el.value) });
        X -= Math.abs(el.value);
      }
      break;
    default:
      break;
  }
};

const _getPosition = (element) => {
  const pos = element.style.transform
    .slice(
      element.style.transform.indexOf("(") + 1,
      element.style.transform.indexOf(")")
    )
    .replace("px,", "")
    .replace("px", "")
    .split(" ");
  let X = parseInt(pos[0]);
  let Y = parseInt(pos[1]);
  return { X: parseInt(pos[0]), Y: parseInt(pos[1]) };
};

const _initTimeline = () => {
  let tl = gsap.timeline({ repeatDelay: 1 });
  tl.pause();
  return tl;
};

const _utils = (inputs) => {
  const repeatStartIndex = inputs.findIndex((el) => el.type === "repeat");
  const repeatEndIndex = inputs.findIndex((el) => el.type === "end");
  const repeatableInputs = inputs.slice(repeatStartIndex + 1, repeatEndIndex);
  let repeatNumber;
  if (repeatStartIndex !== -1) {
    repeatNumber = inputs[repeatStartIndex].value;
  } else {
    repeatNumber = null;
  }

  return {
    repeatStartIndex: repeatStartIndex,
    repeatEndIndex: repeatEndIndex,
    repeatableInputs: repeatableInputs,
    repeatNumber: repeatNumber,
  };
};
