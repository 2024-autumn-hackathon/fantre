import { render } from "@testing-library/react"

import LayoutView from "@/components/MonitorLayout"

describe("Monitor Layout Snapshot", () => {
  const layoutView = render(
    <LayoutView
      headerContent="Header"
      mainContent="Main"
      navigationContent="Navi"
      footerContent="Footer"
    />
  ).container

  it("layout snapshot", () => {
    expect(layoutView).toMatchSnapshot()
  })
})
