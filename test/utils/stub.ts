// @ts-nocheck
const stub = <T extends any> (): T => {
  const typeAssertion = <T>{}

  for (const prop in typeAssertion) {
    if (typeAssertion.hasOwnProperty(prop)) {
      typeAssertion[prop] = undefined
    }
  }

  return typeAssertion
}

export { stub }
