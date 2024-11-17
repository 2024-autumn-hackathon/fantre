import concatClassName from "@/utils/concatClassName"

describe("Check concatClassName from Utils", () => {
  it("base is empty", () => {
    const baseClass = ""
    const addClass = "addClass"
    const result = concatClassName(baseClass, addClass)
    const toBeResult = "addClass"
    expect(result).toBe(toBeResult)
  })
  it("add is empty", () => {
    const baseClass = "baseClass"
    const addClass = ""
    const result = concatClassName(baseClass, addClass)
    const toBeResult = "baseClass"
    expect(result).toBe(toBeResult)
  })
  it("both are valid string ", () => {
    const baseClass = "baseClass"
    const addClass = "addClass"
    const result = concatClassName(baseClass, addClass)
    const toBeResult = "baseClass addClass"
    expect(result).toBe(toBeResult)
  })
})