import React from 'react'
import { useParams, Link } from 'react-router-dom'
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

var CALCULATOR_MODULES = [
  { key: 'parking', number: '01', label: 'Parking', path: '/parking' },
  { key: 'fsi', number: '02', label: 'FSI', path: null },
  { key: 'toilets', number: '03', label: 'Toilets', path: '/toilets' },
  { key: 'refuge', number: '04', label: 'Refuge Area', path: null },
  { key: 'staircase', number: '05', label: 'Staircase', path: null },
  { key: 'openspaces', number: '06', label: 'Open Spaces', path: null },
  { key: 'lifts', number: '07', label: 'Lifts', path: null }
]

function ProjectDashboard() {
  var params = useParams()
  var projectId = params.id

  var projectState = React.useState(null)
  var project = projectState[0]
  var setProject = projectState[1]

  var loadingState = React.useState(true)
  var loading = loadingState[0]
  var setLoading = loadingState[1]

  React.useEffect(function () {
    var active = true
    setLoading(true)
    storage.getProject(projectId).then(function (result) {
      if (active) {
        setProject(result)
        setLoading(false)
      }
    })
    return function () {
      active = false
    }
  }, [projectId])

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

  var emptyStateStyle = {
    fontSize: '13px',
    color: '#787774',
    fontStyle: 'italic'
  }

  if (loading) {
    return (
      <div>
        <div style={emptyStateStyle}>Loading project&hellip;</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div>
        <div style={headingStyle}>Project not found</div>
        <div style={emptyStateStyle}>This project does not exist. <Link to="/home">Back to Projects</Link></div>
      </div>
    )
  }

  var panelRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    alignItems: 'flex-start'
  }

  var cardStyle = {
    backgroundColor: '#FFFFFF',
    border: '0.5px solid #E2DDD5',
    borderRadius: '8px',
    padding: '20px 24px',
    fontFamily: 'system-ui',
    flex: 1
  }

  var sectionLabelStyle = {
    fontSize: '10px',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#787774',
    marginBottom: '4px'
  }

  var paramRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid #E2DDD5',
    fontSize: '13px',
    color: '#1E2820'
  }

  var paramLabelStyle = {
    color: '#787774'
  }

  var moduleListStyle = {
    display: 'flex',
    flexDirection: 'column'
  }

  var moduleRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #E2DDD5'
  }

  var moduleLabelGroupStyle = {
    display: 'flex',
    alignItems: 'center'
  }

  var moduleNumberStyle = {
    fontSize: '11px',
    fontWeight: 400,
    color: '#787774',
    marginRight: '10px'
  }

  var moduleLabelStyle = {
    fontSize: '13px',
    fontWeight: 400,
    color: '#1E2820'
  }

  var statusPillLockedStyle = {
    fontSize: '11px',
    fontWeight: 500,
    color: '#2D5A3D',
    backgroundColor: '#E8F4F0',
    padding: '3px 10px',
    borderRadius: '20px'
  }

  var statusPillPendingStyle = {
    fontSize: '11px',
    fontWeight: 400,
    color: '#787774',
    backgroundColor: '#F5F0E8',
    padding: '3px 10px',
    borderRadius: '20px'
  }

  var statusPillNotBuiltStyle = {
    fontSize: '11px',
    fontWeight: 400,
    color: '#787774',
    backgroundColor: '#F5F0E8',
    padding: '3px 10px',
    borderRadius: '20px'
  }

  var moduleLinkStyle = {
    textDecoration: 'none'
  }

  var deviationFlagStyle = {
    backgroundColor: '#FEF3D8',
    color: '#8B5E0A',
    borderLeft: '3px solid #F0C040',
    padding: '8px 12px',
    borderRadius: '0 4px 4px 0',
    fontSize: '12px',
    marginBottom: '8px'
  }

  function renderParamRow(label, value) {
    return (
      <div style={paramRowStyle} key={label}>
        <span style={paramLabelStyle}>{label}</span>
        <span>{value || '—'}</span>
      </div>
    )
  }

  function describeDevType() {
    var devType = project.parameters.development_type
    if (DEV_TYPE_LABELS.hasOwnProperty(devType)) {
      return DEV_TYPE_LABELS[devType]
    }
    return devType
  }

  function getModuleStatus(moduleKey) {
    var calc = project.calculations[moduleKey]
    if (calc && calc.locked) {
      return 'locked'
    }
    if (calc && calc.result !== null) {
      return 'calculated'
    }
    return 'pending'
  }

  return (
    <div>
      <div style={headingStyle}>{project.project_name}</div>
      <div style={subheadingStyle}>
        Created {project.created_at} &middot; Last updated {project.updated_at}
        {project.owner ? ' · ' + project.owner : ''}
      </div>

      {project.deviations.length > 0 ? (
        <div>
          {project.deviations.map(function (deviation) {
            return (
              <div style={deviationFlagStyle} key={deviation.id}>
                {deviation.rule_ref}: {deviation.override_value} — {deviation.reason}
              </div>
            )
          })}
        </div>
      ) : null}

      <div style={panelRowStyle}>
        <div style={cardStyle}>
          <div style={sectionLabelStyle}>Project Parameters</div>
          {renderParamRow('Primary use', project.parameters.primary_use)}
          {project.parameters.use_mix.length > 0 ? renderParamRow('Use mix', project.parameters.use_mix.join(', ')) : null}
          {renderParamRow('Zone', project.parameters.zone)}
          {renderParamRow('Location', project.parameters.location)}
          {renderParamRow('Plot area', project.parameters.plot_area_range)}
          {renderParamRow('Road width', project.parameters.road_width_range)}
          {renderParamRow('Development type', describeDevType())}
        </div>

        <div style={cardStyle}>
          <div style={sectionLabelStyle}>Calculators</div>
          <div style={moduleListStyle}>
            {CALCULATOR_MODULES.map(function (module) {
              var status = getModuleStatus(module.key)
              var statusStyle = statusPillPendingStyle
              var statusLabel = 'Not started'

              if (module.path === null) {
                statusStyle = statusPillNotBuiltStyle
                statusLabel = 'Not built yet'
              } else if (status === 'locked') {
                statusStyle = statusPillLockedStyle
                statusLabel = 'Locked'
              } else if (status === 'calculated') {
                statusStyle = statusPillLockedStyle
                statusLabel = 'Calculated'
              }

              var row = (
                <div style={moduleRowStyle} key={module.key}>
                  <div style={moduleLabelGroupStyle}>
                    <span style={moduleNumberStyle}>{module.number}</span>
                    <span style={moduleLabelStyle}>{module.label}</span>
                  </div>
                  <span style={statusStyle}>{statusLabel}</span>
                </div>
              )

              if (module.path === null) {
                return row
              }

              return (
                <Link key={module.key} to={module.path + '?projectId=' + project.project_id} style={moduleLinkStyle}>
                  {row}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDashboard
