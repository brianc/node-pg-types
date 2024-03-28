function paserAgtype (raw) {
  raw = raw.split('::')
  const type = raw[1]
  const graphData = JSON.parse(raw[0])
  const id = graphData.id
  const label = graphData.label
  delete graphData.id
  delete graphData.label
  return {
    type: type,
    id: id,
    label: label,
    ...graphData
  }
}

function init (register) {
  register(17260, paserAgtype) // agtype
}

module.exports = {
  init: init
}
