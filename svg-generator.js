/*

   ______________________________
 / \                             \.
|   |        hello there         |.
 \_ |                            |.
    |                            |.
    |     bask in the glory      |.
    |   that is my vanilla JS    |.
    |                            |.
    |                            |.
    |                            |.
    |        hope u enjoy        |.
    |                            |.
    |                            |.
    |                alex <3     |.
    |                            |.
    |   _________________________|___
    |  /                            /.
    \_/____________________________/.

*/

/* --------------- VARS --------------- */
const svg = document.querySelector("#svg-item")
const gridSizeInput = document.querySelector("#gridsize")
const triangleWeightInput = document.querySelector("#triangleweight")
const circleWeightInput = document.querySelector("#circleweight")
const colorArrayInput = document.querySelector("#colorarray")
const regenerateButton = document.querySelector("#generate-svg")
const downloadButton = document.querySelector("#download-svg")
const svgns = "http://www.w3.org/2000/svg"

const DEFAULT_COLOR_ARRAYS = [
  ['#031473','#031059','#0634BF','#033F73','#0D0D0D'],
  ['#265C4B','#146551','#007566','#589A8D','#8FC1B5'],
  ['#FFF587','#FF8C64','#FF665A','#7D6B7D','#A3A1A8'],
  ['#D90416','#020540','#32508C','#048ABF','#F2F2F2'],
  ['#FCE5C6','#FEC0B1','#FFA082','#FFD3A4','#CDF1E5'],
  ['#F1C221','#F38902','#F15E07','#8B1C00','#3E0900'],
  ['#F03447','#AB342C','#2A0006','#FF5F5E','#452228'],
  ['#ABD2BF','#BBCEDF','#F28A05','#3D7071','#FFE0AA'],
  ['#515559','#727365','#D9D3B8','#BFB6AA','#BF2626'],
  ['#56688C','#EBEEF2','#7F8C72'],
  ['#D9C5C9','#F20C60','#0F8C8C','#F27E63','#F25252'],
]
const TOTAL_UNITS = 500
let ROWS
let COLUMNS
let WIDTH = TOTAL_UNITS / COLUMNS
let HEIGHT = TOTAL_UNITS / ROWS
let TRIANGLE_WEIGHT
let CIRCLE_WEIGHT
let COLOR_ARRAY

const possibleCornerMultipliers = [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}]

/* --------------- UTILS --------------- */
const shuffle = (array) => {
  let currentIndex = array.length,  randomIndex

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }

  return array
}
  
const generateTrianglePoints = (i, j) => {
  const cornerModifiers = shuffle(possibleCornerMultipliers).slice(0,3)
  
  const corners = cornerModifiers.reduce((acc, mods) => {
    let newPoint = `${(i + mods.x) * WIDTH} ${(j + mods.y) * HEIGHT}`
    acc.push(newPoint)
    return acc
  }, [])
  
  return corners.join(', ')
}

const isDarkColor = (hexString) => {
  const colorCode = hexString.replace(/#/g, '')
  const r = parseInt(colorCode.substring(0, 2), 16) // hexToR
  const g = parseInt(colorCode.substring(2, 4), 16) // hexToG
  const b = parseInt(colorCode.substring(4, 6), 16) // hexToB
  return ((r * 0.299) + (g * 0.587) + (b * 0.114)) < 186
}

const updateVariables = () => {
  const curDimensionInput = Number.parseInt(gridSizeInput.value)
  const curTriangleWeightInput = Number.parseFloat(triangleWeightInput.value)
  const curCircleWeightInput = Number.parseFloat(circleWeightInput.value)
  const cleanedCurColorArrayInput = colorArrayInput.value
    .replace(/\s/g, '')
    .split(',')
    .filter(maybeHexVal => /^#[0-9A-F]{6}$/i.test(maybeHexVal))

  ROWS = curDimensionInput
  COLUMNS = curDimensionInput
  WIDTH = TOTAL_UNITS / curDimensionInput
  HEIGHT = TOTAL_UNITS / curDimensionInput
  TRIANGLE_WEIGHT = curTriangleWeightInput
  CIRCLE_WEIGHT = curCircleWeightInput

  if (cleanedCurColorArrayInput.length) {
    COLOR_ARRAY = cleanedCurColorArrayInput
  } else {
    const randomDefaultColors = DEFAULT_COLOR_ARRAYS[Math.floor(Math.random() * DEFAULT_COLOR_ARRAYS.length)]
    COLOR_ARRAY = randomDefaultColors
    colorArrayInput.value = randomDefaultColors.join(',')
  }
}

const generateSVG = () => {
  let counter = 0

  gsap.set(svg, {
    attr: {
      width: TOTAL_UNITS,
      height: TOTAL_UNITS,
      viewBox: "0 0 " + TOTAL_UNITS + " " + TOTAL_UNITS
    }
  })

  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLUMNS; i++) {
      counter++;
      let newShape = document.createElementNS(svgns, "rect")
      gsap.set(newShape, {
        attr: {
          x: i * WIDTH,
          y: j * HEIGHT,
          width: WIDTH,
          height: HEIGHT,
          fill: COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)]
        }
      })
      
      // Add in the base square
      svg.appendChild(newShape)
      
      // Create and add triangles/circles based on defined weights
      if (Math.random() < TRIANGLE_WEIGHT) {
        let newTriangle = document.createElementNS(svgns, 'polygon')
        newTriangle.setAttributeNS(null, 'points', generateTrianglePoints(i, j))
        newTriangle.setAttributeNS(null, 'style', `fill: ${COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)]}`)

        svg.appendChild(newTriangle)
      } else if (Math.random() < CIRCLE_WEIGHT) {
        let newCircle = document.createElementNS(svgns, 'circle')
        newCircle.setAttributeNS(null, 'cx', i * WIDTH)
        newCircle.setAttributeNS(null, 'cy', j * HEIGHT)
        newCircle.setAttributeNS(null, 'r', WIDTH)
        newCircle.setAttributeNS(null, 'style', `fill: ${COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)]}`)

        svg.appendChild(newCircle)
      }
    }
  }
}

/* EVENT HANDLERS */
regenerateButton.onclick = () => {
  updateVariables()
  generateSVG()
}

downloadButton.onclick = () => {
  const svgData = svg.outerHTML
  const svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"})
  const svgUrl = URL.createObjectURL(svgBlob)
  const downloadLink = document.createElement("a")
  downloadLink.href = svgUrl
  downloadLink.download = "my-cool-svg.svg"
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

regenerateButton.addEventListener('mouseenter', e => {
  const newBgColor = COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)]
  regenerateButton.style.background = newBgColor
  regenerateButton.style.color = isDarkColor(newBgColor) ? '#fff' : '#000'
})
regenerateButton.addEventListener('mouseleave', e => {
  regenerateButton.style.background = '#fff'
  regenerateButton.style.color = '#000'
})

downloadButton.addEventListener('mouseenter', e => {
  const newBgColor = COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)]
  downloadButton.style.background = newBgColor
  downloadButton.style.color = isDarkColor(newBgColor) ? '#fff' : '#000'
})
downloadButton.addEventListener('mouseleave', e => {
  downloadButton.style.background = '#fff'
  downloadButton.style.color = '#000'
})

/* INIT */
const _init = () => {
  updateVariables()
  generateSVG()
}

_init()
