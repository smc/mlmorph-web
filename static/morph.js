
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

function fetchTags () {
  return fetch('static/tags.json').then((response) => response.json())
}
