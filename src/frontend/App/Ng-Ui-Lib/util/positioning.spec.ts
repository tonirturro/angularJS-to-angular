import {Positioning} from "./positioning";

describe("Positioning", () => {
  const positioning = new Positioning();
  const documentMargin = document.documentElement.style.margin;
  const bodyMargin = document.body.style.margin;
  const bodyHeight = document.body.style.height;
  const bodyWidth = document.body.style.width;
  let elementTopPosition: number;

  function createElement(height: number, width: number, marginTop: number, marginLeft: number): HTMLElement {
    const el = document.createElement("div");
    el.style.display = "inline-block";
    el.style.height = height + "px";
    el.style.width = width + "px";
    el.style.marginTop = marginTop + "px";
    el.style.marginLeft = marginLeft + "px";

    return el;
  }

  const topOffset = 100;
  const element = createElement(200, 300, topOffset, 150);
  const targetElement = createElement(50, 100, 10, 20);

  beforeAll(() => {
    document.body.appendChild(element);
    document.body.appendChild(targetElement);
    document.documentElement.style.margin = "0";
    document.body.style.margin = "0";
    document.body.style.height = "2000px";
    document.body.style.width = "2000px";
  });

  afterAll(() => {
    document.body.removeChild(element);
    document.body.removeChild(targetElement);
    document.documentElement.style.margin = documentMargin;
    document.body.style.margin = bodyMargin;
    document.body.style.height = bodyHeight;
    document.body.style.width = bodyWidth;
  });

  beforeEach(() => {
    elementTopPosition = element.offsetTop - topOffset;
  });

  it("should calculate the element offset", () => {
    const position = positioning.offset(element);

    expect(position.height).toBe(200);
    expect(position.width).toBe(300);
    expect(position.top).toBe(100 + elementTopPosition);
    expect(position.bottom).toBe(300 + elementTopPosition);
    expect(position.left).toBe(150);
    expect(position.right).toBe(450);
  });

  it("should calculate the element offset when scrolled", () => {
    document.documentElement.scrollTop = 1000;
    document.documentElement.scrollLeft = 1000;

    const position = positioning.offset(element);

    expect(position.top).toBe(100 + elementTopPosition);
    expect(position.bottom).toBe(300 + elementTopPosition);
    expect(position.left).toBe(150);
    expect(position.right).toBe(450);

    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  });

  it("should calculate the element position", () => {
    const position = positioning.position(element);

    expect(position.height).toBe(200);
    expect(position.width).toBe(300);
    expect(position.top).toBe(100 + elementTopPosition);
    expect(position.bottom).toBe(300 + elementTopPosition);
    expect(position.left).toBe(150);
    expect(position.right).toBe(450);
  });

  it("should calculate the element position when scrolled", () => {
    document.documentElement.scrollTop = 1000;
    document.documentElement.scrollLeft = 1000;

    const position = positioning.position(element);

    expect(position.top).toBe(100 + elementTopPosition);
    expect(position.bottom).toBe(300 + elementTopPosition);
    expect(position.left).toBe(150);
    expect(position.right).toBe(450);

    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  });

  it("should calculate the element position on positioned ancestor", () => {
    const childElement = createElement(100, 150, 50, 75);

    element.style.position = "relative";
    element.appendChild(childElement);

    const position = positioning.position(childElement);

    expect(position.top).toBe(50);
    expect(position.bottom).toBe(150);
    expect(position.left).toBe(75);
    expect(position.right).toBe(225);

    element.style.position = "";
    element.removeChild(childElement);
  });

  it("should position the element top-left", () => {
    const position = positioning.positionElements(element, targetElement, "top-left");

    expect(position.top).toBe(50 + elementTopPosition);
    expect(position.left).toBe(150);
  });

  it("should position the element top-center", () => {
    const position = positioning.positionElements(element, targetElement, "top");

    expect(position.top).toBe(50 + elementTopPosition);
    expect(position.left).toBe(250);
  });

  it("should position the element top-right", () => {
    const position = positioning.positionElements(element, targetElement, "top-right");

    expect(position.top).toBe(50 + elementTopPosition);
    expect(position.left).toBe(350);
  });

  it("should position the element bottom-left", () => {
    const position = positioning.positionElements(element, targetElement, "bottom-left");

    expect(position.top).toBe(300 + elementTopPosition);
    expect(position.left).toBe(150);
  });

  it("should position the element bottom-center", () => {
    const position = positioning.positionElements(element, targetElement, "bottom");

    expect(position.top).toBe(300 + elementTopPosition);
    expect(position.left).toBe(250);
  });

  it("should position the element bottom-right", () => {
    const position = positioning.positionElements(element, targetElement, "bottom-right");

    expect(position.top).toBe(300 + elementTopPosition);
    expect(position.left).toBe(350);
  });

  it("should position the element left-top", () => {
    const position = positioning.positionElements(element, targetElement, "left-top");

    expect(position.top).toBe(100 + elementTopPosition);
    expect(position.left).toBe(50);
  });

  it("should position the element left-center", () => {
    const position = positioning.positionElements(element, targetElement, "left");

    expect(position.top).toBe(175 + elementTopPosition);
    expect(position.left).toBe(50);
  });

  it("should position the element left-bottom", () => {
    const position = positioning.positionElements(element, targetElement, "left-bottom");

    expect(position.top).toBe(250 + elementTopPosition);
    expect(position.left).toBe(50);
  });

  it("should position the element right-top", () => {
    const position = positioning.positionElements(element, targetElement, "right-top");

    expect(position.top).toBe(100 + elementTopPosition);
    expect(position.left).toBe(450);
  });

  it("should position the element right-center", () => {
    const position = positioning.positionElements(element, targetElement, "right");

    expect(position.top).toBe(175 + elementTopPosition);
    expect(position.left).toBe(450);
  });

  it("should position the element right-bottom", () => {
    const position = positioning.positionElements(element, targetElement, "right-bottom");

    expect(position.top).toBe(250 + elementTopPosition);
    expect(position.left).toBe(450);
  });
});
