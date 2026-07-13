import React from 'react'
import { useNavigate } from 'react-router-dom'
import storage from '../utils/storage.js'
import questionData from '../data/projectQuestions.json' with { type: 'json' }

function NewProject() {
  var navigate = useNavigate()

  var stepState = React.useState(1)
  var step = stepState[0]
  var setStep = stepState[1]

  var projectNameState = React.useState('')
  var projectName = projectNameState[0]
  var setProjectName = projectNameState[1]

  var userNameState = React.useState('')
  var userName = userNameState[0]
  var setUserName = userNameState[1]

  var baseAnswersState = React.useState({})
  var baseAnswers = baseAnswersState[0]
  var setBaseAnswers = baseAnswersState[1]

  var useMixState = React.useState([])
  var useMix = useMixState[0]
  var setUseMix = useMixState[1]

  var developmentTypeState = React.useState('')
  var developmentType = developmentTypeState[0]
  var setDevelopmentType = developmentTypeState[1]

  var branchAnswersState = React.useState({})
  var branchAnswers = branchAnswersState[0]
  var setBranchAnswers = branchAnswersState[1]

  var errorState = React.useState('')
  var errorMessage = errorState[0]
  var setErrorMessage = errorState[1]

  function handleBaseAnswerChange(key, value) {
    var updated = Object.assign({}, baseAnswers)
    updated[key] = value
    setBaseAnswers(updated)
  }

  function handleUseMixToggle(option) {
    var index = useMix.indexOf(option)
    var updated = useMix.slice()
    if (index === -1) {
      updated.push(option)
    } else {
      updated.splice(index, 1)
    }
    setUseMix(updated)
  }

  function handleBranchAnswerChange(key, value) {
    var updated = Object.assign({}, branchAnswers)
    updated[key] = value
    setBranchAnswers(updated)
  }

  function getBranchQuestions() {
    if (!developmentType) {
      return []
    }
    if (questionData.branchQuestions.hasOwnProperty(developmentType)) {
      return questionData.branchQuestions[developmentType]
    }
    return []
  }

  function buildProject() {
    var project = {
      project_id: window.crypto.randomUUID(),
      project_name: projectName,
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
      owner: userName,

      parameters: {
        primary_use: baseAnswers.primary_use || '',
        use_mix: useMix,
        zone: baseAnswers.zone || '',
        location: baseAnswers.location || '',
        plot_area_range: baseAnswers.plot_area_range || '',
        plot_area_exact: null,
        road_width_range: baseAnswers.road_width_range || '',
        road_width_exact: null,
        development_type: developmentType
      },

      branch_parameters: branchAnswers,

      deviations: [],

      calculations: {
        parking: { result: null, version: null, locked: false, date: null },
        fsi: { result: null, version: null, locked: false, date: null },
        toilets: { result: null, version: null, locked: false, date: null },
        refuge: { result: null, version: null, locked: false, date: null },
        staircase: { result: null, version: null, locked: false, date: null },
        openspaces: { result: null, version: null, locked: false, date: null },
        lifts: { result: null, version: null, locked: false, date: null }
      },

      stage: 'brief',
      design_brief_generated: false
    }
    return project
  }

  function handleFinish() {
    var project = buildProject()
    storage.saveProject(project)
    navigate('/project/' + project.project_id)
  }

  function handleStep1Next() {
    if (projectName.trim() === '') {
      setErrorMessage('Project name is required.')
      return
    }
    setErrorMessage('')
    setStep(2)
  }

  function handleStep2Next() {
    var questions = questionData.screen2.questions
    var i
    for (i = 0; i < questions.length; i = i + 1) {
      var q = questions[i]
      if (q.required && (!baseAnswers[q.key] || baseAnswers[q.key] === '')) {
        setErrorMessage('Please answer: ' + q.label)
        return
      }
    }
    setErrorMessage('')
    setStep(3)
  }

  function handleStep3Next() {
    if (developmentType === '') {
      setErrorMessage('Please select a development type.')
      return
    }
    setErrorMessage('')
    var branchQuestions = getBranchQuestions()
    if (branchQuestions.length === 0) {
      handleFinish()
      return
    }
    setStep(4)
  }

  function shouldShowQuestion(question) {
    if (!question.showIf) {
      return true
    }
    return baseAnswers[question.showIf.key] === question.showIf.equals
  }

  var pageStyle = {
    maxWidth: '640px'
  }

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

  var panelStyle = {
    backgroundColor: '#FFFFFF',
    border: '0.5px solid #E2DDD5',
    borderRadius: '8px',
    padding: '20px 24px',
    fontFamily: 'system-ui'
  }

  var stepLabelStyle = {
    fontSize: '10px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#4A7C5F',
    marginBottom: '16px'
  }

  var sectionLabelStyle = {
    fontSize: '10px',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#787774',
    marginBottom: '4px'
  }

  var fieldGroupStyle = {
    marginTop: '16px'
  }

  var inputStyle = {
    backgroundColor: '#F5F0E8',
    border: '0.5px solid #E2DDD5',
    borderRadius: '5px',
    padding: '6px 10px',
    fontSize: '14px',
    color: '#1E2820',
    fontFamily: 'system-ui',
    width: '100%',
    boxSizing: 'border-box'
  }

  var selectStyle = {
    backgroundColor: '#F5F0E8',
    border: '0.5px solid #E2DDD5',
    borderRadius: '5px',
    padding: '6px 10px',
    fontSize: '14px',
    color: '#1E2820',
    fontFamily: 'system-ui',
    width: '100%',
    boxSizing: 'border-box'
  }

  var checkboxRowStyle = {
    display: 'flex',
    alignItems: 'center',
    marginTop: '6px',
    fontSize: '14px',
    color: '#1E2820',
    fontFamily: 'system-ui'
  }

  var radioCardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    backgroundColor: '#F5F0E8',
    border: '0.5px solid #E2DDD5',
    borderRadius: '5px',
    marginTop: '8px',
    fontSize: '14px',
    color: '#1E2820',
    fontFamily: 'system-ui',
    cursor: 'pointer'
  }

  var radioCardActiveStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    backgroundColor: '#2D5A3D',
    border: '0.5px solid #2D5A3D',
    borderRadius: '5px',
    marginTop: '8px',
    fontSize: '14px',
    color: '#FFFFFF',
    fontFamily: 'system-ui',
    cursor: 'pointer'
  }

  var buttonRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
    marginTop: '24px'
  }

  var buttonStyle = {
    backgroundColor: '#CC6644',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'system-ui'
  }

  var secondaryButtonStyle = {
    backgroundColor: '#1E2820',
    color: '#F5F0E8',
    fontSize: '13px',
    fontWeight: 400,
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'system-ui'
  }

  var errorStyle = {
    fontSize: '12px',
    color: '#C0392B',
    marginTop: '12px'
  }

  function renderTextField(field, value, onChange) {
    return (
      <div style={fieldGroupStyle} key={field.key}>
        <div style={sectionLabelStyle}>{field.label}</div>
        <input style={inputStyle} type="text" value={value} onChange={function (e) { onChange(field.key, e.target.value) }} />
      </div>
    )
  }

  function renderStep1() {
    return (
      <div style={panelStyle}>
        <div style={stepLabelStyle}>Step 1 of 4 — Project Details</div>

        <div style={fieldGroupStyle}>
          <div style={sectionLabelStyle}>Project name</div>
          <input style={inputStyle} type="text" value={projectName} onChange={function (e) { setProjectName(e.target.value) }} />
        </div>

        <div style={fieldGroupStyle}>
          <div style={sectionLabelStyle}>Your name (optional)</div>
          <input style={inputStyle} type="text" value={userName} onChange={function (e) { setUserName(e.target.value) }} />
        </div>

        {errorMessage !== '' ? <div style={errorStyle}>{errorMessage}</div> : null}

        <div style={buttonRowStyle}>
          <button type="button" style={buttonStyle} onClick={handleStep1Next}>Next</button>
        </div>
      </div>
    )
  }

  function renderStep2() {
    return (
      <div style={panelStyle}>
        <div style={stepLabelStyle}>Step 2 of 4 — Base Questions</div>

        {questionData.screen2.questions.map(function (question) {
          if (!shouldShowQuestion(question)) {
            return null
          }

          if (question.type === 'dropdown') {
            return (
              <div style={fieldGroupStyle} key={question.key}>
                <div style={sectionLabelStyle}>{question.label}</div>
                <select
                  style={selectStyle}
                  value={baseAnswers[question.key] || ''}
                  onChange={function (e) { handleBaseAnswerChange(question.key, e.target.value) }}
                >
                  <option value="">Select&hellip;</option>
                  {question.options.map(function (option) {
                    return <option key={option} value={option}>{option}</option>
                  })}
                </select>
              </div>
            )
          }

          if (question.type === 'multiselect') {
            return (
              <div style={fieldGroupStyle} key={question.key}>
                <div style={sectionLabelStyle}>{question.label}</div>
                {question.options.map(function (option) {
                  return (
                    <label style={checkboxRowStyle} key={option}>
                      <input
                        type="checkbox"
                        checked={useMix.indexOf(option) !== -1}
                        onChange={function () { handleUseMixToggle(option) }}
                        style={{ marginRight: '8px' }}
                      />
                      {option}
                    </label>
                  )
                })}
              </div>
            )
          }

          return null
        })}

        {errorMessage !== '' ? <div style={errorStyle}>{errorMessage}</div> : null}

        <div style={buttonRowStyle}>
          <button type="button" style={secondaryButtonStyle} onClick={function () { setStep(1) }}>Back</button>
          <button type="button" style={buttonStyle} onClick={handleStep2Next}>Next</button>
        </div>
      </div>
    )
  }

  function renderStep3() {
    return (
      <div style={panelStyle}>
        <div style={stepLabelStyle}>Step 3 of 4 — Development Type</div>

        {questionData.screen3.options.map(function (option) {
          var active = developmentType === option.value
          return (
            <div
              key={option.value}
              style={active ? radioCardActiveStyle : radioCardStyle}
              onClick={function () { setDevelopmentType(option.value) }}
            >
              {option.label}
            </div>
          )
        })}

        {errorMessage !== '' ? <div style={errorStyle}>{errorMessage}</div> : null}

        <div style={buttonRowStyle}>
          <button type="button" style={secondaryButtonStyle} onClick={function () { setStep(2) }}>Back</button>
          <button type="button" style={buttonStyle} onClick={handleStep3Next}>
            {getBranchQuestions().length === 0 ? 'Create Project' : 'Next'}
          </button>
        </div>
      </div>
    )
  }

  function renderStep4() {
    var branchQuestions = getBranchQuestions()
    return (
      <div style={panelStyle}>
        <div style={stepLabelStyle}>Step 4 of 4 — Additional Details</div>

        {branchQuestions.map(function (question) {
          if (question.type === 'number') {
            return (
              <div style={fieldGroupStyle} key={question.key}>
                <div style={sectionLabelStyle}>{question.label}</div>
                <input
                  style={inputStyle}
                  type="number"
                  value={branchAnswers[question.key] || ''}
                  onChange={function (e) { handleBranchAnswerChange(question.key, e.target.value) }}
                />
              </div>
            )
          }

          if (question.type === 'text') {
            return renderTextField(question, branchAnswers[question.key] || '', handleBranchAnswerChange)
          }

          if (question.type === 'dropdown') {
            return (
              <div style={fieldGroupStyle} key={question.key}>
                <div style={sectionLabelStyle}>{question.label}</div>
                <select
                  style={selectStyle}
                  value={branchAnswers[question.key] || ''}
                  onChange={function (e) { handleBranchAnswerChange(question.key, e.target.value) }}
                >
                  <option value="">Select&hellip;</option>
                  {question.options.map(function (option) {
                    return <option key={option} value={option}>{option}</option>
                  })}
                </select>
              </div>
            )
          }

          if (question.type === 'yesno') {
            return (
              <div style={fieldGroupStyle} key={question.key}>
                <div style={sectionLabelStyle}>{question.label}</div>
                <select
                  style={selectStyle}
                  value={branchAnswers[question.key] || ''}
                  onChange={function (e) { handleBranchAnswerChange(question.key, e.target.value) }}
                >
                  <option value="">Select&hellip;</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            )
          }

          return null
        })}

        <div style={buttonRowStyle}>
          <button type="button" style={secondaryButtonStyle} onClick={function () { setStep(3) }}>Back</button>
          <button type="button" style={buttonStyle} onClick={handleFinish}>Create Project</button>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={headingStyle}>New Project</div>
      <div style={subheadingStyle}>Set up project parameters to unlock the calculators and design brief.</div>

      {step === 1 ? renderStep1() : null}
      {step === 2 ? renderStep2() : null}
      {step === 3 ? renderStep3() : null}
      {step === 4 ? renderStep4() : null}
    </div>
  )
}

export default NewProject
