import React from 'react'
import { Link } from 'react-router-dom'
import storage from '../utils/storage.js'

var DEV_TYPE_LABELS = {
  new_development: 'New development',
  self_redevelopment: 'Self redevelopment',
  '33_5_mhada': '33(5) — MHADA redevelopment',
  '33_7_cessed': '33(7) — Cessed buildings',
  '33_7a_dilapidated': '33(7A) — Dilapidated buildings',
  '33_9_slum': '33(9) — Slum redevelopment',
  '33_10_sra': '33(10) — SRA scheme',
  not_decided: 'Not decided yet'
}

function Home() {
  var projectsState = React.useState([])
  var projects = projectsState[0]
  var setProjects = projectsState[1]

  var loadingState = React.useState(true)
  var loading = loadingState[0]
  var setLoading = loadingState[1]

  React.useEffect(function () {
    var active = true
    storage.getAllProjects().then(function (list) {
      if (active) {
        setProjects(list)
        setLoading(false)
      }
    })
    return function () {
      active = false
    }
  }, [])

  var sortedProjects = projects.slice().sort(function (a, b) {
    if (a.updated_at < b.updated_at) return 1
    if (a.updated_at > b.updated_at) return -1
    return 0
  })

  var headingStyle = {
    fontSize: '28px',
    fontWeight: 600,
    color: '#1E2820',
    fontFamily: 'system-ui',
    marginBottom: '4px'
  }

  var subheadingStyle = {
    fontSize: '14px',
    fontWeight: 400,
    color: '#787774',
    fontFamily: 'system-ui',
    marginBottom: '24px'
  }

  var headerRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  }

  var newProjectButtonStyle = {
    backgroundColor: '#CC6644',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'system-ui',
    textDecoration: 'none',
    display: 'inline-block'
  }

  var listStyle = {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }

  var cardStyle = {
    backgroundColor: '#FFFFFF',
    border: '0.5px solid #E2DDD5',
    borderRadius: '8px',
    padding: '16px 20px',
    fontFamily: 'system-ui',
    textDecoration: 'none',
    display: 'block'
  }

  var cardTitleStyle = {
    fontSize: '15px',
    fontWeight: 500,
    color: '#1E2820',
    marginBottom: '4px'
  }

  var cardMetaStyle = {
    fontSize: '13px',
    fontWeight: 400,
    color: '#787774'
  }

  var emptyStateStyle = {
    fontSize: '13px',
    color: '#787774',
    fontStyle: 'italic',
    marginTop: '24px'
  }

  function describeDevType(project) {
    var devType = project.parameters.development_type
    if (DEV_TYPE_LABELS.hasOwnProperty(devType)) {
      return DEV_TYPE_LABELS[devType]
    }
    return 'Development type not set'
  }

  return (
    <div>
      <div style={headerRowStyle}>
        <div>
          <div style={headingStyle}>Projects</div>
          <div style={subheadingStyle}>All projects synced to your account.</div>
        </div>
        <Link to="/new-project" style={newProjectButtonStyle}>+ New Project</Link>
      </div>

      {loading ? (
        <div style={emptyStateStyle}>Loading projects&hellip;</div>
      ) : sortedProjects.length === 0 ? (
        <div style={emptyStateStyle}>No projects yet. Click "New Project" to start one.</div>
      ) : (
        <div style={listStyle}>
          {sortedProjects.map(function (project) {
            return (
              <Link key={project.project_id} to={'/project/' + project.project_id} style={cardStyle}>
                <div style={cardTitleStyle}>{project.project_name}</div>
                <div style={cardMetaStyle}>
                  {describeDevType(project)}
                  {project.parameters.zone ? ' · ' + project.parameters.zone : ''}
                  {project.parameters.location ? ' · ' + project.parameters.location : ''}
                  {' · Updated ' + project.updated_at}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Home
