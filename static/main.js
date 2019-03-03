var morphemechipsInstance, tagInfo

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
      if (!values) continue
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

window.onload = function () {
  document.getElementById('analresult-progress').style.display = 'none'
  document.getElementById('genresult-progress').style.display = 'none'
  fetchTags().then((tags) => {
    tagInfo = tags
    init()
  })
}
