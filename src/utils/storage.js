import { supabase } from './supabaseClient.js'

var TABLE_NAME = 'projects'

var storage = {
  getProject: async function (id) {
    var response = await supabase.from(TABLE_NAME).select('data').eq('id', id).maybeSingle()
    if (response.error || !response.data) {
      return null
    }
    return response.data.data
  },

  saveProject: async function (project) {
    project.updated_at = new Date().toISOString().slice(0, 10)
    var row = {
      id: project.project_id,
      updated_at: new Date().toISOString(),
      data: project
    }
    var response = await supabase.from(TABLE_NAME).upsert(row)
    if (response.error) {
      return null
    }
    return project
  },

  saveCalculationResult: async function (projectId, calculatorName, result) {
    var project = await storage.getProject(projectId)
    if (!project) {
      return null
    }
    if (!project.calculations.hasOwnProperty(calculatorName)) {
      return null
    }
    project.calculations[calculatorName].result = result
    project.calculations[calculatorName].version = result && result.rule_version ? result.rule_version : null
    project.calculations[calculatorName].locked = true
    project.calculations[calculatorName].date = new Date().toISOString().slice(0, 10)
    return storage.saveProject(project)
  },

  saveCalculatorVersion: async function (projectId, calculatorName, version) {
    var project = await storage.getProject(projectId)
    if (!project) {
      return null
    }
    if (!project.calculations.hasOwnProperty(calculatorName)) {
      return null
    }
    if (!project.calculations[calculatorName].versions) {
      project.calculations[calculatorName].versions = []
    }
    version.version_number = project.calculations[calculatorName].versions.length + 1
    project.calculations[calculatorName].versions.push(version)
    var saved = await storage.saveProject(project)
    if (!saved) {
      return null
    }
    return version
  },

  getAllProjects: async function () {
    var response = await supabase.from(TABLE_NAME).select('data')
    if (response.error || !response.data) {
      return []
    }
    var list = []
    var i
    for (i = 0; i < response.data.length; i = i + 1) {
      list.push(response.data[i].data)
    }
    return list
  },

  deleteProject: async function (id) {
    var response = await supabase.from(TABLE_NAME).delete().eq('id', id)
    return !response.error
  },

  exportProject: async function (id) {
    var project = await storage.getProject(id)
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

  importProject: async function (json) {
    var project = JSON.parse(json)
    return storage.saveProject(project)
  }
}

export default storage
