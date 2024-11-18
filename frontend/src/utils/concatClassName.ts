// 受け取った2つの文字列を半角スペースで結合して返す
const concatClassName = (
  baseClass: string,
  addClass: string,
) => {
  return (baseClass === "" || addClass === "") ? `${baseClass}${addClass}` : `${ baseClass } ${ addClass }`
}

export default concatClassName