var morphemechipsInstance, tagInfo

function formatResult (result) {
  var resultContainer = document.createElement('ul')
  resultContainer.classList.add('result')

  let morphemes = result.morphemes
  for (let i = 0; i < morphemes.length; i++) {
    let morpheme = morphemes[i]
    let root = morpheme.root
    let tags = morpheme.pos
    let tagsElement = document.createElement('div')
    tagsElement.classList.add('tags')

    for (let j = 0; j < tags.length; j++) {
      let tagData = tagInfo.find(item => item.id === tags[j])
      let tag = document.createElement('div')
      tag.classList.add('tag')
      if (tagData && tagData.url) {
        let tagLink = document.createElement('a')
        tagLink.setAttribute('href', tagData.url)
        tagLink.textContent = tagData.tag
        tag.appendChild(tagLink)
      } else {
        let tagLabel = tagData ? tagData.tag : tags[j]
        tag.textContent = tagLabel
      }
      tagsElement.appendChild(tag)
    }
    let rootElement = document.createElement('div')
    rootElement.classList.add('root')
    rootElement.textContent = root

    let component = document.createElement('li')
    component.classList.add('component')
    component.appendChild(rootElement)
    component.appendChild(tagsElement)
    resultContainer.appendChild(component)
  }
  return resultContainer
}

function onGenerateClick () {
  let genResult = document.querySelector('.genresult')
  genResult.innerHTML = ''
  document.getElementById('genresult-progress').style.display = ''
  generate(morphemechipsInstance.getDataString()).then((data) => {
    let result = data.result
    for (let key in result) {
      let resultEl = document.createElement('div')
      resultEl.classList.add('result')
      resultEl.textContent = result[key]
      genResult.appendChild(resultEl)
    }
    document.getElementById('genresult-progress').style.display = 'none'
  })
}

function generate (word) {
  return fetch(`/api/generate?word=${word}`).then(res => res.json())
}

function analyse (text) {
  return fetch('/api/analyse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      text
    })
  }).then(res => res.json())
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
      let length = 0
      let key = tokens[i]
      let values = result[key]
      let formattedValues = document.createElement('tr')
      if (values.length > 0) {
        length = 1
      }
      for (let i = 0; i < length; i++) {
        formattedValues.appendChild(formatResult(values[i]))
      }
      let tr = document.createElement('tr')
      let td = document.createElement('td')
      td.textContent = key
      tr.appendChild(td)
      tr.appendChild(formattedValues)
      document.querySelector('.analresult tbody').appendChild(tr)
    };
  })
}

function init () {
  document.getElementById('analyse').onclick = onAnalysisClick
  document.getElementById('generate').onclick = onGenerateClick
  document.querySelector('.analresult').style.display = 'none'
  morphemechipsInstance = M.MorphemeChips.init(
    document.querySelector('.chips-autocomplete'), {
      placeholder: 'Add morphemes',
      autocompleteOptions: {
        data: tagInfo,
        limit: Infinity,
        minLength: 1
      }
    }
  )

  M.Sidenav.init(document.querySelectorAll('.sidenav'))
}

function fetchTags () {
  return fetch('static/tags.json').then((response) => response.json())
}

window.onload = function () {
  document.getElementById('analresult-progress').style.display = 'none'
  document.getElementById('genresult-progress').style.display = 'none'
  fetchTags().then((tags) => {
    tagInfo = tags
    init()
  })
}
