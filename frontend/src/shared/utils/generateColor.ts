function generateColorFactory() {
  const colors = [
    "#386641",
    "#6a994e",
    "#a7c957",
    "#f2e8cf",
    "#bc4749",
    "#ffa5ab",
    "#da627d",
    "#a53860",
    "#450920",
    "#dd2d4a",
    "#f26a8d",
    "#e0aaff",
    "#5a189a",
    "#c77dff",
  ];

  return () => colors[Math.floor(Math.random() * colors.length)];
}

export const generateColor = generateColorFactory();
