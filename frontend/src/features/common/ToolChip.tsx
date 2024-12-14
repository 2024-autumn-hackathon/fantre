import React from 'react'

const ToolChip = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <span
      className="tooltip-text"
    >
      { children }
    </span>
  )
}

export default ToolChip