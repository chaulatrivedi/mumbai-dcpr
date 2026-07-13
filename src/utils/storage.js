var STORAGE_KEY = 'dcpr_projects'

function readAll() {
  var raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return {}
  }
  return JSON.parse(raw)
}

function writeAll(projects) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

var storage = {
  getProject: function (id) {
    var projects = readAll()
    if (projects.hasOwnProperty(id)) {
      return projects[id]
    }
    return null
  },

  saveProject: function (project) {
    var projects = readAll()
    project.updated_at = new Date().toISOString().slice(0, 10)
    projects[project.project_id] = project
    writeAll(projects)
    return project
  },

  saveCalculationResult: function (projectId, calculatorName, result) {
    var project = storage.getProject(projectId)
    if (!project) {
      return null
    }
    if (!project.calculations.hasOwnProperty(calculatorName)) {
      return null
    }
    project.calculations[calculatorName] = {
      result: result,
      version: result && result.rule_version ? result.rule_version : null,
      locked: true,
      date: new Date().toISOString().slice(0, 10)
    }
    return storage.saveProject(project)
  },

  getAllProjects: function () {
    var projects = readAll()
    var list = []
    var key
    for (key in projects) {
      if (projects.hasOwnProperty(key)) {
        list.push(projects[key])
      }
    }
    return list
  },

  deleteProject: function (id) {
    var projects = readAll()
    delete projects[id]
    writeAll(projects)
  },

  exportProject: function (id) {
    var project = storage.getProject(id)
    if (!project) {
      return
    }
    var blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
    var url = window.URL.createObjectURL(blob)
    var link = document.createElement('a')
    link.href = url
    link.download = project.project_name + '.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  importProject: function (json) {
    var project = JSON.parse(json)
    storage.saveProject(project)
    return project
  }
}

export default storage
