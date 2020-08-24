export const deepSpread = <T extends [] | Object, K extends keyof T>(
  inObject: T
): T => {
  let key: keyof T;
  if (typeof inObject !== "object" || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  const outObject: T = Array.isArray(inObject) ? <T>[] : <T>{};

  for (key in inObject) {
    const value: T[keyof T] = inObject[key];

    outObject[key] = deepSpread(value);
  }

  return outObject;
};
