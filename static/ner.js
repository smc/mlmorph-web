function isEntity (result) {
  let morphemes = result.morphemes
  for (let i = 0; i < morphemes.length; i++) {
    let morpheme = morphemes[i]
    let tags = morpheme.pos

    for (let j = 0; j < tags.length; j++) {
      if (tags[j] === 'np') return true
    }
  }
  return false
}

function onAnalysisClick () {
  document.querySelector('.analresult tbody').innerHTML = ''
  document.querySelector('.analresult').style.display = ''
  document.getElementById('analresult-progress').style.display = ''

  let text = document.querySelector('textarea[name="text"]').value
  analyse(text).then((response) => {
    let result = response.result
    document.getElementById('analresult-progress').style.display = 'none'
    let tokens = text.split(/\s+/)
    for (let i = 0; i < tokens.length; i++) {
      let entity = false
      let key = tokens[i]
      let values = result[key]
      if (!values) continue
      let formattedValues = document.createElement('tr')
      for (let i = 0; i < values.length; i++) {
        if (isEntity(values[i])) {
          entity = true
          formattedValues.appendChild(formatResult(values[i]))
          break
        }
      }
      let tr = document.createElement('tr')
      let td = document.createElement('td')
      td.textContent = key
      tr.appendChild(td)
      tr.appendChild(formattedValues)
      if (entity) {
        document.querySelector('.analresult tbody').appendChild(tr)
      }
    };
  })
}

function init () {
  document.getElementById('analyse').onclick = onAnalysisClick
  document.querySelector('.analresult').style.display = 'none'

  M.Sidenav.init(document.querySelectorAll('.sidenav'))
}

window.onload = function () {
  document.getElementById('analresult-progress').style.display = 'none'
  fetchTags().then((tags) => {
    tagInfo = tags
    init()
  })
}
