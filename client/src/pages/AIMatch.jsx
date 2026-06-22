import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getMe } from '../api/auth'
import { uploadResume, matchResume } from '../api/ai'

function AnimatedScore({ score }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    let frame
    const duration = 800
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplayed(Math.round(progress * score))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const color =
    score >= 75 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'

  return <span className={`text-5xl font-bold ${color}`}>{displayed}%</span>
}

function AIMatch() {
  const [resumeUrl, setResumeUrl] = useState(null)
  const [resumeName, setResumeName] = useState(null)
  const [checkingResume, setCheckingResume] = useState(true)

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [invalidFileSelected, setInvalidFileSelected] = useState(false)

  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    const checkResume = async () => {
      try {
        const res = await getMe()
        setResumeUrl(res.data.resumeUrl || null)
        setResumeName(res.data.resumeName || null)
      } catch (err) {
        console.error(err)
      } finally {
        setCheckingResume(false)
      }
    }

    checkResume()
  }, [])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed.')
      setInvalidFileSelected(true)
      return
    }

    setInvalidFileSelected(false)
    setUploading(true)
    setUploadError('')

    try {
      const res = await uploadResume(file)
      setResumeUrl(res.data.resumeUrl)
      setResumeName(res.data.resumeName)
    } catch (err) {
      console.error(err)
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setAnalyzeError('Please paste a job description.')
      return
    }

    setAnalyzing(true)
    setAnalyzeError('')
    setResult(null)

    try {
      const res = await matchResume(jobDescription.trim())
      setResult(res.data)
    } catch (err) {
      console.error(err)
      setAnalyzeError(
        err.response?.data?.message || 'Something went wrong analyzing your resume.'
      )
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">AI Resume Match</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left: Resume upload */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="font-medium mb-3">1. Your Resume</h3>

            {checkingResume ? (
              <p className="text-gray-400 text-sm">Checking...</p>
            ) : (
              <>
                {resumeUrl && resumeName && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <polyline points="9 15 11 17 15 13"/>
                    </svg>
                    <span className="truncate" title={resumeName}>{resumeName}</span>
                  </div>
                )}

                <label className="block">
                  <span className="sr-only">Upload resume</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-500 file:cursor-pointer cursor-pointer"
                  />
                </label>

                {uploading && <p className="text-gray-400 text-sm mt-2">Uploading...</p>}
                {uploadError && <p className="text-red-400 text-sm mt-2">{uploadError}</p>}

                {resumeUrl && (
                  <p className="text-xs text-gray-500 mt-3">
                    Uploading a new file will replace your current resume.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Right: Job description */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="font-medium mb-3">2. Job Description</h3>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              placeholder="Paste the job description here..."
              className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !resumeUrl || invalidFileSelected}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {!resumeUrl && !checkingResume && (
          <p className="text-center text-gray-500 text-sm mb-4">
            Upload a resume before analyzing.
          </p>
        )}

        {resumeUrl && invalidFileSelected && (
          <p className="text-center text-amber-400 text-sm mb-4">
            The selected file is not a PDF. Please choose a valid PDF to replace your current resume.
          </p>
        )}

        {analyzeError && (
          <p className="text-center text-red-400 text-sm mb-4">{analyzeError}</p>
        )}

        {analyzing && (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {result && !result.isResume && (
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <p className="text-amber-400 font-medium mb-2">
              This doesn't look like a valid resume.
            </p>
            <p className="text-gray-400 text-sm">
              Please upload a proper resume PDF and try again.
            </p>
          </div>
        )}

        {result && result.isResume && (
          <div className="bg-slate-800 rounded-xl p-6 flex flex-col gap-6">
            <div className="flex flex-col items-center">
              <AnimatedScore score={result.matchPercentage} />
              <p className="text-gray-400 text-sm mt-1">Match Score</p>
            </div>

            {result.summary && (
              <p className="text-gray-300 text-sm text-center max-w-2xl mx-auto">
                {result.summary}
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.strengths?.length > 0 ? (
                    result.strengths.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">None listed.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.length > 0 ? (
                    result.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">None listed.</p>
                  )}
                </div>
              </div>
            </div>

            {result.suggestions?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Suggestions
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-300 flex flex-col gap-1">
                  {result.suggestions.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AIMatch