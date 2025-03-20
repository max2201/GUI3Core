export const setRootCssProperty = (name: string, value: string) => {
  const root = document.querySelector(':root') as HTMLElement

  root.style.setProperty(name, `${value}`)
}
