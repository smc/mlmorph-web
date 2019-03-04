function findEntity (result) {
  let morphemes = result.morphemes
  for (let i = 0; i < morphemes.length; i++) {
    let morpheme = morphemes[i]
    let tags = morpheme.pos
    if (tags[0] === 'np') return morpheme.root
  }
  return false
}

function onAnalysisClick () {
  document.querySelector('.analresult').innerHTML = ''
  document.querySelector('.analresult').style.display = ''
  document.getElementById('analresult-progress').style.display = ''

  let text = document.querySelector('textarea[name="text"]').value
  analyse(text).then((response) => {
    let result = response.result
    document.getElementById('analresult-progress').style.display = 'none'
    let tokens = text.split(/\s+/)
    for (let i = 0; i < tokens.length; i++) {
      let key = tokens[i]
      let values = result[key]
      if (!values) continue
      for (let i = 0; i < values.length; i++) {
        let entity = findEntity(values[i])
        if (entity) {
          let itemElement = document.createElement('li')
          itemElement.textContent = entity
          document.querySelector('.analresult').appendChild(itemElement)
          break
        }
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
